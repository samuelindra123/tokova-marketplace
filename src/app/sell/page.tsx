'use client';

import Link from 'next/link';
import { TokovaLogo } from '@/components/TokovaLogo';

const VENDOR_URL = process.env.NEXT_PUBLIC_VENDOR_URL || 'http://localhost:3002';

export default function SellOnTokovaPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-orange-500 to-red-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                            Start Your Business Journey with <span className="text-orange-200">Tokova</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-orange-100 mb-8 font-light">
                            Join thousands of successful sellers. Reach millions of customers and grow your brand today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <a
                                href={`${VENDOR_URL}/register`}
                                target="_blank"
                                className="px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-full shadow-xl hover:bg-orange-50 hover:scale-105 transition-all transform"
                            >
                                Start Selling Now
                            </a>
                            <a
                                href="#benefits"
                                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white/10 transition-colors"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        {/* Abstract/Icon representation if no image is available yet */}
                        <div className="w-full h-80 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 flex flex-col justify-center items-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <TokovaLogo className="w-16 h-16 text-orange-500" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Tokova Seller Center</h3>
                            <p className="text-orange-100 text-center">Your all-in-one dashboard to manage products, orders, and analytics.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-12 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-4">
                            <div className="text-4xl font-bold text-slate-900 mb-2">0%</div>
                            <div className="text-slate-500 text-lg">Registration Fee</div>
                        </div>
                        <div className="p-4 border-l-0 md:border-l border-slate-100">
                            <div className="text-4xl font-bold text-slate-900 mb-2">24/7</div>
                            <div className="text-slate-500 text-lg">Seller Support</div>
                        </div>
                        <div className="p-4 border-l-0 md:border-l border-slate-100">
                            <div className="text-4xl font-bold text-slate-900 mb-2">Millions</div>
                            <div className="text-slate-500 text-lg">Potential Customers</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div id="benefits" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Sell on Tokova?</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            We provide the tools and support you need to build a successful online business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Benefit 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-slate-100">
                            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Easy to Grow</h3>
                            <p className="text-slate-600">
                                Access powerful marketing tools and analytics to boost your sales and reach more customers effectively.
                            </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-slate-100">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Low Commission</h3>
                            <p className="text-slate-600">
                                Enjoy competitive commission rates transparent fees. Maximize your profit margins with Tokova.
                            </p>
                        </div>

                        {/* Benefit 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-slate-100">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Safe & Secure</h3>
                            <p className="text-slate-600">
                                Robust security for your store and customers. Secure payment processing and verified transaction systems.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Start selling in 3 simple steps. No hidden complexity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connector Line (hidden on mobile) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10"></div>

                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="w-24 h-24 bg-white border-4 border-orange-500 rounded-full flex items-center justify-center text-3xl font-bold text-orange-500 mx-auto mb-6 shadow-sm">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Register Your Store</h3>
                            <p className="text-slate-600 px-4">
                                Complete your store profile and verify your identity in minutes.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="w-24 h-24 bg-white border-4 border-orange-500 rounded-full flex items-center justify-center text-3xl font-bold text-orange-500 mx-auto mb-6 shadow-sm">
                                2
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Products</h3>
                            <p className="text-slate-600 px-4">
                                Add photos and details of your products to start showcasing them.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="w-24 h-24 bg-white border-4 border-orange-500 rounded-full flex items-center justify-center text-3xl font-bold text-orange-500 mx-auto mb-6 shadow-sm">
                                3
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Start Selling</h3>
                            <p className="text-slate-600 px-4">
                                Process orders, ship items, and get paid directly to your account.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonial / Social Proof */}
            <div className="py-24 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="mb-8">
                        <div className="flex justify-center gap-1 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
                            "Tokova transformed my small local shop into a nationwide brand. The tools are easy to use and the support is incredible."
                        </h2>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center font-bold text-xl">S</div>
                        <div className="text-left">
                            <div className="font-bold text-lg">Sarah Johnson</div>
                            <div className="text-slate-400 text-sm">Owner of Sarah's Boutique</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Call to Action */}
            <div className="py-24 bg-orange-500">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to grow your business?
                    </h2>
                    <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
                        Don't miss the opportunity to reach millions of potential customers. Registration is free and takes less than 5 minutes.
                    </p>
                    <a
                        href={`${VENDOR_URL}/register`}
                        target="_blank"
                        className="inline-block px-10 py-5 bg-white text-orange-600 font-bold text-xl rounded-full shadow-xl hover:bg-slate-50 hover:scale-105 transition-all transform"
                    >
                        Register Now - It's Free
                    </a>
                </div>
            </div>
        </div>
    );
}
