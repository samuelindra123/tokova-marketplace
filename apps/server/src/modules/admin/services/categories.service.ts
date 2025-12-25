import {
    Injectable,
    Inject,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { eq, desc, count } from 'drizzle-orm';
import slugify from 'slugify';
import { DATABASE_CONNECTION, type Database } from '../../../database/database.module';
import * as schema from '../../../database/schema';

@Injectable()
export class CategoriesService {
    constructor(@Inject(DATABASE_CONNECTION) private db: Database) { }

    async findAll(query: { includeInactive?: boolean }) {
        const conditions = query.includeInactive
            ? undefined
            : eq(schema.categories.isActive, true);

        const categories = await this.db.query.categories.findMany({
            where: conditions,
            orderBy: [schema.categories.sortOrder, schema.categories.name],
        });

        // Build tree structure
        const categoryMap = new Map();
        const rootCategories: any[] = [];

        categories.forEach((cat) => {
            categoryMap.set(cat.id, { ...cat, children: [] });
        });

        categories.forEach((cat) => {
            if (cat.parentId) {
                const parent = categoryMap.get(cat.parentId);
                if (parent) {
                    parent.children.push(categoryMap.get(cat.id));
                }
            } else {
                rootCategories.push(categoryMap.get(cat.id));
            }
        });

        return rootCategories;
    }

    async findOne(id: string) {
        const category = await this.db.query.categories.findFirst({
            where: eq(schema.categories.id, id),
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    async create(data: {
        name: string;
        parentId?: string;
        image?: string;
        sortOrder?: number;
    }) {
        const slug = slugify(data.name, { lower: true, strict: true });

        // Check if slug exists
        const existing = await this.db.query.categories.findFirst({
            where: eq(schema.categories.slug, slug),
        });

        if (existing) {
            throw new ConflictException('Category with this name already exists');
        }

        // Validate parent exists if provided
        if (data.parentId) {
            const parent = await this.db.query.categories.findFirst({
                where: eq(schema.categories.id, data.parentId),
            });

            if (!parent) {
                throw new NotFoundException('Parent category not found');
            }
        }

        const [category] = await this.db
            .insert(schema.categories)
            .values({
                name: data.name,
                slug,
                parentId: data.parentId || null,
                image: data.image,
                sortOrder: data.sortOrder || 0,
            })
            .returning();

        return category;
    }

    async update(
        id: string,
        data: {
            name?: string;
            parentId?: string;
            image?: string;
            isActive?: boolean;
            sortOrder?: number;
        },
    ) {
        const category = await this.db.query.categories.findFirst({
            where: eq(schema.categories.id, id),
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        const updateData: any = { updatedAt: new Date() };

        if (data.name) {
            updateData.name = data.name;
            updateData.slug = slugify(data.name, { lower: true, strict: true });

            // Check if new slug exists
            const existing = await this.db.query.categories.findFirst({
                where: eq(schema.categories.slug, updateData.slug),
            });

            if (existing && existing.id !== id) {
                throw new ConflictException('Category with this name already exists');
            }
        }

        if (data.parentId !== undefined) {
            if (data.parentId === id) {
                throw new ConflictException('Category cannot be its own parent');
            }
            updateData.parentId = data.parentId || null;
        }

        if (data.image !== undefined) updateData.image = data.image;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;
        if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

        const [updated] = await this.db
            .update(schema.categories)
            .set(updateData)
            .where(eq(schema.categories.id, id))
            .returning();

        return updated;
    }

    async delete(id: string) {
        const category = await this.db.query.categories.findFirst({
            where: eq(schema.categories.id, id),
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        // Check if category has children
        const children = await this.db.query.categories.findMany({
            where: eq(schema.categories.parentId, id),
        });

        if (children.length > 0) {
            throw new ConflictException('Cannot delete category with subcategories');
        }

        // Check if category has products
        const [productCount] = await this.db
            .select({ count: count() })
            .from(schema.products)
            .where(eq(schema.products.categoryId, id));

        if (productCount.count > 0) {
            throw new ConflictException('Cannot delete category with products');
        }

        await this.db.delete(schema.categories).where(eq(schema.categories.id, id));

        return { message: 'Category deleted successfully' };
    }
}
