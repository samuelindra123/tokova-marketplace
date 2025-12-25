import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and, desc, count, sql, gte } from 'drizzle-orm';
import { DATABASE_CONNECTION, type Database } from '../../../database/database.module';
import * as schema from '../../../database/schema';

@Injectable()
export class VendorOrdersService {
    constructor(@Inject(DATABASE_CONNECTION) private db: Database) { }

    private async getVendorId(userId: string): Promise<string> {
        const vendor = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.userId, userId),
        });
        if (!vendor) throw new NotFoundException('Vendor not found');
        return vendor.id;
    }

    async findAll(
        userId: string,
        query: { page?: number; limit?: number; status?: string },
    ) {
        const vendorId = await this.getVendorId(userId);
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;

        const conditions = [eq(schema.orderItems.vendorId, vendorId)];

        if (query.status) {
            conditions.push(
                eq(
                    schema.orderItems.status,
                    query.status as 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
                ),
            );
        }

        const orderItems = await this.db.query.orderItems.findMany({
            where: and(...conditions),
            orderBy: [desc(schema.orderItems.createdAt)],
            limit,
            offset,
            with: {
                order: {
                    with: {
                        customer: {
                            with: {
                                user: true,
                            },
                        },
                    },
                },
                product: true,
            },
        });

        const [totalCount] = await this.db
            .select({ count: count() })
            .from(schema.orderItems)
            .where(and(...conditions));

        return {
            data: orderItems.map((item) => ({
                id: item.id,
                orderNumber: item.order.orderNumber,
                productName: item.productName,
                productImage: item.productImage,
                quantity: item.quantity,
                price: Number(item.price),
                subtotal: Number(item.subtotal),
                status: item.status,
                trackingNumber: item.trackingNumber,
                customerName: `${item.order.customer?.firstName || ''} ${item.order.customer?.lastName || ''}`.trim(),
                customerEmail: item.order.customer?.user?.email,
                shippingAddress: item.order.shippingAddress,
                createdAt: item.createdAt,
            })),
            meta: {
                page,
                limit,
                total: totalCount.count,
                totalPages: Math.ceil(totalCount.count / limit),
            },
        };
    }

    async updateStatus(
        userId: string,
        orderItemId: string,
        status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED',
        trackingNumber?: string,
    ) {
        const vendorId = await this.getVendorId(userId);

        const orderItem = await this.db.query.orderItems.findFirst({
            where: and(
                eq(schema.orderItems.id, orderItemId),
                eq(schema.orderItems.vendorId, vendorId),
            ),
        });

        if (!orderItem) {
            throw new NotFoundException('Order item not found');
        }

        const updateData: any = { status, updatedAt: new Date() };
        if (trackingNumber && status === 'SHIPPED') {
            updateData.trackingNumber = trackingNumber;
        }

        // Update the order item status
        await this.db
            .update(schema.orderItems)
            .set(updateData)
            .where(eq(schema.orderItems.id, orderItemId));

        // Now sync the order status based on all items
        await this.syncOrderStatus(orderItem.orderId);

        return { message: `Order status updated to ${status}` };
    }

    /**
     * Sync order status based on all order items statuses
     */
    private async syncOrderStatus(orderId: string) {
        // Get all items for this order
        const allItems = await this.db.query.orderItems.findMany({
            where: eq(schema.orderItems.orderId, orderId),
        });

        if (allItems.length === 0) return;

        // Determine order status based on item statuses
        const statuses = allItems.map(item => item.status);

        let newOrderStatus: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | null = null;

        // If ALL items are DELIVERED, order is DELIVERED
        if (statuses.every(s => s === 'DELIVERED')) {
            newOrderStatus = 'DELIVERED';
        }
        // If ALL items are SHIPPED or DELIVERED, order is SHIPPED
        else if (statuses.every(s => s === 'SHIPPED' || s === 'DELIVERED')) {
            newOrderStatus = 'SHIPPED';
        }
        // If any item is PROCESSING, SHIPPED, or DELIVERED, order is PROCESSING
        else if (statuses.some(s => s === 'PROCESSING' || s === 'SHIPPED' || s === 'DELIVERED')) {
            newOrderStatus = 'PROCESSING';
        }

        if (newOrderStatus) {
            await this.db
                .update(schema.orders)
                .set({
                    status: newOrderStatus,
                    updatedAt: new Date()
                })
                .where(eq(schema.orders.id, orderId));
        }
    }

    async findOne(userId: string, orderItemId: string) {
        const vendorId = await this.getVendorId(userId);

        const item = await this.db.query.orderItems.findFirst({
            where: and(
                eq(schema.orderItems.id, orderItemId),
                eq(schema.orderItems.vendorId, vendorId),
            ),
            with: {
                order: {
                    with: {
                        customer: {
                            with: {
                                user: true,
                            },
                        },
                    },
                },
                product: true,
            },
        });

        if (!item) {
            throw new NotFoundException('Order item not found');
        }

        return {
            id: item.id,
            orderNumber: item.order.orderNumber,
            productName: item.productName,
            productImage: item.productImage,
            quantity: item.quantity,
            price: Number(item.price),
            subtotal: Number(item.subtotal),
            status: item.status,
            trackingNumber: item.trackingNumber,
            customerName: `${item.order.customer?.firstName || ''} ${item.order.customer?.lastName || ''}`.trim(),
            customerEmail: item.order.customer?.user?.email,
            shippingAddress: item.order.shippingAddress,
            notes: item.order.notes,
            createdAt: item.createdAt,
        };
    }

    async getAnalytics(userId: string) {
        const vendorId = await this.getVendorId(userId);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const [
            totalRevenue,
            revenueThisMonth,
            totalOrders,
            pendingOrders,
            totalProducts,
        ] = await Promise.all([
            this.db
                .select({
                    total: sql<number>`COALESCE(SUM(${schema.orderItems.subtotal}), 0)`,
                })
                .from(schema.orderItems)
                .where(
                    and(
                        eq(schema.orderItems.vendorId, vendorId),
                        eq(schema.orderItems.status, 'DELIVERED'),
                    ),
                ),
            this.db
                .select({
                    total: sql<number>`COALESCE(SUM(${schema.orderItems.subtotal}), 0)`,
                })
                .from(schema.orderItems)
                .where(
                    and(
                        eq(schema.orderItems.vendorId, vendorId),
                        eq(schema.orderItems.status, 'DELIVERED'),
                        gte(schema.orderItems.createdAt, startOfMonth),
                    ),
                ),
            this.db
                .select({ count: count() })
                .from(schema.orderItems)
                .where(eq(schema.orderItems.vendorId, vendorId)),
            this.db
                .select({ count: count() })
                .from(schema.orderItems)
                .where(
                    and(
                        eq(schema.orderItems.vendorId, vendorId),
                        eq(schema.orderItems.status, 'PENDING'),
                    ),
                ),
            this.db
                .select({ count: count() })
                .from(schema.products)
                .where(eq(schema.products.vendorId, vendorId)),
        ]);

        return {
            totalRevenue: Number(totalRevenue[0].total),
            revenueThisMonth: Number(revenueThisMonth[0].total),
            totalOrders: totalOrders[0].count,
            pendingOrders: pendingOrders[0].count,
            totalProducts: totalProducts[0].count,
        };
    }
}
