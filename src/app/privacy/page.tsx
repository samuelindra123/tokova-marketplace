import Link from 'next/link';
import { TokovaLogo } from '@/components/TokovaLogo';

export default function PrivacyPage() {
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
                        Privacy Policy
                    </h1>
                    <p className="text-slate-500">
                        Last updated: December 20, 2024
                    </p>
                </div>

                <div className="prose prose-slate max-w-none">
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Tokova (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            By using the Tokova Seller Center service, you agree to the collection and use of information in accordance with this policy.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Information We Collect</h2>
                        <h3 className="text-lg font-medium text-slate-800 mb-3">a. Information You Provide</h3>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                            <li>Full name and store name</li>
                            <li>Email address and phone number</li>
                            <li>Shipping and billing address</li>
                            <li>Bank account information for payments</li>
                            <li>Identity documents (if required)</li>
                            <li>Product information you sell</li>
                        </ul>

                        <h3 className="text-lg font-medium text-slate-800 mb-3">b. Automatically Collected Information</h3>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>IP address and geographic location</li>
                            <li>Device type and browser used</li>
                            <li>Pages visited and access time</li>
                            <li>Click patterns and usage behavior</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">3. How We Use Information</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            We use the collected information to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Provide and maintain our services</li>
                            <li>Process transactions and send order notifications</li>
                            <li>Send notifications related to orders and store activity</li>
                            <li>Respond to questions and provide customer support</li>
                            <li>Improve and develop our services</li>
                            <li>Detect and prevent fraud</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Information Sharing</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            We may share your information with:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                            <li><strong>Buyers:</strong> Store name, product information, and seller rating.</li>
                            <li><strong>Shipping Partners:</strong> Name and address for shipping purposes.</li>
                            <li><strong>Payment Partners:</strong> Information required to process payments.</li>
                            <li><strong>Authorities:</strong> If required by law or legal process.</li>
                        </ul>
                        <p className="text-slate-600 leading-relaxed">
                            We do not sell your personal information to third parties for marketing purposes.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Data Security</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            We implement appropriate security measures to protect your information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>SSL/TLS encryption for data transmission</li>
                            <li>Secure password hashing</li>
                            <li>Access restrictions to personal information</li>
                            <li>Regular security audits</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Cookies</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            We use cookies and similar technologies to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                            <li>Keep you logged in</li>
                            <li>Remember your preferences</li>
                            <li>Analyze site usage</li>
                        </ul>
                        <p className="text-slate-600 leading-relaxed">
                            You can set your browser to reject cookies, but some features may not work properly.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Your Rights</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Access personal information we store about you</li>
                            <li>Update or correct inaccurate information</li>
                            <li>Request deletion of your data</li>
                            <li>Withdraw consent for certain data usage</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">8. Contact Us</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            If you have questions or concerns about this Privacy Policy, please contact:
                        </p>
                        <div className="bg-slate-50 rounded-lg p-6">
                            <p className="text-slate-800 font-medium">Tokova Privacy Team</p>
                            <p className="text-slate-600">Email: privacy@tokova.com</p>
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
