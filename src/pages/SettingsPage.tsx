import { useEffect, useMemo, useState } from 'react';
import {
    AlertTriangle,
    Check,
    Monitor,
    Moon,
    Palette,
    Printer,
    Save,
    Scan,
    Settings,
    Sparkles,
    Store,
    Sun,
    TestTube,
    Trash2,
} from 'lucide-react';
import { useSettingsStore, type ReceiptPaperSize } from '../store/useSettingsStore';
import { generateReceiptHTML, printReceipt } from '../utils/receiptTemplate';

interface PrinterInfo {
    name: string;
    isDefault: boolean;
}

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export function SettingsPage() {
    const {
        storeName,
        setStoreName,
        storeAddress,
        setStoreAddress,
        storePhone,
        setStorePhone,
        receiptFooter,
        setReceiptFooter,
        taxRate,
        setTaxRate,
        taxEnabled,
        setTaxEnabled,
        currency,
        setCurrency,
        theme,
        setTheme,
        billPrinter,
        setBillPrinter,
        barcodePrinter,
        setBarcodePrinter,
        billPaperSize,
        setBillPaperSize,
    } = useSettingsStore();

    const [printers, setPrinters] = useState<PrinterInfo[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [localStoreName, setLocalStoreName] = useState(storeName);
    const [localStoreAddress, setLocalStoreAddress] = useState(storeAddress);
    const [localStorePhone, setLocalStorePhone] = useState(storePhone);
    const [localReceiptFooter, setLocalReceiptFooter] = useState(receiptFooter);
    const [localTaxRate, setLocalTaxRate] = useState(taxRate.toString());
    const [localTaxEnabled, setLocalTaxEnabled] = useState(taxEnabled);
    const [localCurrency, setLocalCurrency] = useState(currency);
    const [localTheme, setLocalTheme] = useState(theme);
    const [localBillPrinter, setLocalBillPrinter] = useState(billPrinter);
    const [localBarcodePrinter, setLocalBarcodePrinter] = useState(barcodePrinter);
    const [localBillPaperSize, setLocalBillPaperSize] = useState<ReceiptPaperSize>(billPaperSize);

    useEffect(() => {
        const root = document.documentElement;
        if (localTheme === 'dark') {
            root.classList.add('dark');
        } else if (localTheme === 'light') {
            root.classList.remove('dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [localTheme]);

    useEffect(() => {
        const loadPrinters = async () => {
            // @ts-ignore
            if (!window.api?.getPrinters) return;

            // @ts-ignore
            const result = await window.api.getPrinters();
            if (!result?.success) return;

            setPrinters(result.printers || []);

            if (!localBillPrinter) {
                // @ts-ignore
                const suggested = await window.api?.getSuggestedPrinter?.();
                if (suggested) {
                    setLocalBillPrinter(suggested);
                    if (!localBarcodePrinter) {
                        setLocalBarcodePrinter(suggested);
                    }
                }
            }
        };

        loadPrinters();
    }, []);

    const themeOptions = [
        { value: 'system', label: 'System', icon: Monitor },
        { value: 'light', label: 'Light', icon: Sun },
        { value: 'dark', label: 'Dark', icon: Moon },
    ] as const;

    const previewReceiptData = useMemo(
        () => ({
            storeName: localStoreName || 'Your Store',
            storeAddress: localStoreAddress,
            storePhone: localStorePhone,
            footerMessage: localReceiptFooter || 'Thank you for shopping with us.',
            transactionId: 'PREVIEW-001',
            date: new Date().toLocaleString(),
            items: [
                { name: 'Premium Cotton Shirt', quantity: 2, price: 899, total: 1798 },
                { name: 'Classic Denim Jeans', quantity: 1, price: 1499, total: 1499 },
            ],
            subtotal: 3297,
            tax: localTaxEnabled ? (3297 * (parseFloat(localTaxRate) || 0)) / 100 : 0,
            taxRate: parseFloat(localTaxRate) || 0,
            total: localTaxEnabled ? 3297 + (3297 * (parseFloat(localTaxRate) || 0)) / 100 : 3297,
            paymentMethod: 'CASH',
            customerName: 'Preview Customer',
            customerPhone: '9876543210',
        }),
        [localReceiptFooter, localStoreAddress, localStoreName, localStorePhone, localTaxEnabled, localTaxRate]
    );

    const previewHtml = useMemo(
        () =>
            generateReceiptHTML(previewReceiptData, {
                paperSize: localBillPaperSize,
                preview: true,
            }),
        [localBillPaperSize, previewReceiptData]
    );

    const handleTestPrint = async (preview = false) => {
        const testData = {
            ...previewReceiptData,
            transactionId: preview ? 'PREVIEW' : 'TEST',
        };
        await printReceipt(testData, {
            paperSize: localBillPaperSize,
            printerName: localBillPrinter,
            preview,
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        setStoreName(localStoreName);
        setStoreAddress(localStoreAddress);
        setStorePhone(localStorePhone);
        setReceiptFooter(localReceiptFooter);
        setTaxRate(parseFloat(localTaxRate) || 0);
        setTaxEnabled(localTaxEnabled);
        setCurrency(localCurrency);
        setTheme(localTheme);
        setBillPrinter(localBillPrinter);
        setBarcodePrinter(localBarcodePrinter);
        setBillPaperSize(localBillPaperSize);
        await new Promise((resolve) => setTimeout(resolve, 350));
        setIsSaving(false);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 1800);
    };

    return (
        <div className="h-full overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.12),_transparent_28%),linear-gradient(180deg,_#09090b_0%,_#18181b_100%)]">
            <div className="mx-auto flex max-w-7xl flex-col gap-5 p-5">
                <div className="rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_28px_70px_rgba(15,23,42,0.10)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/75">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="rounded-2xl bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-3 text-white shadow-lg">
                                <Settings size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Store Settings</h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                                    Control shop identity, barcode printing, and thermal bill output from one place.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Bill Printer</p>
                                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-zinc-100">{localBillPrinter || 'Not selected'}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Barcode Printer</p>
                                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-zinc-100">{localBarcodePrinter || 'Not selected'}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Thermal Size</p>
                                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-zinc-100">{localBillPaperSize === '3-inch' ? '3 inch roll' : '4 inch roll'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="flex flex-col gap-5">
                        <section className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/75">
                            <div className="flex items-center gap-2">
                                <Store size={18} className="text-slate-600 dark:text-zinc-300" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Store Identity</h2>
                            </div>
                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">Store Name</label>
                                    <input value={localStoreName} onChange={(event) => setLocalStoreName(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">Phone</label>
                                    <input value={localStorePhone} onChange={(event) => setLocalStorePhone(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">Address</label>
                                    <input value={localStoreAddress} onChange={(event) => setLocalStoreAddress(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">Receipt Footer</label>
                                    <input value={localReceiptFooter} onChange={(event) => setLocalReceiptFooter(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/75">
                            <div className="flex items-center gap-2">
                                <Printer size={18} className="text-emerald-600 dark:text-emerald-400" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Printer Routing</h2>
                            </div>
                            <div className="mt-5 grid gap-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">Bill Printer</label>
                                        <select value={localBillPrinter} onChange={(event) => setLocalBillPrinter(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
                                            <option value="">Select bill printer</option>
                                            {printers.map((printer) => (
                                                <option key={printer.name} value={printer.name}>
                                                    {printer.name} {printer.isDefault ? '(Default)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">Barcode Printer</label>
                                        <select value={localBarcodePrinter} onChange={(event) => setLocalBarcodePrinter(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
                                            <option value="">Select barcode printer</option>
                                            {printers.map((printer) => (
                                                <option key={printer.name} value={printer.name}>
                                                    {printer.name} {printer.isDefault ? '(Default)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">Thermal Bill Size</label>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {(['3-inch', '4-inch'] as ReceiptPaperSize[]).map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setLocalBillPaperSize(size)}
                                                className={cn(
                                                    'rounded-2xl border px-4 py-4 text-left transition',
                                                    localBillPaperSize === size
                                                        ? 'border-slate-900 bg-slate-900 text-white shadow-lg dark:border-white dark:bg-white dark:text-slate-900'
                                                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-500'
                                                )}
                                            >
                                                <div className="text-sm font-bold">{size === '3-inch' ? '3 inch thermal roll' : '4 inch thermal roll'}</div>
                                                <p className={cn('mt-1 text-xs', localBillPaperSize === size ? 'text-white/80 dark:text-slate-600' : 'text-slate-500 dark:text-zinc-500')}>
                                                    {size === '3-inch' ? 'Compact counter bill format.' : 'Wider layout with larger item spacing.'}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid gap-3 md:grid-cols-2">
                                    <button onClick={() => handleTestPrint(true)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
                                        <Sparkles size={15} />
                                        Open Print Preview
                                    </button>
                                    <button onClick={() => handleTestPrint(false)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f172a,#334155)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.25)] transition hover:translate-y-[-1px]">
                                        <TestTube size={15} />
                                        Send Test Bill
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/75">
                            <div className="flex items-center gap-2">
                                <Palette size={18} className="text-violet-600 dark:text-violet-400" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Appearance & Billing Rules</h2>
                            </div>

                            <div className="mt-5 grid gap-5">
                                <div className="grid gap-3 md:grid-cols-3">
                                    {themeOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setLocalTheme(option.value)}
                                            className={cn(
                                                'rounded-2xl border px-4 py-4 text-left transition',
                                                localTheme === option.value
                                                    ? 'border-slate-900 bg-slate-900 text-white shadow-lg dark:border-white dark:bg-white dark:text-slate-900'
                                                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-500'
                                            )}
                                        >
                                            <option.icon size={18} />
                                            <div className="mt-3 text-sm font-bold">{option.label}</div>
                                        </button>
                                    ))}
                                </div>

                                <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">Tax Rate</label>
                                        <input type="number" min="0" step="0.01" value={localTaxRate} onChange={(event) => setLocalTaxRate(event.target.value)} disabled={!localTaxEnabled} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                                    </div>
                                    <button onClick={() => setLocalTaxEnabled(!localTaxEnabled)} className={cn('rounded-2xl px-4 py-3 text-sm font-semibold transition', localTaxEnabled ? 'bg-emerald-600 text-white' : 'border border-slate-200 bg-slate-50 text-slate-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300')}>
                                        {localTaxEnabled ? 'Tax Enabled' : 'Enable Tax'}
                                    </button>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                                        Currency: {localCurrency}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">Currency</label>
                                    <div className="grid gap-3 md:grid-cols-3">
                                        {[
                                            { value: 'INR', label: 'Indian Rupee' },
                                            { value: 'USD', label: 'US Dollar' },
                                            { value: 'EUR', label: 'Euro' },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => setLocalCurrency(option.value as typeof localCurrency)}
                                                className={cn(
                                                    'rounded-2xl border px-4 py-3 text-left transition',
                                                    localCurrency === option.value
                                                        ? 'border-slate-900 bg-slate-900 text-white shadow-lg dark:border-white dark:bg-white dark:text-slate-900'
                                                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-500'
                                                )}
                                            >
                                                <div className="text-sm font-bold">{option.value}</div>
                                                <p className={cn('mt-1 text-xs', localCurrency === option.value ? 'text-white/80 dark:text-slate-600' : 'text-slate-500 dark:text-zinc-500')}>
                                                    {option.label}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/75">
                            <div className="flex items-center gap-2">
                                <Scan size={18} className="text-amber-600 dark:text-amber-400" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Barcode Workflow</h2>
                            </div>
                            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                    Barcode labels now use the saved shop name from Settings and print price plus quantity on every label.
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="flex flex-col gap-5">
                        <section className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/75">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Bill Preview</p>
                                    <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Thermal receipt layout</h2>
                                </div>
                                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-zinc-800 dark:text-zinc-300">
                                    {localBillPaperSize === '3-inch' ? '3 inch' : '4 inch'}
                                </div>
                            </div>
                            <div className="mt-5 rounded-[28px] border border-dashed border-slate-300 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 dark:border-zinc-700 dark:bg-[linear-gradient(180deg,#111827_0%,#09090b_100%)]">
                                <div className="mx-auto flex min-h-[620px] items-center justify-center overflow-hidden rounded-[24px] border border-slate-200 bg-slate-200 p-3 dark:border-zinc-800 dark:bg-zinc-950">
                                    <iframe
                                        title="Receipt preview"
                                        srcDoc={previewHtml}
                                        className={cn('rounded-[20px] border-0 bg-white shadow-2xl', localBillPaperSize === '3-inch' ? 'h-[560px] w-[280px]' : 'h-[560px] w-[360px]')}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/75">
                            <div className="flex items-center gap-2">
                                <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Data Management</h2>
                            </div>
                            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    Clearing transaction history removes the old bill records permanently.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {!showDeleteConfirm ? (
                                        <button onClick={() => setShowDeleteConfirm(true)} className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
                                            Delete History
                                        </button>
                                    ) : (
                                        <>
                                            <button onClick={() => setShowDeleteConfirm(false)} className="rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-800 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-950/30">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    setIsDeleting(true);
                                                    try {
                                                        // @ts-ignore
                                                        const result = await window.api?.clearTransactionHistory?.();
                                                        if (result?.success) {
                                                            alert('Transaction history cleared.');
                                                        } else {
                                                            alert(result?.error || 'Failed to clear history.');
                                                        }
                                                    } finally {
                                                        setIsDeleting(false);
                                                        setShowDeleteConfirm(false);
                                                    }
                                                }}
                                                disabled={isDeleting}
                                                className="rounded-2xl bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                                            </button>
                                        </>
                                    )}
                                </div>
                                {showDeleteConfirm && (
                                    <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-white/70 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
                                        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                        This action cannot be undone.
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/75">
                            <div className="flex items-center gap-2">
                                <Sparkles size={18} className="text-slate-600 dark:text-zinc-300" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Save Changes</h2>
                            </div>
                            <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">Keep printer selections and bill size in settings</p>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">These values will be used by bill printing and barcode printing automatically.</p>
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={cn(
                                        'inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white transition',
                                        isSaving
                                            ? 'cursor-wait bg-slate-400'
                                            : showSaved
                                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                                : 'bg-[linear-gradient(135deg,#0f172a,#334155)] shadow-[0_18px_35px_rgba(15,23,42,0.25)] hover:translate-y-[-1px]'
                                    )}
                                >
                                    {showSaved ? <Check size={16} /> : <Save size={16} />}
                                    {isSaving ? 'Saving...' : showSaved ? 'Saved' : 'Save Settings'}
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
