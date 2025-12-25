import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DATABASE_CONNECTION, type Database } from '../../../database/database.module';
import * as schema from '../../../database/schema';

@Injectable()
export class WishlistService {
    constructor(@Inject(DATABASE_CONNECTION) private db: Database) { }

    private async getCustomerId(userId: string): Promise<string> {
        const customer = await this.db.query.customers.findFirst({
            where: eq(schema.customers.userId, userId),
        });
        if (!customer) throw new NotFoundException('Customer not found');
        return customer.id;
    }

    async getWishlist(userId: string) {
        const customerId = await this.getCustomerId(userId);

        const items = await this.db.query.wishlists.findMany({
            where: eq(schema.wishlists.customerId, customerId),
            with: {
                product: {
                    with: {
                        images: true,
                        vendor: true,
                    },
                },
            },
        });

        return items.map((item) => ({
            id: item.id,
            productId: item.productId, // Add this for frontend tracking
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
            addedAt: item.createdAt,
        }));
    }

    async addToWishlist(userId: string, productId: string) {
        const customerId = await this.getCustomerId(userId);

        const product = await this.db.query.products.findFirst({
            where: eq(schema.products.id, productId),
        });

        if (!product) throw new NotFoundException('Product not found');

        const existing = await this.db.query.wishlists.findFirst({
            where: and(
                eq(schema.wishlists.customerId, customerId),
                eq(schema.wishlists.productId, productId),
            ),
        });

        if (existing) {
            return { message: 'Product already in wishlist' };
        }

        await this.db.insert(schema.wishlists).values({
            customerId,
            productId,
        });

        return { message: 'Added to wishlist' };
    }

    async removeFromWishlist(userId: string, wishlistItemId: string) {
        const customerId = await this.getCustomerId(userId);

        const item = await this.db.query.wishlists.findFirst({
            where: and(
                eq(schema.wishlists.id, wishlistItemId),
                eq(schema.wishlists.customerId, customerId),
            ),
        });

        if (!item) throw new NotFoundException('Wishlist item not found');

        await this.db.delete(schema.wishlists).where(eq(schema.wishlists.id, wishlistItemId));

        return { message: 'Removed from wishlist' };
    }
}
