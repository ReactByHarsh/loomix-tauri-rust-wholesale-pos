import { useEffect, useState, useMemo } from 'react';
import { History, Printer, Eye, Download, Search, Calendar, CreditCard, Banknote, Receipt, X, FileText, TrendingUp, Package, Clock, QrCode } from 'lucide-react';
import { useSettingsStore, getCurrencySymbol } from '../store/useSettingsStore';
import { printReceipt as sendReceiptToPrinter } from '../utils/receiptTemplate';
import { useI18n } from '../i18n';

interface Transaction {
    id: number;
    total_amount: number;
    extra_discount?: number;
    payment_method: string;
    billing_mode?: string;
    customer_name?: string;
    customer_phone?: string;
    created_at: string;
}

interface TransactionDetail extends Transaction {
    items: { product_id?: number; name: string; sku: string; quantity: number; price_at_sale: number; }[];
}

export function HistoryPage() {
    const { currency } = useSettingsStore();
    const { t } = useI18n();
    const currencySymbol = getCurrencySymbol(currency);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedTx, setSelectedTx] = useState<TransactionDetail | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
    const [paymentFilter, setPaymentFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(50);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHistory = async () => {
        setIsLoading(true);
        // @ts-ignore
        if (window.api?.getTransactionHistory) {
            try {
                // @ts-ignore
                const response = await window.api.getTransactionHistory({ page: currentPage, pageSize, search: searchQuery, paymentFilter, dateFilter });
                if (response?.transactions) {
                    setTransactions(response.transactions);
                    setTotalTransactions(response.total || 0);
                    setTotalPages(Math.ceil((response.total || 0) / pageSize));
                } else { setTransactions([]); setTotalTransactions(0); setTotalPages(1); }
            } catch (e) { setTransactions([]); }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => { if (currentPage !== 1) setCurrentPage(1); else fetchHistory(); }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, dateFilter, paymentFilter]);

    useEffect(() => { fetchHistory(); }, [currentPage]);

    const stats = useMemo(() => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const todayTx = transactions.filter(tx => new Date(tx.created_at) >= today);
        const todaySales = todayTx.reduce((sum, tx) => sum + tx.total_amount, 0);
        const totalSales = transactions.reduce((sum, tx) => sum + tx.total_amount, 0);
        const avgTransaction = transactions.length > 0 ? totalSales / transactions.length : 0;
        return { totalTransactions: transactions.length, todayTransactions: todayTx.length, todaySales, totalSales, avgTransaction };
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        let filtered = [...transactions];
        if (searchQuery) filtered = filtered.filter(tx => tx.id.toString().includes(searchQuery) || tx.payment_method.toLowerCase().includes(searchQuery.toLowerCase()));
        const now = new Date();
        if (dateFilter === 'today') { const today = new Date(now); today.setHours(0, 0, 0, 0); filtered = filtered.filter(tx => new Date(tx.created_at) >= today); }
        else if (dateFilter === 'week') { const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7); filtered = filtered.filter(tx => new Date(tx.created_at) >= weekAgo); }
        else if (dateFilter === 'month') { const monthAgo = new Date(now); monthAgo.setMonth(monthAgo.getMonth() - 1); filtered = filtered.filter(tx => new Date(tx.created_at) >= monthAgo); }
        if (paymentFilter !== 'all') filtered = filtered.filter(tx => tx.payment_method === paymentFilter);
        return filtered;
    }, [transactions, searchQuery, dateFilter, paymentFilter]);

    const paymentMethods = useMemo(() => Array.from(new Set(transactions.map(tx => tx.payment_method))), [transactions]);

    const viewTransaction = async (id: number) => {
        try {
            // @ts-ignore
            if (window.api?.getTransactionById) { const tx = await window.api.getTransactionById(id); setSelectedTx(tx); setShowModal(true); }
        } catch (error) {
            console.error('Failed to load transaction', error);
        }
    };

    const handlePrintReceipt = async (tx: TransactionDetail) => {
        const { storeName, storeAddress, storePhone, receiptFooter, profileImage, billPrinter, billPaperSize, taxRate } = useSettingsStore.getState();
        const subtotal = tx.items.reduce((sum, item) => sum + (item.price_at_sale * item.quantity), 0);
        const extraDiscount = tx.extra_discount || 0;
        const grossTotal = tx.total_amount + extraDiscount; // Reverse calculate gross before discount
        const tax = grossTotal - subtotal; // Tax is what's left after subtracting subtotal from gross
        const receiptData = {
            storeName, storeAddress, storePhone, footerMessage: receiptFooter, logo: profileImage || undefined,
            transactionId: tx.id, date: new Date(tx.created_at).toLocaleString(),
            items: tx.items.map(item => ({ name: item.name, quantity: item.quantity, price: item.price_at_sale, total: item.price_at_sale * item.quantity })),
            subtotal, tax, taxRate, total: tx.total_amount, extraDiscount, paymentMethod: tx.payment_method, customerName: tx.customer_name, customerPhone: tx.customer_phone, currencySymbol
        };
        await sendReceiptToPrinter(receiptData, {
            printerName: billPrinter,
            paperSize: billPaperSize,
        });
    };

    const printById = async (id: number) => {
        // @ts-ignore
        if (!window.api?.getTransactionById) return;
        // @ts-ignore
        const tx = await window.api.getTransactionById(id);
        if (tx) handlePrintReceipt(tx);
    };

    const exportHistory = async () => {
        // @ts-ignore
        if (!window.api?.exportTransactions) return;
        // @ts-ignore
        const result = await window.api.exportTransactions();
        if (result.success) {
            const headers = ['Transaction ID', 'Date', 'Product SKU', 'Product Name', 'Quantity', 'Price', 'Total Amount', 'Payment Method'];
            const rows = result.data.map((row: any) => [row.id, row.created_at, row.sku, row.name, row.quantity, row.price_at_sale, row.total_amount, row.payment_method]);
            const csv = [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`; a.click();
            URL.revokeObjectURL(url);
        }
    };

    const getPaymentIcon = (method: string) => {
        if (!method) return <Receipt size={12} />;
        switch (method.toUpperCase()) {
            case 'CASH': return <Banknote size={12} />;
            case 'CARD': case 'CREDIT': case 'DEBIT': return <CreditCard size={12} />;
            case 'UPI': return <QrCode size={12} />;
            default: return <Receipt size={12} />;
        }
    };

    const getPaymentBadgeClass = (method: string) => {
        if (!method) return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300';
        switch (method.toUpperCase()) {
            case 'CASH': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'CARD': case 'CREDIT': case 'DEBIT': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'UPI': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date(); const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === today.toDateString()) return `${t('time.today')}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        else if (date.toDateString() === yesterday.toDateString()) return `${t('time.yesterday')}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex h-full flex-col overscroll-contain bg-zinc-100 dark:bg-zinc-900">
            {/* Compact Header */}
            <div className="sticky top-0 z-20 shrink-0 border-b border-zinc-200 bg-white/95 p-4 backdrop-blur dark:border-zinc-700 dark:bg-zinc-800/95">
                <div className="mx-auto w-full max-w-[1900px]">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-slate-950 p-2 text-white shadow-sm dark:bg-white dark:text-zinc-950">
                            <History size={18} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{t('history.title')}</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('history.subtitle')}</p>
                        </div>
                    </div>
                    <button onClick={exportHistory} className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-600 border border-zinc-200 dark:border-zinc-600 rounded-lg font-medium text-sm">
                        <Download size={14} className="text-zinc-500" /> {t('common.export')}
                    </button>
                </div>

                {/* Compact Stats */}
                <div className="mb-3 grid grid-cols-2 gap-2 xl:grid-cols-4">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium text-zinc-500 uppercase">{t('history.total')}</span>
                            <TrendingUp size={12} className="text-zinc-400" />
                        </div>
                        <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{currencySymbol}{stats.totalSales.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-zinc-400">{stats.totalTransactions} {t('history.orders')}</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium text-zinc-500 uppercase">{t('history.today')}</span>
                            <Calendar size={12} className="text-emerald-500" />
                        </div>
                        <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{currencySymbol}{stats.todaySales.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-zinc-400">{stats.todayTransactions} {t('history.orders')}</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium text-zinc-500 uppercase">{t('history.average')}</span>
                            <Package size={12} className="text-amber-500" />
                        </div>
                        <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{currencySymbol}{stats.avgTransaction.toFixed(0)}</p>
                        <p className="text-[10px] text-zinc-400">{t('history.perOrder')}</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium text-zinc-500 uppercase">{t('history.showing')}</span>
                            <FileText size={12} className="text-zinc-400" />
                        </div>
                        <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{filteredTransactions.length}</p>
                        <p className="text-[10px] text-zinc-400">{t('history.filtered')}</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-wrap gap-2">
                    <div className="relative min-w-[240px] flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input type="text" placeholder={t('history.searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm" />
                    </div>
                    <div className="flex flex-wrap bg-zinc-100 dark:bg-zinc-900 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-700">
                        {[{ value: 'all', label: t('common.all') }, { value: 'today', label: t('history.today') }, { value: 'week', label: t('vendors.week') }, { value: 'month', label: t('vendors.month') }].map((option) => (
                            <button key={option.value} onClick={() => setDateFilter(option.value as any)}
                                className={`px-2.5 py-1.5 rounded-md text-xs font-medium ${dateFilter === option.value ? 'bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}>
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}
                        className="px-2 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 text-sm">
                        <option value="all">{t('history.allPayments')}</option>
                        {paymentMethods.map(method => <option key={method} value={method}>{method}</option>)}
                    </select>
                </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto flex h-full w-full max-w-[1900px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                    {isLoading ? (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="w-8 h-8 border-3 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-400 rounded-full"></div>
                            <p className="mt-3 text-zinc-500 text-sm">{t('common.loading')}</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-x-auto">
                                <table className="min-w-[1040px] w-full text-left 2xl:min-w-[1180px]">
                                    <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500">{t('history.order')}</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500">{t('history.dateTime')}</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500">{t('history.payment')}</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-right">{t('history.amount')}</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-right">{t('inventory.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                                        {filteredTransactions.map((tx) => (
                                            <tr key={tx.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-700/30">
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <Receipt size={14} className="text-zinc-400" />
                                                        <div>
                                                            <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-100">#{tx.id}</p>
                                                            {tx.customer_name && <p className="text-[11px] text-zinc-500">{tx.customer_name}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={12} className="text-zinc-400" />
                                                        <span className="text-zinc-600 dark:text-zinc-300 text-xs">{formatDate(tx.created_at)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${getPaymentBadgeClass(tx.payment_method)}`}>
                                                        {getPaymentIcon(tx.payment_method)} {tx.payment_method}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <span className="font-bold text-sm text-zinc-800 dark:text-zinc-100">{currencySymbol}{(tx.total_amount || 0).toFixed(2)}</span>
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <div className="flex items-center justify-end gap-0.5">
                                                        <button onClick={() => viewTransaction(tx.id)} className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded" title={t('history.view')}>
                                                            <Eye size={14} />
                                                        </button>
                                                        <button onClick={() => printById(tx.id)} className="p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded" title={t('history.print')}>
                                                            <Printer size={14} />
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
                                <p className="text-xs text-zinc-500">{t('history.transactionsCount', { shown: filteredTransactions.length, total: totalTransactions })}</p>
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

            {/* Detail Modal - Compact */}
            {showModal && selectedTx && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-zinc-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="relative bg-gradient-to-r from-zinc-700 to-zinc-800 dark:from-zinc-600 dark:to-zinc-700 p-4 text-white">
                            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full"><X size={16} /></button>
                            <div className="flex items-center gap-2">
                                <Receipt size={20} className="text-white/90" />
                                <div>
                                    <h2 className="text-base font-bold">{t('history.order')} #{selectedTx.id}</h2>
                                    {selectedTx.customer_name && <p className="text-zinc-300 text-xs font-medium">{selectedTx.customer_name}</p>}
                                    <p className="text-zinc-400 text-xs flex items-center gap-1 mt-0.5"><Clock size={10} /> {new Date(selectedTx.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 max-h-[280px] overflow-auto">
                            <div className="space-y-1.5">
                                {selectedTx.items.map((item, i) => (
                                    <div key={item.product_id ? `${item.product_id}-${i}` : i} className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-bold text-xs">{item.quantity}x</span>
                                            <div>
                                                <p className="font-medium text-zinc-800 dark:text-zinc-100 text-sm">{item.name}</p>
                                                <p className="text-[11px] text-zinc-500">{currencySymbol}{(typeof item.price_at_sale === 'number' ? item.price_at_sale : 0).toFixed(2)} {t('history.each')}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-zinc-800 dark:text-zinc-100 text-sm">{currencySymbol}{((typeof item.price_at_sale === 'number' ? item.price_at_sale : 0) * (item.quantity || 0)).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700 space-y-1.5">
                                <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                                    <span>{t('receipt.subtotal')}</span>
                                    <span>{currencySymbol}{selectedTx.items.reduce((sum, item) => sum + ((typeof item.price_at_sale === 'number' ? item.price_at_sale : 0) * (item.quantity || 0)), 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                                    <span>{t('receipt.tax', { rate: useSettingsStore.getState().taxRate })}</span>
                                    <span>{currencySymbol}{((selectedTx.total_amount || 0) - selectedTx.items.reduce((sum, item) => sum + ((typeof item.price_at_sale === 'number' ? item.price_at_sale : 0) * (item.quantity || 0)), 0)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-zinc-800 dark:text-zinc-100 pt-1.5 border-t border-zinc-200 dark:border-zinc-700">
                                    <span>{t('common.total')}</span>
                                    <span className="text-zinc-700 dark:text-zinc-300">{currencySymbol}{(selectedTx.total_amount || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1.5">
                                    <span className="text-xs text-zinc-500">{t('history.payment')}</span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${getPaymentBadgeClass(selectedTx.payment_method)}`}>
                                        {getPaymentIcon(selectedTx.payment_method)} {selectedTx.payment_method || t('history.unknown')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 flex gap-2">
                            <button onClick={() => setShowModal(false)} className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-600 rounded-lg font-medium text-sm hover:bg-white dark:hover:bg-zinc-700">{t('common.close')}</button>
                            <button onClick={() => handlePrintReceipt(selectedTx)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 dark:bg-zinc-600 dark:hover:bg-zinc-500 text-white rounded-lg font-medium text-sm">
                                <Printer size={14} /> {t('common.print')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
