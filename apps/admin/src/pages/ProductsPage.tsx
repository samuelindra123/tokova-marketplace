import { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    status: string;
    images?: { url: string }[];
    vendor?: { storeName: string };
    category?: { name: string };
    createdAt: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', '10');
            if (search) params.append('search', search);

            const response = await api.get(`/admin/products?${params}`);
            setProducts(response.data.data || response.data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Products</h1>
                    <p className="text-slate-500">View all products across vendors</p>
                </div>
            </div>

            {/* Search */}
            <div className="flex gap-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                    placeholder="Search products..."
                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button onClick={fetchProducts} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500">
                    Search
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Vendor</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">
                                        <div className="animate-spin inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No products found</td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.images?.[0]?.url ? (
                                                    <img src={product.images[0].url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                                        📦
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-slate-900">{product.name}</p>
                                                    <p className="text-sm text-slate-500">{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(product.price)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`${product.stock < 10 ? 'text-red-600' : 'text-slate-900'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{product.vendor?.storeName || '-'}</td>
                                        <td className="px-6 py-4 text-slate-600">{product.category?.name || '-'}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={product.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-slate-600">Page {page}</span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={products.length < 10}
                        className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        ACTIVE: 'bg-emerald-100 text-emerald-700',
        DRAFT: 'bg-amber-100 text-amber-700',
        INACTIVE: 'bg-slate-100 text-slate-700',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
            {status}
        </span>
    );
}
