import { Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { type Product } from '../store/useCartStore';

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock < 5 && product.stock > 0;

    return (
        <button
            onClick={onClick}
            disabled={isOutOfStock}
            className="group block text-left w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {/* Image Container (Portrait Ratio 3:4) */}
            <div className="relative w-full aspect-[3/4] bg-zinc-100 rounded-sm overflow-hidden mb-3">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300 bg-zinc-50">
                        <span className="text-xs uppercase tracking-widest font-semibold">{product.name.substring(0, 2)}</span>
                    </div>
                )}

                {/* Stock Dot Badge (Minimalist) */}
                <div className={cn(
                    "absolute top-3 right-3 w-2.5 h-2.5 rounded-full shadow-sm ring-2 ring-white",
                    isOutOfStock ? "bg-zinc-300" : isLowStock ? "bg-orange-500" : "bg-emerald-500"
                )} />

                {/* Hover Add Overlay (Subtle) */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0">
                        <Plus size={20} className="text-zinc-900" />
                    </div>
                </div>
            </div>

            {/* Content (Minimal Typography) */}
            <div className="space-y-1">
                <h3 className="font-semibold text-sm text-zinc-900 tracking-tight leading-snug group-hover:underline decoration-zinc-300 underline-offset-4 decoration-1">
                    {product.name}
                </h3>
                <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500 truncate max-w-[70%]">
                        Classic Fit • Cotton
                    </p>
                    <span className="text-sm font-medium text-zinc-900 tracking-tight">
                        ${product.price}
                    </span>
                </div>
            </div>
        </button>
    );
}
