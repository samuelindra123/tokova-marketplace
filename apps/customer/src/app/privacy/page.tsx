import Link from 'next/link';
import { TokovaLogo } from '@/components/TokovaLogo';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Information We Collect</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Provide, maintain, and improve our services.</li>
                            <li>Process transactions and send related information.</li>
                            <li>Send you technical notices, updates, security alerts, and support messages.</li>
                            <li>Respond to your comments, questions, and requests.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Sharing of Information</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            We may share information about you as follows:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</li>
                            <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Security</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Cookies</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Services.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Changes to this Policy</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We may change this privacy policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Contact Us</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <div className="bg-slate-50 rounded-lg p-6">
                            <p className="text-slate-800 font-medium">Tokova Privacy Team</p>
                            <p className="text-slate-600">Email: privacy@tokova.com</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
