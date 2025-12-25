'use client';

import Link from 'next/link';
import { TokovaLogo } from '@/components/TokovaLogo';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20 z-0"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10 text-center">
                    <div className="inline-flex items-center gap-3 mb-8 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10">
                        <TokovaLogo className="w-6 h-6 text-orange-400" />
                        <span className="font-semibold tracking-wide uppercase text-sm text-orange-400">The Future of Commerce</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight">
                        Redefining the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Marketplace Experience</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 font-light">
                        Tokova is not just a platform; it's a revolution. Built to rival giants, engineered for speed, and designed for you.
                    </p>
                </div>
            </div>

            {/* Our Mission */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                Bringing the World <br /> to Your Fingertips
                            </h2>
                            <div className="w-20 h-1 bg-orange-500 mb-8"></div>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                At Tokova, we believe that buying and selling should be effortless, secure, and enjoyable. We've built a robust ecosystem that connects millions of buyers and sellers across the nation, providing a seamless shopping experience that rivals the biggest names in the industry.
                            </p>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                With state-of-the-art technology and a user-centric approach, we are setting new standards for e-commerce performance and reliability.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl transform rotate-3 opacity-20"></div>
                            <div className="relative bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-xl">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                                        <div className="text-3xl font-bold text-orange-500 mb-2">Fast</div>
                                        <div className="text-sm text-slate-500">Lightning Speed Performance</div>
                                    </div>
                                    <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                                        <div className="text-3xl font-bold text-orange-500 mb-2">Secure</div>
                                        <div className="text-sm text-slate-500">Bank-Grade Security</div>
                                    </div>
                                    <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                                        <div className="text-3xl font-bold text-orange-500 mb-2">Smart</div>
                                        <div className="text-sm text-slate-500">AI-Powered Recommendations</div>
                                    </div>
                                    <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                                        <div className="text-3xl font-bold text-orange-500 mb-2">Global</div>
                                        <div className="text-sm text-slate-500">World-Class Standard</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Developer Story */}
            <div className="py-24 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Meet the Mastermind</h2>
                        <p className="text-lg text-slate-600">The young genius behind the platform</p>
                    </div>

                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 md:flex">
                        <div className="md:w-1/3 bg-slate-900 relative min-h-[400px] md:min-h-0">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 z-10"></div>
                            {/* Developer Image */}
                            <img
                                src="/images/samuel-profile-tech.png"
                                alt="Samuel Indra Bastian"
                                className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-normal"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
                                <h3 className="text-3xl font-bold mb-1">Samuel Indra Bastian</h3>
                                <p className="text-orange-400 font-medium text-lg">Lead Fullstack Developer & Architect</p>
                            </div>
                        </div>
                        <div className="md:w-2/3 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                            <div className="mb-8">
                                <h4 className="text-2xl font-bold text-slate-900 mb-4">A 17-Year-Old Visionary</h4>
                                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                    Samuel is not your average student. Currently a 2nd-year student at SMK majoring in TEI (Industrial Electronics Engineering), he has already amassed <strong>3 years of professional fullstack development experience</strong>.
                                </p>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    With a passion for code that started early, Samuel has successfully delivered numerous complex projects before even graduating high school. Tokova is his masterpiece—a testament to his skill, dedication, and ambition to build a platform that stands toe-to-toe with giants like Shopee.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-100">
                                <div>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">17</div>
                                    <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Years Old</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">3+</div>
                                    <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Years Exp</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">TEI</div>
                                    <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Major</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">100%</div>
                                    <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Dedication</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tech Stack */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-slate-500 font-medium mb-8">POWERED BY MODERN TECHNOLOGY</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Simple text representation of tech stack for now */}
                        <span className="text-2xl font-bold text-slate-400">Next.js 16</span>
                        <span className="text-2xl font-bold text-slate-400">NestJS</span>
                        <span className="text-2xl font-bold text-slate-400">TypeScript</span>
                        <span className="text-2xl font-bold text-slate-400">PostgreSQL</span>
                        <span className="text-2xl font-bold text-slate-400">Tailwind CSS</span>
                        <span className="text-2xl font-bold text-slate-400">Docker</span>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-24 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">Join the Revolution</h2>
                    <p className="text-xl text-orange-100 mb-10">
                        Experience the platform built with passion and precision.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-full shadow-lg hover:bg-orange-50 transition-colors"
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white/10 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
