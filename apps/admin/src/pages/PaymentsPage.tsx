import { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';

export default function PaymentsPage() {
    const [loading, setLoading] = useState(false);
    const [stripeConfig, setStripeConfig] = useState<{ publishableKey?: string } | null>(null);

    useEffect(() => {
        fetchPaymentConfig();
    }, []);

    const fetchPaymentConfig = async () => {
        try {
            const response = await api.get('/payments/config');
            setStripeConfig(response.data);
        } catch (err) {
            console.error('Failed to fetch payment config:', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
                    <p className="text-slate-500">Manage payment settings and view transactions</p>
                </div>
            </div>

            {/* Payment Provider Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-xl">💳</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Stripe Connect</h3>
                            <p className="text-sm text-slate-500">Payment gateway</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                            <span className="text-sm text-slate-600">Status</span>
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                                Connected
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                            <span className="text-sm text-slate-600">Mode</span>
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                                Test Mode
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-slate-600">Platform Fee</span>
                            <span className="text-sm font-medium text-slate-900">10%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <span className="text-white text-xl">📊</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Payout Settings</h3>
                            <p className="text-sm text-slate-500">Vendor payments</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                            <span className="text-sm text-slate-600">Payout Schedule</span>
                            <span className="text-sm font-medium text-slate-900">Weekly</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                            <span className="text-sm text-slate-600">Minimum Payout</span>
                            <span className="text-sm font-medium text-slate-900">Rp 100,000</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-slate-600">Processing</span>
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                                Automatic
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions - Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Recent Transactions</h3>
                <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
                        <span className="text-xl">💰</span>
                    </div>
                    <p className="text-slate-500">Transaction history will appear here</p>
                </div>
            </div>
        </div>
    );
}
