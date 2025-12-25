'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistPage() {
    const { user, loading: authLoading } = useAuth();
    const { wishlistItems, loading, removeFromWishlist } = useWishlist();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleRemoveItem = async (id: string) => {
        await removeFromWishlist(id);
    };

    // Get product image safely
    const getProductImage = (product: any): string => {
        return product.image || product.images?.[0]?.url || '/placeholder-product.png';
    };

    if (authLoading || loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">My Wishlist</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-square rounded-xl bg-slate-200"></div>
                            <div className="h-4 bg-slate-200 rounded mt-3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">My Wishlist</h1>

            {wishlistItems.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">Wishlist is Empty</h2>
                    <p className="text-slate-500 mb-6">Save your favorite products here!</p>
                    <Link href="/products" className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {wishlistItems.map((item) => {
                        const product = item.product;
                        const price = parseFloat(product.price);
                        const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;

                        return (
                            <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
                                <Link href={`/products/${product.slug}`} className="block">
                                    <div className="aspect-square relative overflow-hidden bg-slate-100">
                                        <img
                                            src={getProductImage(product)}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/placeholder-product.png';
                                            }}
                                        />
                                        {/* Wishlist indicator */}
                                        <div className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="p-3">
                                        <h3 className="text-sm text-slate-800 font-medium line-clamp-2 min-h-[40px] group-hover:text-orange-500 transition-colors">
                                            {product.name}
                                        </h3>

                                        <div className="mt-2">
                                            {salePrice ? (
                                                <>
                                                    <p className="text-orange-500 font-bold">
                                                        ${salePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </p>
                                                    <p className="text-slate-400 text-xs line-through">
                                                        ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-orange-500 font-bold">
                                                    ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>

                                <div className="px-3 pb-3">
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="w-full py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
