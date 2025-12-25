'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { TokovaLogo } from '@/components/TokovaLogo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function ResendVerificationPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch(`${API_URL}/auth/resend-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Terjadi kesalahan');
            }

            setMessage(data.message);
            setSuccess(true);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Terjadi kesalahan. Please coba lagi.');
            }
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
                        Log In
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8">
                        {success ? (
                            <>
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 text-center">
                                    Email Terkirim!
                                </h1>
                                <p className="text-slate-600 mb-6 text-center">
                                    {message}
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-flex justify-center items-center w-full py-3.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    KEMBALI KE LOGIN
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 text-center">
                                    Kirim Ulang Verifikasi
                                </h1>
                                <p className="text-slate-500 mb-6 sm:mb-8 text-center">
                                    Enter the email you used during registration to resend verification email.
                                </p>

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
                                        {loading ? 'MENGIRIM...' : 'KIRIM ULANG VERIFIKASI'}
                                    </button>
                                </form>

                                <div className="mt-8 pt-8 border-t border-slate-200">
                                    <p className="text-center text-sm text-slate-600">
                                        Sudah verifikasi email?{' '}
                                        <Link href="/login" className="text-orange-500 hover:underline font-semibold">
                                            Log In
                                        </Link>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
