const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

type ApiResponse<T> = { data: T; error?: never } | { data?: never; error: string };

async function getAccessToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = await getAccessToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message || 'Something went wrong' };
        }

        return { data };
    } catch (error) {
        return { error: 'Network error' };
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

// Types based on database schema
export interface User {
    id: string;
    email: string;
    role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
    isVerified: boolean;
}

export interface Customer {
    id: string;
    userId: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    avatar: string | null;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    parentId: string | null;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: string;
    salePrice: string | null;
    stock: number;
    status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
    rating: string;
    reviewCount: number;
    images: ProductImage[];
    category?: Category;
    vendor?: {
        id: string;
        storeName: string;
        storeSlug: string;
        logo: string | null;
    };
}

export interface ProductImage {
    id: string;
    url: string;
    isPrimary: boolean;
    sortOrder: number;
}

export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    product: Product;
}

export interface Address {
    id: string;
    label: string;
    recipientName: string;
    phone: string;
    addressLine: string;
    city: string;
    province: string;
    postalCode: string;
    isDefault: boolean;
}

export interface Order {
    id: string;
    orderNumber: string;
    subtotal: string;
    shippingCost: string;
    discount: string;
    total: string;
    status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
    shippingAddress: Address;
    createdAt: string;
    items: OrderItem[];
}

export interface OrderItem {
    id: string;
    productName: string;
    productImage: string | null;
    price: string;
    quantity: number;
    subtotal: string;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    trackingNumber: string | null;
}

export interface WishlistItem {
    id: string;
    productId: string;
    product: Product;
}

export interface Store {
    id: string;
    storeName: string;
    storeSlug: string;
    description: string | null;
    logo: string | null;
    banner: string | null;
}
