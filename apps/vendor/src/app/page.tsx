'use client';

import Link from 'next/link';
import { TokovaLogo } from '@/components/TokovaLogo';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TokovaLogo className="w-8 h-8 sm:w-10 sm:h-10" />
              <span className="text-xl sm:text-2xl font-bold text-slate-900">
                Tokova<span className="text-orange-500">.</span>
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Features
              </Link>
              <Link href="#benefits" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Benefits
              </Link>
              <Link href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Testimonials
              </Link>
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={process.env.NEXT_PUBLIC_CUSTOMER_URL || 'http://localhost:3000'}
                className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors mr-2"
              >
                <span>Back to Shopping</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <Link
                href="/login"
                className="px-3 sm:px-4 py-2 text-sm font-semibold text-slate-700 hover:text-orange-500 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 sm:px-5 py-2.5 text-sm font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/25"
              >
                Register Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 sm:pt-40 pb-20 sm:pb-32 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-6">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-orange-700">#1 Seller Platform in Indonesia</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Sell More,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  Earn More
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Join 50,000+ successful sellers on Tokova. Manage your store, products, and orders easily in one dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
                >
                  Start Selling for Free
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="#features"
                  className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold border-2 border-slate-200 text-slate-700 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  Learn More
                </Link>
              </div>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-8">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">50K+</p>
                  <p className="text-sm text-slate-500">Active Sellers</p>
                </div>
                <div className="w-px h-12 bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">1M+</p>
                  <p className="text-sm text-slate-500">Products Sold</p>
                </div>
                <div className="w-px h-12 bg-slate-200"></div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">4.9</p>
                  <p className="text-sm text-slate-500">Seller Rating</p>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-60"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/50 p-6 border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-slate-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-slate-900">$2,905.50</p>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    +24%
                  </div>
                </div>
                <div className="h-40 flex items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-md transition-all hover:from-orange-600 hover:to-orange-500" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">Orders</p>
                    <p className="text-lg font-bold text-slate-900">1,234</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">Products</p>
                    <p className="text-lg font-bold text-slate-900">89</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">Rating</p>
                    <p className="text-lg font-bold text-slate-900">4.9</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-500 mb-8">Dipercaya oleh brand-brand ternama</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 lg:gap-16 opacity-60">
            {['Samsung', 'Unilever', 'L\'Oreal', 'Nike', 'Adidas', 'Apple'].map((brand) => (
              <div key={brand} className="text-xl sm:text-2xl font-bold text-slate-400">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Currency & Stripe Payment Gateway Section */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-6">
              <span className="text-violet-600 font-bold text-lg">$</span>
              <span className="text-sm font-medium text-violet-700">Transaksi dalam USD</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Payment Global dengan{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Stripe</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Semua transaksi menggunakan mata uang USD dengan payment gateway Stripe yang aman dan terpercaya
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Currency Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                  <span className="text-white font-bold text-3xl">$</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Mata Uang USD</h3>
                  <p className="text-slate-500">United States Dollar</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-600">Kurs Real-time</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full font-medium">Live</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">$1</span>
                  <span className="text-slate-400">=</span>
                  <span className="text-2xl font-semibold text-green-600">Rp 15.800</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">*Kurs diperbarui secara otomatis</p>
              </div>

              <div className="space-y-3">
                {[
                  'Product prices displayed in USD',
                  'Automatic currency conversion',
                  'Support for international payments',
                  'Konversi otomatis ke IDR saat checkout',
                  'Jangkau pasar internasional',
                  'Lebih mudah bersaing global'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stripe Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Powered by Stripe</h3>
                  <p className="text-slate-500">Payment Gateway Global #1</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100">
                <p className="text-sm text-slate-600 mb-4">Metode Payment Tersedia</p>
                <div className="flex items-center justify-center gap-4">
                  {/* VISA */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png"
                      alt="VISA"
                      className="h-6 w-auto"
                    />
                  </div>
                  {/* Mastercard */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png"
                      alt="Mastercard"
                      className="h-6 w-auto"
                    />
                  </div>
                  {/* AMEX */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png"
                      alt="American Express"
                      className="h-6 w-auto"
                    />
                  </div>
                  {/* Google Pay */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/200px-Google_Pay_Logo.svg.png"
                      alt="Google Pay"
                      className="h-6 w-auto"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Enkripsi SSL 256-bit</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  'Kartu kredit & debit internasional',
                  'Apple Pay & Google Pay',
                  'Transaksi aman & terenkripsi',
                  'Refund otomatis jika diperlukan'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-violet-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '$2M+', label: 'Volume Transaksi' },
              { value: '99.9%', label: 'Uptime Gateway' },
              { value: '<3s', label: 'Waktu Proses' },
              { value: '135+', label: 'Mata Uang' },
            ].map((stat, i) => (
              <div key={i} className="text-center bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-orange-500 mb-3">FITUR UNGGULAN</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Semua yang your Butuhkan
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tools lengkap untuk mengelola toko online your of mana saja
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
                title: 'Dashboard Analytics',
                desc: 'Pantau performa toko dengan data real-time dan insight mendalam'
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                ),
                title: 'Manajemen Products',
                desc: 'Upload and manage thousands of products easily and quickly'
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                ),
                title: 'Proses Orders',
                desc: 'Manage orders from one place with real-time notifications'
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                ),
                title: 'Payment Stripe',
                desc: 'Terima pembayaran global dengan Stripe yang aman'
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
                title: 'Integrasi Ekspedisi',
                desc: 'Terhubung dengan semua ekspedisi populer di Indonesia'
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                ),
                title: 'Support 24/7',
                desc: 'Tim support siap membantu kapanpun your butuhkan'
              },
            ].map((feature, i) => (
              <div key={i} className="group p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300">
                <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-5 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-sm font-semibold text-orange-500 mb-3">KEUNTUNGAN SELLER</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Mengapa Seller Memilih Tokova?
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'Komisi Terendah', desc: 'Hanya 3-5% per transaksi, lebih hemat of marketplace lain' },
                  { title: 'Fast Withdrawal', desc: 'Funds transferred to account within 24 hours after order completion' },
                  { title: 'Gratis Ongkir', desc: 'Subsidi ongkir untuk menarik lebih banyak pembeli' },
                  { title: 'Promosi Gratis', desc: 'Products your tampil di halaman utama dan kampanye besar' },
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">{benefit.title}</h4>
                      <p className="text-slate-600">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
              <div className="text-center mb-8">
                <p className="text-sm text-slate-500 mb-2">Perbandingan Komisi</p>
                <h3 className="text-2xl font-bold text-slate-900">Hemat Hingga 70%</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Marketplace A', fee: '15%', width: '100%', color: 'bg-slate-300' },
                  { name: 'Marketplace B', fee: '12%', width: '80%', color: 'bg-slate-300' },
                  { name: 'Marketplace C', fee: '10%', width: '66%', color: 'bg-slate-300' },
                  { name: 'Tokova', fee: '3-5%', width: '33%', color: 'bg-gradient-to-r from-orange-500 to-orange-400' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={`font-medium ${item.name === 'Tokova' ? 'text-orange-500' : 'text-slate-600'}`}>{item.name}</span>
                      <span className={`font-semibold ${item.name === 'Tokova' ? 'text-orange-500' : 'text-slate-900'}`}>{item.fee}</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-orange-500 mb-3">TESTIMONI</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Apa Kata Seller Kami
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Bergabung dengan ribuan seller yang sudah sukses berjualan di Tokova
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: 'Budi Santoso',
                store: 'Elektronik Jaya',
                location: 'Jakarta',
                quote: 'Omzet naik 3x lipat sejak bergabung di Tokova. Dashboard-nya sangat membantu analisis penjualan.',
                revenue: '$950/bln',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
              },
              {
                name: 'Sari Wijaya',
                store: 'Fashion Corner',
                location: 'Bandung',
                quote: 'Proses pencairan cepat dan komisi yang rendah membuat profit saya meningkat signifikan.',
                revenue: '$540/bln',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
              },
              {
                name: 'Ahmad Rahman',
                store: 'Gadget Store',
                location: 'Surabaya',
                quote: 'Support tim Tokova sangat responsif. Masalah selalu terselesaikan dengan cepat.',
                revenue: '$1,265/bln',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
              },
            ].map((testimonial, i) => (
              <div key={i} className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-orange-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-orange-100"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.store} • {testimonial.location}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Pendapatan</span>
                    <span className="text-sm font-semibold text-green-600">{testimonial.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-32 bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Siap Mulai Berjualan?
          </h2>
          <p className="text-lg sm:text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
            Register sekarang dan dapatkan akses penuh ke semua fitur. Gratis tanpa biaya bulanan.
          </p>
          <Link
            href="/register"
            className="inline-flex justify-center items-center px-10 py-4 text-lg font-semibold bg-white text-orange-500 rounded-xl hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Register Gratis Sekarang
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-sm text-orange-200 mt-6">
            Tidak perlu kartu kredit. Setup dalam 5 menit.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TokovaLogo className="w-8 h-8" />
                <span className="text-xl font-bold text-white">Tokova</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Trusted e-commerce platform for Indonesian sellers. Sell more, earn more.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Integration</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href={`${process.env.NEXT_PUBLIC_CUSTOMER_URL}/about`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href={`${process.env.NEXT_PUBLIC_CUSTOMER_URL}/contact`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href={`${process.env.NEXT_PUBLIC_CUSTOMER_URL}/terms`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href={`${process.env.NEXT_PUBLIC_CUSTOMER_URL}/privacy`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © 2025 Tokova. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
              </Link>
              <Link href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
