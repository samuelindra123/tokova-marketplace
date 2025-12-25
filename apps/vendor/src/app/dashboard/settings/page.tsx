'use client';

import { useEffect, useState, FormEvent, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api, VendorProfilee } from '@/lib/api';
import { TokovaLogo } from '@/components/TokovaLogo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function SettingsPage() {
    const { user, vendor, loading, logout } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mounted, setMounted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Form state
    const [storeName, setStoreName] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');
    const [logoUrl, setLogoUrl] = useState('');

    // Name change limit
    const [canChangeName, setCanChangeName] = useState(true);
    const [daysUntilNameChange, setDaysUntilNameChange] = useState(0);

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

    useEffect(() => {
        if (vendor) {
            setStoreName(vendor.storeName || '');
            setDescription(vendor.description || '');
            setPhone(vendor.phone || '');
            setLogoUrl(vendor.logo || '');

            // Check name change limit
            if (vendor.storeNameChangedAt) {
                const daysSince = Math.floor(
                    (Date.now() - new Date(vendor.storeNameChangedAt).getTime()) / (1000 * 60 * 60 * 24)
                );
                if (daysSince < 7) {
                    setCanChangeName(false);
                    setDaysUntilNameChange(7 - daysSince);
                }
            }
        }
    }, [vendor]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Only image files are allowed (JPEG, PNG, GIF, WebP)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Ukuran file maksimal 5MB');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_URL}/upload/image?folder=logos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed mengupload');
            }

            setLogoUrl(data.url);
            setMessage('Logo berhasil diupload!');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed mengupload gambar');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        try {
            const updateData: Partial<VendorProfilee> & { logo?: string } = {
                description,
                phone,
                logo: logoUrl,
            };

            // Only include storeName if it changed and allowed
            if (canChangeName && storeName !== vendor?.storeName) {
                updateData.storeName = storeName;
            }

            const { data, error: apiError } = await api.put<VendorProfilee>('/vendor/store', updateData);

            if (apiError) {
                setError(apiError);
            } else if (data) {
                setMessage('Settings berhasil disimpan!');
                // If name was changed, update the limit
                if (storeName !== vendor?.storeName) {
                    setCanChangeName(false);
                    setDaysUntilNameChange(7);
                }
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menyimpan');
        } finally {
            setSaving(false);
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
                                <Link href="/dashboard/settings" className="text-sm font-medium text-orange-500 px-3 py-2">
                                    Settings
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">
                                    {vendor?.storeName || 'Store you'}
                                </p>
                                <p className="text-xs text-slate-500 truncate max-w-[150px]">{user.email}</p>
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

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Settings Store</h1>
                    <p className="text-slate-600 mt-1">Kelola profil dan informasi your store</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Messages */}
                    {message && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Profilee Photo Section */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Logo Store</h2>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                    )}
                                </div>
                                {uploading && (
                                    <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                                        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {uploading ? 'Mengupload...' : 'Upload Logo'}
                                </button>
                                <p className="text-xs text-slate-500 mt-2">
                                    Format: JPEG, PNG, GIF, WebP. Maksimal 5MB. Rekomendasi 200x200 piksel.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Store Name Section */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900">Store Name</h2>
                            {!canChangeName && (
                                <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                                    Dapat diubah dalam {daysUntilNameChange} hari
                                </span>
                            )}
                        </div>
                        <div>
                            <input
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                disabled={!canChangeName}
                                className={`w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${!canChangeName ? 'bg-slate-50 cursor-not-allowed text-slate-500' : ''
                                    }`}
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                <svg className="w-4 h-4 inline-block mr-1 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Store name can only be changed once in 7 days
                            </p>
                        </div>
                    </div>

                    {/* Bio/Description Section */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Store Description</h2>
                        <div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Tell us about your store, products you sell, advantages, etc..."
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Description will be displayed on your store page
                            </p>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Kontak</h2>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nomor Telepon
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+62 812 3456 7890"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-3 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Menyimpan...
                                </>
                            ) : (
                                'Save Perubahan'
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
