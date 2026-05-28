import { useEffect, useState, useRef } from 'react';
import { useCartStore, type Product } from '../store/useCartStore';
import { useSettingsStore, getCurrencySymbol } from '../store/useSettingsStore';
import { useBarcodeListener } from '../hooks/useBarcodeListener';
import { printReceipt } from '../utils/receiptTemplate';
import { Search, Minus, Plus, Trash2, ShoppingBag, User, ShoppingCart, LayoutGrid, List, X, Check, CreditCard, Banknote, QrCode, UserPlus, Printer } from 'lucide-react';
import { useI18n } from '../i18n';
import { BillingModeToggle } from '../components/BillingModeToggle';
import { hasWholesalePrice, resolveProductPrice } from '../lib/pricing';

function cn(...classes: (string | undefined | null | false)[]) { return classes.filter(Boolean).join(' '); }

export const POSPage = () => {
    const { cart, addToCart, getTotal, clearCart, updateQuantity, billingMode, setBillingMode } = useCartStore();
    const { taxRate, taxEnabled, currency, defaultBillingMode } = useSettingsStore();
    const { t } = useI18n();
    const currencySymbol = getCurrencySymbol(currency);

    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'UPI'>('CASH');
    const [processing, setProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [customer, setCustomer] = useState<{ name: string; phone: string; dob: string } | null>(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerDob, setCustomerDob] = useState('');

    const searchInputRef = useRef<HTMLInputElement>(null);

    const fetchProducts = async (searchQuery = '') => {
        try {
            // @ts-ignore
            if (window.api?.getProducts) {
                // @ts-ignore
                const response = await window.api.getProducts({ page: 1, pageSize: 100, search: searchQuery, category: 'all' });
                setProducts(response.products || []);
            }
        } catch (error) {
            console.error('Failed to load POS products', error);
            setProducts([]);
        }
    };

    useEffect(() => {
        setBillingMode(defaultBillingMode);
    }, [defaultBillingMode, setBillingMode]);

    useEffect(() => { fetchProducts(); }, []);
    useEffect(() => { const timer = setTimeout(() => fetchProducts(search), 300); return () => clearTimeout(timer); }, [search]);

    const refreshProducts = () => fetchProducts(search);

    useBarcodeListener(async (code) => {
        const visibleProduct = products.find(p => p.sku === code);
        if (visibleProduct) { if (visibleProduct.stock > 0) addToCart(visibleProduct); else alert(t('pos.outOfStock')); return; }
        // @ts-ignore
        if (window.api?.getProductBySku) {
            // @ts-ignore
            const product = await window.api.getProductBySku(code);
            if (product) { if (product.stock > 0) addToCart(product); else alert(t('pos.productOutOfStock')); }
        }
    });

    const [extraDiscount, setExtraDiscount] = useState(0);

    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];
    const filtered = products.filter(p => selectedCategory ? p.category === selectedCategory : true);

    const subtotal = getTotal();
    const tax = taxEnabled ? subtotal * (taxRate / 100) : 0;
    const grossTotal = subtotal + tax;
    const finalTotal = Math.max(0, grossTotal - extraDiscount);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F2') {
                e.preventDefault();
                searchInputRef.current?.focus();
            } else if (e.key === 'F4') {
                e.preventDefault();
                setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
            } else if (e.key === 'F8') {
                e.preventDefault();
                if (cart.length > 0 && !processing) {
                    const btn = document.getElementById('checkout-btn');
                    if (btn) btn.click();
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setSearch('');
                setSelectedCategory(null);
                searchInputRef.current?.blur();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cart.length, processing]);

    const handleCheckout = async (shouldPrint: boolean = false) => {
        if (cart.length === 0) return;
        setProcessing(true);
        try {
            const transaction = {
                total_amount: finalTotal,
                extra_discount: extraDiscount,
                payment_method: paymentMethod,
                billing_mode: billingMode,
                customer_name: customer?.name || null, customer_phone: customer?.phone || null, customer_dob: customer?.dob || null,
                items: cart.map(item => ({ product_id: item.id, quantity: item.quantity, price_at_sale: item.unit_price }))
            };
            // @ts-ignore
            if (!window.api?.createTransaction) { alert("API not available"); setProcessing(false); return; }
            // @ts-ignore
            const result = await window.api.createTransaction(transaction);
            if (result.success) {
                const { storeName, storeAddress, storePhone, receiptFooter, profileImage, taxRate, billPrinter, billPaperSize } = useSettingsStore.getState();
                const receiptData = {
                    storeName, storeAddress, storePhone, footerMessage: receiptFooter, logo: profileImage || undefined,
                    transactionId: result.id, date: new Date().toLocaleString(),
                    items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.unit_price, total: item.unit_price * item.quantity })),
                    subtotal, tax, taxRate, total: finalTotal, extraDiscount, paymentMethod, customerName: customer?.name, customerPhone: customer?.phone, currencySymbol
                };
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    if (shouldPrint) {
                        printReceipt(receiptData, {
                            printerName: billPrinter,
                            paperSize: billPaperSize,
                        });
                    }
                    clearCart(); setCustomer(null); setExtraDiscount(0); refreshProducts();
                }, 1500);
            } else { alert("Failed: " + result.error); }
        } catch (e) { alert("Error processing transaction"); }
        finally { setProcessing(false); }
    };

    const handleAddCustomer = () => {
        if (customerName.trim()) { setCustomer({ name: customerName, phone: customerPhone, dob: customerDob }); setShowCustomerModal(false); setCustomerName(''); setCustomerPhone(''); setCustomerDob(''); }
    };

    return (
        <div className="flex h-full flex-col overflow-hidden overscroll-contain bg-zinc-100 font-sans xl:flex-row dark:bg-zinc-900">
            {/* LEFT: Cart - Compact */}
            <div className="flex min-h-0 min-w-0 shrink-0 flex-col border-b border-zinc-200 bg-white shadow-xl xl:w-[420px] xl:border-b-0 xl:border-r 2xl:w-[460px] dark:border-zinc-700 dark:bg-zinc-800">
                {/* Cart Header */}
                <div className="p-3 shrink-0 border-b border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{t('pos.order')}</h2>
                        <button onClick={clearCart} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-zinc-400 hover:text-red-500">
                            <Trash2 size={14} />
                        </button>
                    </div>
                    <div onClick={() => setShowCustomerModal(true)} className="w-full flex items-center justify-between p-2 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 group cursor-pointer">
                        <div className="flex items-center gap-2">
                            <div className={cn("w-7 h-7 rounded-full flex items-center justify-center", customer ? "bg-zinc-200 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300" : "bg-zinc-100 dark:bg-zinc-700 text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-600")}>
                                {customer ? <User size={14} /> : <UserPlus size={14} />}
                            </div>
                            <div className="text-left">
                                {customer ? (<><p className="text-xs font-medium text-zinc-800 dark:text-zinc-100">{customer.name}</p><p className="text-[10px] text-zinc-400">{customer.phone || t('pos.noPhone')}</p></>) : (<><p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{t('pos.addCustomer')}</p><p className="text-[10px] text-zinc-400">{t('pos.customerOptional')}</p></>)}
                            </div>
                        </div>
                        {customer ? (<button onClick={(e) => { e.stopPropagation(); setCustomer(null); }} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full text-zinc-400 hover:text-red-500"><X size={12} /></button>) : (<Plus size={12} className="text-zinc-300 group-hover:text-zinc-500" />)}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-600 space-y-2">
                            <ShoppingBag size={36} strokeWidth={1} />
                            <p className="text-xs font-medium">{t('pos.cartEmpty')}</p>
                        </div>
                    ) : (
                        cart.map((item) => {
                            return (
                                <div key={item.id} className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 bg-white dark:bg-zinc-700 rounded flex items-center justify-center text-zinc-400 border border-zinc-100 dark:border-zinc-600 shrink-0 text-xs font-medium">{item.name.charAt(0)}</div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-zinc-800 dark:text-zinc-100 text-xs truncate">{item.name}</h4>
                                            <div className="flex justify-between w-full pr-1">
                                                <span className="text-[10px] text-zinc-400">#{item.sku}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={cn(
                                                        "rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                                                        item.pricing_mode === 'wholesale'
                                                            ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                                                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                                                    )}>
                                                        {item.pricing_mode === 'wholesale' ? t('settings.wholesale') : t('settings.retail')}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-400">{currencySymbol}{item.unit_price.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-0.5 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zinc-600"><Minus size={10} /></button>
                                            <span className="w-5 text-center text-xs font-semibold text-zinc-800 dark:text-zinc-100">{item.quantity}</span>
                                            <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zinc-600"><Plus size={10} /></button>
                                        </div>
                                        <span className="font-semibold text-zinc-800 dark:text-zinc-100 text-xs w-14 text-right">{currencySymbol}{(item.unit_price * item.quantity).toFixed(0)}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="shrink-0 p-3 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="grid grid-cols-3 gap-1.5 mb-2">
                        {[{ value: 'CASH', label: t('pos.payment.cash'), icon: Banknote }, { value: 'CARD', label: t('pos.payment.card'), icon: CreditCard }, { value: 'UPI', label: t('pos.payment.upi'), icon: QrCode }].map((method) => (
                            <button key={method.value} onClick={() => setPaymentMethod(method.value as any)}
                                className={cn("flex flex-col items-center justify-center gap-0.5 py-2 rounded-lg text-[10px] font-semibold border",
                                    paymentMethod === method.value ? "bg-zinc-700 dark:bg-zinc-600 text-white border-zinc-600 dark:border-zinc-500" : "bg-white dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-600 hover:border-zinc-400")}>
                                <method.icon size={14} />{method.label}
                            </button>
                        ))}
                    </div>

                    <div className="mb-2 bg-white dark:bg-zinc-800 p-2 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-600">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{t('pos.extraDiscount')}</span>
                            <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400">{currencySymbol}</span>
                                <input type="number" value={extraDiscount || ''} onChange={(e) => setExtraDiscount(Number(e.target.value))} placeholder="0"
                                    className="w-20 pl-5 pr-2 py-1 text-right text-sm font-semibold rounded border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-xs text-zinc-500"><span>{t('receipt.subtotal')}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-xs text-zinc-500"><span>{t('receipt.tax', { rate: taxRate })}</span><span>{currencySymbol}{tax.toFixed(2)}</span></div>
                        {extraDiscount > 0 && (
                            <div className="flex justify-between text-xs text-red-500 font-medium"><span>{t('pos.extraDiscount')}</span><span>-{currencySymbol}{extraDiscount.toFixed(2)}</span></div>
                        )}

                        <div className="flex justify-between items-baseline pt-1.5 border-t border-zinc-200 dark:border-zinc-600">
                            <span className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">{t('common.total')}</span>
                            <span className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{currencySymbol}{finalTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button id="checkout-btn" disabled={processing || cart.length === 0} onClick={() => handleCheckout(false)}
                            className={cn("flex-1 h-10 rounded-lg font-semibold text-sm flex items-center justify-center gap-1.5",
                                processing || cart.length === 0 ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed" : "bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-600")}>
                            {processing ? <span>...</span> : <><CreditCard size={14} /><span>{t('pos.checkout')}</span></>}
                        </button>
                        <button disabled={processing || cart.length === 0} onClick={() => handleCheckout(true)}
                            className={cn("flex-1 h-10 rounded-lg font-semibold text-sm flex items-center justify-center gap-1.5",
                                processing || cart.length === 0 ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed" : "bg-zinc-700 dark:bg-zinc-600 text-white hover:bg-zinc-600 dark:hover:bg-zinc-500")}>
                            {processing ? <span>...</span> : <><Printer size={14} /><span>{t('pos.printCheckout')}</span></>}
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT: Product Grid - Compact */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden xl:border-l-0 dark:border-zinc-700">
                {/* Header - Compact */}
                <div className="p-3 shrink-0 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex flex-col gap-3 z-10 shadow-sm relative">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex items-center gap-2">
                            <div className="rounded-xl bg-slate-950 p-2 text-white shadow-sm dark:bg-white dark:text-zinc-950">
                                <ShoppingCart size={18} />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{t('pos.title')}</h1>
                                <p className="text-[10px] text-zinc-500">{t('pos.scanOrClick')}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-3">
                            <BillingModeToggle
                                value={billingMode}
                                onChange={setBillingMode}
                                retailLabel={t('settings.retail')}
                                wholesaleLabel={t('settings.wholesale')}
                            />
                            <div className="flex items-center bg-zinc-100 dark:bg-zinc-700 rounded-lg p-0.5">
                                <button onClick={() => setViewMode('grid')} className={cn("p-1.5 rounded-md", viewMode === 'grid' ? "bg-white dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200 shadow-sm" : "text-zinc-400 hover:text-zinc-600")}>
                                    <LayoutGrid size={14} />
                                </button>
                                <button onClick={() => setViewMode('list')} className={cn("p-1.5 rounded-md", viewMode === 'list' ? "bg-white dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200 shadow-sm" : "text-zinc-400 hover:text-zinc-600")}>
                                    <List size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input ref={searchInputRef} type="text" placeholder={`${t('pos.searchPlaceholder')} [F2]`} value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-600 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400 text-zinc-800 dark:text-zinc-100 transition-shadow shadow-sm" />
                    </div>
                    {/* Categories Row */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={cn("whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border",
                                selectedCategory === null
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-700/50 dark:text-indigo-300"
                                    : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700"
                            )}
                        >
                            {t('pos.allCategories')}
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn("whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border",
                                    selectedCategory === cat
                                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-700/50 dark:text-indigo-300"
                                        : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid/List - Compact */}
                <div className="flex-1 overflow-y-auto p-2 bg-zinc-50 dark:bg-zinc-900/50">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                            {filtered.map(product => (
                                <button key={product.id} onClick={() => product.stock > 0 && addToCart(product)} disabled={product.stock === 0}
                                    className={cn("group flex flex-col bg-white dark:bg-zinc-800 rounded-xl p-2.5 border text-left transition-all hover:shadow-md",
                                        product.stock === 0 ? "opacity-50 cursor-not-allowed border-zinc-200 dark:border-zinc-700" : "border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 active:bg-indigo-50/50 dark:active:bg-indigo-900/20")}>
                                    <div className="flex items-start justify-between w-full mb-2">
                                        <span className="text-[9px] text-zinc-400 font-medium uppercase">{product.sku}</span>
                                        <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                                            product.stock === 0 ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                                : product.stock < 10 ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                                    : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                        )}>STOCK {product.stock === 0 ? '0' : product.stock}</span>
                                    </div>
                                    <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 text-[12px] leading-tight line-clamp-2 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{product.name}</h3>
                                    <div className="mt-auto flex items-center justify-between w-full">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[13px]">{currencySymbol}{resolveProductPrice(product, billingMode).toFixed(2)}</span>
                                            {billingMode === 'wholesale' && !hasWholesalePrice(product) ? (
                                                <span className="text-[9px] text-amber-500 font-medium">{t('pos.priceFallback')}</span>
                                            ) : null}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2 2xl:grid-cols-2">
                            {filtered.map(product => (
                                <button key={product.id} onClick={() => product.stock > 0 && addToCart(product)} disabled={product.stock === 0}
                                    className={cn("w-full flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-xl p-2.5 border text-left transition-all hover:shadow-sm",
                                        product.stock === 0 ? "opacity-50 cursor-not-allowed border-zinc-200 dark:border-zinc-700" : "border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 active:bg-indigo-50/50 dark:active:bg-indigo-900/20")}>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[9px] text-zinc-400 font-medium uppercase">{product.sku}</span>
                                            <span className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                                                product.stock === 0 ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                                    : product.stock < 10 ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                                        : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            )}>STOCK {product.stock === 0 ? '0' : product.stock}</span>
                                        </div>
                                        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 text-[12px] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{product.name}</h3>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[13px]">{currencySymbol}{resolveProductPrice(product, billingMode).toFixed(2)}</span>
                                        {billingMode === 'wholesale' && !hasWholesalePrice(product) ? (
                                            <span className="text-[8px] text-amber-500 font-medium">{t('pos.priceFallback')}</span>
                                        ) : null}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                    {filtered.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                            <ShoppingBag size={36} strokeWidth={1.5} className="mb-2 opacity-50" />
                            <p className="text-sm font-medium">{t('pos.productsEmpty')}</p>
                        </div>
                    )}
                </div>
                {/* Keyboard Shortcuts Footer */}
                <div className="flex flex-wrap items-center gap-4 p-2.5 shrink-0 bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 text-[10px] text-zinc-500 font-medium">
                    <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-sans shadow-sm">F2</kbd> {t('pos.focusSearch')}</span>
                    <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-sans shadow-sm">F4</kbd> {t('pos.switchMode')}</span>
                    <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-sans shadow-sm">F8</kbd> {t('pos.quickCheckout')}</span>
                    <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-sans shadow-sm">ESC</kbd> {t('pos.clearView')}</span>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-6 max-w-xs w-full text-center">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={24} /></div>
                        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{t('pos.success')}</h3>
                        <p className="text-zinc-500 text-sm mt-1">{t('pos.transactionRecorded')}</p>
                    </div>
                </div>
            )}

            {/* Customer Modal - Compact */}
            {showCustomerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCustomerModal(false)}>
                    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl p-4 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{t('pos.addCustomer')}</h3>
                            <button onClick={() => setShowCustomerModal(false)} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg"><X size={16} className="text-zinc-500" /></button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">{t('common.name')} *</label>
                                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={t('pos.customerName')}
                                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-800 dark:text-zinc-100 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">{t('common.phone')}</label>
                                <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder={t('common.phone')}
                                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-800 dark:text-zinc-100 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">{t('pos.dateOfBirth')}</label>
                                <input type="date" value={customerDob} onChange={(e) => setCustomerDob(e.target.value)}
                                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-800 dark:text-zinc-100 text-sm" />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={() => setShowCustomerModal(false)} className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-600 rounded-lg font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300">{t('common.cancel')}</button>
                            <button onClick={handleAddCustomer} disabled={!customerName.trim()} className="flex-1 px-3 py-2 bg-zinc-700 dark:bg-zinc-600 text-white rounded-lg font-medium text-sm hover:bg-zinc-600 dark:hover:bg-zinc-500 disabled:opacity-50">{t('common.add')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
