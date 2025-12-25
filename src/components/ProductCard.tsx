'use client';

import Link from 'next/link';
import { Product } from '@/lib/api';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { user } = useAuth();
    const { isInWishlist, addToWishlist, removeByProductId } = useWishlist();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Backend returns 'image' (string) OR 'images' (array), handle both
    const imageUrl = (product as any).image || product.images?.[0]?.url || '/placeholder-product.png';
    const price = parseFloat(product.price) || 0;
    const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
    const discount = salePrice && price > 0 ? Math.round((1 - salePrice / price) * 100) : 0;
    // Backend returns 'store' not 'vendor'
    const store = (product as any).store || product.vendor;

    const inWishlist = isInWishlist(product.id);

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            if (inWishlist) {
                await removeByProductId(product.id);
            } else {
                await addToWishlist(product.id);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative group">
            <Link href={`/products/${product.slug}`}>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Image */}
                    <div className="aspect-square relative overflow-hidden bg-slate-100">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-product.png';
                            }}
                        />
                        {discount > 0 && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                        <h3 className="text-sm text-slate-800 font-medium line-clamp-2 min-h-[40px] group-hover:text-orange-500 transition-colors">
                            {product.name}
                        </h3>

                        {/* Price */}
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

                        {/* Rating & Store */}
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            {parseFloat(product.rating) > 0 && (
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {product.rating}
                                </span>
                            )}
                            {store && (
                                <span className="truncate">{store.name || store.storeName}</span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            {/* Wishlist Button */}
            <button
                onClick={handleWishlistToggle}
                disabled={loading}
                className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${inWishlist
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white shadow-md'
                    } ${loading ? 'opacity-50' : ''}`}
                title={inWishlist ? 'Remove of wishlist' : 'Add ke wishlist'}
            >
                <svg
                    className="w-4 h-4"
                    fill={inWishlist ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
        </div>
    );
}

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
