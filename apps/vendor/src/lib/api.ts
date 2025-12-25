const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message || 'Something went wrong' };
        }

        return { data };
    } catch (error) {
        return { error: 'Network error. Please try again.' };
    }
}

export const api = {
    get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        role: string;
        isVerified: boolean;
    };
    accessToken: string;
    refreshToken: string;
}

export interface VendorProfile {
    id: string;
    storeName: string;
    storeSlug: string;
    description?: string;
    logo?: string;
    banner?: string;
    status: string;
    email: string;
    phone?: string;
    storeNameChangedAt?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    parentId?: string;
    image?: string;
}

export interface ProductImage {
    id: string;
    productId: string;
    url: string;
    isPrimary: boolean;
    sortOrder: number;
}

export interface Product {
    id: string;
    vendorId: string;
    categoryId?: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    salePrice?: number;
    stock: number;
    status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
    attributes?: any;
    rating: number;
    reviewCount: number;
    weight?: number;
    createdAt: string;
    updatedAt: string;
    images?: ProductImage[];
    category?: Category;
}
