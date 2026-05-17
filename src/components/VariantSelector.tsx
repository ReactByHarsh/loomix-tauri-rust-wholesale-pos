import * as Dialog from '@radix-ui/react-dialog';
import { X, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { type Product } from '../store/useCartStore';
import { useState, useEffect } from 'react';

// Mock Variants
const COLORS = [
    { name: "Black", hex: "#18181b" },
    { name: "White", hex: "#ffffff" },
    { name: "Navy", hex: "#1e3a8a" },
    { name: "Beige", hex: "#e5e5e5" },
];

const SIZES = ["XS", "S", "M", "L", "XL"];

interface VariantSelectorProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (product: Product, variant: { color: string; size: string }) => void;
}

export function VariantSelector({ product, isOpen, onClose, onAddToCart }: VariantSelectorProps) {
    const [selectedColor, setSelectedColor] = useState<string>(COLORS[0].name);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    // Reset state when product changes
    useEffect(() => {
        if (isOpen) {
            setSelectedColor(COLORS[0].name);
            setSelectedSize(null);
        }
    }, [isOpen, product]);

    if (!product) return null;

    const handleAdd = () => {
        if (selectedColor && selectedSize) {
            onAddToCart(product, { color: selectedColor, size: selectedSize });
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-zinc-900/40 z-50" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-white shadow-2xl outline-none p-0">

                    <div className="relative flex">
                        {/* Left: Product Preview (Image) */}
                        <div className="w-1/3 bg-zinc-50 border-r border-zinc-100 p-6 flex items-center justify-center">
                            <div className="aspect-[3/4] w-full bg-zinc-200 rounded-sm overflow-hidden relative">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-2xl">
                                        {product.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Controls */}
                        <div className="flex-1 p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{product.name}</h2>
                                    <p className="text-sm text-zinc-500 mt-1">Select Size & Color</p>
                                </div>
                                <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 hover:bg-zinc-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Color Row */}
                            <div className="mb-6">
                                <label className="text-xs font-semibold text-zinc-900 uppercase tracking-widest mb-3 block">Color</label>
                                <div className="flex gap-3">
                                    {COLORS.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={cn(
                                                "w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center ring-offset-2",
                                                selectedColor === color.name ? "ring-2 ring-zinc-900" : ""
                                            )}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        >
                                            {selectedColor === color.name && color.name === 'White' && <Check size={14} className="text-black" />}
                                            {selectedColor === color.name && color.name !== 'White' && <Check size={14} className="text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Row */}
                            <div className="mb-8">
                                <label className="text-xs font-semibold text-zinc-900 uppercase tracking-widest mb-3 block">Size</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {SIZES.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "h-10 w-full rounded-sm border text-sm font-medium",
                                                selectedSize === size
                                                    ? "bg-zinc-900 text-white border-zinc-900"
                                                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={handleAdd}
                                disabled={!selectedSize}
                                className="w-full h-12 bg-zinc-900 text-white font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black rounded-sm"
                            >
                                {selectedSize ? `Add ${selectedColor} - ${selectedSize} to Bag` : "Select a Size"}
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
