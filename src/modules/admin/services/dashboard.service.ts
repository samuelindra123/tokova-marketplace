import { Injectable, Inject } from '@nestjs/common';
import { sql, eq, count, desc, and, gte } from 'drizzle-orm';
import { DATABASE_CONNECTION, type Database } from '../../../database/database.module';
import * as schema from '../../../database/schema';

@Injectable()
export class DashboardService {
    constructor(@Inject(DATABASE_CONNECTION) private db: Database) { }

    async getStats() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Get counts
        const [
            totalUsers,
            totalVendors,
            totalCustomers,
            totalProducts,
            totalOrders,
            pendingVendors,
        ] = await Promise.all([
            this.db.select({ count: count() }).from(schema.users),
            this.db
                .select({ count: count() })
                .from(schema.vendors)
                .where(eq(schema.vendors.status, 'APPROVED')),
            this.db.select({ count: count() }).from(schema.customers),
            this.db
                .select({ count: count() })
                .from(schema.products)
                .where(eq(schema.products.status, 'ACTIVE')),
            this.db.select({ count: count() }).from(schema.orders),
            this.db
                .select({ count: count() })
                .from(schema.vendors)
                .where(eq(schema.vendors.status, 'PENDING')),
        ]);

        // Get revenue this month
        const [revenueThisMonth] = await this.db
            .select({
                total: sql<number>`COALESCE(SUM(${schema.orders.total}), 0)`,
            })
            .from(schema.orders)
            .where(
                and(
                    gte(schema.orders.createdAt, startOfMonth),
                    eq(schema.orders.paymentStatus, 'PAID'),
                ),
            );

        // Get revenue last month
        const [revenueLastMonth] = await this.db
            .select({
                total: sql<number>`COALESCE(SUM(${schema.orders.total}), 0)`,
            })
            .from(schema.orders)
            .where(
                and(
                    gte(schema.orders.createdAt, startOfLastMonth),
                    sql`${schema.orders.createdAt} < ${startOfMonth.toISOString()}`,
                    eq(schema.orders.paymentStatus, 'PAID'),
                ),
            );

        // Recent orders
        const recentOrders = await this.db.query.orders.findMany({
            orderBy: [desc(schema.orders.createdAt)],
            limit: 10,
            with: {
                customer: {
                    with: {
                        user: true,
                    },
                },
            },
        });

        return {
            stats: {
                totalUsers: totalUsers[0].count,
                totalVendors: totalVendors[0].count,
                totalCustomers: totalCustomers[0].count,
                totalProducts: totalProducts[0].count,
                totalOrders: totalOrders[0].count,
                pendingVendors: pendingVendors[0].count,
                revenueThisMonth: Number(revenueThisMonth.total),
                revenueLastMonth: Number(revenueLastMonth.total),
            },
            recentOrders: recentOrders.map((order) => ({
                id: order.id,
                orderNumber: order.orderNumber,
                total: Number(order.total),
                status: order.status,
                paymentStatus: order.paymentStatus,
                customerEmail: order.customer?.user?.email,
                createdAt: order.createdAt,
            })),
        };
    }
}
