'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
    const { user, customer, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
                    <div className="bg-white rounded-xl p-6 h-40"></div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const menuItems = [
        { href: '/account/profile', icon: '👤', label: 'Edit Profile', desc: 'Edit nama dan foto profil' },
        { href: '/account/addresses', icon: '📍', label: 'Address', desc: 'Manage shipping addresses' },
        { href: '/orders', icon: '📦', label: 'Order', desc: 'View riwayat pesanan' },
        { href: '/wishlist', icon: '❤️', label: 'Wishlist', desc: 'Saved products' },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">My Account</h1>

            {/* Profile Summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-orange-500">
                            {customer?.firstName?.[0] || user.email[0].toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-slate-900">
                            {customer?.firstName && customer?.lastName
                                ? `${customer.firstName} ${customer.lastName}`
                                : 'Customer'}
                        </h2>
                        <p className="text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link
                        href="/account/profile"
                        className="px-4 py-2 text-sm text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                        Edit
                    </Link>
                </div>
            </div>

            {/* Menu Items */}
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                    >
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1">
                            <p className="font-medium text-slate-900">{item.label}</p>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                ))}
            </div>

            {/* Logout */}
            <button
                onClick={() => { logout(); router.push('/'); }}
                className="w-full mt-6 py-3 text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 bg-white transition-colors font-medium"
            >
                Keluar
            </button>
        </div>
    );
}
