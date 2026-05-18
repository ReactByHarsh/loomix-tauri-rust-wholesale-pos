import type { BillingMode } from '../lib/pricing';

export interface Product {
    id: number;
    sku: string;
    name: string;
    price: number;
    wholesale_price?: number;
    stock: number;
    category: string;
    cost_price?: number;
    created_at?: string;
}

export interface CartItem extends Product {
    quantity: number;
    unit_price: number;
    pricing_mode: BillingMode;
}

export interface TransactionItem {
    product_id: number;
    quantity: number;
    price_at_sale: number;
}
export interface TransactionPayload {
    total_amount: number;
    payment_method: 'CASH' | 'UPI' | 'CARD';
    billing_mode?: BillingMode;
    items: { product_id: number; quantity: number; price_at_sale: number }[];
}

export interface DashboardStats {
    today_sales: number;
    total_sales: number;
    today_profit: number;
    total_profit: number;
    low_stock_items: number;
    total_transactions: number;
}
export interface DashboardData {
    stats: DashboardStats;
    chart: { date: string; total: number }[];
}
