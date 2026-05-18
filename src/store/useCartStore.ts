import { create } from 'zustand';
import type { BillingMode } from '../lib/pricing';
import { resolveProductPrice } from '../lib/pricing';

export interface Product {
    id: number;
    sku: string;
    name: string;
    price: number;
    wholesale_price?: number;
    cost_price?: number;
    stock: number;
    category?: string;
    image?: string;
}

export interface CartItem extends Product {
    quantity: number;
    unit_price: number;
    pricing_mode: BillingMode;
}

interface CartState {
    cart: CartItem[];
    billingMode: BillingMode;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    setBillingMode: (mode: BillingMode) => void;

    // Computed (helper)
    getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    cart: [],
    billingMode: 'retail',

    addToCart: (product) => set((state) => {
        const unitPrice = resolveProductPrice(product, state.billingMode);
        const existingItem = state.cart.find(item => item.id === product.id);
        if (existingItem) {
            return {
                cart: state.cart.map(item =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                            price: product.price,
                            wholesale_price: product.wholesale_price,
                            unit_price: unitPrice,
                            pricing_mode: state.billingMode,
                        }
                        : item
                )
            };
        }
        return {
            cart: [...state.cart, {
                ...product,
                quantity: 1,
                unit_price: unitPrice,
                pricing_mode: state.billingMode,
            }]
        };
    }),

    removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(item => item.id !== id)
    })),

    updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
            return { cart: state.cart.filter(item => item.id !== id) };
        }
        return {
            cart: state.cart.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        };
    }),

    clearCart: () => set({ cart: [] }),

    setBillingMode: (billingMode) => set((state) => ({
        billingMode,
        cart: state.cart.map((item) => ({
            ...item,
            unit_price: resolveProductPrice(item, billingMode),
            pricing_mode: billingMode,
        })),
    })),

    getTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
    }
}));
