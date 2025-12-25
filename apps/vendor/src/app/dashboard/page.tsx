'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { TokovaLogo } from '@/components/TokovaLogo';
import { api } from '@/lib/api';

interface DashboardStats {
    totalRevenue: number;
    revenueThisMonth: number;
    totalOrders: number;
    pendingOrders: number;
    totalProducts: number;
}

interface RecentOrder {
    id: string;
    orderNumber: string;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
    subtotal: number;
    status: string;
    customerName?: string;
    createdAt: string;
}

export default function DashboardPage() {
    const { user, vendor, loading, logout } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !loading) {
            if (!user) {
                router.push('/login');
            } else if (vendor && vendor.status !== 'APPROVED') {
                router.push('/pending-approval');
            } else if (user && vendor?.status === 'APPROVED') {
                fetchDashboardData();
            }
        }
    }, [mounted, loading, user, vendor, router]);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, ordersRes] = await Promise.all([
                api.get<DashboardStats>('/vendor/store/dashboard'),
                api.get<{ data: RecentOrder[] }>('/vendor/orders?limit=5'),
            ]);

            if (statsRes.data) {
                setStats(statsRes.data);
            }
            if (ordersRes.data) {
                const orders = Array.isArray(ordersRes.data)
                    ? ordersRes.data
                    : (ordersRes.data as any).data || [];
                setRecentOrders(orders.slice(0, 5));
            }
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoadingStats(false);
        }
    };

    if (!mounted || loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const formatCurrency = (amount: number | undefined | null) => {
        const value = amount ?? 0;
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
    };

    const statusLabels: Record<string, string> = {
        PENDING: 'Pending',
        PROCESSING: 'Processing',
        SHIPPED: 'Shipped',
        DELIVERED: 'Completed',
        CANCELLED: 'Cancelled',
    };

    const statusColors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        PROCESSING: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        DELIVERED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
    };

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
                                <Link href="/dashboard" className="text-sm font-medium text-orange-500 px-3 py-2">
                                    Dashboard
                                </Link>
                                <Link href="/dashboard/products" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
                                    Products
                                </Link>
                                <Link href="/dashboard/orders" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
                                    Orders
                                </Link>
                                <Link href="/dashboard/settings" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
                                    Settings
                                </Link>
                                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                                <a
                                    href={process.env.NEXT_PUBLIC_CUSTOMER_URL || 'http://localhost:3000'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-slate-600 hover:text-orange-500 px-3 py-2 flex items-center gap-1"
                                >
                                    <span>Back to Customer Web</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </nav>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">
                                    {vendor?.storeName || 'Store you'}
                                </p>
                                <p className="text-xs text-slate-500 truncate max-w-[150px]">{user.email}</p>
                            </div>
                            <Link href="/dashboard/profile" className="px-3 sm:px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-3 sm:px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Welcome, {vendor?.storeName || 'Seller'}!
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage your store and increase sales today
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200">
                        <p className="text-sm text-slate-500 mb-1">Total Products</p>
                        {loadingStats ? (
                            <div className="h-8 bg-slate-200 rounded animate-pulse w-16"></div>
                        ) : (
                            <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                                {stats?.totalProducts || 0}
                            </p>
                        )}
                    </div>
                    <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200">
                        <p className="text-sm text-slate-500 mb-1">New Orders</p>
                        {loadingStats ? (
                            <div className="h-8 bg-slate-200 rounded animate-pulse w-16"></div>
                        ) : (
                            <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                                {stats?.pendingOrders || 0}
                            </p>
                        )}
                    </div>
                    <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200">
                        <p className="text-sm text-slate-500 mb-1">Revenue</p>
                        {loadingStats ? (
                            <div className="h-8 bg-slate-200 rounded animate-pulse w-24"></div>
                        ) : (
                            <p className="text-2xl sm:text-3xl font-bold text-green-600">
                                {formatCurrency(stats?.totalRevenue || 0)}
                            </p>
                        )}
                    </div>
                    <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200">
                        <p className="text-sm text-slate-500 mb-1">This Month</p>
                        {loadingStats ? (
                            <div className="h-8 bg-slate-200 rounded animate-pulse w-24"></div>
                        ) : (
                            <p className="text-2xl sm:text-3xl font-bold text-orange-500">
                                {formatCurrency(stats?.revenueThisMonth || 0)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Quick Actions & Recent Orders */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Start Selling</h2>
                        <div className="space-y-4">
                            <Link href="/dashboard/products/new" className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">Add New Products</p>
                                    <p className="text-sm text-slate-500">Upload your first product</p>
                                </div>
                            </Link>
                            <Link href="/dashboard/settings" className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">Complete Store Profile</p>
                                    <p className="text-sm text-slate-500">Add logo and description</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
                            <Link href="/dashboard/orders" className="text-sm text-orange-500 hover:underline">
                                View All
                            </Link>
                        </div>
                        {loadingStats ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="animate-pulse flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-200 rounded"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : recentOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                    </svg>
                                </div>

                                <p className="text-slate-600 font-medium">No orders yet</p>
                                <p className="text-sm text-slate-500 mt-1">New orders will appear here</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/dashboard/orders/${order.id}`}
                                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 text-sm truncate">
                                                #{order.orderNumber}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {order.productName || 'Products'} x{order.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status] || 'bg-slate-100 text-slate-600'}`}>
                                                {statusLabels[order.status] || order.status}
                                            </span>
                                            <p className="text-sm font-medium text-slate-900 mt-1">
                                                {formatCurrency(order.subtotal)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main >
        </div >
    );
}
