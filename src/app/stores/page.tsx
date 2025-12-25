'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Store } from '@/lib/api';

export default function StoresPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            // Backend returns array directly
            const { data } = await api.get<Store[]>('/products/stores');
            if (data) setStores(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Store</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-white rounded-xl p-6">
                            <div className="w-20 h-20 rounded-full bg-slate-200 mx-auto mb-4"></div>
                            <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Store</h1>

            {stores.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">No stores registered yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {stores.map((store) => {
                        // Backend returns 'slug' and 'name', not 'storeSlug' and 'storeName'
                        const storeSlug = (store as any).slug || store.storeSlug;
                        const storeName = (store as any).name || store.storeName || 'Store';
                        return (
                            <Link
                                key={store.id}
                                href={`/stores/${storeSlug}`}
                                className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:border-orange-300 hover:shadow-md transition-all group"
                            >
                                <div className="w-20 h-20 rounded-full bg-slate-100 mx-auto mb-4 overflow-hidden flex items-center justify-center">
                                    {store.logo ? (
                                        <img src={store.logo} alt={storeName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-slate-400 group-hover:text-orange-400 transition-colors">
                                            {storeName[0]}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-medium text-slate-900 group-hover:text-orange-500 transition-colors">
                                    {storeName}
                                </h3>
                                {store.description && (
                                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{store.description}</p>
                                )}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
