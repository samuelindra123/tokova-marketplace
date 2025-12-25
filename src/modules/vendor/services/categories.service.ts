import { Injectable, Inject } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DATABASE_CONNECTION, type Database } from '../../../database/database.module';
import * as schema from '../../../database/schema';

@Injectable()
export class VendorCategoriesService {
    constructor(@Inject(DATABASE_CONNECTION) private db: Database) { }

    async findAll() {
        // Return only active categories, ordered by sortOrder or name
        return this.db.query.categories.findMany({
            where: eq(schema.categories.isActive, true),
            orderBy: [desc(schema.categories.sortOrder)],
        });
    }
}
