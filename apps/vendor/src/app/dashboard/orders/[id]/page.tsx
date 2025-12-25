'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { TokovaLogo } from '@/components/TokovaLogo';

interface OrderDetail {
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
    customerEmail: string;
    shippingAddress: {
        recipientName: string;
        phone: string;
        addressLine: string;
        city: string;
        province: string;
        postalCode: string;
    };
    notes?: string;
    createdAt: string;
}

export default function OrderDetailPage() {
    const { user, vendor, loading, logout } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [mounted, setMounted] = useState(false);

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [fetching, setFetching] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    // Status update form
    const [newStatus, setNewStatus] = useState<string>('');
    const [trackingNumber, setTrackingNumber] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !loading) {
            if (!user) {
                router.push('/login');
            } else if (vendor && vendor.status !== 'APPROVED') {
                router.push('/pending-approval');
            } else if (params.id) {
                fetchOrder(params.id as string);
            }
        }
    }, [mounted, loading, user, vendor, router, params.id]);

    const fetchOrder = async (id: string) => {
        try {
            setFetching(true);
            const { data } = await api.get<OrderDetail>(`/vendor/orders/${id}`);
            if (data) {
                setOrder(data);
                setNewStatus(data.status);
                setTrackingNumber(data.trackingNumber || '');
            }
        } catch (err) {
            setError('Failed to load order details');
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    const handleUpdateStatus = async (e: FormEvent) => {
        e.preventDefault();
        if (!order) return;

        setUpdating(true);
        setError('');

        try {
            const payload = {
                status: newStatus,
                trackingNumber: newStatus === 'SHIPPED' ? trackingNumber : undefined,
            };

            const { data, error: apiError } = await api.put(`/vendor/orders/${order.id}/status`, payload);

            if (apiError) {
                setError(apiError);
            } else {
                fetchOrder(order.id); // Refresh data
                alert('Order status updated successfully');
            }
        } catch (err) {
            setError('Failed to update status');
            console.error(err);
        } finally {
            setUpdating(false);
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

    if (!mounted || loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user) return null;

    if (fetching) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Orders Tidak Ditemukan</h1>
                    <p className="text-slate-600 mb-6">This order may have been deleted or your do not have access.</p>
                    <Link href="/dashboard/orders" className="text-orange-600 hover:text-orange-700 font-medium">
                        Kembali ke Register Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header matches Dashboard */}
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

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Link href="/dashboard/orders" className="text-sm text-slate-500 hover:text-slate-900 mb-2 inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Register Orders
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                        <h1 className="text-2xl font-bold text-slate-900">Detail Orders #{order.orderNumber}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                            }`}>
                            {order.status}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Dipesan pada {formatDate(order.createdAt)}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Product & Shipping */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Details */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                                <h2 className="font-semibold text-slate-900">Products Dipesan</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                                        {order.productImage ? (
                                            <img src={order.productImage} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                📦
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-slate-900 text-lg mb-1">{order.productName}</h3>
                                        <div className="flex items-center justify-between text-sm text-slate-600">
                                            <span>Price Satuan:</span>
                                            <span>{formatCurrency(order.price)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-slate-600 mt-1">
                                            <span>Jumlah:</span>
                                            <span>x{order.quantity}</span>
                                        </div>
                                        <div className="border-t border-slate-100 mt-3 pt-3 flex items-center justify-between font-semibold text-slate-900">
                                            <span>Total:</span>
                                            <span>{formatCurrency(order.subtotal)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                                <h2 className="font-semibold text-slate-900">Information Pengiriman</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-slate-500 mb-1">Penerima</p>
                                        <p className="font-medium text-slate-900">{order.shippingAddress.recipientName}</p>
                                        <p className="text-slate-600">{order.shippingAddress.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 mb-1">Address</p>
                                        <p className="text-slate-900">{order.shippingAddress.addressLine}</p>
                                        <p className="text-slate-900">
                                            {order.shippingAddress.city}, {order.shippingAddress.province}, {order.shippingAddress.postalCode}
                                        </p>
                                    </div>
                                    {order.notes && (
                                        <div>
                                            <p className="text-slate-500 mb-1">Catatan Orders</p>
                                            <p className="text-slate-900 italic">"{order.notes}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Update Status */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                                <h2 className="font-semibold text-slate-900">Update Status</h2>
                            </div>
                            <div className="p-6">
                                <form onSubmit={handleUpdateStatus} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Status Orders
                                        </label>
                                        <select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            disabled={updating || order.status === 'CANCELLED'}
                                        >
                                            <option value="PENDING">PENDING (Pending)</option>
                                            <option value="PROCESSING">PROCESSING (Processing)</option>
                                            <option value="SHIPPED">SHIPPED (Shipped)</option>
                                            <option value="DELIVERED">DELIVERED (Completed)</option>
                                            <option value="CANCELLED" disabled>CANCELLED (Cancelled)</option>
                                        </select>
                                    </div>

                                    {newStatus === 'SHIPPED' && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Tracking Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={trackingNumber}
                                                onChange={(e) => setTrackingNumber(e.target.value)}
                                                placeholder="Contoh: JNE12345678"
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                required
                                                disabled={updating}
                                            />
                                        </div>
                                    )}

                                    {error && (
                                        <p className="text-xs text-red-600">{error}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={updating || order.status === 'CANCELLED'}
                                        className="w-full py-2.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                    >
                                        {updating ? 'Menyimpan...' : 'Update Status'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Customer Info Summary */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-900 mb-4">Info Pelanggan</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                    {order.customerName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{order.customerName}</p>
                                    <p className="text-xs text-slate-500">Customer</p>
                                </div>
                            </div>
                            <div className="text-sm">
                                <p className="text-slate-600 mb-1">Email:</p>
                                <a href={`mailto:${order.customerEmail}`} className="text-orange-600 hover:underline break-all">
                                    {order.customerEmail}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
