import Link from 'next/link';
import { TokovaLogo } from '@/components/TokovaLogo';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
                            Welcome to Tokova. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Account Registration</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>You must be at least 18 years old or have parental consent to use this service.</li>
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>You agree to provide accurate and current information during registration.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Purchases and Payments</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>All prices are displayed in USD unless otherwise stated.</li>
                            <li>We reserve the right to refuse or cancel orders at any time.</li>
                            <li>Payment must be made using valid payment methods accepted by our platform.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Shipping and Returns</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Shipping times and costs vary depending on the seller and location.</li>
                            <li>Returns are subject to the individual seller's return policy and our platform guidelines.</li>
                            <li>Please review product details carefully before making a purchase.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">5. User Conduct</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            You agree not to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Use the service for any illegal or unauthorized purpose.</li>
                            <li>Harass, abuse, or harm another person.</li>
                            <li>Interfere with the security or proper functioning of the service.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Intellectual Property</h2>
                        <p className="text-slate-600 leading-relaxed">
                            The content, organization, graphics, design, and other matters related to the Site are protected under applicable copyrights and other proprietary laws. Making unauthorized copies of content is prohibited.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Limitation of Liability</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Tokova shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">8. Contact Us</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            If you have any questions about these Terms, please contact us at:
                        </p>
                        <div className="bg-slate-50 rounded-lg p-6">
                            <p className="text-slate-800 font-medium">Tokova Customer Support</p>
                            <p className="text-slate-600">Email: support@tokova.com</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
