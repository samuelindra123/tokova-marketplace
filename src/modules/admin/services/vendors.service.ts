import {
    Injectable,
    Inject,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { eq, desc, ilike, or, and, count } from 'drizzle-orm';
import { DATABASE_CONNECTION, type Database } from '../../../database/database.module';
import * as schema from '../../../database/schema';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class VendorsService {
    constructor(
        @Inject(DATABASE_CONNECTION) private db: Database,
        private mailService: MailService,
    ) { }

    async findAll(query: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
    }) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;

        const conditions: any[] = [];

        if (query.status) {
            conditions.push(
                eq(schema.vendors.status, query.status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'),
            );
        }

        if (query.search) {
            conditions.push(
                or(
                    ilike(schema.vendors.storeName, `%${query.search}%`),
                    ilike(schema.vendors.description, `%${query.search}%`),
                ),
            );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [vendors, totalCount] = await Promise.all([
            this.db.query.vendors.findMany({
                where: whereClause,
                orderBy: [desc(schema.vendors.createdAt)],
                limit,
                offset,
                with: {
                    user: true,
                },
            }),
            this.db
                .select({ count: count() })
                .from(schema.vendors)
                .where(whereClause),
        ]);

        return {
            data: vendors.map((vendor) => ({
                id: vendor.id,
                storeName: vendor.storeName,
                storeSlug: vendor.storeSlug,
                description: vendor.description,
                logo: vendor.logo,
                status: vendor.status,
                commissionRate: Number(vendor.commissionRate),
                email: vendor.user.email,
                phone: vendor.phone,
                createdAt: vendor.createdAt,
            })),
            meta: {
                page,
                limit,
                total: totalCount[0].count,
                totalPages: Math.ceil(totalCount[0].count / limit),
            },
        };
    }

    async findOne(id: string) {
        const vendor = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.id, id),
            with: {
                user: true,
                products: {
                    limit: 10,
                    orderBy: [desc(schema.products.createdAt)],
                },
            },
        });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        return vendor;
    }

    async updateStatus(
        id: string,
        status: 'APPROVED' | 'REJECTED' | 'SUSPENDED',
        reason?: string,
    ) {
        const vendor = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.id, id),
            with: { user: true },
        });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        if (vendor.status === status) {
            throw new BadRequestException(`Vendor is already ${status.toLowerCase()}`);
        }

        await this.db
            .update(schema.vendors)
            .set({
                status,
                updatedAt: new Date(),
            })
            .where(eq(schema.vendors.id, id));

        // Send email notification
        if (status === 'APPROVED') {
            await this.mailService.sendVendorApprovedEmail(
                vendor.user.email,
                vendor.storeName,
            );
        } else if (status === 'REJECTED') {
            await this.mailService.sendVendorRejectedEmail(
                vendor.user.email,
                vendor.storeName,
                reason,
            );
        }

        return { message: `Vendor ${status.toLowerCase()} successfully` };
    }

    async updateCommissionRate(id: string, commissionRate: number) {
        if (commissionRate < 0 || commissionRate > 100) {
            throw new BadRequestException('Commission rate must be between 0 and 100');
        }

        const vendor = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.id, id),
        });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        await this.db
            .update(schema.vendors)
            .set({
                commissionRate: commissionRate.toString(),
                updatedAt: new Date(),
            })
            .where(eq(schema.vendors.id, id));

        return { message: 'Commission rate updated successfully' };
    }
}
