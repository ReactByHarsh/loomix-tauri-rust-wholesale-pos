import { create } from 'zustand';

export interface Product {
    id: number;
    sku: string;
    name: string;
    price: number;
    cost_price?: number;
    stock: number;
    category?: string;
    image?: string;
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;

    // Computed (helper)
    getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    cart: [],

    addToCart: (product) => set((state) => {
        const existingItem = state.cart.find(item => item.id === product.id);
        if (existingItem) {
            return {
                cart: state.cart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
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

    getTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}));
