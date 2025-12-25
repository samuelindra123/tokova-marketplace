'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            fetchOrders();
        }
    }, [user, authLoading, router]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get<{ data: Order[]; meta?: any } | Order[]>('/customer/orders');
            if (data) {
                // Handle both { data: [...] } and direct array format
                const ordersList = Array.isArray(data) ? data : (data as any).data || [];
                setOrders(ordersList);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">My Orders</h1>
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-6">
                            <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">Belum Ada Order</h2>
                    <p className="text-slate-500 mb-6">Ayo mulai belanja dan buat pesanan pertamamu!</p>
                    <Link href="/products" className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                        Mulai Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link
                            key={order.id}
                            href={`/orders/${order.id}`}
                            className="block bg-white rounded-xl border border-slate-200 p-6 hover:border-orange-300 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                    <p className="font-medium text-slate-900">#{order.orderNumber}</p>
                                    <p className="text-sm text-slate-500">
                                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                    {statusLabels[order.status]}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex -space-x-2">
                                    {order.items.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="w-12 h-12 rounded-lg border-2 border-white overflow-hidden bg-slate-100">
                                            {item.productImage ? (
                                                <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                                    No img
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <div className="w-12 h-12 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center text-xs text-slate-600 font-medium">
                                            +{order.items.length - 3}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-600 truncate">
                                        {order.items.map(i => i.productName).join(', ')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">{order.items.length} produk</span>
                                <span className="font-bold text-orange-500">
                                    ${parseFloat(order.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
