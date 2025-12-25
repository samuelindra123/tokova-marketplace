'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { TokovaLogo } from '@/components/TokovaLogo';

interface OrderItem {
    id: string;
    orderNumber: string;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
    subtotal: number;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    trackingNumber?: string;
    customerName: string;
    createdAt: string;
}

export default function OrdersPage() {
    const { user, vendor, loading, logout } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [fetching, setFetching] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !loading) {
            if (!user) {
                router.push('/login');
            } else if (vendor && vendor.status !== 'APPROVED') {
                router.push('/pending-approval');
            } else {
                fetchOrders();
            }
        }
    }, [mounted, loading, user, vendor, router, page, statusFilter]);

    const fetchOrders = async () => {
        try {
            setFetching(true);
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', '10');
            if (statusFilter) params.append('status', statusFilter);

            const { data } = await api.get<{ data: OrderItem[], meta: { totalPages: number } }>(`/vendor/orders?${params}`);
            if (data) {
                setOrders(data.data);
                setTotalPages(data.meta.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setFetching(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'PROCESSING': return 'bg-blue-100 text-blue-800';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    if (!mounted || loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-2">
                                <TokovaLogo className="w-8 h-8" />
                                <span className="text-xl font-bold text-slate-900">Tokova</span>
                            </Link>
                            <nav className="hidden md:flex items-center gap-4">
                                <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
                                    Dashboard
                                </Link>
                                <Link href="/dashboard/products" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
                                    Products
                                </Link>
                                <Link href="/dashboard/orders" className="text-sm font-medium text-orange-500 px-3 py-2">
                                    Orders
                                </Link>
                                <Link href="/dashboard/settings" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
                                    Settings
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">
                                    {vendor?.storeName || 'Store you'}
                                </p>
                            </div>
                            <Link href="/dashboard/profile" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
                                Profilee
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Orders Login</h1>
                        <p className="text-slate-600 mt-1">Manage and process customer orders</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex overflow-x-auto pb-2 gap-2">
                    {['', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => { setStatusFilter(status); setPage(1); }}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status
                                ? 'bg-orange-500 text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            {status === '' ? 'Semua Orders' : status}
                        </button>
                    ))}
                </div>

                {fetching ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-8 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No orders yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            {statusFilter
                                ? `No orders with status "${statusFilter}"`
                                : "New orders will appear here when customers buy your products."}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-900">Order ID</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900">Products</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900">Total</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900">Tanggal</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-slate-900">#{order.orderNumber}</span>
                                                <div className="text-xs text-slate-500 mt-1">{order.customerName}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                                                        {order.productImage ? (
                                                            <img src={order.productImage} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                📦
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900 line-clamp-1">{order.productName}</div>
                                                        <div className="text-xs text-slate-500">Qty: {order.quantity}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {formatCurrency(order.subtotal)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/dashboard/orders/${order.id}`}
                                                    className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                                >
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-slate-600">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
