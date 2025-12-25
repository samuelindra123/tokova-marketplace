'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { TokovaLogo } from '@/components/TokovaLogo';

export default function ProfileePage() {
    const { user, vendor, loading, logout } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Form states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !loading) {
            if (!user) {
                router.push('/login');
            } else if (vendor && vendor.status !== 'APPROVED') {
                router.push('/pending-approval');
            }
        }
    }, [mounted, loading, user, vendor, router]);

    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ text: 'Confirmation password does not match', type: 'error' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ text: 'New password must be at least 6 characters', type: 'error' });
            return;
        }

        try {
            setUpdating(true);
            const { data, error } = await api.post('/auth/change-password', {
                currentPassword,
                newPassword,
                confirmPassword
            });

            if (error) {
                setMessage({ text: error, type: 'error' });
            } else {
                setMessage({ text: 'Password berhasil diperbarui', type: 'success' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            setMessage({ text: 'Failed to update password', type: 'error' });
        } finally {
            setUpdating(false);
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
                                <Link href="/dashboard/orders" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
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
                            <Link href="/dashboard/profile" className="text-sm font-medium text-orange-500 px-3 py-2">
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

            <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile Saya</h1>
                <p className="text-slate-600 mb-8">Kelola informasi akun dan keamanan</p>

                <div className="space-y-6">
                    {/* User Info */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Information Account</h2>
                        <div>
                            <label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
                            <div className="font-medium text-slate-900">{user.email}</div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-500 mb-1">Role</label>
                            <div className="font-medium text-slate-900 capitalize">{user.role.toLowerCase()}</div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Ganti Password</h2>

                        {message.text && (
                            <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Password Saat Ini
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Password Baru
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Konfirmasi Password Baru
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70"
                                >
                                    {updating ? 'Menyimpan...' : 'Save Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
