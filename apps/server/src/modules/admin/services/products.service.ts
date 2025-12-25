import { Injectable, Inject } from '@nestjs/common';
import { desc, count, like, or, SQL } from 'drizzle-orm';
import { DATABASE_CONNECTION, type Database } from '../../../database/database.module';
import * as schema from '../../../database/schema';

@Injectable()
export class AdminProductsService {
    constructor(@Inject(DATABASE_CONNECTION) private db: Database) { }

    async findAll(query: { page?: number; limit?: number; search?: string }) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;

        const conditions: SQL[] = [];

        if (query.search) {
            conditions.push(or(
                like(schema.products.name, `%${query.search}%`),
                like(schema.products.slug, `%${query.search}%`)
            )!);
        }

        const data = await this.db.query.products.findMany({
            where: conditions.length ? conditions[0] : undefined,
            orderBy: [desc(schema.products.createdAt)],
            limit,
            offset,
            with: {
                vendor: true,
                category: true,
                images: true,
            },
        });

        const [totalCount] = await this.db
            .select({ count: count() })
            .from(schema.products)
            .where(conditions.length ? conditions[0] : undefined);

        return {
            data,
            meta: {
                page,
                limit,
                total: totalCount.count,
                totalPages: Math.ceil(totalCount.count / limit),
            },
        };
    }
}
