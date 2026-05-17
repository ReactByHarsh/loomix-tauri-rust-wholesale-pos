import { useEffect, useState, useRef, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Download, Upload, FileDown, Package, Tag, DollarSign, Layers, X, AlertTriangle, CheckCircle, Barcode, TrendingUp } from 'lucide-react';
import type { Product } from '../types';
import { useSettingsStore, getCurrencySymbol } from '../store/useSettingsStore';
import { useBarcodeListener } from '../hooks/useBarcodeListener';

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

export function InventoryPage() {
    const { currency } = useSettingsStore();
    const currencySymbol = getCurrencySymbol(currency);
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(50);
    const [totalProducts, setTotalProducts] = useState(0);

    const [formData, setFormData] = useState<Partial<Product>>({ stock: 0 });

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            // @ts-ignore
            if (!window.api?.getProducts) return;
            // @ts-ignore
            const response = await window.api.getProducts({
                page: currentPage,
                pageSize,
                search,
                category: categoryFilter
            });
            setProducts(response.products);
            setTotalProducts(response.total);
            setTotalPages(Math.ceil(response.total / pageSize));
        } catch (error) { }
        setIsLoading(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchProducts();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, categoryFilter, currentPage]);

    const categories = useMemo(() => ['Apparel', 'Accessories', 'Electronics', 'Footwear'], []);

    const stats = useMemo(() => ({
        totalProducts: totalProducts,
        totalValue: 0,
        lowStock: 0,
        outOfStock: 0
    }), [products, totalProducts]);

    const filtered = products;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // @ts-ignore
            if (!window.api?.addProduct) { alert("API not available"); return; }

            const payload = {
                id: formData.id,
                sku: formData.sku || "",
                name: formData.name || "",
                price: Number(formData.price) || 0,
                cost_price: Number(formData.cost_price) || 0,
                stock: Number(formData.stock) || 0,
                category: formData.category || "Uncategorized",
                created_at: (formData as any).created_at || null
            };

            console.log("Sending payload:", payload);

            // @ts-ignore
            const result = await window.api.addProduct(payload);

            if (result.success) {
                setIsDialogOpen(false);
                setFormData({ stock: 0 });
                fetchProducts();
            } else {
                const errorMsg = result.error || "Unknown error";
                if (errorMsg.includes("UNIQUE constraint failed") || errorMsg.includes("products.sku")) {
                    alert("A product with this SKU already exists. Please use a unique SKU.");
                } else {
                    alert("Error: " + errorMsg);
                }
                console.error("Add Product Error:", result);
            }
        } catch (error: any) {
            console.error(error);
            alert("Error adding product: " + (error.message || JSON.stringify(error)));
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                // @ts-ignore
                if (!window.api?.deleteProduct) return;
                // @ts-ignore
                await window.api.deleteProduct(id);
                fetchProducts();
            } catch (error) { alert("Error deleting product"); }
        }
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            id: product.id, sku: product.sku, name: product.name, price: product.price,
            cost_price: product.cost_price || 0, stock: product.stock, category: product.category
        });
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // @ts-ignore
            if (!window.api?.updateProduct) { alert("API not available"); return; }
            // @ts-ignore
            await window.api.updateProduct({
                id: editingProduct?.id, sku: formData.sku, name: formData.name,
                price: Number(formData.price), cost_price: Number(formData.cost_price) || 0,
                stock: Number(formData.stock), category: formData.category
            });
            setIsDialogOpen(false);
            setIsEditing(false);
            setEditingProduct(null);
            setFormData({ stock: 0 });
            fetchProducts();
        } catch (error) { alert("Error updating product"); }
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setIsEditing(false);
        setEditingProduct(null);
        setFormData({ stock: 0 });
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    useBarcodeListener((code) => {
        if (isDialogOpen) setFormData(prev => ({ ...prev, sku: code }));
    });

    const downloadTemplate = () => {
        const template = 'sku,name,price,cost_price,stock,category\n123456,Example Product,100,60,50,Category';
        const blob = new Blob([template], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'product_import_template.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    const exportProducts = async () => {
        // @ts-ignore
        if (!window.api?.exportProducts) return;
        // @ts-ignore
        const result = await window.api.exportProducts();
        if (result.success) {
            const headers = ['sku', 'name', 'price', 'cost_price', 'stock', 'category'];
            const rows = result.data.map((p: any) => [p.sku, p.name, p.price, p.cost_price || 0, p.stock, p.category || '']);
            const csv = [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `products_${new Date().toISOString().split('T')[0]}.csv`; a.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const text = await file.text();
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',');
        const products = lines.slice(1).map(line => {
            const values = line.split(',');
            return {
                sku: values[headers.indexOf('sku')]?.trim(),
                name: values[headers.indexOf('name')]?.trim(),
                price: parseFloat(values[headers.indexOf('price')] || '0'),
                cost_price: parseFloat(values[headers.indexOf('cost_price')] || '0'),
                stock: parseInt(values[headers.indexOf('stock')] || '0'),
                category: values[headers.indexOf('category')]?.trim() || 'Uncategorized'
            };
        }).filter(p => p.sku && p.name);
        if (products.length === 0) { alert('No valid products found in CSV'); return; }
        // @ts-ignore
        if (!window.api?.importProducts) return;
        // @ts-ignore
        const result = await window.api.importProducts(products);
        if (result.success) { alert(`Successfully imported ${result.imported} products`); fetchProducts(); }
        else { alert('Import failed: ' + (result.error || 'Unknown error')); }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="flex flex-col h-full bg-zinc-100 dark:bg-zinc-900">
            {/* Compact Header */}
            <div className="shrink-0 p-4 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-600 dark:to-zinc-700 rounded-lg">
                            <Package size={18} className="text-zinc-700 dark:text-zinc-300" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Inventory</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage products</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button onClick={downloadTemplate} className="p-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg" title="Template">
                            <FileDown size={16} />
                        </button>
                        <button onClick={exportProducts} className="p-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg" title="Export">
                            <Download size={16} />
                        </button>
                        <label className="p-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg cursor-pointer" title="Import">
                            <Upload size={16} />
                            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
                        </label>
                        <button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-1.5 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 dark:bg-zinc-600 dark:hover:bg-zinc-500 text-white rounded-lg font-medium text-sm">
                            <Plus size={16} /> Add
                        </button>
                    </div>
                </div>

                {/* Compact Stats */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium text-zinc-500 uppercase">Products</span>
                            <Package size={12} className="text-zinc-400" />
                        </div>
                        <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{stats.totalProducts}</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium text-zinc-500 uppercase">Value</span>
                            <DollarSign size={12} className="text-zinc-400" />
                        </div>
                        <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{currencySymbol}{stats.totalValue.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium text-zinc-500 uppercase">Low Stock</span>
                            <AlertTriangle size={12} className={stats.lowStock > 0 ? "text-amber-500" : "text-zinc-400"} />
                        </div>
                        <p className={cn("text-lg font-bold", stats.lowStock > 0 ? "text-amber-600" : "text-zinc-800 dark:text-zinc-100")}>{stats.lowStock}</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium text-zinc-500 uppercase">Out</span>
                            <Package size={12} className={stats.outOfStock > 0 ? "text-red-500" : "text-zinc-400"} />
                        </div>
                        <p className={cn("text-lg font-bold", stats.outOfStock > 0 ? "text-red-600" : "text-zinc-800 dark:text-zinc-100")}>{stats.outOfStock}</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input type="text" placeholder="Search by name or SKU..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm" />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Tag size={14} className="text-zinc-400" />
                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-2 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm">
                            <option value="all">All</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden flex flex-col h-full">
                    {isLoading ? (
                        <div className="p-8 flex flex-col items-center justify-center">
                            <div className="w-8 h-8 border-3 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-400 rounded-full"></div>
                            <p className="mt-3 text-zinc-500 text-sm">Loading...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left">
                                    <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500">Product</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500">SKU</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500">Category</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-right">Price</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-center">Stock</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                                        {filtered.map(product => (
                                            <tr key={product.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-700/30">
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
                                                            <span className="text-xs font-bold text-zinc-400">{product.name.charAt(0)}</span>
                                                        </div>
                                                        <span className="font-medium text-sm text-zinc-800 dark:text-zinc-100">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <Barcode size={12} className="text-zinc-400" />
                                                        <span className="font-mono text-xs text-zinc-500">{product.sku}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 rounded text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                                                        {product.category || 'Uncategorized'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-right font-medium text-sm text-zinc-800 dark:text-zinc-100">{currencySymbol}{product.price.toFixed(2)}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1",
                                                        product.stock === 0 ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                                            : product.stock < 10 ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                                                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                    )}>
                                                        {product.stock === 0 ? <><X size={10} /> Out</>
                                                            : product.stock < 10 ? <><AlertTriangle size={10} /> {product.stock}</>
                                                                : <><CheckCircle size={10} /> {product.stock}</>}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <div className="flex items-center justify-end gap-0.5">
                                                        <button onClick={() => handleEdit(product)} className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded" title="Edit">
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button onClick={() => handleDelete(product.id)} className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" title="Delete">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="p-3 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
                                <p className="text-xs text-zinc-500">{products.length} of {totalProducts} products</p>
                                <div className="flex items-center gap-1.5">
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        className="px-2 py-1 text-xs font-medium rounded border border-zinc-300 dark:border-zinc-600 hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-50">Prev</button>
                                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{currentPage}/{totalPages}</span>
                                    <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        className="px-2 py-1 text-xs font-medium rounded border border-zinc-300 dark:border-zinc-600 hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-50">Next</button>
                                </div>
                            </div>

                            {filtered.length === 0 && (
                                <div className="p-8 text-center">
                                    <Package size={32} className="mx-auto mb-3 text-zinc-300 dark:text-zinc-600" />
                                    <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-1">No products found</h3>
                                    <p className="text-zinc-500 text-xs">{products.length === 0 ? "Add your first product." : "Try adjusting filters."}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal - Compact */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeDialog}>
                    <div className="bg-white dark:bg-zinc-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="relative bg-gradient-to-r from-zinc-700 to-zinc-800 dark:from-zinc-600 dark:to-zinc-700 p-4 text-white">
                            <button onClick={closeDialog} className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full"><X size={16} /></button>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white/20 rounded-lg">{isEditing ? <Edit2 size={16} /> : <Plus size={16} />}</div>
                                <div>
                                    <h2 className="text-base font-bold">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
                                    <p className="text-zinc-300 text-xs">{isEditing ? 'Update details' : 'Enter information'}</p>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="p-4 space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">SKU / Barcode</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Barcode size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input required type="text" className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm"
                                            value={formData.sku || ''} onChange={e => setFormData({ ...formData, sku: e.target.value })} placeholder="Enter SKU" />
                                    </div>
                                    <button type="button" onClick={() => setFormData({ ...formData, sku: Math.floor(10000000 + Math.random() * 90000000).toString() })}
                                        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300" title="Generate Random SKU">
                                        Auto
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Product Name</label>
                                <input required type="text" className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm"
                                    value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter name" />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Price ({currencySymbol})</label>
                                    <div className="relative">
                                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input required type="number" step="0.01" className="w-full pl-9 pr-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm"
                                            value={formData.price || ''} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Cost ({currencySymbol})</label>
                                    <div className="relative">
                                        <TrendingUp size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input type="number" step="0.01" className="w-full pl-9 pr-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm"
                                            value={formData.cost_price || ''} onChange={e => setFormData({ ...formData, cost_price: Number(e.target.value) })} placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Stock</label>
                                    <div className="relative">
                                        <Layers size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input required type="number" className="w-full pl-9 pr-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm"
                                            value={formData.stock || ''} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} placeholder="0" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Category</label>
                                <div className="relative">
                                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input type="text" className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm"
                                        value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Category (optional)" />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-1">
                                <button type="button" onClick={closeDialog} className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 font-medium text-sm">Cancel</button>
                                <button type="submit" className="flex-1 px-3 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 dark:bg-zinc-600 dark:hover:bg-zinc-500 text-white font-medium text-sm">{isEditing ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
