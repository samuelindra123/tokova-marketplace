import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, and, desc, count } from 'drizzle-orm';
import { DATABASE_CONNECTION, type Database } from '../../../database/database.module';
import * as schema from '../../../database/schema';

@Injectable()
export class CartService {
    constructor(@Inject(DATABASE_CONNECTION) private db: Database) { }

    private async getCustomerId(userId: string): Promise<string> {
        const customer = await this.db.query.customers.findFirst({
            where: eq(schema.customers.userId, userId),
        });
        if (!customer) throw new NotFoundException('Customer not found');
        return customer.id;
    }

    async getCart(userId: string) {
        const customerId = await this.getCustomerId(userId);

        const cartItems = await this.db.query.carts.findMany({
            where: eq(schema.carts.customerId, customerId),
            with: {
                product: {
                    with: {
                        images: true,
                        vendor: true,
                    },
                },
            },
        });

        const items = cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            product: {
                id: item.product.id,
                name: item.product.name,
                slug: item.product.slug,
                price: Number(item.product.price),
                salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
                stock: item.product.stock,
                image: item.product.images?.find((img) => img.isPrimary)?.url || item.product.images?.[0]?.url,
                storeName: item.product.vendor.storeName,
            },
            subtotal: item.quantity * Number(item.product.salePrice || item.product.price),
        }));

        const total = items.reduce((sum, item) => sum + item.subtotal, 0);

        return { items, total, itemCount: items.length };
    }

    async addToCart(userId: string, productId: string, quantity: number = 1) {
        const customerId = await this.getCustomerId(userId);

        // Check product exists and has stock
        const product = await this.db.query.products.findFirst({
            where: eq(schema.products.id, productId),
        });

        if (!product) throw new NotFoundException('Product not found');
        if (product.status !== 'ACTIVE') throw new BadRequestException('Product is not available');
        if (product.stock < quantity) throw new BadRequestException('Insufficient stock');

        // Check if already in cart
        const existingItem = await this.db.query.carts.findFirst({
            where: and(
                eq(schema.carts.customerId, customerId),
                eq(schema.carts.productId, productId),
            ),
        });

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock) throw new BadRequestException('Insufficient stock');

            await this.db
                .update(schema.carts)
                .set({ quantity: newQuantity, updatedAt: new Date() })
                .where(eq(schema.carts.id, existingItem.id));
        } else {
            await this.db.insert(schema.carts).values({
                customerId,
                productId,
                quantity,
            });
        }

        return this.getCart(userId);
    }

    async updateQuantity(userId: string, cartItemId: string, quantity: number) {
        const customerId = await this.getCustomerId(userId);

        const cartItem = await this.db.query.carts.findFirst({
            where: and(
                eq(schema.carts.id, cartItemId),
                eq(schema.carts.customerId, customerId),
            ),
            with: { product: true },
        });

        if (!cartItem) throw new NotFoundException('Cart item not found');
        if (quantity > cartItem.product.stock) throw new BadRequestException('Insufficient stock');

        if (quantity <= 0) {
            await this.db.delete(schema.carts).where(eq(schema.carts.id, cartItemId));
        } else {
            await this.db
                .update(schema.carts)
                .set({ quantity, updatedAt: new Date() })
                .where(eq(schema.carts.id, cartItemId));
        }

        return this.getCart(userId);
    }

    async removeItem(userId: string, cartItemId: string) {
        const customerId = await this.getCustomerId(userId);

        const cartItem = await this.db.query.carts.findFirst({
            where: and(
                eq(schema.carts.id, cartItemId),
                eq(schema.carts.customerId, customerId),
            ),
        });

        if (!cartItem) throw new NotFoundException('Cart item not found');

        await this.db.delete(schema.carts).where(eq(schema.carts.id, cartItemId));

        return this.getCart(userId);
    }

    async clearCart(userId: string) {
        const customerId = await this.getCustomerId(userId);

        await this.db.delete(schema.carts).where(eq(schema.carts.customerId, customerId));

        return { message: 'Cart cleared' };
    }
}
