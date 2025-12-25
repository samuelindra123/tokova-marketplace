import {
    Injectable,
    Inject,
    NotFoundException,
    ForbiddenException,
    ConflictException,
} from '@nestjs/common';
import { eq, and, desc, count, ilike, or } from 'drizzle-orm';
import slugify from 'slugify';
import { DATABASE_CONNECTION, type Database } from '../../../database/database.module';
import * as schema from '../../../database/schema';

@Injectable()
export class ProductsService {
    constructor(@Inject(DATABASE_CONNECTION) private db: Database) { }

    private async getVendorId(userId: string): Promise<string> {
        const vendor = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.userId, userId),
        });
        if (!vendor) throw new NotFoundException('Vendor not found');
        return vendor.id;
    }

    async findAll(
        userId: string,
        query: { page?: number; limit?: number; status?: string; search?: string },
    ) {
        const vendorId = await this.getVendorId(userId);
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;

        const conditions = [eq(schema.products.vendorId, vendorId)];

        if (query.status) {
            conditions.push(
                eq(schema.products.status, query.status as 'DRAFT' | 'ACTIVE' | 'INACTIVE'),
            );
        }

        if (query.search) {
            conditions.push(
                or(
                    ilike(schema.products.name, `%${query.search}%`),
                    ilike(schema.products.description, `%${query.search}%`),
                )!,
            );
        }

        const [products, totalCount] = await Promise.all([
            this.db.query.products.findMany({
                where: and(...conditions),
                orderBy: [desc(schema.products.createdAt)],
                limit,
                offset,
                with: {
                    images: true,
                    category: true,
                },
            }),
            this.db
                .select({ count: count() })
                .from(schema.products)
                .where(and(...conditions)),
        ]);

        return {
            data: products,
            meta: {
                page,
                limit,
                total: totalCount[0].count,
                totalPages: Math.ceil(totalCount[0].count / limit),
            },
        };
    }

    async findOne(userId: string, productId: string) {
        const vendorId = await this.getVendorId(userId);

        const product = await this.db.query.products.findFirst({
            where: and(
                eq(schema.products.id, productId),
                eq(schema.products.vendorId, vendorId),
            ),
            with: {
                images: true,
                category: true,
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async create(
        userId: string,
        data: {
            name: string;
            description?: string;
            price: number;
            salePrice?: number;
            categoryId?: string;
            stock: number;
            weight?: number;
            attributes?: any;
            images?: string[];
            status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
        },
    ) {
        const vendorId = await this.getVendorId(userId);
        const slug = slugify(data.name, { lower: true, strict: true }) + '-' + Date.now();

        const [product] = await this.db
            .insert(schema.products)
            .values({
                vendorId,
                name: data.name,
                slug,
                description: data.description,
                price: data.price.toString(),
                salePrice: data.salePrice?.toString(),
                categoryId: data.categoryId,
                stock: data.stock,
                weight: data.weight?.toString(),
                attributes: data.attributes,
                status: data.status || 'DRAFT',
            })
            .returning();

        // Add images if provided
        if (data.images && data.images.length > 0) {
            await this.db.insert(schema.productImages).values(
                data.images.map((url, index) => ({
                    productId: product.id,
                    url,
                    isPrimary: index === 0,
                    sortOrder: index,
                })),
            );
        }

        return this.findOne(userId, product.id);
    }

    async update(
        userId: string,
        productId: string,
        data: {
            name?: string;
            description?: string;
            price?: number;
            salePrice?: number;
            categoryId?: string;
            stock?: number;
            weight?: number;
            attributes?: any;
            status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
        },
    ) {
        const product = await this.findOne(userId, productId);

        const updateData: any = { updatedAt: new Date() };

        if (data.name) {
            updateData.name = data.name;
            updateData.slug = slugify(data.name, { lower: true, strict: true }) + '-' + Date.now();
        }
        if (data.description !== undefined) updateData.description = data.description;
        if (data.price !== undefined) updateData.price = data.price.toString();
        if (data.salePrice !== undefined) updateData.salePrice = data.salePrice?.toString();
        if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
        if (data.stock !== undefined) updateData.stock = data.stock;
        if (data.weight !== undefined) updateData.weight = data.weight?.toString();
        if (data.attributes !== undefined) updateData.attributes = data.attributes;
        if (data.status !== undefined) updateData.status = data.status;

        await this.db
            .update(schema.products)
            .set(updateData)
            .where(eq(schema.products.id, productId));

        return this.findOne(userId, productId);
    }

    async updateStock(userId: string, productId: string, stock: number) {
        await this.findOne(userId, productId);

        await this.db
            .update(schema.products)
            .set({ stock, updatedAt: new Date() })
            .where(eq(schema.products.id, productId));

        return { message: 'Stock updated successfully' };
    }

    async delete(userId: string, productId: string) {
        await this.findOne(userId, productId);

        await this.db.delete(schema.products).where(eq(schema.products.id, productId));

        return { message: 'Product deleted successfully' };
    }

    async addImages(userId: string, productId: string, urls: string[]) {
        await this.findOne(userId, productId);

        const existingImages = await this.db.query.productImages.findMany({
            where: eq(schema.productImages.productId, productId),
        });

        await this.db.insert(schema.productImages).values(
            urls.map((url, index) => ({
                productId,
                url,
                isPrimary: existingImages.length === 0 && index === 0,
                sortOrder: existingImages.length + index,
            })),
        );

        return { message: 'Images added successfully' };
    }

    async deleteImage(userId: string, productId: string, imageId: string) {
        await this.findOne(userId, productId);

        await this.db
            .delete(schema.productImages)
            .where(
                and(
                    eq(schema.productImages.id, imageId),
                    eq(schema.productImages.productId, productId),
                ),
            );

        return { message: 'Image deleted successfully' };
    }
}
