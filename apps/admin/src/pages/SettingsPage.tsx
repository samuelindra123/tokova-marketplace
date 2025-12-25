import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your admin account and platform settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Profile Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <input
                                    type="text"
                                    value={user?.role || 'ADMIN'}
                                    disabled
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Platform Settings</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                <div>
                                    <p className="font-medium text-slate-900">Marketplace Name</p>
                                    <p className="text-sm text-slate-500">The name of your marketplace</p>
                                </div>
                                <input
                                    type="text"
                                    defaultValue="Marketplace"
                                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                <div>
                                    <p className="font-medium text-slate-900">Default Commission Rate</p>
                                    <p className="text-sm text-slate-500">Platform fee percentage</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        defaultValue={10}
                                        className="w-20 px-4 py-2 border border-slate-200 rounded-lg text-sm text-right"
                                    />
                                    <span className="text-slate-500">%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <p className="font-medium text-slate-900">Vendor Auto-Approval</p>
                                    <p className="text-sm text-slate-500">Automatically approve new vendors</p>
                                </div>
                                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors">
                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform translate-x-1" />
                                </button>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                disabled={saving}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full px-4 py-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <p className="font-medium text-slate-900">📧 Email Settings</p>
                                <p className="text-sm text-slate-500">Configure email templates</p>
                            </button>
                            <button className="w-full px-4 py-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <p className="font-medium text-slate-900">🔒 Security</p>
                                <p className="text-sm text-slate-500">Change password & 2FA</p>
                            </button>
                            <button className="w-full px-4 py-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <p className="font-medium text-slate-900">📊 API Docs</p>
                                <p className="text-sm text-slate-500">View API documentation</p>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                        <h3 className="font-semibold mb-2">Need Help?</h3>
                        <p className="text-sm text-indigo-100 mb-4">Contact our support team for assistance with your admin dashboard.</p>
                        <button className="w-full px-4 py-2 bg-white/20 backdrop-blur rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
