import { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';

interface Vendor {
    id: string;
    storeName: string;
    storeSlug: string;
    description?: string;
    logo?: string;
    status: string;
    commissionRate: number;
    email: string;
    phone?: string;
    createdAt: string;
}

interface Meta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchVendors();
    }, [filter, page]);

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filter) params.append('status', filter);
            if (search) params.append('search', search);
            params.append('page', page.toString());
            params.append('limit', '10');

            const response = await api.get(`/admin/vendors?${params}`);
            setVendors(response.data.data);
            setMeta(response.data.meta);
        } catch (err) {
            console.error('Failed to fetch vendors:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchVendors();
    };

    const updateStatus = async (id: string, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED') => {
        try {
            await api.put(`/admin/vendors/${id}/status`, { status });
            fetchVendors();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const statusOptions = ['', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vendors</h1>
                    <p className="text-slate-500">Manage vendor applications and accounts</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <select
                    value={filter}
                    onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                    className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">All Status</option>
                    {statusOptions.slice(1).map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search vendors..."
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button onClick={handleSearch} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500">
                        Search
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Store</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Commission</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Joined</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">
                                        <div className="animate-spin inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                                    </td>
                                </tr>
                            ) : vendors.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No vendors found</td>
                                </tr>
                            ) : (
                                vendors.map((vendor) => (
                                    <tr key={vendor.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {vendor.logo ? (
                                                    <img src={vendor.logo} alt="" className="w-10 h-10 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                        {vendor.storeName.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-slate-900">{vendor.storeName}</p>
                                                    <p className="text-sm text-slate-500">{vendor.storeSlug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{vendor.email}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={vendor.status} />
                                        </td>
                                        <td className="px-6 py-4 text-slate-900">{vendor.commissionRate}%</td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(vendor.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {vendor.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(vendor.id, 'APPROVED')}
                                                            className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-200"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(vendor.id, 'REJECTED')}
                                                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {vendor.status === 'APPROVED' && (
                                                    <button
                                                        onClick={() => updateStatus(vendor.id, 'SUSPENDED')}
                                                        className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-200"
                                                    >
                                                        Suspend
                                                    </button>
                                                )}
                                                {vendor.status === 'SUSPENDED' && (
                                                    <button
                                                        onClick={() => updateStatus(vendor.id, 'APPROVED')}
                                                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-200"
                                                    >
                                                        Reactivate
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Showing {(meta.page - 1) * meta.limit + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                disabled={page === meta.totalPages}
                                className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-700',
        APPROVED: 'bg-emerald-100 text-emerald-700',
        REJECTED: 'bg-red-100 text-red-700',
        SUSPENDED: 'bg-slate-100 text-slate-700',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
            {status}
        </span>
    );
}
