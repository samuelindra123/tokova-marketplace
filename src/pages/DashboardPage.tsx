import { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';

interface Stats {
    totalUsers: number;
    totalVendors: number;
    totalCustomers: number;
    totalProducts: number;
    totalOrders: number;
    pendingVendors: number;
    revenueThisMonth: number;
    revenueLastMonth: number;
}

interface Order {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    paymentStatus: string;
    customerEmail?: string;
    createdAt: string;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await api.get('/admin/dashboard');
            setStats(response.data.stats);
            setRecentOrders(response.data.recentOrders);
        } catch (err) {
            console.error('Failed to fetch dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: 'from-blue-500 to-blue-600' },
        { label: 'Total Vendors', value: stats?.totalVendors || 0, icon: '🏪', color: 'from-emerald-500 to-emerald-600' },
        { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: '🛒', color: 'from-purple-500 to-purple-600' },
        { label: 'Total Products', value: stats?.totalProducts || 0, icon: '📦', color: 'from-orange-500 to-orange-600' },
        { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '🧾', color: 'from-pink-500 to-pink-600' },
        { label: 'Pending Vendors', value: stats?.pendingVendors || 0, icon: '⏳', color: 'from-amber-500 to-amber-600' },
    ];

    const revenueChange = stats?.revenueLastMonth && stats.revenueLastMonth > 0
        ? (((stats.revenueThisMonth - stats.revenueLastMonth) / stats.revenueLastMonth) * 100).toFixed(1)
        : '0';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500">Welcome back! Here's what's happening.</p>
                </div>
                <button
                    onClick={fetchDashboard}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                    Refresh
                </button>
            </div>

            {/* Revenue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-indigo-200 text-sm font-medium">Revenue This Month</p>
                            <p className="text-3xl font-bold mt-2">{formatCurrency(stats?.revenueThisMonth || 0)}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`text-sm ${parseFloat(revenueChange) >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                                    {parseFloat(revenueChange) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(revenueChange))}%
                                </span>
                                <span className="text-indigo-200 text-sm">vs last month</span>
                            </div>
                        </div>
                        <div className="text-5xl opacity-30">💰</div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-300 text-sm font-medium">Revenue Last Month</p>
                            <p className="text-3xl font-bold mt-2">{formatCurrency(stats?.revenueLastMonth || 0)}</p>
                        </div>
                        <div className="text-5xl opacity-30">📊</div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
                        <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Order</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        No orders yet
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-900">#{order.orderNumber}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{order.customerEmail || '-'}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(order.total)}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <PaymentBadge status={order.paymentStatus} />
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-700',
        PROCESSING: 'bg-blue-100 text-blue-700',
        SHIPPED: 'bg-purple-100 text-purple-700',
        DELIVERED: 'bg-emerald-100 text-emerald-700',
        CANCELLED: 'bg-red-100 text-red-700',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
            {status}
        </span>
    );
}

function PaymentBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-700',
        PAID: 'bg-emerald-100 text-emerald-700',
        FAILED: 'bg-red-100 text-red-700',
        REFUNDED: 'bg-slate-100 text-slate-700',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
            {status}
        </span>
    );
}
