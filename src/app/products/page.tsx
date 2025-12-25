'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api, Product, Category } from '@/lib/api';
import { ProductGrid } from '@/components/ProductCard';

function ProductsContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    const page = parseInt(searchParams.get('page') || '1');
    const categoryId = searchParams.get('categoryId') || '';
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'newest';

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [page, categoryId, search, sortBy]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', page.toString());
            params.set('limit', '20');
            if (categoryId) params.set('categoryId', categoryId);
            if (search) params.set('search', search);
            params.set('sortBy', sortBy);

            const { data } = await api.get<{ data: Product[]; total?: number; totalPages?: number }>(`/products?${params}`);
            if (data) {
                // Backend returns { data: [...products...] }
                setProducts(data.data || []);
                // Calculate total pages if not provided
                const total = data.total || data.data?.length || 0;
                setTotalPages(data.totalPages || Math.ceil(total / 20) || 1);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        const { data } = await api.get<Category[]>('/products/categories');
        if (data) setCategories(data);
    };

    const buildUrl = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });
        params.delete('page');
        return `/products?${params.toString()}`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {search ? `Hasil Pencarian "${search}"` : 'Semua Product'}
                    </h1>
                    {categoryId && categories.find(c => c.id === categoryId) && (
                        <p className="text-slate-600 mt-1">
                            Category: {categories.find(c => c.id === categoryId)?.name}
                        </p>
                    )}
                </div>

                {/* Sort */}
                <select
                    value={sortBy}
                    onChange={(e) => window.location.href = buildUrl({ sortBy: e.target.value })}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    <option value="newest">Terbaru</option>
                    <option value="price_asc">Price Terendah</option>
                    <option value="price_desc">Price Tertinggi</option>
                    <option value="rating">Rating Tertinggi</option>
                </select>
            </div>

            <div className="flex gap-8">
                {/* Sidebar Filters */}
                <aside className="hidden lg:block w-56 flex-shrink-0">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-24">
                        <h3 className="font-semibold text-slate-900 mb-4">Category</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href={buildUrl({ categoryId: '' })}
                                    className={`block text-sm ${!categoryId ? 'text-orange-500 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
                                >
                                    All Categories
                                </Link>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={buildUrl({ categoryId: cat.id })}
                                        className={`block text-sm ${categoryId === cat.id ? 'text-orange-500 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Products */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-square rounded-xl bg-slate-200"></div>
                                    <div className="h-4 bg-slate-200 rounded mt-3"></div>
                                    <div className="h-4 bg-slate-200 rounded mt-2 w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <ProductGrid products={products} />

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    {page > 1 && (
                                        <Link
                                            href={`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: (page - 1).toString() })}`}
                                            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    <span className="px-4 py-2 text-slate-600">
                                        Page {page} of {totalPages}
                                    </span>
                                    {page < totalPages && (
                                        <Link
                                            href={`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: (page + 1).toString() })}`}
                                            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                                        >
                                            Selanjutnya
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p className="text-slate-500">No products ditemukan</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-48 mb-6"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i}>
                                <div className="aspect-square rounded-xl bg-slate-200"></div>
                                <div className="h-4 bg-slate-200 rounded mt-3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
