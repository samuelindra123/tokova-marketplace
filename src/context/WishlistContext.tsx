'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, WishlistItem } from '@/lib/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    wishlistCount: number;
    wishlistProductIds: Set<string>;
    loading: boolean;
    refreshWishlist: () => Promise<void>;
    addToWishlist: (productId: string) => Promise<boolean>;
    removeFromWishlist: (wishlistItemId: string) => Promise<boolean>;
    removeByProductId: (productId: string) => Promise<boolean>;
    isInWishlist: (productId: string) => boolean;
    getWishlistItemByProductId: (productId: string) => WishlistItem | undefined;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Create a Set of product IDs for quick lookup
    // Fallback to product.id if productId is not available
    const wishlistProductIds = new Set(
        wishlistItems.map(item => item.productId || item.product?.id).filter(Boolean)
    );

    const refreshWishlist = useCallback(async () => {
        if (!user) {
            setWishlistItems([]);
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.get<WishlistItem[] | { items: WishlistItem[] }>('/customer/wishlist');
            if (data) {
                const items = Array.isArray(data) ? data : (data as any).items || [];
                setWishlistItems(items);
            }
        } catch (err) {
            console.error('Failed to fetch wishlist:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Refresh wishlist when user changes
    useEffect(() => {
        refreshWishlist();
    }, [refreshWishlist]);

    const addToWishlist = async (productId: string): Promise<boolean> => {
        try {
            const { error } = await api.post('/customer/wishlist', { productId });
            if (error) {
                console.error('Add to wishlist error:', error);
                return false;
            }
            await refreshWishlist();
            return true;
        } catch (err) {
            console.error('Failed to add to wishlist:', err);
            return false;
        }
    };

    const removeFromWishlist = async (wishlistItemId: string): Promise<boolean> => {
        try {
            const { error } = await api.delete(`/customer/wishlist/${wishlistItemId}`);
            if (error) {
                console.error('Remove from wishlist error:', error);
                return false;
            }
            await refreshWishlist();
            return true;
        } catch (err) {
            console.error('Failed to remove from wishlist:', err);
            return false;
        }
    };

    const removeByProductId = async (productId: string): Promise<boolean> => {
        const item = wishlistItems.find(i =>
            i.productId === productId || i.product?.id === productId
        );
        if (item) {
            return removeFromWishlist(item.id);
        }
        return false;
    };

    const isInWishlist = (productId: string): boolean => {
        return wishlistProductIds.has(productId);
    };

    const getWishlistItemByProductId = (productId: string): WishlistItem | undefined => {
        return wishlistItems.find(item => item.productId === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                wishlistCount: wishlistItems.length,
                wishlistProductIds,
                loading,
                refreshWishlist,
                addToWishlist,
                removeFromWishlist,
                removeByProductId,
                isInWishlist,
                getWishlistItemByProductId,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
