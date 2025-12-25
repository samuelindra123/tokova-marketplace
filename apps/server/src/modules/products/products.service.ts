import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and, desc, ilike, or, count, gte, lte } from 'drizzle-orm';
import { DATABASE_CONNECTION, type Database } from '../../database/database.module';
import * as schema from '../../database/schema';

@Injectable()
export class ProductsService {
    constructor(@Inject(DATABASE_CONNECTION) private db: Database) { }

    async findAll(query: {
        page?: number;
        limit?: number;
        categoryId?: string;
        vendorId?: string;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
    }) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const offset = (page - 1) * limit;

        const conditions = [eq(schema.products.status, 'ACTIVE')];

        if (query.categoryId) {
            conditions.push(eq(schema.products.categoryId, query.categoryId));
        }

        if (query.vendorId) {
            conditions.push(eq(schema.products.vendorId, query.vendorId));
        }

        if (query.search) {
            conditions.push(
                or(
                    ilike(schema.products.name, `%${query.search}%`),
                    ilike(schema.products.description, `%${query.search}%`),
                )!,
            );
        }

        if (query.minPrice !== undefined) {
            conditions.push(gte(schema.products.price, query.minPrice.toString()));
        }

        if (query.maxPrice !== undefined) {
            conditions.push(lte(schema.products.price, query.maxPrice.toString()));
        }

        let orderBy: any[] = [desc(schema.products.createdAt)];
        if (query.sortBy === 'price_asc') {
            orderBy = [schema.products.price];
        } else if (query.sortBy === 'price_desc') {
            orderBy = [desc(schema.products.price)];
        } else if (query.sortBy === 'rating') {
            orderBy = [desc(schema.products.rating)];
        }

        const [products, totalCount] = await Promise.all([
            this.db.query.products.findMany({
                where: and(...conditions),
                orderBy,
                limit,
                offset,
                with: {
                    images: true,
                    vendor: true,
                    category: true,
                },
            }),
            this.db
                .select({ count: count() })
                .from(schema.products)
                .where(and(...conditions)),
        ]);

        return {
            data: products.map((product) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                salePrice: product.salePrice ? Number(product.salePrice) : null,
                rating: Number(product.rating),
                reviewCount: product.reviewCount,
                stock: product.stock,
                image: product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url,
                store: {
                    name: product.vendor.storeName,
                    slug: product.vendor.storeSlug,
                },
                category: product.category
                    ? { name: product.category.name, slug: product.category.slug }
                    : null,
            })),
            meta: {
                page,
                limit,
                total: totalCount[0].count,
                totalPages: Math.ceil(totalCount[0].count / limit),
            },
        };
    }

    async findBySlug(slug: string) {
        const product = await this.db.query.products.findFirst({
            where: and(
                eq(schema.products.slug, slug),
                eq(schema.products.status, 'ACTIVE'),
            ),
            with: {
                images: true,
                vendor: true,
                category: true,
                reviews: {
                    limit: 10,
                    orderBy: [desc(schema.reviews.createdAt)],
                    with: {
                        customer: true,
                    },
                },
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return {
            ...product,
            price: Number(product.price),
            salePrice: product.salePrice ? Number(product.salePrice) : null,
            rating: Number(product.rating),
            weight: product.weight ? Number(product.weight) : null,
            reviews: product.reviews.map((review) => ({
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                images: review.images,
                customerName: `${review.customer?.firstName || ''} ${review.customer?.lastName || ''}`.trim() || 'Anonymous',
                createdAt: review.createdAt,
            })),
        };
    }

    async getCategories() {
        const categories = await this.db.query.categories.findMany({
            where: eq(schema.categories.isActive, true),
            orderBy: [schema.categories.sortOrder, schema.categories.name],
        });

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

    async getStores(query: { page?: number; limit?: number }) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const offset = (page - 1) * limit;

        const stores = await this.db.query.vendors.findMany({
            where: eq(schema.vendors.status, 'APPROVED'),
            limit,
            offset,
        });

        return stores.map((store) => ({
            id: store.id,
            name: store.storeName,
            slug: store.storeSlug,
            description: store.description,
            logo: store.logo,
            banner: store.banner,
        }));
    }

    async getStoreBySlug(slug: string) {
        const store = await this.db.query.vendors.findFirst({
            where: and(
                eq(schema.vendors.storeSlug, slug),
                eq(schema.vendors.status, 'APPROVED'),
            ),
        });

        if (!store) {
            throw new NotFoundException('Store not found');
        }

        const products = await this.db.query.products.findMany({
            where: and(
                eq(schema.products.vendorId, store.id),
                eq(schema.products.status, 'ACTIVE'),
            ),
            limit: 20,
            with: { images: true },
        });

        return {
            store: {
                name: store.storeName,
                slug: store.storeSlug,
                description: store.description,
                logo: store.logo,
                banner: store.banner,
            },
            products: products.map((p) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                price: Number(p.price),
                salePrice: p.salePrice ? Number(p.salePrice) : null,
                image: p.images?.find((img) => img.isPrimary)?.url || p.images?.[0]?.url,
            })),
        };
    }
}
