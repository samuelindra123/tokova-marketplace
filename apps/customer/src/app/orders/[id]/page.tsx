'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { api, Order } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const statusLabels: Record<string, string> = {
    PENDING: 'Pending Payment',
    PAID: 'Dibayar',
    PROCESSING: 'Diproses',
    SHIPPED: 'Dikirim',
    DELIVERED: 'Selesai',
    CANCELLED: 'Dibatalkan',
};

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    PAID: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-purple-100 text-purple-700',
    SHIPPED: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
};

const itemStatusLabels: Record<string, string> = {
    PENDING: 'Pending',
    PROCESSING: 'Diproses Seller',
    SHIPPED: 'Dalam Pengiriman',
    DELIVERED: 'Diterima',
    CANCELLED: 'Dibatalkan',
};

function OrderDetailContent() {
    const { user, loading: authLoading } = useAuth();
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user && params.id) {
            handlePageLoad(params.id as string);
        }
    }, [user, authLoading, params.id, router]);

    const handlePageLoad = async (id: string) => {
        const paymentStatus = searchParams.get('payment');

        // If returning from Stripe, verify payment first
        if (paymentStatus === 'success') {
            setVerifying(true);
            setMessage({ type: 'info', text: 'Memverifikasi pembayaran...' });

            try {
                const { data: verifyResult } = await api.post<{ status: string; updated: boolean }>(`/payments/verify/${id}`, {});

                if (verifyResult?.updated) {
                    setMessage({ type: 'success', text: '✅ Payment berhasil! Order your sedang diproses.' });
                } else if (verifyResult?.status === 'PAID') {
                    setMessage({ type: 'success', text: '✅ Payment verified.' });
                } else {
                    setMessage({ type: 'info', text: 'Status pembayaran sedang diproses. Please wait beberapa saat.' });
                }
            } catch (err) {
                console.error('Verify payment error:', err);
            } finally {
                setVerifying(false);
            }
        } else if (paymentStatus === 'cancelled') {
            setMessage({ type: 'error', text: 'Payment dibatalkan. Please try again.' });
        } else if (paymentStatus === 'pending') {
            setMessage({ type: 'info', text: 'Payment not completed. Please complete your payment.' });
        }

        // Fetch order details
        await fetchOrder(id);
    };

    const fetchOrder = async (id: string) => {
        try {
            const { data } = await api.get<Order>(`/customer/orders/${id}`);
            if (data) setOrder(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!order || !confirm('Are your sure your want to cancel this order?')) return;
        setCancelling(true);
        try {
            await api.post(`/customer/orders/${order.id}/cancel`, {});
            await fetchOrder(order.id);
        } catch (err) {
            console.error(err);
        } finally {
            setCancelling(false);
        }
    };

    const handleRetryPayment = async () => {
        if (!order) return;
        setVerifying(true);
        try {
            const { data, error } = await api.post<{ url: string }>(`/payments/checkout/${order.id}`, {});
            if (data?.url) {
                window.location.href = data.url;
            } else if (error) {
                setMessage({ type: 'error', text: error });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to open payment page' });
        } finally {
            setVerifying(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
                    <div className="bg-white rounded-xl p-6">
                        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Order not found</h1>
                <Link href="/orders" className="text-orange-500 hover:underline">
                    Kembali ke Daftar Order
                </Link>
            </div>
        );
    }

    const address = order.shippingAddress;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Message Banner */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
                        message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' :
                            'bg-blue-50 border border-blue-200 text-blue-700'
                    }`}>
                    {verifying && (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/orders" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Order #{order.orderNumber}</h1>
                    <p className="text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Order Status</p>
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                            {statusLabels[order.status]}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {order.status === 'PENDING' && (
                            <>
                                <button
                                    onClick={handleRetryPayment}
                                    disabled={verifying}
                                    className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                                >
                                    {verifying ? 'Processing...' : '💳 Pay Now'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {cancelling ? 'Membatalkan...' : 'Cancelkan'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl border border-slate-200 mb-6">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="font-semibold text-slate-900">📦 Product</h2>
                </div>
                <div className="divide-y divide-slate-200">
                    {order.items.map((item) => (
                        <div key={item.id} className="p-4 flex gap-4">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                {item.productImage ? (
                                    <img
                                        src={item.productImage}
                                        alt={item.productName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900">{item.productName}</p>
                                <p className="text-sm text-slate-500 mt-1">
                                    {item.quantity} x ${parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className={`text-xs px-2 py-1 rounded ${statusColors[item.status]}`}>
                                        {itemStatusLabels[item.status]}
                                    </span>
                                    {item.trackingNumber && (
                                        <span className="text-xs text-slate-500">
                                            Resi: {item.trackingNumber}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-900">
                                    ${parseFloat(item.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="font-semibold text-slate-900 mb-4">📍 Shipping Address</h2>
                    <div className="text-sm text-slate-600">
                        <p className="font-medium text-slate-900">{address?.recipientName}</p>
                        <p>{address?.phone}</p>
                        <p className="mt-2">{address?.addressLine}</p>
                        <p>{address?.city}, {address?.province} {address?.postalCode}</p>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="font-semibold text-slate-900 mb-4">💳 Payment Summary</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Subtotal</span>
                            <span>${parseFloat(order.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Ongkir</span>
                            <span>${parseFloat(order.shippingCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        {parseFloat(order.discount) > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Diskon</span>
                                <span>-${parseFloat(order.discount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                        )}
                        <hr className="border-slate-200" />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-orange-500">${parseFloat(order.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderDetailPage() {
    return (
        <Suspense fallback={
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
                    <div className="bg-white rounded-xl p-6">
                        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    </div>
                </div>
            </div>
        }>
            <OrderDetailContent />
        </Suspense>
    );
}
