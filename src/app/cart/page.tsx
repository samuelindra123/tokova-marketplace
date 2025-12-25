'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
    const { user, loading: authLoading } = useAuth();
    const { cartItems, loading: cartLoading, updateQuantity, removeFromCart, refreshCart } = useCart();
    const router = useRouter();
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleUpdateQuantity = async (itemId: string, quantity: number) => {
        if (quantity < 1) return;
        setUpdating(itemId);
        try {
            await updateQuantity(itemId, quantity);
        } finally {
            setUpdating(null);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        setUpdating(itemId);
        try {
            await removeFromCart(itemId);
        } finally {
            setUpdating(null);
        }
    };

    const getProductImage = (item: CartItem): string => {
        const product = item.product as any;
        return product.image || product.images?.[0]?.url || '/placeholder-product.png';
    };

    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.product.salePrice
            ? parseFloat(item.product.salePrice)
            : parseFloat(item.product.price);
        return sum + price * item.quantity;
    }, 0);

    if (authLoading || cartLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Shopping Cart</h1>
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-6">
                            <div className="flex gap-4">
                                <div className="w-20 h-20 bg-slate-200 rounded"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">Cart is Empty</h2>
                    <p className="text-slate-500 mb-6">Ayo mulai belanja dan temukan produk favoritmu!</p>
                    <Link href="/products" className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                        Shop Now
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => {
                            const price = item.product.salePrice
                                ? parseFloat(item.product.salePrice)
                                : parseFloat(item.product.price);
                            const originalPrice = parseFloat(item.product.price);
                            const hasDiscount = item.product.salePrice && parseFloat(item.product.salePrice) < originalPrice;

                            return (
                                <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                            <img
                                                src={getProductImage(item)}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/placeholder-product.png';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/products/${item.product.slug}`} className="font-medium text-slate-900 hover:text-orange-500 line-clamp-2">
                                                {item.product.name}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="font-bold text-orange-500">
                                                    ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </span>
                                                {hasDiscount && (
                                                    <span className="text-sm text-slate-400 line-through">
                                                        ${originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                disabled={updating === item.id}
                                                className="text-slate-400 hover:text-red-500 disabled:opacity-50"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                            <div className="flex items-center border border-slate-300 rounded-lg">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={updating === item.id || item.quantity <= 1}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-50 rounded-l-lg"
                                                >
                                                    -
                                                </button>
                                                <span className="w-10 text-center text-sm font-medium">
                                                    {updating === item.id ? '...' : item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    disabled={updating === item.id}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-50 rounded-r-lg"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="font-bold text-slate-900">
                                                ${(price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
                            <h3 className="font-semibold text-slate-900 mb-4">Order Summary</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Total ({cartItems.length} produk)</span>
                                    <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <hr className="my-4 border-slate-200" />

                            <div className="flex justify-between text-lg font-bold mb-6">
                                <span>Total</span>
                                <span className="text-orange-500">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>

                            <Link
                                href="/checkout"
                                className="block w-full py-3 bg-orange-500 text-white font-semibold rounded-lg text-center hover:bg-orange-600 transition-colors"
                            >
                                Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
