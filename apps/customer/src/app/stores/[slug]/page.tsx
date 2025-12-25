'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api, Store, Product } from '@/lib/api';
import { ProductGrid } from '@/components/ProductCard';

interface StoreWithProducts extends Store {
    products?: Product[];
}

export default function StoreDetailPage() {
    const params = useParams();
    const [store, setStore] = useState<StoreWithProducts | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.slug) {
            fetchStore(params.slug as string);
        }
    }, [params.slug]);

    const fetchStore = async (slug: string) => {
        try {
            // Backend returns {store: {...}, products: [...]}
            const { data } = await api.get<{ store: Store; products: Product[] }>(`/products/stores/${slug}`);
            if (data) {
                // Extract store object with fallback to handle both formats
                const storeData = (data as any).store || data;
                const productsData = (data as any).products || [];
                setStore(storeData);
                setProducts(productsData);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-40 bg-slate-200 rounded-xl mb-6"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i}>
                                <div className="aspect-square bg-slate-200 rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Store not found</h1>
                <Link href="/stores" className="text-orange-500 hover:underline">
                    Kembali ke Daftar Store
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Store Header */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-8">
                {store.banner && (
                    <div className="h-40 bg-slate-100">
                        <img src={store.banner} alt="" className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-20 h-20 rounded-full bg-orange-100 overflow-hidden flex items-center justify-center flex-shrink-0 border-4 border-white shadow-lg ${store.banner ? '-mt-12' : ''}`}>
                            {store.logo ? (
                                <img src={store.logo} alt={(store as any).name || store.storeName || 'Store'} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-orange-500">{((store as any).name || store.storeName || 'S')[0].toUpperCase()}</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-slate-900">{(store as any).name || store.storeName}</h1>
                            {store.description && (
                                <p className="text-slate-600 mt-1">{store.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Products */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Product ({products.length})</h2>
                {products.length > 0 ? (
                    <ProductGrid products={products} />
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <p className="text-slate-500">This store has no products yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
