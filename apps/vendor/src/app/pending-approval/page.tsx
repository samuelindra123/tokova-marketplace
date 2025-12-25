'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TokovaLogo } from '@/components/TokovaLogo';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

interface QueueData {
    status: string;
    storeName: string;
    position: number;
    totalPending: number;
    createdAt: string;
}

export default function PendingApprovalPage() {
    const { user, vendor, logout } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [queueData, setQueueData] = useState<QueueData | null>(null);
    const [checking, setChecking] = useState(false);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);

    // Fetch queue position
    const fetchQueuePosition = useCallback(async () => {
        if (checking) return;
        setChecking(true);

        try {
            const { data } = await api.get<QueueData>('/vendor/store/queue-position');
            if (data) {
                setQueueData(data);
                setLastChecked(new Date());

                if (data.status === 'APPROVED') {
                    router.push('/dashboard');
                }
            }
        } catch (error) {
            console.error('Failed to check status:', error);
        } finally {
            setChecking(false);
        }
    }, [checking, router]);

    // Initial mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Initial fetch and polling
    useEffect(() => {
        if (!mounted) return;

        // Initial fetch
        fetchQueuePosition();

        // Poll every 30 seconds
        const interval = setInterval(fetchQueuePosition, 30000);

        return () => clearInterval(interval);
    }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    // Loading state
    if (!mounted || !queueData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white font-medium">Loading data...</p>
                </div>
            </div>
        );
    }

    // Approved state
    if (queueData.status === 'APPROVED') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex flex-col">
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
                        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-3">
                                Store your Disetujui! 🎉
                            </h1>
                            <p className="text-slate-600 mb-8">
                                Selamat! Store <span className="font-semibold">{queueData.storeName}</span> telah disetujui. your sekarang bisa mulai berjualan.
                            </p>
                            <Link
                                href="/dashboard"
                                className="inline-flex justify-center items-center w-full py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
                            >
                                GO TO DASHBOARD
                                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Rejected state
    if (queueData.status === 'REJECTED') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-500 to-rose-600 flex flex-col">
                <header className="px-4 sm:px-6 lg:px-8 py-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <TokovaLogo className="w-8 h-8 sm:w-10 sm:h-10" />
                            <span className="text-xl sm:text-2xl font-bold text-white">Tokova</span>
                        </Link>
                        <button
                            onClick={logout}
                            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-3">
                                Pengajuan Ditolak
                            </h1>
                            <p className="text-slate-600 mb-6">
                                Maaf, pengajuan toko <span className="font-semibold">{queueData.storeName}</span> tidak dapat kami setujui saat ini.
                            </p>
                            <p className="text-sm text-slate-500 mb-8">
                                Please hubungi tim support kami untuk informasi lebih lanjut atau untuk mengajukan banding.
                            </p>
                            <a
                                href="mailto:support@tokova.id"
                                className="inline-flex justify-center items-center w-full py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                Hubungi Support
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Pending state
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-600 flex flex-col">
            {/* Header */}
            <header className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <TokovaLogo className="w-8 h-8 sm:w-10 sm:h-10" />
                        <span className="text-xl sm:text-2xl font-bold text-white">Tokova</span>
                    </Link>
                    <button
                        onClick={logout}
                        className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full max-w-lg">
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        {/* Status Icon */}
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                <svg className="w-12 h-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">
                                Pending Persetujuan
                            </h1>
                            <p className="text-slate-600">
                                Store <span className="font-semibold text-orange-500">{queueData.storeName}</span> sedang dalam proses review
                            </p>
                        </div>

                        {/* Queue Status Card */}
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-slate-500">Status Antrian</span>
                                <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                                    PENDING
                                </span>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-slate-900">#{queueData.position}</span>
                                        <span className="text-sm text-slate-500">of {queueData.totalPending} antrian</span>
                                    </div>
                                </div>
                                <div className="w-px h-12 bg-slate-200"></div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-500">Estimasi</p>
                                    <p className="text-lg font-semibold text-slate-900">1-3 hari kerja</p>
                                </div>
                            </div>

                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: '33%' }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mt-2">
                                <span>Diajukan</span>
                                <span>Review</span>
                                <span>Completed</span>
                            </div>
                        </div>

                        {/* Checklist */}
                        <div className="space-y-3 mb-6">
                            {[
                                { label: 'Email terverifikasi', done: true },
                                { label: 'Data toko lengkap', done: true },
                                { label: 'Pending approval admin', done: false, current: true },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.done
                                        ? 'bg-green-100'
                                        : item.current
                                            ? 'bg-orange-100'
                                            : 'bg-slate-100'
                                        }`}>
                                        {item.done ? (
                                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : item.current ? (
                                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                        ) : (
                                            <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                                        )}
                                    </div>
                                    <span className={`text-sm ${item.done ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Check Status Button */}
                        <button
                            onClick={fetchQueuePosition}
                            disabled={checking}
                            className="w-full py-3.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {checking ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Memeriksa...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Cek Status Sekarang
                                </>
                            )}
                        </button>

                        {lastChecked && (
                            <p className="text-xs text-slate-400 text-center mt-4">
                                Terakhir diperiksa: {formatTime(lastChecked)} • Auto-refresh setiap 30 detik
                            </p>
                        )}
                    </div>

                    {/* Info Cards */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <p className="text-white/60 text-xs mb-1">Email</p>
                            <p className="text-white font-medium text-sm truncate">{user?.email}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <p className="text-white/60 text-xs mb-1">Bantuan</p>
                            <a href="mailto:support@tokova.id" className="text-white font-medium text-sm hover:underline">
                                support@tokova.id
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
