'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, CartItem } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    loading: boolean;
    refreshCart: () => Promise<void>;
    addToCart: (productId: string, quantity?: number) => Promise<boolean>;
    updateQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
    removeFromCart: (cartItemId: string) => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    const refreshCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.get<CartItem[] | { items: CartItem[] }>('/customer/cart');
            if (data) {
                const items = Array.isArray(data) ? data : (data as any).items || [];
                setCartItems(items);
            }
        } catch (err) {
            console.error('Failed to fetch cart:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Refresh cart when user changes
    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addToCart = async (productId: string, quantity: number = 1): Promise<boolean> => {
        try {
            const { error } = await api.post('/customer/cart', { productId, quantity });
            if (error) {
                console.error('Add to cart error:', error);
                return false;
            }
            await refreshCart();
            return true;
        } catch (err) {
            console.error('Failed to add to cart:', err);
            return false;
        }
    };

    const updateQuantity = async (cartItemId: string, quantity: number): Promise<boolean> => {
        try {
            const { error } = await api.put(`/customer/cart/${cartItemId}`, { quantity });
            if (error) {
                console.error('Update cart error:', error);
                return false;
            }
            await refreshCart();
            return true;
        } catch (err) {
            console.error('Failed to update cart:', err);
            return false;
        }
    };

    const removeFromCart = async (cartItemId: string): Promise<boolean> => {
        try {
            const { error } = await api.delete(`/customer/cart/${cartItemId}`);
            if (error) {
                console.error('Remove from cart error:', error);
                return false;
            }
            await refreshCart();
            return true;
        } catch (err) {
            console.error('Failed to remove from cart:', err);
            return false;
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount: cartItems.length,
                loading,
                refreshCart,
                addToCart,
                updateQuantity,
                removeFromCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
