'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, AuthResponse, VendorProfilee } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    vendor: VendorProfilee | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; vendorStatus?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    clearError: () => void;
}

interface RegisterData {
    email: string;
    password: string;
    storeName: string;
    phone: string;
    description?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [vendor, setVendor] = useState<VendorProfilee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setLoading(false);
            return;
        }

        const { data, error } = await api.get<User>('/auth/me');
        if (data && data.role === 'VENDOR') {
            setUser(data);
            await fetchVendorProfilee();
        } else if (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
        setLoading(false);
    };

    const fetchVendorProfilee = async () => {
        const { data } = await api.get<VendorProfilee>('/vendor/store');
        if (data) {
            setVendor(data);
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; vendorStatus?: string }> => {
        setError(null);
        const { data, error } = await api.post<AuthResponse>('/auth/login', { email, password });

        if (error) {
            setError(error);
            return { success: false };
        }

        if (data) {
            if (data.user.role !== 'VENDOR') {
                setError('This portal is only for vendors. Please use the customer or admin portal.');
                return { success: false };
            }

            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            setUser(data.user);

            // Fetch vendor profile to get status
            const { data: vendorData } = await api.get<VendorProfilee>('/vendor/store');
            if (vendorData) {
                setVendor(vendorData);
                return { success: true, vendorStatus: vendorData.status };
            }

            return { success: true };
        }

        return { success: false };
    };

    const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
        setError(null);
        const { data: response, error } = await api.post<{ message: string }>('/auth/register/vendor', data);

        if (error) {
            setError(error);
            return { success: false, message: error };
        }

        return { success: true, message: response?.message };
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setVendor(null);
        router.push('/login');
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{ user, vendor, loading, error, login, register, logout, clearError }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
