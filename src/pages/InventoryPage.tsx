import { useEffect, useState, useRef, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Download, Upload, FileDown, Package, Tag, DollarSign, Layers, X, AlertTriangle, CheckCircle, Barcode, TrendingUp, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { useSettingsStore, getCurrencySymbol } from '../store/useSettingsStore';
import { useBarcodeListener } from '../hooks/useBarcodeListener';
import { useI18n } from '../i18n';

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

export function InventoryPage() {
    const { currency } = useSettingsStore();
    const { t } = useI18n();
    const currencySymbol = getCurrencySymbol(currency);
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const navigate = useNavigate();

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
        } catch (error) {
            console.error('Failed to load products', error);
            setProducts([]);
            setTotalProducts(0);
            setTotalPages(1);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [search, categoryFilter]);

    useEffect(() => {
        void fetchProducts();
    }, [currentPage, search, categoryFilter]);

    const categories = useMemo(() => ['Apparel', 'Accessories', 'Electronics', 'Footwear'], []);

    const stats = useMemo(() => ({
        totalProducts: totalProducts,
        totalValue: products.reduce((sum, product) => sum + (product.price * product.stock), 0),
        lowStock: products.filter((product) => product.stock > 0 && product.stock < 10).length,
        outOfStock: products.filter((product) => product.stock === 0).length
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
                wholesale_price: Number(formData.wholesale_price) || 0,
                cost_price: Number(formData.cost_price) || 0,
                stock: Number(formData.stock) || 0,
                category: formData.category || "Uncategorized",
                created_at: (formData as any).created_at || null
            };

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

    const handleBarcodeRedirect = (product: Product) => {
        navigate('/barcode', { state: { product } });
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            id: product.id, sku: product.sku, name: product.name, price: product.price,
            wholesale_price: product.wholesale_price || 0, cost_price: product.cost_price || 0, stock: product.stock, category: product.category
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
                price: Number(formData.price), wholesale_price: Number(formData.wholesale_price) || 0, cost_price: Number(formData.cost_price) || 0,
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
        const template = 'sku,name,price,wholesale_price,cost_price,stock,category\n123456,Example Product,100,90,60,50,Category';
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
            const headers = ['sku', 'name', 'price', 'wholesale_price', 'cost_price', 'stock', 'category'];
            const rows = result.data.map((p: any) => [p.sku, p.name, p.price, p.wholesale_price || 0, p.cost_price || 0, p.stock, p.category || '']);
            const csv = [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `products_${new Date().toISOString().split('T')[0]}.csv`; a.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleImportFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImportFile(e.target.files[0]);
        }
    };

    const executeImport = async () => {
        if (!importFile) return;
        setIsImporting(true);
        try {
            const text = await importFile.text();
            const lines = text.trim().split('\n');
            const headers = lines[0].split(',');
            const products = lines.slice(1).map(line => {
                const values = line.split(',');
                return {
                    sku: values[headers.indexOf('sku')]?.trim(),
                    name: values[headers.indexOf('name')]?.trim(),
                    price: parseFloat(values[headers.indexOf('price')] || '0'),
                    wholesale_price: parseFloat(values[headers.indexOf('wholesale_price')] || '0'),
                    cost_price: parseFloat(values[headers.indexOf('cost_price')] || '0'),
                    stock: parseInt(values[headers.indexOf('stock')] || '0'),
                    category: values[headers.indexOf('category')]?.trim() || 'Uncategorized'
                };
            }).filter(p => p.sku && p.name);
            if (products.length === 0) { alert('No valid products found in CSV'); setIsImporting(false); return; }
            // @ts-ignore
            if (!window.api?.importProducts) { setIsImporting(false); return; }
            // @ts-ignore
            const result = await window.api.importProducts(products);
            if (result.success) { alert(`Successfully imported ${result.imported} products`); fetchProducts(); setIsImportModalOpen(false); setImportFile(null); }
            else { alert('Import failed: ' + (result.error || 'Unknown error')); }
        } catch (err) {
            alert('Failed to parse file.');
        } finally {
            setIsImporting(false);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="flex h-full flex-col overscroll-contain bg-zinc-100 dark:bg-zinc-900">
            {/* Compact Header */}
            <div className="sticky top-0 z-20 shrink-0 border-b border-zinc-200 bg-white/95 p-4 backdrop-blur dark:border-zinc-700 dark:bg-zinc-800/95">
                <div className="mx-auto w-full max-w-[1900px]">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-slate-950 p-2 text-white shadow-sm dark:bg-white dark:text-zinc-950">
                            <Package size={18} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{t('inventory.title')}</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('inventory.subtitle')}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button onClick={downloadTemplate} className="flex items-center gap-1.5 p-2 px-3 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors rounded-lg font-medium text-xs border border-zinc-200 dark:border-zinc-700" title={t('inventory.template')}>
                            <FileDown size={14} /> {t('inventory.template')}
                        </button>
                        <button onClick={exportProducts} className="flex items-center gap-1.5 p-2 px-3 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors rounded-lg font-medium text-xs border border-zinc-200 dark:border-zinc-700" title={t('common.export')}>
                            <Download size={14} /> {t('common.export')}
                        </button>
                        <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-1.5 p-2 px-3 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors rounded-lg font-medium text-xs border border-zinc-200 dark:border-zinc-700" title={t('common.import')}>
                            <Upload size={14} /> {t('common.import')}
                        </button>
                        <button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg font-medium text-sm transition-colors shadow-sm ml-2">
                            <Plus size={16} /> {t('common.add')}
                        </button>
                    </div>
                </div>

                {/* Premium Stats */}
                <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('inventory.products')}</span>
                            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
                                <Package size={14} className="text-indigo-500 dark:text-indigo-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{stats.totalProducts}</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('inventory.value')}</span>
                            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
                                <DollarSign size={14} className="text-indigo-500 dark:text-indigo-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{currencySymbol}{stats.totalValue.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('inventory.lowStock')}</span>
                            <div className={cn("p-1.5 rounded-md", stats.lowStock > 0 ? "bg-amber-50 dark:bg-amber-900/30" : "bg-zinc-50 dark:bg-zinc-700")}>
                                <AlertTriangle size={14} className={stats.lowStock > 0 ? "text-amber-500 dark:text-amber-400" : "text-zinc-400"} />
                            </div>
                        </div>
                        <p className={cn("text-2xl font-black", stats.lowStock > 0 ? "text-amber-600 dark:text-amber-400" : "text-zinc-800 dark:text-zinc-100")}>{stats.lowStock}</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('inventory.out')}</span>
                            <div className={cn("p-1.5 rounded-md", stats.outOfStock > 0 ? "bg-red-50 dark:bg-red-900/30" : "bg-zinc-50 dark:bg-zinc-700")}>
                                <Package size={14} className={stats.outOfStock > 0 ? "text-red-500 dark:text-red-400" : "text-zinc-400"} />
                            </div>
                        </div>
                        <p className={cn("text-2xl font-black", stats.outOfStock > 0 ? "text-red-600 dark:text-red-400" : "text-zinc-800 dark:text-zinc-100")}>{stats.outOfStock}</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-wrap gap-2">
                    <div className="relative min-w-[260px] flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input type="text" placeholder={t('inventory.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm" />
                    </div>
                    <div className="flex min-w-[170px] items-center gap-1.5">
                        <Tag size={14} className="text-zinc-400" />
                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-2 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm">
                            <option value="all">{t('common.all')}</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto flex h-full w-full max-w-[1900px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                    {isLoading ? (
                            <div className="p-8 flex flex-col items-center justify-center">
                                <div className="w-8 h-8 border-3 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-400 rounded-full"></div>
                                <p className="mt-3 text-zinc-500 text-sm">{t('inventory.loading')}</p>
                            </div>
                        ) : (
                        <>
                            <div className="flex-1 overflow-x-auto">
                                <table className="min-w-[1080px] w-full text-left 2xl:min-w-[1240px]">
                                    <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500">{t('inventory.product')}</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500">{t('inventory.sku')}</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500">{t('inventory.category')}</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-right">{t('inventory.retailPrice')}</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-right">{t('inventory.wholesalePrice')}</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-center">{t('common.stock')}</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-right">{t('inventory.actions')}</th>
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
                                                <td className="px-4 py-2 text-right text-sm text-zinc-600 dark:text-zinc-300">
                                                    {product.wholesale_price && product.wholesale_price > 0 ? `${currencySymbol}${product.wholesale_price.toFixed(2)}` : '—'}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1",
                                                        product.stock === 0 ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                                            : product.stock < 10 ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                                                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                    )}>
                                                        {product.stock === 0 ? <><X size={10} /> {t('inventory.stockStatus.out')}</>
                                                            : product.stock < 10 ? <><AlertTriangle size={10} /> {product.stock}</>
                                                                : <><CheckCircle size={10} /> {product.stock}</>}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button onClick={() => handleBarcodeRedirect(product)} className="flex items-center justify-center w-7 h-7 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors" title={t('inventory.printBarcode')}>
                                                            <Barcode size={14} />
                                                        </button>
                                                        <button onClick={() => handleEdit(product)} className="flex items-center justify-center w-7 h-7 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors" title={t('common.update')}>
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button onClick={() => handleDelete(product.id)} className="flex items-center justify-center w-7 h-7 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" title={t('common.delete')}>
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
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-700 dark:bg-zinc-900/50 shrink-0">
                                <p className="text-xs text-zinc-500">{t('inventory.productsCount', { shown: products.length, total: totalProducts })}</p>
                                <div className="flex items-center gap-1.5">
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        className="px-2 py-1 text-xs font-medium rounded border border-zinc-300 dark:border-zinc-600 hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-50">{t('common.prev')}</button>
                                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{currentPage}/{totalPages}</span>
                                    <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        className="px-2 py-1 text-xs font-medium rounded border border-zinc-300 dark:border-zinc-600 hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-50">{t('common.next')}</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Import Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsImportModalOpen(false)}>
                    <div className="bg-white dark:bg-zinc-800 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="relative border-b border-zinc-200 dark:border-zinc-700 p-4">
                            <button onClick={() => setIsImportModalOpen(false)} className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-full"><X size={16} /></button>
                            <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">{t('inventory.importProducts')}</h2>
                            <p className="text-zinc-500 text-xs mt-1">{t('inventory.importHint')}</p>
                        </div>
                        <div className="p-5">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl cursor-pointer bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FileText className="w-8 h-8 text-zinc-400 mb-2" />
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">{t('inventory.clickToUpload')}</span> {t('inventory.dragAndDrop')}</p>
                                    <p className="text-xs text-zinc-400 mt-1">{t('inventory.csvOnly')}</p>
                                </div>
                                <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImportFileSelect} />
                            </label>
                            
                            {importFile && (
                                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FileText size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                                        <span className="text-sm font-medium text-indigo-900 dark:text-indigo-300 truncate">{importFile.name}</span>
                                    </div>
                                    <button onClick={() => setImportFile(null)} className="text-indigo-400 hover:text-indigo-600"><X size={14} /></button>
                                </div>
                            )}

                            <div className="mt-6 flex gap-3">
                                <button onClick={() => setIsImportModalOpen(false)} className="flex-1 py-2 px-4 rounded-lg border border-zinc-200 dark:border-zinc-700 font-medium text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                    {t('common.cancel')}
                                </button>
                                <button onClick={executeImport} disabled={!importFile || isImporting} className="flex-1 py-2 px-4 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                    {isImporting ? t('inventory.importing') : t('inventory.importData')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Add/Edit Modal - Compact */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeDialog}>
                    <div className="bg-white dark:bg-zinc-800 w-full max-w-[760px] rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="relative bg-gradient-to-r from-zinc-700 to-zinc-800 dark:from-zinc-600 dark:to-zinc-700 p-4 text-white">
                            <button onClick={closeDialog} className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full"><X size={16} /></button>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white/20 rounded-lg">{isEditing ? <Edit2 size={16} /> : <Plus size={16} />}</div>
                                <div>
                                    <h2 className="text-base font-bold">{isEditing ? t('inventory.editProduct') : t('inventory.addProduct')}</h2>
                                    <p className="text-zinc-300 text-xs">{isEditing ? t('inventory.updateDetails') : t('inventory.enterInformation')}</p>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="p-4 space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">{t('inventory.skuBarcode')}</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Barcode size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input required type="text" className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm"
                                            value={formData.sku || ''} onChange={e => setFormData({ ...formData, sku: e.target.value })} placeholder={t('inventory.enterSku')} />
                                    </div>
                                    <button type="button" onClick={() => setFormData({ ...formData, sku: Math.floor(10000000 + Math.random() * 90000000).toString() })}
                                        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300" title={t('inventory.generateAuto')}>
                                        {t('inventory.generateAuto')}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">{t('inventory.productName')}</label>
                                <input required type="text" className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm"
                                    value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder={t('inventory.enterName')} />
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">{t('inventory.retailPrice')} ({currencySymbol})</label>
                                    <div className="relative">
                                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input required type="number" step="0.01" className="w-full pl-9 pr-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm"
                                            value={formData.price || ''} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">{t('inventory.wholesalePrice')} ({currencySymbol})</label>
                                    <div className="relative">
                                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input type="number" step="0.01" className="w-full pl-9 pr-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm"
                                            value={formData.wholesale_price || ''} onChange={e => setFormData({ ...formData, wholesale_price: Number(e.target.value) })} placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">{t('inventory.costPrice')} ({currencySymbol})</label>
                                    <div className="relative">
                                        <TrendingUp size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input type="number" step="0.01" className="w-full pl-9 pr-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm"
                                            value={formData.cost_price || ''} onChange={e => setFormData({ ...formData, cost_price: Number(e.target.value) })} placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">{t('common.stock')}</label>
                                    <div className="relative">
                                        <Layers size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input required type="number" className="w-full pl-9 pr-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm"
                                            value={formData.stock || ''} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} placeholder="0" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">{t('inventory.category')}</label>
                                <div className="relative">
                                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input type="text" className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm"
                                        value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder={t('inventory.categoryOptional')} />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-1">
                                <button type="button" onClick={closeDialog} className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 font-medium text-sm">{t('common.cancel')}</button>
                                <button type="submit" className="flex-1 px-3 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 dark:bg-zinc-600 dark:hover:bg-zinc-500 text-white font-medium text-sm">{isEditing ? t('common.update') : t('common.add')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
