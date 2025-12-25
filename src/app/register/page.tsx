'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { TokovaLogo } from '@/components/TokovaLogo';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        storeName: '',
        phone: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, error, clearError } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();

        if (formData.password !== formData.confirmPassword) {
            return;
        }

        if (formData.password.length < 8) {
            return;
        }

        setLoading(true);

        const result = await register({
            email: formData.email,
            password: formData.password,
            storeName: formData.storeName,
            phone: formData.phone,
            description: formData.description,
        });

        setLoading(false);

        if (result.success) {
            setSuccess(true);
            setSuccessMessage(result.message || 'Registration successful! Please check your email for verification.');
        }
    };

    if (success) {
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
                        <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                                Registrasi Success!
                            </h1>
                            <p className="text-slate-600 mb-6">
                                {successMessage}
                            </p>
                            <p className="text-sm text-slate-500 mb-8">
                                Kami telah mengirimkan email verifikasi ke{' '}
                                <span className="font-semibold text-slate-700">{formData.email}</span>.
                                Please check your inbox or spam folder.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex justify-center items-center w-full py-3.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                KEMBALI KE LOGIN
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

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
                <div className="w-full max-w-lg">
                    <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                            Register sebagai Penjual
                        </h1>
                        <p className="text-slate-500 mb-6 sm:mb-8">
                            Mulai berjualan dan kembangkan bisnis you
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Store Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="storeName"
                                    value={formData.storeName}
                                    onChange={handleChange}
                                    placeholder="Contoh: Store Elektronik Jaya"
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    No. Telepon <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="08xxxxxxxxxx"
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Min. 8 karakter"
                                            required
                                            minLength={8}
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
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Konfirmasi <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Ulangi password"
                                            required
                                            className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showConfirmPassword ? (
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
                            </div>
                            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="text-xs text-red-500 -mt-3">Passwords do not match</p>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Store Description <span className="text-slate-400 font-normal">(opsional)</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Tell us about your store"
                                    rows={3}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || (formData.password !== formData.confirmPassword && formData.confirmPassword !== '')}
                                className="w-full py-3.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'MEMPROSES...' : 'DAFTAR'}
                            </button>
                        </form>

                        <p className="text-xs text-slate-500 mt-6 text-center leading-relaxed">
                            Dengan mendaftar, your menyetujui{' '}
                            <Link href="/terms" className="text-orange-500 hover:underline">
                                Syarat & Ketentuan
                            </Link>{' '}
                            dan{' '}
                            <Link href="/privacy" className="text-orange-500 hover:underline">
                                Privacy Policy
                            </Link>
                        </p>

                        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-200">
                            <p className="text-center text-sm text-slate-600">
                                Sudah punya akun?{' '}
                                <Link href="/login" className="text-orange-500 hover:underline font-semibold">
                                    Log In
                                </Link>
                            </p>
                        </div>
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
