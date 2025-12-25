'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, Product, CartItem } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { isInWishlist, addToWishlist, removeByProductId } = useWishlist();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (params.slug) {
            fetchProduct(params.slug as string);
        }
    }, [params.slug]);

    const fetchProduct = async (slug: string) => {
        try {
            const { data, error } = await api.get<Product>(`/products/${slug}`);
            if (data) {
                setProduct(data);
            } else if (error) {
                console.error(error);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (!product) return;

        setAdding(true);
        try {
            const success = await addToCart(product.id, quantity);
            if (success) {
                setMessage('Added to cart successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Failed to add to cart');
            }
        } catch (err) {
            setMessage('Failed to add to cart');
        } finally {
            setAdding(false);
        }
    };

    const handleWishlistToggle = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (!product) return;

        try {
            if (isInWishlist(product.id)) {
                const success = await removeByProductId(product.id);
                if (success) {
                    setMessage('Removed from wishlist');
                    setTimeout(() => setMessage(''), 3000);
                }
            } else {
                const success = await addToWishlist(product.id);
                if (success) {
                    setMessage('Added to wishlist successfully!');
                    setTimeout(() => setMessage(''), 3000);
                }
            }
        } catch (err) {
            setMessage('Failed to update wishlist');
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
                    <div className="aspect-square bg-slate-200 rounded-xl"></div>
                    <div>
                        <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
                        <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
                        <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h1>
                <Link href="/products" className="text-orange-500 hover:underline">
                    Kembali ke daftar produk
                </Link>
            </div>
        );
    }

    const price = parseFloat(product.price) || 0;
    const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
    const displayPrice = salePrice || price;
    // Backend returns 'image' (string) not 'images' (array)
    const productImage = (product as any).image;
    const images = product.images?.length
        ? product.images
        : productImage
            ? [{ id: '0', url: productImage, isPrimary: true, sortOrder: 0 }]
            : [{ id: '0', url: '/placeholder-product.png', isPrimary: true, sortOrder: 0 }];
    // Backend returns 'store' not 'vendor'
    const store = (product as any).store || product.vendor;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link href="/" className="hover:text-slate-900">Home</Link>
                <span>/</span>
                <Link href="/products" className="hover:text-slate-900">Product</Link>
                <span>/</span>
                <span className="text-slate-900 truncate">{product.name}</span>
            </nav>

            {message && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                    <div className="aspect-square bg-white rounded-xl border border-slate-200 overflow-hidden mb-4">
                        <img
                            src={images[selectedImage]?.url}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {images.map((img, idx) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-20 h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 ${selectedImage === idx ? 'border-orange-500' : 'border-slate-200'}`}
                                >
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                        {product.name}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-4 mb-4">
                        {parseFloat(product.rating) > 0 && (
                            <div className="flex items-center gap-1">
                                <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-medium">{product.rating}</span>
                                <span className="text-slate-500">({product.reviewCount} reviews)</span>
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        <p className="text-3xl font-bold text-orange-500">
                            ${displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        {salePrice && (
                            <p className="text-lg text-slate-400 line-through mt-1">
                                ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                        )}
                    </div>

                    {/* Stock */}
                    <div className="mb-6">
                        <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock > 0 ? `Stock: ${product.stock}` : 'Stock Habis'}
                        </p>
                    </div>

                    {/* Quantity */}
                    {product.stock > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Jumlah</label>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 border border-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-50"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                    className="w-20 h-10 border border-slate-300 rounded-lg text-center"
                                />
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="w-10 h-10 border border-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-50"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={handleAddToCart}
                            disabled={adding || product.stock === 0}
                            className="flex-1 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {adding ? 'Adding...' : 'Add to Cart'}
                        </button>
                        <button
                            onClick={handleWishlistToggle}
                            className={`p-3 border rounded-lg transition-colors ${isInWishlist(product.id)
                                    ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
                                    : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                                }`}
                            title={isInWishlist(product.id) ? 'Remove of wishlist' : 'Add ke wishlist'}
                        >
                            <svg
                                className="w-6 h-6"
                                fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>

                    {/* Store */}
                    {store && (
                        <Link
                            href={`/stores/${store.slug || store.storeSlug}`}
                            className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                {store.logo ? (
                                    <img src={store.logo} alt={store.name || store.storeName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xl font-bold text-slate-400">{(store.name || store.storeName || 'S')[0]}</span>
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">{store.name || store.storeName}</p>
                                <p className="text-sm text-slate-500">Kunjungi Store</p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            {/* Description */}
            {product.description && (
                <div className="mt-12">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Deskripsi Product</h2>
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <p className="text-slate-700 whitespace-pre-wrap">{product.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
