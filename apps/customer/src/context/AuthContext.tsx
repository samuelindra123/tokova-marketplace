'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User, Customer } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    customer: Customer | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean }>;
    register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    clearError: () => void;
}

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

interface ProfileResponse extends User {
    customer?: Customer;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await api.get<ProfileResponse>('/auth/profile');
            if (data && data.role === 'CUSTOMER') {
                setUser({
                    id: data.id,
                    email: data.email,
                    role: data.role,
                    isVerified: data.isVerified,
                });
                if (data.customer) {
                    setCustomer(data.customer);
                }
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
        } catch (err) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setError(null);
        try {
            const { data, error: apiError } = await api.post<AuthResponse>('/auth/login', {
                email,
                password,
            });

            if (apiError) {
                setError(apiError);
                return { success: false };
            }

            if (data) {
                if (data.user.role !== 'CUSTOMER') {
                    setError('Account ini bukan akun customer');
                    return { success: false };
                }

                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                setUser(data.user);
                await checkAuth();
                return { success: true };
            }

            return { success: false };
        } catch (err) {
            setError('An error occurred');
            return { success: false };
        }
    };

    const register = async (registerData: RegisterData) => {
        setError(null);
        try {
            const { data, error: apiError } = await api.post<{ message: string }>('/auth/register/customer', registerData);

            if (apiError) {
                setError(apiError);
                return { success: false };
            }

            return { success: true, message: data?.message };
        } catch (err) {
            setError('An error occurred');
            return { success: false };
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setCustomer(null);
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{ user, customer, loading, error, login, register, logout, clearError }}>
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
