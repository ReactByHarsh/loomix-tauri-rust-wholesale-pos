import { useEffect, useState } from 'react';
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
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'UPI'>('CASH');
    const [processing, setProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [customer, setCustomer] = useState<{ name: string; phone: string; dob: string } | null>(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerDob, setCustomerDob] = useState('');

    const fetchProducts = async (searchQuery = '') => {
        // @ts-ignore
        if (window.api?.getProducts) {
            // @ts-ignore
            const response = await window.api.getProducts({ page: 1, pageSize: 40, search: searchQuery });
            setProducts(response.products || []);
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

    const filtered = products;
    const subtotal = getTotal();
    const tax = taxEnabled ? subtotal * (taxRate / 100) : 0;
    const grossTotal = subtotal + tax;
    const finalTotal = Math.max(0, grossTotal - extraDiscount);

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
        <div className="flex h-full bg-zinc-100 dark:bg-zinc-900 font-sans">
            {/* LEFT: Product Grid - Compact */}
            <div className="flex-[0.6] flex flex-col h-full overflow-hidden border-r border-zinc-200 dark:border-zinc-700">
                {/* Header - Compact */}
                <div className="p-3 shrink-0 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-600 dark:to-zinc-700 rounded-lg">
                                <ShoppingCart size={16} className="text-zinc-700 dark:text-zinc-300" />
                            </div>
                            <div>
                                <h1 className="text-base font-bold text-zinc-800 dark:text-zinc-100">{t('pos.title')}</h1>
                                <p className="text-[10px] text-zinc-500">{t('pos.scanOrClick')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <BillingModeToggle
                                value={billingMode}
                                onChange={setBillingMode}
                                retailLabel={t('settings.retail')}
                                wholesaleLabel={t('settings.wholesale')}
                            />
                            <div className="flex items-center bg-zinc-100 dark:bg-zinc-700 rounded-lg p-0.5">
                                <button onClick={() => setViewMode('grid')} className={cn("p-1.5 rounded-md", viewMode === 'grid' ? "bg-white dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200" : "text-zinc-400 hover:text-zinc-600")}>
                                    <LayoutGrid size={14} />
                                </button>
                                <button onClick={() => setViewMode('list')} className={cn("p-1.5 rounded-md", viewMode === 'list' ? "bg-white dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200" : "text-zinc-400 hover:text-zinc-600")}>
                                    <List size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                        <input type="text" placeholder={t('pos.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-9 pl-9 pr-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-600 rounded-lg text-sm outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 placeholder:text-zinc-400 text-zinc-800 dark:text-zinc-100" />
                    </div>
                </div>

                {/* Product Grid/List - Compact */}
                <div className="flex-1 overflow-y-auto p-2">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5">
                            {filtered.map(product => (
                                <button key={product.id} onClick={() => product.stock > 0 && addToCart(product)} disabled={product.stock === 0}
                                    className={cn("group flex flex-col bg-white dark:bg-zinc-800 rounded-lg p-2 border border-zinc-200 dark:border-zinc-700 text-left", product.stock === 0 && "opacity-50 cursor-not-allowed")}>
                                    <div className="w-full aspect-square bg-zinc-100 dark:bg-zinc-700 rounded mb-1.5 flex items-center justify-center">
                                        <span className="text-lg font-bold text-zinc-300 dark:text-zinc-500">{product.name.charAt(0)}</span>
                                    </div>
                                    <h3 className="font-medium text-zinc-800 dark:text-zinc-100 text-xs line-clamp-2 mb-0.5">{product.name}</h3>
                                    <p className="text-[10px] text-zinc-400 mb-1">{product.sku}</p>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-zinc-800 dark:text-zinc-100 text-xs">{currencySymbol}{resolveProductPrice(product, billingMode).toFixed(2)}</span>
                                            {billingMode === 'wholesale' && !hasWholesalePrice(product) ? (
                                                <span className="text-[9px] text-amber-500">{t('pos.priceFallback')}</span>
                                            ) : null}
                                        </div>
                                        <span className={cn("text-[9px] font-medium px-1 py-0.5 rounded",
                                            product.stock === 0 ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                                : product.stock < 10 ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                                    : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                        )}>{product.stock === 0 ? 'Out' : product.stock}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filtered.map(product => (
                                <button key={product.id} onClick={() => product.stock > 0 && addToCart(product)} disabled={product.stock === 0}
                                    className={cn("w-full flex items-center gap-2 bg-white dark:bg-zinc-800 rounded-lg p-2 border border-zinc-200 dark:border-zinc-700 text-left", product.stock === 0 && "opacity-50 cursor-not-allowed")}>
                                    <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-700 rounded flex items-center justify-center shrink-0">
                                        <span className="text-sm font-bold text-zinc-300 dark:text-zinc-500">{product.name.charAt(0)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-zinc-800 dark:text-zinc-100 text-xs truncate">{product.name}</h3>
                                        <p className="text-[10px] text-zinc-400">{product.sku}</p>
                                    </div>
                                    <div className="flex min-w-[74px] flex-col items-end">
                                        <span className="font-bold text-zinc-800 dark:text-zinc-100 text-xs">{currencySymbol}{resolveProductPrice(product, billingMode).toFixed(2)}</span>
                                        {billingMode === 'wholesale' && !hasWholesalePrice(product) ? (
                                            <span className="text-[9px] text-amber-500">{t('pos.priceFallback')}</span>
                                        ) : null}
                                    </div>
                                    <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded",
                                        product.stock === 0 ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                            : product.stock < 10 ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    )}>{product.stock}</span>
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
            </div>

            {/* RIGHT: Cart - Compact */}
            <div className="flex-[0.4] bg-white dark:bg-zinc-800 flex flex-col h-full shadow-xl">
                {/* Cart Header */}
                <div className="p-3 shrink-0 border-b border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{t('pos.order')}</h2>
                        <button onClick={clearCart} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-zinc-400 hover:text-red-500">
                            <Trash2 size={14} />
                        </button>
                    </div>
                    {/* Customer Card - Compact */}
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

                {/* Cart Items - Compact */}
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

                {/* Footer - Compact */}
                <div className="shrink-0 p-3 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                    {/* Payment Methods - Compact */}
                    <div className="grid grid-cols-3 gap-1.5 mb-2">
                        {[{ value: 'CASH', label: t('pos.payment.cash'), icon: Banknote }, { value: 'CARD', label: t('pos.payment.card'), icon: CreditCard }, { value: 'UPI', label: t('pos.payment.upi'), icon: QrCode }].map((method) => (
                            <button key={method.value} onClick={() => setPaymentMethod(method.value as any)}
                                className={cn("flex flex-col items-center justify-center gap-0.5 py-2 rounded-lg text-[10px] font-semibold border",
                                    paymentMethod === method.value ? "bg-zinc-700 dark:bg-zinc-600 text-white border-zinc-600 dark:border-zinc-500" : "bg-white dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-600 hover:border-zinc-400")}>
                                <method.icon size={14} />{method.label}
                            </button>
                        ))}
                    </div>

                    {/* Extra Discount Input */}
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

                    {/* Totals - Compact */}
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

                    {/* Checkout Buttons */}
                    <div className="flex gap-2">
                        <button disabled={processing || cart.length === 0} onClick={() => handleCheckout(false)}
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
