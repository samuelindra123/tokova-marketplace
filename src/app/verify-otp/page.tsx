'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { TokovaLogo } from '@/components/TokovaLogo';

export default function VerifyOtpPage() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const storedEmail = localStorage.getItem('resetEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            // Optional: redirect back if no email found, or just let user input OTP if they came from email link (but email link usually goes to reset-password directly? No, vendor flow is OTP).
            // Actually vendor email has OTP code to be MANUALLY entered.
            // So user must be on this page.
            // If no email in local storage, maybe user closed tab?
            // It's fine, display empty or redirect. Redirect is safer.
            router.push('/forgot-password');
        }
    }, [router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error: apiError } = await api.post('/auth/verify-reset-token', { token: otp });

            if (apiError) {
                setError('Invalid or expired OTP code.');
            } else {
                router.push(`/reset-password?token=${otp}`);
            }
        } catch (err) {
            setError('Terjadi kesalahan. Please coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-500 flex flex-col">
            <header className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <TokovaLogo className="w-8 h-8 sm:w-10 sm:h-10" />
                        <span className="text-xl sm:text-2xl font-bold text-white">Tokova</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8">
                        <div className="mb-6 sm:mb-8 text-center sm:text-left">
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                                Loginkan Kode OTP
                            </h1>
                            <p className="text-slate-600 text-sm">
                                Kode verifikasi telah dikirim ke <strong>{email}</strong>
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
                                    Kode OTP (6 Digit)
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => {
                                        // Only allow numbers and max 6 chars
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setOtp(val);
                                    }}
                                    placeholder="123456"
                                    required
                                    className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-slate-300 rounded-lg text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow font-mono"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full py-3.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'MEMVERIFIKASI...' : 'VERIFIKASI'}
                            </button>

                            <div className="text-center">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                                >
                                    Kirim Ulang Kode
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <footer className="py-6 text-center">
                <p className="text-white/70 text-xs">
                    © 2025 Tokova. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
