import Link from 'next/link';
import { TokovaLogo } from '@/components/TokovaLogo';

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="mb-10 border-b border-slate-100 pb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Shipping Information
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Learn about our delivery methods, timeframes, and costs.
                    </p>
                </div>

                <div className="prose prose-slate max-w-none">
                    {/* Delivery Methods */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">🚚</span>
                            Delivery Services
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
                            <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
                                <h3 className="font-bold text-lg text-slate-800 mb-2">Standard Shipping</h3>
                                <p className="text-sm text-slate-500 mb-4">Best for everyday items</p>
                                <div className="text-orange-600 font-bold mb-1">3 - 5 Days</div>
                                <div className="text-xs text-slate-400">Regular cost</div>
                            </div>
                            <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
                                <h3 className="font-bold text-lg text-slate-800 mb-2">Express Shipping</h3>
                                <p className="text-sm text-slate-500 mb-4">When you need it fast</p>
                                <div className="text-orange-600 font-bold mb-1">1 - 2 Days</div>
                                <div className="text-xs text-slate-400">Higher cost</div>
                            </div>
                            <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
                                <h3 className="font-bold text-lg text-slate-800 mb-2">Cargo / Bulk</h3>
                                <p className="text-sm text-slate-500 mb-4">For heavy or large items</p>
                                <div className="text-orange-600 font-bold mb-1">5 - 14 Days</div>
                                <div className="text-xs text-slate-400">Economy cost</div>
                            </div>
                        </div>
                    </section>

                    {/* Shipping Process */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">📦</span>
                            How It Works
                        </h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 flex-shrink-0">1</div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Order Processing</h3>
                                    <p className="text-slate-600">Once your payment is verified, the seller will process your order within 1-2 business days.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 flex-shrink-0">2</div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Handover to Courier</h3>
                                    <p className="text-slate-600">The seller packs your item and hands it over to the selected shipping partner.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 flex-shrink-0">3</div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Tracking</h3>
                                    <p className="text-slate-600">You will receive a tracking number to monitor your package's journey in real-time.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 flex-shrink-0">4</div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Delivery</h3>
                                    <p className="text-slate-600">The courier delivers the package to your doorstep. Make sure someone is available to receive it.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">❓</span>
                            Common Questions
                        </h2>
                        <div className="space-y-4">
                            <div className="border border-slate-200 rounded-lg p-4">
                                <h3 className="font-bold text-slate-800 mb-2">Do you ship internationally?</h3>
                                <p className="text-slate-600">Currently, Tokova primarily operates within the country. Some sellers may offer international shipping, which will be indicated on the product page.</p>
                            </div>
                            <div className="border border-slate-200 rounded-lg p-4">
                                <h3 className="font-bold text-slate-800 mb-2">What if my package is lost?</h3>
                                <p className="text-slate-600">If your package hasn't arrived by the estimated date, please check the tracking status. If it seems stuck or lost, contact our Customer Support for assistance with a refund or replacement.</p>
                            </div>
                        </div>
                    </section>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex items-center justify-between flex-col sm:flex-row gap-4">
                        <div>
                            <h3 className="font-bold text-slate-900">Need more help?</h3>
                            <p className="text-slate-600 text-sm">Our support team is available 24/7 to assist you.</p>
                        </div>
                        <Link href="/help" className="px-6 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
