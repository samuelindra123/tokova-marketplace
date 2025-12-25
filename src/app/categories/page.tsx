'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Category } from '@/lib/api';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get<Category[]>('/products/categories');
            if (data) setCategories(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Category</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-square rounded-xl bg-slate-200"></div>
                            <div className="h-4 bg-slate-200 rounded mt-3 w-3/4 mx-auto"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Category</h1>

            {categories.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">No categories yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/products?categoryId=${category.id}`}
                            className="group text-center"
                        >
                            <div className="aspect-square rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden group-hover:border-orange-500 group-hover:shadow-md transition-all">
                                {category.image ? (
                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <p className="mt-3 text-sm font-medium text-slate-700 group-hover:text-orange-500 transition-colors">
                                {category.name}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
