'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { TokovaLogo } from '@/components/TokovaLogo';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, error, clearError } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
        setLoading(true);

        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            // Redirect based on vendor approval status
            if (result.vendorStatus === 'APPROVED') {
                router.push('/dashboard');
            } else {
                // PENDING or REJECTED - show waiting room
                router.push('/pending-approval');
            }
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
                        href="/register"
                        className="text-sm font-medium text-white hover:underline"
                    >
                        Register
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">
                            Log in
                        </h1>

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

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Loginkan password"
                                        required
                                        className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'MEMPROSES...' : 'LOG IN'}
                            </button>
                        </form>

                        <div className="mt-6 flex items-center justify-between text-sm">
                            <Link href="/forgot-password" className="text-slate-500 hover:text-orange-500 transition-colors">
                                Forgot Password?
                            </Link>
                            <Link href="/resend-verification" className="text-slate-500 hover:text-orange-500 transition-colors">
                                Kirim Ulang Verifikasi
                            </Link>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-200">
                            <p className="text-center text-sm text-slate-600">
                                Belum punya akun?{' '}
                                <Link href="/register" className="text-orange-500 hover:underline font-semibold">
                                    Register Sekarang
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-white/80 text-xs mt-8 px-4">
                        By continuing, you agree to our Terms & Conditions and Privacy Policy.
                    </p>
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
