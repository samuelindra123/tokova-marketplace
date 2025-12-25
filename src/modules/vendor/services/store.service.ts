import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and, lt, count, sql, sum, desc, inArray } from 'drizzle-orm';
import slugify from 'slugify';
import { DATABASE_CONNECTION, type Database } from '../../../database/database.module';
import * as schema from '../../../database/schema';

@Injectable()
export class StoreService {
    constructor(@Inject(DATABASE_CONNECTION) private db: Database) { }

    async getStore(userId: string) {
        const vendor = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.userId, userId),
        });

        if (!vendor) {
            throw new NotFoundException('Store not found');
        }

        return vendor;
    }

    async getDashboardStats(userId: string) {
        const vendor = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.userId, userId),
        });

        if (!vendor) {
            throw new NotFoundException('Store not found');
        }

        // Get total products
        const [productsResult] = await this.db
            .select({ count: count() })
            .from(schema.products)
            .where(eq(schema.products.vendorId, vendor.id));

        // Get order items for this vendor
        const orderItems = await this.db.query.orderItems.findMany({
            where: eq(schema.orderItems.vendorId, vendor.id),
            with: {
                order: true,
            },
        });

        // Calculate stats from order items
        const newOrdersCount = orderItems.filter(item =>
            item.status === 'PENDING' || item.status === 'PROCESSING'
        ).length;

        // Revenue from delivered orders
        const revenue = orderItems
            .filter(item => item.status === 'DELIVERED')
            .reduce((sum, item) => sum + Number(item.subtotal), 0);

        // Get recent orders (unique by orderId)
        const uniqueOrderIds = [...new Set(orderItems.map(item => item.orderId))];
        const recentOrders = await this.db.query.orders.findMany({
            where: inArray(schema.orders.id, uniqueOrderIds.slice(0, 5)),
            orderBy: [desc(schema.orders.createdAt)],
            with: {
                customer: {
                    with: { user: true }
                },
                items: {
                    where: eq(schema.orderItems.vendorId, vendor.id),
                },
            },
        });

        // Get vendor rating (if reviews exist)
        const [ratingResult] = await this.db
            .select({
                avgRating: sql<number>`AVG(${schema.reviews.rating})::float`,
                totalReviews: count()
            })
            .from(schema.reviews)
            .innerJoin(schema.products, eq(schema.reviews.productId, schema.products.id))
            .where(eq(schema.products.vendorId, vendor.id));

        return {
            totalProducts: productsResult?.count || 0,
            newOrders: newOrdersCount,
            revenue: revenue,
            rating: ratingResult?.avgRating ? Number(ratingResult.avgRating.toFixed(1)) : null,
            totalReviews: ratingResult?.totalReviews || 0,
            recentOrders: recentOrders.map(order => ({
                id: order.id,
                orderNumber: order.orderNumber,
                customerName: order.customer?.user?.email || 'Customer',
                status: order.status,
                total: Number(order.total),
                items: order.items.map(item => ({
                    productName: item.productName,
                    quantity: item.quantity,
                    subtotal: Number(item.subtotal),
                    status: item.status,
                })),
                createdAt: order.createdAt,
            })),
        };
    }

    async updateStore(
        userId: string,
        data: {
            storeName?: string;
            description?: string;
            phone?: string;
            address?: string;
            bankInfo?: any;
            logo?: string;
        },
    ) {
        const vendor = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.userId, userId),
        });

        if (!vendor) {
            throw new NotFoundException('Store not found');
        }

        const updateData: any = { updatedAt: new Date() };

        // Check if trying to change store name
        if (data.storeName && data.storeName !== vendor.storeName) {
            // Check if 7 days have passed since last name change
            if (vendor.storeNameChangedAt) {
                const daysSinceChange = Math.floor(
                    (Date.now() - new Date(vendor.storeNameChangedAt).getTime()) / (1000 * 60 * 60 * 24)
                );
                if (daysSinceChange < 7) {
                    const daysRemaining = 7 - daysSinceChange;
                    throw new Error(`Anda hanya dapat mengubah nama toko sekali dalam seminggu. Tunggu ${daysRemaining} hari lagi.`);
                }
            }
            updateData.storeName = data.storeName;
            updateData.storeSlug = slugify(data.storeName, { lower: true, strict: true });
            updateData.storeNameChangedAt = new Date();
        }

        if (data.description !== undefined) updateData.description = data.description;
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.address !== undefined) updateData.address = data.address;
        if (data.bankInfo !== undefined) updateData.bankInfo = data.bankInfo;
        if (data.logo !== undefined) updateData.logo = data.logo;

        const [updated] = await this.db
            .update(schema.vendors)
            .set(updateData)
            .where(eq(schema.vendors.id, vendor.id))
            .returning();

        return updated;
    }

    async updateLogo(userId: string, logoUrl: string) {
        const vendor = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.userId, userId),
        });

        if (!vendor) {
            throw new NotFoundException('Store not found');
        }

        await this.db
            .update(schema.vendors)
            .set({ logo: logoUrl, updatedAt: new Date() })
            .where(eq(schema.vendors.id, vendor.id));

        return { message: 'Logo updated successfully' };
    }

    async updateBanner(userId: string, bannerUrl: string) {
        const vendor = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.userId, userId),
        });

        if (!vendor) {
            throw new NotFoundException('Store not found');
        }

        await this.db
            .update(schema.vendors)
            .set({ banner: bannerUrl, updatedAt: new Date() })
            .where(eq(schema.vendors.id, vendor.id));

        return { message: 'Banner updated successfully' };
    }

    async getQueuePosition(userId: string) {
        const vendor = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.userId, userId),
        });

        if (!vendor) {
            throw new NotFoundException('Store not found');
        }

        // Count total pending vendors
        const [totalPending] = await this.db
            .select({ count: count() })
            .from(schema.vendors)
            .where(eq(schema.vendors.status, 'PENDING'));

        // Count pending vendors created before this vendor (queue position)
        const [positionResult] = await this.db
            .select({ count: count() })
            .from(schema.vendors)
            .where(
                and(
                    eq(schema.vendors.status, 'PENDING'),
                    lt(schema.vendors.createdAt, vendor.createdAt)
                )
            );

        return {
            status: vendor.status,
            storeName: vendor.storeName,
            position: (positionResult?.count || 0) + 1, // 1-indexed position
            totalPending: totalPending?.count || 0,
            createdAt: vendor.createdAt,
        };
    }
}
