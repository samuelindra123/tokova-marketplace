import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, and, desc, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { DATABASE_CONNECTION, type Database } from '../../../database/database.module';
import * as schema from '../../../database/schema';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class CustomerOrdersService {
    constructor(
        @Inject(DATABASE_CONNECTION) private db: Database,
        private mailService: MailService,
    ) { }

    private async getCustomer(userId: string) {
        const customer = await this.db.query.customers.findFirst({
            where: eq(schema.customers.userId, userId),
            with: { user: true },
        });
        if (!customer) throw new NotFoundException('Customer not found');
        return customer;
    }

    async getOrders(userId: string, query: { page?: number; limit?: number }) {
        const customer = await this.getCustomer(userId);
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;

        const orders = await this.db.query.orders.findMany({
            where: eq(schema.orders.customerId, customer.id),
            orderBy: [desc(schema.orders.createdAt)],
            limit,
            offset,
            with: {
                items: {
                    with: {
                        vendor: true,
                    },
                },
            },
        });

        return {
            data: orders.map((order) => ({
                ...order,
                total: Number(order.total),
                subtotal: Number(order.subtotal),
                items: order.items.map((item) => ({
                    ...item,
                    price: Number(item.price),
                    subtotal: Number(item.subtotal),
                })),
            })),
            meta: { page, limit },
        };
    }

    async getOrder(userId: string, orderId: string) {
        const customer = await this.getCustomer(userId);

        const order = await this.db.query.orders.findFirst({
            where: and(
                eq(schema.orders.id, orderId),
                eq(schema.orders.customerId, customer.id),
            ),
            with: {
                items: {
                    with: {
                        vendor: true,
                        product: {
                            with: { images: true },
                        },
                    },
                },
            },
        });

        if (!order) throw new NotFoundException('Order not found');

        return {
            ...order,
            total: Number(order.total),
            subtotal: Number(order.subtotal),
            items: order.items.map((item) => ({
                ...item,
                price: Number(item.price),
                subtotal: Number(item.subtotal),
            })),
        };
    }

    async createOrder(
        userId: string,
        data: {
            addressId: string;
            notes?: string;
            paymentMethod?: string;
        },
    ) {
        const customer = await this.getCustomer(userId);

        // Get cart items
        const cartItems = await this.db.query.carts.findMany({
            where: eq(schema.carts.customerId, customer.id),
            with: {
                product: {
                    with: { vendor: true, images: true },
                },
            },
        });

        if (cartItems.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        // Get shipping address
        const address = await this.db.query.addresses.findFirst({
            where: and(
                eq(schema.addresses.id, data.addressId),
                eq(schema.addresses.customerId, customer.id),
            ),
        });

        if (!address) throw new NotFoundException('Address not found');

        // Validate stock for all items
        for (const item of cartItems) {
            if (item.quantity > item.product.stock) {
                throw new BadRequestException(`Insufficient stock for ${item.product.name}`);
            }
            if (item.product.status !== 'ACTIVE') {
                throw new BadRequestException(`${item.product.name} is not available`);
            }
        }

        // Calculate totals
        const subtotal = cartItems.reduce((sum, item) => {
            const price = Number(item.product.salePrice || item.product.price);
            return sum + price * item.quantity;
        }, 0);

        const shippingCost = 0; // Can be calculated based on address
        const discount = 0;
        const total = subtotal + shippingCost - discount;

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

        // Create order
        const [order] = await this.db
            .insert(schema.orders)
            .values({
                orderNumber,
                customerId: customer.id,
                subtotal: subtotal.toString(),
                shippingCost: shippingCost.toString(),
                discount: discount.toString(),
                total: total.toString(),
                status: 'PENDING',
                paymentStatus: 'PENDING',
                paymentMethod: data.paymentMethod,
                shippingAddress: {
                    label: address.label,
                    recipientName: address.recipientName,
                    phone: address.phone,
                    addressLine: address.addressLine,
                    city: address.city,
                    province: address.province,
                    postalCode: address.postalCode,
                },
                notes: data.notes,
            })
            .returning();

        // Create order items
        const orderItemsData = cartItems.map((item) => ({
            orderId: order.id,
            productId: item.product.id,
            vendorId: item.product.vendorId,
            productName: item.product.name,
            productImage: item.product.images?.find((img) => img.isPrimary)?.url || item.product.images?.[0]?.url,
            price: (item.product.salePrice || item.product.price).toString(),
            quantity: item.quantity,
            subtotal: (Number(item.product.salePrice || item.product.price) * item.quantity).toString(),
        }));

        await this.db.insert(schema.orderItems).values(orderItemsData);

        // Update product stock
        for (const item of cartItems) {
            await this.db
                .update(schema.products)
                .set({
                    stock: sql`${schema.products.stock} - ${item.quantity}`,
                    updatedAt: new Date(),
                })
                .where(eq(schema.products.id, item.product.id));
        }

        // Clear cart
        await this.db.delete(schema.carts).where(eq(schema.carts.customerId, customer.id));

        // Send confirmation email
        await this.mailService.sendOrderConfirmationEmail(
            customer.user.email,
            orderNumber,
            cartItems.map((item) => ({
                name: item.product.name,
                quantity: item.quantity,
                price: Number(item.product.salePrice || item.product.price) * item.quantity,
            })),
            total,
        );

        return this.getOrder(userId, order.id);
    }

    async cancelOrder(userId: string, orderId: string) {
        const customer = await this.getCustomer(userId);

        const order = await this.db.query.orders.findFirst({
            where: and(
                eq(schema.orders.id, orderId),
                eq(schema.orders.customerId, customer.id),
            ),
            with: { items: true },
        });

        if (!order) throw new NotFoundException('Order not found');
        if (order.status !== 'PENDING') {
            throw new BadRequestException('Only pending orders can be cancelled');
        }

        // Restore stock
        for (const item of order.items) {
            await this.db
                .update(schema.products)
                .set({
                    stock: sql`${schema.products.stock} + ${item.quantity}`,
                    updatedAt: new Date(),
                })
                .where(eq(schema.products.id, item.productId));
        }

        // Update order status
        await this.db
            .update(schema.orders)
            .set({ status: 'CANCELLED', updatedAt: new Date() })
            .where(eq(schema.orders.id, orderId));

        // Update order items status
        await this.db
            .update(schema.orderItems)
            .set({ status: 'CANCELLED', updatedAt: new Date() })
            .where(eq(schema.orderItems.orderId, orderId));

        return { message: 'Order cancelled successfully' };
    }
}
