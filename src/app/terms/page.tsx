import Link from 'next/link';
import { TokovaLogo } from '@/components/TokovaLogo';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <TokovaLogo className="w-8 h-8" />
                            <span className="text-xl font-bold text-slate-900">Tokova</span>
                        </Link>
                        <Link href="/register" className="px-4 py-2 text-sm font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                            Register
                        </Link>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-slate-500">
                        Last updated: December 20, 2024
                    </p>
                </div>

                <div className="prose prose-slate max-w-none">
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Welcome to Tokova. These Terms and Conditions govern your use of the Tokova Seller Center platform and related services. By accessing or using our services, you agree to be bound by these terms and conditions.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Seller Account</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>You must be at least 18 years old to become a seller</li>
                            <li>You must provide accurate and complete information during registration</li>
                            <li>You are responsible for maintaining the security of your account</li>
                            <li>One person/business may only have one active seller account</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Products and Listings</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>All products must be legal and comply with applicable regulations</li>
                            <li>Product descriptions must be accurate and not misleading</li>
                            <li>Product images must represent the actual item being sold</li>
                            <li>Pricing must be clearly stated including all taxes</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Orders and Shipping</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Sellers must process orders within the specified timeframe</li>
                            <li>Shipping must be done using reliable courier services</li>
                            <li>Tracking numbers must be provided to buyers</li>
                            <li>Sellers are responsible for proper packaging</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Payments</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Payments will be processed according to the established schedule</li>
                            <li>Commission and service fees will be deducted from sales</li>
                            <li>Valid bank account information is required for payment</li>
                            <li>Tokova reserves the right to hold payments for investigation</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Prohibited Items</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Illegal drugs and controlled substances</li>
                            <li>Weapons and ammunition</li>
                            <li>Counterfeit and pirated goods</li>
                            <li>Adult content that violates regulations</li>
                            <li>Items that infringe intellectual property rights</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Account Termination</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Tokova reserves the right to suspend or terminate seller accounts that violate these terms, engage in fraudulent activity, or receive excessive negative feedback from buyers.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">8. Limitation of Liability</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Tokova is not responsible for direct, indirect, incidental, or consequential damages arising from the use of our platform. Sellers are fully responsible for their products and transactions.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">9. Changes to Terms</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Tokova reserves the right to modify these terms at any time. Significant changes will be notified via email or platform notification. Continued use of the service after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">10. Contact</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            For questions about these Terms and Conditions, please contact:
                        </p>
                        <div className="bg-slate-50 rounded-lg p-6">
                            <p className="text-slate-800 font-medium">Tokova Seller Support</p>
                            <p className="text-slate-600">Email: seller-support@tokova.com</p>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Tokova. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
