import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DATABASE_CONNECTION, type Database } from '../../../database/database.module';
import * as schema from '../../../database/schema';

@Injectable()
export class AddressesService {
    constructor(@Inject(DATABASE_CONNECTION) private db: Database) { }

    private async getCustomerId(userId: string): Promise<string> {
        const customer = await this.db.query.customers.findFirst({
            where: eq(schema.customers.userId, userId),
        });
        if (!customer) throw new NotFoundException('Customer not found');
        return customer.id;
    }

    async getAddresses(userId: string) {
        const customerId = await this.getCustomerId(userId);

        return this.db.query.addresses.findMany({
            where: eq(schema.addresses.customerId, customerId),
            orderBy: [schema.addresses.isDefault],
        });
    }

    async getAddress(userId: string, addressId: string) {
        const customerId = await this.getCustomerId(userId);

        const address = await this.db.query.addresses.findFirst({
            where: and(
                eq(schema.addresses.id, addressId),
                eq(schema.addresses.customerId, customerId),
            ),
        });

        if (!address) throw new NotFoundException('Address not found');
        return address;
    }

    async createAddress(
        userId: string,
        data: {
            label: string;
            recipientName: string;
            phone: string;
            addressLine: string;
            city: string;
            province: string;
            postalCode: string;
            isDefault?: boolean;
        },
    ) {
        const customerId = await this.getCustomerId(userId);

        // If this is default, unset other defaults
        if (data.isDefault) {
            await this.db
                .update(schema.addresses)
                .set({ isDefault: false })
                .where(eq(schema.addresses.customerId, customerId));
        }

        // Check if this is the first address
        const existingAddresses = await this.db.query.addresses.findMany({
            where: eq(schema.addresses.customerId, customerId),
        });

        const [address] = await this.db
            .insert(schema.addresses)
            .values({
                customerId,
                ...data,
                isDefault: data.isDefault || existingAddresses.length === 0,
            })
            .returning();

        return address;
    }

    async updateAddress(
        userId: string,
        addressId: string,
        data: {
            label?: string;
            recipientName?: string;
            phone?: string;
            addressLine?: string;
            city?: string;
            province?: string;
            postalCode?: string;
            isDefault?: boolean;
        },
    ) {
        const customerId = await this.getCustomerId(userId);

        const address = await this.db.query.addresses.findFirst({
            where: and(
                eq(schema.addresses.id, addressId),
                eq(schema.addresses.customerId, customerId),
            ),
        });

        if (!address) throw new NotFoundException('Address not found');

        // If setting as default, unset other defaults
        if (data.isDefault) {
            await this.db
                .update(schema.addresses)
                .set({ isDefault: false })
                .where(eq(schema.addresses.customerId, customerId));
        }

        const [updated] = await this.db
            .update(schema.addresses)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(schema.addresses.id, addressId))
            .returning();

        return updated;
    }

    async deleteAddress(userId: string, addressId: string) {
        const customerId = await this.getCustomerId(userId);

        const address = await this.db.query.addresses.findFirst({
            where: and(
                eq(schema.addresses.id, addressId),
                eq(schema.addresses.customerId, customerId),
            ),
        });

        if (!address) throw new NotFoundException('Address not found');

        await this.db.delete(schema.addresses).where(eq(schema.addresses.id, addressId));

        // If deleted address was default, make another one default
        if (address.isDefault) {
            const remaining = await this.db.query.addresses.findFirst({
                where: eq(schema.addresses.customerId, customerId),
            });

            if (remaining) {
                await this.db
                    .update(schema.addresses)
                    .set({ isDefault: true })
                    .where(eq(schema.addresses.id, remaining.id));
            }
        }

        return { message: 'Address deleted successfully' };
    }
}
