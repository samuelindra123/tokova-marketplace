'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TokovaLogo } from '@/components/TokovaLogo';
import { api } from '@/lib/api';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Token verifikasi tidak ditemukan');
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await api.post('/auth/verify-email', { token });
                const data = response.data as { message?: string };
                setStatus('success');
                setMessage(data.message || 'Email berhasil diverifikasi!');
            } catch (error: unknown) {
                setStatus('error');
                const err = error as { response?: { data?: { message?: string } } };
                setMessage(err.response?.data?.message || 'Failed memverifikasi email');
            }
        };

        verifyEmail();
    }, [searchParams]);

    return (
        <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 text-center">
                {status === 'loading' && (
                    <>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                            Memverifikasi Email...
                        </h1>
                        <p className="text-slate-600">
                            Please wait sebentar
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                            Email Terverifikasi!
                        </h1>
                        <p className="text-slate-600 mb-8">
                            {message}
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex justify-center items-center w-full py-3.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            LOGIN TO ACCOUNT
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                            Verifikasi Failed
                        </h1>
                        <p className="text-slate-600 mb-8">
                            {message}
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex justify-center items-center w-full py-3.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            KEMBALI KE LOGIN
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
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
                <Suspense fallback={
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                                Loading...
                            </h1>
                        </div>
                    </div>
                }>
                    <VerifyEmailContent />
                </Suspense>
            </main>

            <footer className="py-6 text-center">
                <p className="text-white/70 text-xs">
                    © 2025 Tokova. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
