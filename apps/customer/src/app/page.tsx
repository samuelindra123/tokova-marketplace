'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Product, Category } from '@/lib/api';
import { ProductGrid } from '@/components/ProductCard';
import { TokovaLogo } from '@/components/TokovaLogo';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get<{ data: Product[]; total?: number }>('/products?limit=10'),
        api.get<Category[]>('/products/categories'),
      ]);

      if (productsRes.data) {
        // Backend returns { data: [...products...] }
        setProducts(productsRes.data.data || []);
      }
      if (categoriesRes.data) {
        // Backend returns array directly
        setCategories(categoriesRes.data.slice(0, 8));
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Shopping Mudah, Price Murah
              </h1>
              <p className="text-lg sm:text-xl text-orange-100 mb-6">
                Temukan ribuan produk berkualitas of seller terpercaya
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-white text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
              >
                Mulai Shopping
              </Link>
            </div>
            <div className="flex-shrink-0">
              <TokovaLogo className="w-32 h-32 sm:w-40 sm:h-40 opacity-90" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Category</h2>
            <Link href="/categories" className="text-sm text-orange-500 hover:underline font-medium">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square rounded-xl bg-slate-200"></div>
                  <div className="h-4 bg-slate-200 rounded mt-2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?categoryId=${category.id}`}
                  className="group text-center"
                >
                  <div className="aspect-square rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden group-hover:ring-2 ring-orange-500 transition-all">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    )}
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-slate-700 font-medium line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {category.name}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">New Products</h2>
            <Link href="/products" className="text-sm text-orange-500 hover:underline font-medium">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square rounded-xl bg-slate-200"></div>
                  <div className="h-4 bg-slate-200 rounded mt-3"></div>
                  <div className="h-4 bg-slate-200 rounded mt-2 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>Belum ada produk tersedia</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Product Berkualitas</h3>
              <p className="text-sm text-slate-600">Semua produk of seller terverifikasi</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Price Terbaik</h3>
              <p className="text-sm text-slate-600">Dapatkan penawaran harga terbaik</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Transaksi Aman</h3>
              <p className="text-sm text-slate-600">Payment dijamin aman & terlindungi</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
