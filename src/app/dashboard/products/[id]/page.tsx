'use client';

import { useEffect, useState, FormEvent, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api, Category, Product, ProductImage } from '@/lib/api';
import { TokovaLogo } from '@/components/TokovaLogo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function EditProductPage() {
    const { user, vendor, loading, logout } = useAuth();
    const router = useRouter();
    const params = useParams();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mounted, setMounted] = useState(false);

    // State
    const [dataLoading, setDataLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [product, setProduct] = useState<Product | null>(null);

    // Form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('0');
    const [weight, setWeight] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [status, setStatus] = useState<'DRAFT' | 'ACTIVE' | 'INACTIVE'>('ACTIVE');
    const [existingImages, setExistingImages] = useState<ProductImage[]>([]);

    // Upload state
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchCategories();
    }, []);

    useEffect(() => {
        if (mounted && !loading) {
            console.log('EditPage Check:', { user: !!user, vendorStatus: vendor?.status, params });
            if (!user) {
                router.push('/login');
            } else if (vendor && vendor.status !== 'APPROVED') {
                router.push('/pending-approval');
            } else if (params.id) {
                fetchProduct(params.id as string);
            }
        }
    }, [mounted, loading, user, vendor, router, params.id]);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get<Category[]>('/vendor/categories');
            if (data) setCategories(data);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    const fetchProduct = async (id: string) => {
        try {
            setDataLoading(true);
            const { data, error } = await api.get<Product>(`/vendor/products/${id}`);

            if (error) {
                setError(error);
                console.error('API Error:', error);
                return;
            }

            if (data) {
                console.log('Product data fetched:', data);
                setProduct(data);
                setName(data.name);
                setDescription(data.description || '');
                setPrice(data.price.toString());
                setStock(data.stock.toString());
                setWeight(data.weight?.toString() || '');
                setCategoryId(data.categoryId || '');
                setStatus(data.status);
                setExistingImages(data.images?.sort((a, b) => a.sortOrder - b.sortOrder) || []);
            }
        } catch (err) {
            setError('Failed to load product data');
            console.error(err);
        } finally {
            setDataLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0 || !params.id) return;

        setUploading(true);
        setError('');

        try {
            const token = localStorage.getItem('accessToken');
            const uploadedUrls: string[] = [];

            // 1. Upload to Appwrite bucket
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.size > 5 * 1024 * 1024) continue;
                if (!file.type.startsWith('image/')) continue;

                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch(`${API_URL}/upload/image?folder=products`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                });

                const data = await response.json();
                if (data.url) uploadedUrls.push(data.url);
            }

            // 2. Add via Product API
            if (uploadedUrls.length > 0) {
                await api.post(`/vendor/products/${params.id}/images`, { images: uploadedUrls });
                // Refresh product data to show new images properly
                await fetchProduct(params.id as string);
            }
        } catch (err) {
            setError('Failed mengupload gambar');
            console.error(err);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeleteImage = async (prodId: string, imageId: string) => {
        if (!confirm('Are your sure your want to delete this image?')) return;
        try {
            await api.delete(`/vendor/products/${prodId}/images/${imageId}`);
            // Optimistic update
            setExistingImages(prev => prev.filter(img => img.id !== imageId));
        } catch (err) {
            setError('Failed menghapus gambar');
            console.error(err);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!name || !price || !stock) {
            setError('Please complete required fields (Nama, Price, Stock)');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const payload = {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                weight: weight ? parseFloat(weight) : undefined,
                categoryId: categoryId || undefined,
                status,
            };

            const { data, error: apiError } = await api.put<Product>(`/vendor/products/${params.id}`, payload);

            if (apiError) {
                setError(apiError);
            } else if (data) {
                router.push('/dashboard/products');
            }
        } catch (err) {
            setError('An error occurred while saving the product');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (!mounted || loading || dataLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header matches ProductsPage */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-2">
                                <TokovaLogo className="w-8 h-8" />
                                <span className="text-xl font-bold text-slate-900">Tokova</span>
                            </Link>
                            <nav className="hidden md:flex items-center gap-4">
                                <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
                                    Dashboard
                                </Link>
                                <Link href="/dashboard/products" className="text-sm font-medium text-orange-500 px-3 py-2">
                                    Products
                                </Link>
                                <Link href="/dashboard/orders" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
                                    Orders
                                </Link>
                                <Link href="/dashboard/settings" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
                                    Settings
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">
                                    {vendor?.storeName || 'Store you'}
                                </p>
                            </div>
                            <Link href="/dashboard/profile" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
                                Profilee
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Link href="/dashboard/products" className="text-sm text-slate-500 hover:text-slate-900 mb-2 inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Register Products
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Products</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Information Dasar</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Nama Products <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Contoh: Sepatu Sneakers Pria"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    placeholder="Jelaskan detail your product..."
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Price & Stock */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Price & Stock</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Price ($) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    placeholder="0"
                                    min="0"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Berat (gram)
                                </label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="0"
                                    min="0"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'ACTIVE' | 'INACTIVE')}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                                >
                                    <option value="ACTIVE">Active (Dijual)</option>
                                    <option value="DRAFT">Draft (Disimpan)</option>
                                    <option value="INACTIVE">Non-Active (Disembunyikan)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Foto Products</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {existingImages.map((img) => (
                                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                    <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                                    {img.isPrimary && (
                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-orange-500 text-white text-[10px] uppercase font-bold rounded shadow-sm">
                                            Utama
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(params.id as string, img.id)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            <label className={`relative aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-orange-500 hover:bg-orange-50 transition-colors flex flex-col items-center justify-center cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {uploading ? (
                                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="text-xs text-slate-500 font-medium">Add Foto</span>
                                    </>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">
                            Format: JPEG, PNG, GIF. Maximum 5MB per file. First uploaded photo will be the main image if none exists.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Link
                            href="/dashboard/products"
                            className="px-6 py-3 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving || uploading}
                            className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Menyimpan...
                                </>
                            ) : (
                                'Save Perubahan'
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
