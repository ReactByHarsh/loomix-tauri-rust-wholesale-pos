import * as Dialog from '@radix-ui/react-dialog';
import { X, Calendar, AlertTriangle, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { type Product } from '../store/useCartStore';

interface Batch {
    id: string;
    batchNumber: string;
    expiry: string; // YYYY-MM-DD
    stock: number;
}

// Mock function to generate batches (In real app, this comes from DB)
const getMockBatches = (product: Product): Batch[] => {
    return [
        { id: 'b1', batchNumber: 'BAT-001', expiry: '2026-05-15', stock: Math.floor(product.stock * 0.6) },
        { id: 'b2', batchNumber: 'BAT-002', expiry: '2026-02-10', stock: Math.floor(product.stock * 0.4) }, // Near expiry
    ];
};

interface BatchSelectorProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onSelect: (product: Product, batch: Batch) => void;
}

export function BatchSelector({ product, isOpen, onClose, onSelect }: BatchSelectorProps) {
    if (!product) return null;

    const batches = getMockBatches(product);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    const isNearExpiry = (dateStr: string) => {
        const expiry = new Date(dateStr);
        return expiry < threeMonthsFromNow;
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-2xl">

                    <div className="flex items-center justify-between mb-5">
                        <Dialog.Title className="text-xl font-bold text-slate-900">
                            Select Batch
                        </Dialog.Title>
                        <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:bg-slate-100 rounded-full">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl mb-6 flex items-start gap-4 border border-slate-100">
                        <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center font-bold text-lg text-teal-600 shadow-sm">
                            {product.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">{product.name}</h3>
                            <p className="text-sm text-slate-500">Generic Name • 500mg</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            <span>Batch Details</span>
                            <span>Availability</span>
                        </div>

                        {batches.map((batch) => {
                            const expiring = isNearExpiry(batch.expiry);
                            return (
                                <button
                                    key={batch.id}
                                    onClick={() => onSelect(product, batch)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-xl border text-left group",
                                        expiring
                                            ? "bg-rose-50 border-rose-200 hover:border-rose-300"
                                            : "bg-white border-slate-200 hover:border-teal-500 hover:shadow-md hover:shadow-teal-500/10"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                            expiring ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-600"
                                        )}>
                                            {expiring ? <AlertTriangle size={18} /> : <Check size={18} />}
                                        </div>
                                        <div>
                                            <p className={cn("font-mono font-bold text-sm", expiring ? "text-rose-700" : "text-slate-900")}>
                                                {batch.batchNumber}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Calendar size={12} className={expiring ? "text-rose-400" : "text-slate-400"} />
                                                <span className={cn("text-xs font-medium", expiring ? "text-rose-600" : "text-slate-500")}>
                                                    Exp: {batch.expiry}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={cn(
                                            "px-2.5 py-1 rounded text-xs font-bold uppercase",
                                            expiring ? "bg-white/50 text-rose-700" : "bg-slate-100 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-700"
                                        )}>
                                            {batch.stock} Left
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <Dialog.Description className="sr-only">
                        Select a batch to add {product.name} to the cart.
                    </Dialog.Description>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
