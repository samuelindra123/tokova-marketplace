'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, CartItem, Address, Order } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

// Checkout steps
const STEPS = [
    { id: 1, name: 'Cart', href: '/cart' },
    { id: 2, name: 'Pengiriman', href: '/checkout' },
    { id: 3, name: 'Payment', href: null },
];

export default function CheckoutPage() {
    const { user, loading: authLoading } = useAuth();
    const { cartItems, cartCount, refreshCart, removeFromCart } = useCart();
    const router = useRouter();
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(2);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            fetchAddresses();
        }
    }, [user, authLoading, router]);

    // Handle cart items from context
    useEffect(() => {
        if (cartItems.length > 0) {
            setSelectedItems(new Set(cartItems.map((item: CartItem) => item.id)));
            setLoading(false);
        } else if (!authLoading && user) {
            // If cart is empty after auth is done, redirect
            setLoading(false);
        }
    }, [cartItems, authLoading, user]);

    const fetchAddresses = async () => {
        try {
            const { data: addressRes } = await api.get<Address[] | { addresses: Address[] }>('/customer/addresses');
            if (addressRes) {
                const addrList = Array.isArray(addressRes) ? addressRes : (addressRes as any).addresses || [];
                setAddresses(addrList);
                const defaultAddr = addrList.find((a: Address) => a.isDefault);
                if (defaultAddr) setSelectedAddress(defaultAddr.id);
                else if (addrList.length > 0) setSelectedAddress(addrList[0].id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Helper to get product image safely
    const getProductImage = (item: CartItem): string => {
        const product = item.product as any;
        return product.image || product.images?.[0]?.url || '/placeholder-product.png';
    };

    // Toggle item selection
    const toggleItemSelection = (itemId: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        setSelectedItems(newSelected);
    };

    // Select/Deselect all
    const toggleSelectAll = () => {
        if (selectedItems.size === cartItems.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(cartItems.map(item => item.id)));
        }
    };

    // Get selected cart items
    const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));

    const subtotal = selectedCartItems.reduce((sum, item) => {
        const price = item.product.salePrice
            ? parseFloat(item.product.salePrice)
            : parseFloat(item.product.price);
        return sum + price * item.quantity;
    }, 0);

    const shippingCost = subtotal > 0 ? 5.00 : 0;
    const total = subtotal + shippingCost;

    const handleCheckout = async () => {
        if (!selectedAddress) {
            setError('Please select a shipping address first');
            return;
        }

        if (selectedItems.size === 0) {
            setError('Select minimal 1 produk untuk checkout');
            return;
        }

        setProcessing(true);
        setError('');
        setCurrentStep(3);

        try {
            // Step 1: Create order with selected items
            const { data: orderData, error: orderError } = await api.post<Order>('/customer/orders', {
                addressId: selectedAddress,
                // If backend supports selecting items, pass the selected item IDs
                // itemIds: Array.from(selectedItems),
            });

            if (orderError) {
                setError(orderError);
                setCurrentStep(2);
                setProcessing(false);
                return;
            }

            if (orderData) {
                // Step 2: Create Stripe checkout session
                const { data: paymentData, error: paymentError } = await api.post<{ url: string }>(`/payments/checkout/${orderData.id}`, {});

                if (paymentError) {
                    router.push(`/orders/${orderData.id}?payment=pending`);
                    return;
                }

                if (paymentData?.url) {
                    window.location.href = paymentData.url;
                } else {
                    router.push(`/orders/${orderData.id}?success=true`);
                }
            }
        } catch (err) {
            setError('Failed membuat pesanan');
            setCurrentStep(2);
        } finally {
            setProcessing(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-4">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
                                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse hidden sm:block"></div>
                                {step < 3 && <div className="w-8 h-0.5 bg-slate-200"></div>}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="animate-pulse space-y-4">
                    <div className="bg-white rounded-xl p-6 h-40"></div>
                    <div className="bg-white rounded-xl p-6 h-40"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Step Header */}
            <div className="mb-8">
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                    {STEPS.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep >= step.id
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-slate-200 text-slate-500'
                                        }`}
                                >
                                    {currentStep > step.id ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        step.id
                                    )}
                                </div>
                                <span
                                    className={`text-sm font-medium hidden sm:block ${currentStep >= step.id ? 'text-slate-900' : 'text-slate-400'
                                        }`}
                                >
                                    {step.name}
                                </span>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div
                                    className={`w-8 sm:w-12 h-0.5 ${currentStep > step.id ? 'bg-orange-500' : 'bg-slate-200'
                                        }`}
                                ></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Address Selection */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-slate-900">📍 Shipping Address</h2>
                            <Link href="/account/addresses" className="text-sm text-orange-500 hover:underline">
                                Kelola Address
                            </Link>
                        </div>

                        {addresses.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-slate-500 mb-4">No saved addresses yet</p>
                                <Link href="/account/addresses" className="text-orange-500 hover:underline font-medium">
                                    + Add Address
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {addresses.map((addr) => (
                                    <label
                                        key={addr.id}
                                        className={`block p-4 border rounded-lg cursor-pointer transition-all ${selectedAddress === addr.id
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="address"
                                            value={addr.id}
                                            checked={selectedAddress === addr.id}
                                            onChange={() => setSelectedAddress(addr.id)}
                                            className="sr-only"
                                        />
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${selectedAddress === addr.id
                                                    ? 'border-orange-500 bg-orange-500'
                                                    : 'border-slate-300'
                                                    }`}
                                            >
                                                {selectedAddress === addr.id && (
                                                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-slate-900">{addr.label}</span>
                                                    {addr.isDefault && (
                                                        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded">Utama</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 mt-1">
                                                    {addr.recipientName} • {addr.phone}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {addr.addressLine}, {addr.city}, {addr.province} {addr.postalCode}
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Items with Selection */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-slate-900">📦 Select Product</h2>
                            <button
                                onClick={toggleSelectAll}
                                className="text-sm text-orange-500 hover:underline"
                            >
                                {selectedItems.size === cartItems.length ? 'Cancelkan Semua' : 'Select All'}
                            </button>
                        </div>
                        <div className="space-y-4">
                            {cartItems.map((item) => {
                                const price = item.product.salePrice
                                    ? parseFloat(item.product.salePrice)
                                    : parseFloat(item.product.price);
                                const isSelected = selectedItems.has(item.id);
                                return (
                                    <div
                                        key={item.id}
                                        className={`flex gap-4 p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        onClick={() => toggleItemSelection(item.id)}
                                    >
                                        {/* Checkbox */}
                                        <div className="flex items-center">
                                            <div
                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected
                                                    ? 'border-orange-500 bg-orange-500'
                                                    : 'border-slate-300'
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Image */}
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                            <img
                                                src={getProductImage(item)}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/placeholder-product.png';
                                                }}
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 truncate">{item.product.name}</p>
                                            <p className="text-sm text-slate-500">Jumlah: {item.quantity}</p>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <p className="font-bold text-orange-500">
                                                ${(price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Selection Info */}
                        <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-600">
                            {selectedItems.size} of {cartItems.length} product selected
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
                        <h3 className="font-semibold text-slate-900 mb-4">💳 Payment Summary</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Subtotal ({selectedItems.size} produk)</span>
                                <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Shipping</span>
                                <span>${shippingCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <hr className="my-4 border-slate-200" />

                        <div className="flex justify-between text-lg font-bold mb-6">
                            <span>Total</span>
                            <span className="text-orange-500">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={processing || !selectedAddress || selectedItems.size === 0}
                            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Pay Now
                                </>
                            )}
                        </button>

                        {selectedItems.size === 0 && (
                            <p className="text-xs text-red-500 text-center mt-2">
                                Select minimal 1 produk
                            </p>
                        )}

                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Payment aman dengan Stripe
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
