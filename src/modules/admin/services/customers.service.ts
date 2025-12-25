import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, like, or, desc, count } from 'drizzle-orm';
import { DATABASE_CONNECTION, type Database } from '../../../database/database.module';
import * as schema from '../../../database/schema';

@Injectable()
export class CustomersService {
    constructor(@Inject(DATABASE_CONNECTION) private db: Database) { }

    async findAll(query: { page?: number; limit?: number; search?: string }) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;

        // Build conditions
        const conditions: any[] = [];

        if (query.search) {
            conditions.push(
                or(
                    like(schema.users.email, `%${query.search}%`),
                    like(schema.customers.firstName, `%${query.search}%`),
                    like(schema.customers.lastName, `%${query.search}%`),
                )
            );
        }

        // Get customers with user data including role and isActive
        const customers = await this.db
            .select({
                id: schema.customers.id,
                firstName: schema.customers.firstName,
                lastName: schema.customers.lastName,
                phone: schema.customers.phone,
                userId: schema.customers.userId,
                createdAt: schema.customers.createdAt,
                email: schema.users.email,
                role: schema.users.role,
                isVerified: schema.users.isVerified,
                isActive: schema.users.isActive,
            })
            .from(schema.customers)
            .leftJoin(schema.users, eq(schema.customers.userId, schema.users.id))
            .where(conditions.length > 0 ? conditions[0] : undefined)
            .orderBy(desc(schema.customers.createdAt))
            .limit(limit)
            .offset(offset);

        // Get total count
        const [totalResult] = await this.db
            .select({ count: count() })
            .from(schema.customers);

        return {
            data: customers,
            meta: {
                page,
                limit,
                total: totalResult.count,
                totalPages: Math.ceil(totalResult.count / limit),
            },
        };
    }

    async findOne(id: string) {
        const [customer] = await this.db
            .select({
                id: schema.customers.id,
                firstName: schema.customers.firstName,
                lastName: schema.customers.lastName,
                phone: schema.customers.phone,
                userId: schema.customers.userId,
                createdAt: schema.customers.createdAt,
                email: schema.users.email,
                role: schema.users.role,
                isVerified: schema.users.isVerified,
                isActive: schema.users.isActive,
            })
            .from(schema.customers)
            .leftJoin(schema.users, eq(schema.customers.userId, schema.users.id))
            .where(eq(schema.customers.id, id));

        if (!customer) {
            return null;
        }

        // Get customer's orders
        const orders = await this.db.query.orders.findMany({
            where: eq(schema.orders.customerId, id),
            orderBy: [desc(schema.orders.createdAt)],
            limit: 10,
        });

        // Get customer's addresses
        const addresses = await this.db.query.addresses.findMany({
            where: eq(schema.addresses.customerId, id),
        });

        return {
            ...customer,
            orders,
            addresses,
        };
    }

    async update(id: string, data: { firstName?: string; lastName?: string; phone?: string }) {
        const [customer] = await this.db
            .select({ id: schema.customers.id })
            .from(schema.customers)
            .where(eq(schema.customers.id, id));

        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        await this.db
            .update(schema.customers)
            .set({
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                updatedAt: new Date(),
            })
            .where(eq(schema.customers.id, id));

        return this.findOne(id);
    }

    async verify(id: string) {
        const [customer] = await this.db
            .select({ userId: schema.customers.userId })
            .from(schema.customers)
            .where(eq(schema.customers.id, id));

        if (!customer || !customer.userId) {
            throw new NotFoundException('Customer not found');
        }

        await this.db
            .update(schema.users)
            .set({ isVerified: true, updatedAt: new Date() })
            .where(eq(schema.users.id, customer.userId));

        return { message: 'Customer verified successfully' };
    }

    async suspend(id: string, suspend: boolean) {
        const [customer] = await this.db
            .select({ userId: schema.customers.userId })
            .from(schema.customers)
            .where(eq(schema.customers.id, id));

        if (!customer || !customer.userId) {
            throw new NotFoundException('Customer not found');
        }

        await this.db
            .update(schema.users)
            .set({ isActive: !suspend, updatedAt: new Date() })
            .where(eq(schema.users.id, customer.userId));

        return { message: suspend ? 'Customer suspended' : 'Customer reactivated' };
    }

    async updateRole(id: string, role: 'CUSTOMER' | 'VENDOR' | 'ADMIN') {
        const [customer] = await this.db
            .select({ userId: schema.customers.userId })
            .from(schema.customers)
            .where(eq(schema.customers.id, id));

        if (!customer || !customer.userId) {
            throw new NotFoundException('Customer not found');
        }

        await this.db
            .update(schema.users)
            .set({ role, updatedAt: new Date() })
            .where(eq(schema.users.id, customer.userId));

        return { message: `Role updated to ${role}` };
    }
}

