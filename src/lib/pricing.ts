export type BillingMode = 'retail' | 'wholesale';

export interface PricedProduct {
    price: number;
    wholesale_price?: number | null;
}

export function hasWholesalePrice(product: PricedProduct) {
    return typeof product.wholesale_price === 'number' && product.wholesale_price > 0;
}

export function resolveProductPrice(product: PricedProduct, billingMode: BillingMode) {
    if (billingMode === 'wholesale' && hasWholesalePrice(product)) {
        return product.wholesale_price as number;
    }

    return product.price;
}
