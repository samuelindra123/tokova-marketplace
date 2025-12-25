'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { TokovaLogo } from '@/components/TokovaLogo';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error: apiError } = await api.post('/auth/forgot-password', {
                email,
                requiredRole: 'VENDOR'
            });

            if (apiError) {
                // For security, even if error (unless rate limit), we might want to pretend success.
                // But generally api returns generic success if user not found.
                // If user IS found, it sends email.
                // If API returns error, it's likely real error (500).
                setError(apiError);
            } else {
                // Success - redirect to OTP page
                // Store email to auto-fill or use in next step
                localStorage.setItem('resetEmail', email);
                router.push('/verify-otp');
            }
        } catch (err) {
            setError('Terjadi kesalahan. Please coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-500 flex flex-col">
            {/* Header */}
            <header className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <TokovaLogo className="w-8 h-8 sm:w-10 sm:h-10" />
                        <span className="text-xl sm:text-2xl font-bold text-white">Tokova</span>
                    </Link>
                    <Link
                        href="/login"
                        className="text-sm font-medium text-white hover:underline"
                    >
                        Login
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8">
                        <div className="mb-6 sm:mb-8 text-center sm:text-left">
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                                Forgot Password?
                            </h1>
                            <p className="text-slate-600 text-sm">
                                Enter your email to receive the OTP verification code.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'MENGIRIM...' : 'KIRIM KODE OTP'}
                            </button>

                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                                >
                                    Kembali ke halaman Login
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center">
                <p className="text-white/70 text-xs">
                    © 2025 Tokova. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
