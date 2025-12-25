'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, Address } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AddressesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Address | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        label: '',
        recipientName: '',
        phone: '',
        addressLine: '',
        city: '',
        province: '',
        postalCode: '',
        isDefault: false,
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            fetchAddresses();
        }
    }, [user, authLoading, router]);

    const fetchAddresses = async () => {
        try {
            const { data } = await api.get<Address[]>('/customer/addresses');
            if (data) setAddresses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (editing) {
                await api.put(`/customer/addresses/${editing.id}`, form);
            } else {
                await api.post('/customer/addresses', form);
            }
            await fetchAddresses();
            resetForm();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (addr: Address) => {
        setEditing(addr);
        setForm({
            label: addr.label,
            recipientName: addr.recipientName,
            phone: addr.phone,
            addressLine: addr.addressLine,
            city: addr.city,
            province: addr.province,
            postalCode: addr.postalCode,
            isDefault: addr.isDefault,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Remove this address?')) return;
        try {
            await api.delete(`/customer/addresses/${id}`);
            setAddresses(addresses.filter(a => a.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditing(null);
        setForm({
            label: '',
            recipientName: '',
            phone: '',
            addressLine: '',
            city: '',
            province: '',
            postalCode: '',
            isDefault: false,
        });
    };

    if (authLoading || loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 h-32"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/account" className="p-2 hover:bg-slate-100 rounded-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Shipping Address</h1>
            </div>

            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-3 mb-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                    + Add Address Baru
                </button>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-semibold text-slate-900 mb-4">
                        {editing ? 'Edit Address' : 'Address Baru'}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Label</label>
                            <input
                                type="text"
                                value={form.label}
                                onChange={(e) => setForm({ ...form, label: e.target.value })}
                                placeholder="Rumah, Kantor, dll"
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Penerima</label>
                            <input
                                type="text"
                                value={form.recipientName}
                                onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Telepon</label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Address Lengkap</label>
                            <textarea
                                value={form.addressLine}
                                onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
                                rows={2}
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Kota</label>
                            <input
                                type="text"
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Provinsi</label>
                            <input
                                type="text"
                                value={form.province}
                                onChange={(e) => setForm({ ...form, province: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Kode Pos</label>
                            <input
                                type="text"
                                value={form.postalCode}
                                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isDefault}
                                    onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                                    className="w-4 h-4 text-orange-500 rounded"
                                />
                                <span className="text-sm text-slate-700">Set as primary address</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            )}

            {/* Address List */}
            <div className="space-y-4">
                {addresses.map((addr) => (
                    <div key={addr.id} className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-slate-900">{addr.label}</span>
                                    {addr.isDefault && (
                                        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded">Utama</span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600">{addr.recipientName} • {addr.phone}</p>
                                <p className="text-sm text-slate-500 mt-1">
                                    {addr.addressLine}, {addr.city}, {addr.province} {addr.postalCode}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(addr)}
                                    className="text-sm text-orange-500 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {addresses.length === 0 && !showForm && (
                    <div className="text-center py-12 text-slate-500">
                        No saved addresses yet
                    </div>
                )}
            </div>
        </div>
    );
}
