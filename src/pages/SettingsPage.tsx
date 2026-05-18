import { useEffect, useMemo, useState } from 'react';
import {
    AlertTriangle, ArrowDownToLine, Check, CheckCircle2, Clock, Info, LoaderCircle, Monitor, Moon, Palette, Printer, RefreshCcw, Save, Settings, Sparkles, Store, Sun, TestTube, Trash2,
} from 'lucide-react';
import { useSettingsStore, type ReceiptPaperSize, type AppLanguage } from '../store/useSettingsStore';
import { generateReceiptHTML, printReceipt } from '../utils/receiptTemplate';
import { useUpdaterContext } from '../context/UpdaterContext';
import { useI18n } from '../i18n';
import { BillingModeToggle } from '../components/BillingModeToggle';

function cn(...classes: (string | undefined | null | false)[]) { return classes.filter(Boolean).join(' '); }

interface PrinterInfo { name: string; isDefault: boolean; }

export function SettingsPage() {
    const {
        storeName, setStoreName, storeAddress, setStoreAddress, storePhone, setStorePhone,
        receiptFooter, setReceiptFooter, taxRate, setTaxRate, taxEnabled, setTaxEnabled,
        currency, setCurrency, theme, setTheme, billPrinter, setBillPrinter,
        barcodePrinter, setBarcodePrinter, billPaperSize, setBillPaperSize,
        language, setLanguage, defaultBillingMode, setDefaultBillingMode,
        vendorsEnabled, setVendorsEnabled,
    } = useSettingsStore();
    const { t } = useI18n();

    const updater = useUpdaterContext();

    const [printers, setPrinters] = useState<PrinterInfo[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

    // Local state (unsaved)
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
    const [localLanguage, setLocalLanguage] = useState<AppLanguage>(language);
    const [localDefaultBillingMode, setLocalDefaultBillingMode] = useState(defaultBillingMode);
    const [localVendorsEnabled, setLocalVendorsEnabled] = useState(vendorsEnabled);

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
                if (suggested) { setLocalBillPrinter(suggested); if (!localBarcodePrinter) setLocalBarcodePrinter(suggested); }
            }
        };
        loadPrinters();
    }, []);

    const themeOptions = [
        { value: 'system', label: t('settings.system'), icon: Monitor },
        { value: 'light', label: t('settings.light'), icon: Sun },
        { value: 'dark', label: t('settings.dark'), icon: Moon },
    ] as const;

    const languageOptions: { value: AppLanguage; label: string }[] = [
        { value: 'en', label: t('settings.english') },
        { value: 'hi', label: t('settings.hindi') },
        { value: 'mr', label: t('settings.marathi') },
        { value: 'bn', label: t('settings.bengali') },
        { value: 'gu', label: t('settings.gujarati') },
    ];

    const previewReceiptData = useMemo(() => ({
        storeName: localStoreName || 'Your Store', storeAddress: localStoreAddress, storePhone: localStorePhone,
        footerMessage: localReceiptFooter || 'Thank you for your business!\nPlease visit again!',
        transactionId: 'PREVIEW-001', date: new Date().toLocaleString(),
        items: [
            { name: 'Premium Cotton Shirt', quantity: 2, price: 899, total: 1798 },
            { name: 'Classic Denim Jeans', quantity: 1, price: 1499, total: 1499 },
        ],
        subtotal: 3297,
        tax: localTaxEnabled ? (3297 * (parseFloat(localTaxRate) || 0)) / 100 : 0,
        taxRate: parseFloat(localTaxRate) || 0,
        total: localTaxEnabled ? 3297 + (3297 * (parseFloat(localTaxRate) || 0)) / 100 : 3297,
        paymentMethod: 'UPI', customerName: 'Harshavardhan Shinde', customerPhone: '8329089575', currencySymbol: '₹',
    }), [localReceiptFooter, localStoreAddress, localStoreName, localStorePhone, localTaxEnabled, localTaxRate]);

    const previewHtml = useMemo(() => generateReceiptHTML(previewReceiptData, { paperSize: localBillPaperSize, preview: true }), [localBillPaperSize, previewReceiptData]);

    const handleTestPrint = async (preview = false) => {
        await printReceipt({ ...previewReceiptData, transactionId: preview ? 'PREVIEW' : 'TEST' }, { paperSize: localBillPaperSize, printerName: localBillPrinter, preview });
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
        setLanguage(localLanguage);
        setDefaultBillingMode(localDefaultBillingMode);
        setVendorsEnabled(localVendorsEnabled);
        await new Promise((resolve) => setTimeout(resolve, 350));
        setIsSaving(false);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 1800);
    };

    const handleCheckForUpdates = async () => {
        if (!updater || isCheckingUpdate) return;
        setIsCheckingUpdate(true);
        await updater.checkForUpdates();
        setIsCheckingUpdate(false);
    };

    function formatLastChecked(date: Date | null) {
        if (!date) return 'Not checked yet';
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        if (diffSec < 60) return 'Just now';
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) return `${diffHr}h ago`;
        return date.toLocaleDateString();
    }

    return (
        <div className="h-full overflow-y-auto bg-slate-50 dark:bg-zinc-950">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
                {/* Header */}
                <div className="sticky top-0 z-20 -mx-4 flex items-center justify-between border-b border-slate-200 bg-slate-50/95 px-4 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-slate-900 p-2 text-white dark:bg-white dark:text-zinc-900">
                            <Settings size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white">{t('settings.title')}</h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">{t('settings.subtitle')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleSave} disabled={isSaving}
                            className={cn('inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition',
                                isSaving ? 'cursor-wait bg-slate-400' : showSaved ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100')}
                        >
                            {showSaved ? <Check size={14} /> : <Save size={14} />}
                            {isSaving ? t('common.saving') : showSaved ? t('common.saved') : t('common.save')}
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
                    {/* Left Column */}
                    <div className="flex flex-col gap-4">
                        {/* Store Identity */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                            <div className="flex items-center gap-2">
                                <Store size={16} className="text-slate-600 dark:text-zinc-300" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('settings.storeIdentity')}</h2>
                            </div>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('settings.storeName')}</label>
                                    <input value={localStoreName} onChange={(e) => setLocalStoreName(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('common.phone')}</label>
                                    <input value={localStorePhone} onChange={(e) => setLocalStorePhone(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('settings.address')}</label>
                                    <input value={localStoreAddress} onChange={(e) => setLocalStoreAddress(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('settings.receiptFooter')}</label>
                                    <textarea value={localReceiptFooter} onChange={(e) => setLocalReceiptFooter(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                                </div>
                            </div>
                        </div>

                        {/* Printer Routing */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                            <div className="flex items-center gap-2">
                                <Printer size={16} className="text-emerald-600 dark:text-emerald-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('settings.printerRouting')}</h2>
                            </div>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('settings.billPrinter')}</label>
                                    <select value={localBillPrinter} onChange={(e) => setLocalBillPrinter(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
                                        <option value="">{t('settings.selectBillPrinter')}</option>
                                        {printers.map((p) => <option key={p.name} value={p.name}>{p.name} {p.isDefault ? '(Default)' : ''}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('settings.barcodePrinter')}</label>
                                    <select value={localBarcodePrinter} onChange={(e) => setLocalBarcodePrinter(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
                                        <option value="">{t('settings.selectBarcodePrinter')}</option>
                                        {printers.map((p) => <option key={p.name} value={p.name}>{p.name} {p.isDefault ? '(Default)' : ''}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-3">
                                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('settings.thermalBillSize')}</label>
                                <div className="grid gap-2 md:grid-cols-2">
                                    {(['3-inch', '4-inch'] as ReceiptPaperSize[]).map((size) => (
                                        <button key={size} onClick={() => setLocalBillPaperSize(size)}
                                            className={cn('rounded-lg border px-3 py-2.5 text-left transition',
                                                localBillPaperSize === size ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-zinc-900' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300')}
                                        >
                                            <div className="text-xs font-bold">{size === '3-inch' ? '3 inch thermal roll' : '4 inch thermal roll'}</div>
                                            <p className={cn('mt-0.5 text-[11px]', localBillPaperSize === size ? 'text-white/70 dark:text-zinc-600' : 'text-slate-500 dark:text-zinc-500')}>
                                                {size === '3-inch' ? t('settings.compactCounterBill') : t('settings.widerLayout')}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button onClick={() => handleTestPrint(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
                                    <Sparkles size={13} /> {t('common.preview')}
                                </button>
                                <button onClick={() => handleTestPrint(false)} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
                                    <TestTube size={13} /> {t('common.print')}
                                </button>
                            </div>
                        </div>

                        {/* Appearance */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                            <div className="flex items-center gap-2">
                                <Palette size={16} className="text-violet-600 dark:text-violet-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('settings.appearanceBilling')}</h2>
                            </div>
                            <div className="mt-3 grid gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('settings.theme')}</label>
                                    <div className="grid gap-2 md:grid-cols-3">
                                        {themeOptions.map((option) => (
                                            <button key={option.value} onClick={() => setLocalTheme(option.value)}
                                                className={cn('flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition',
                                                    localTheme === option.value ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-zinc-900' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300')}
                                            >
                                                <option.icon size={14} />
                                                <span className="text-xs font-bold">{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">{t('settings.themeHint')}</p>
                                </div>

                                <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('settings.taxRate')}</label>
                                        <input type="number" min="0" step="0.01" value={localTaxRate} onChange={(e) => setLocalTaxRate(e.target.value)} disabled={!localTaxEnabled}
                                            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                                    </div>
                                    <button onClick={() => setLocalTaxEnabled(!localTaxEnabled)} className={cn('rounded-lg px-3 py-2 text-xs font-semibold transition', localTaxEnabled ? 'bg-emerald-600 text-white' : 'border border-slate-200 bg-slate-50 text-slate-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300')}>
                                        {localTaxEnabled ? t('settings.taxOn') : t('settings.taxOff')}
                                    </button>
                                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                                        {localCurrency}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('settings.currency')}</label>
                                    <div className="grid gap-2 md:grid-cols-3">
                                        {[{ value: 'INR', label: 'Indian Rupee' }, { value: 'USD', label: 'US Dollar' }, { value: 'EUR', label: 'Euro' }].map((opt) => (
                                            <button key={opt.value} onClick={() => setLocalCurrency(opt.value as typeof localCurrency)}
                                                className={cn('rounded-lg border px-3 py-2 text-left transition',
                                                    localCurrency === opt.value ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-zinc-900' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300')}
                                            >
                                                <div className="text-xs font-bold">{opt.value}</div>
                                                <p className={cn('mt-0.5 text-[11px]', localCurrency === opt.value ? 'text-white/70 dark:text-zinc-600' : 'text-slate-500 dark:text-zinc-500')}>{opt.label}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                            <div className="flex items-center gap-2">
                                <Info size={16} className="text-sky-600 dark:text-sky-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('settings.modulesLanguage')}</h2>
                            </div>
                            <div className="mt-3 grid gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('settings.language')}</label>
                                    <div className="grid gap-2 md:grid-cols-5">
                                        {languageOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => setLocalLanguage(option.value)}
                                                className={cn(
                                                    'rounded-lg border px-3 py-2 text-xs font-semibold transition',
                                                    localLanguage === option.value
                                                        ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
                                                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300'
                                                )}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">{t('settings.languageHint')}</p>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('settings.defaultBillingMode')}</label>
                                    <BillingModeToggle
                                        value={localDefaultBillingMode}
                                        onChange={setLocalDefaultBillingMode}
                                        retailLabel={t('settings.retail')}
                                        wholesaleLabel={t('settings.wholesale')}
                                    />
                                    <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">{t('settings.defaultBillingModeHint')}</p>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('settings.vendorsPage')}</label>
                                    <div className="grid gap-2 md:grid-cols-2">
                                        {[
                                            { value: true, label: t('common.visible') },
                                            { value: false, label: t('common.hidden') },
                                        ].map((option) => (
                                            <button
                                                key={String(option.value)}
                                                onClick={() => setLocalVendorsEnabled(option.value)}
                                                className={cn(
                                                    'rounded-lg border px-3 py-2 text-xs font-semibold transition',
                                                    localVendorsEnabled === option.value
                                                        ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
                                                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300'
                                                )}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">{t('settings.vendorsPageHint')}</p>
                                </div>
                            </div>
                        </div>

                        {/* App Updates */}
                        {updater && (
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                            <div className="flex items-center gap-2">
                                <RefreshCcw size={16} className="text-sky-600 dark:text-sky-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">App Updates</h2>
                            </div>

                            {/* Version row */}
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                                <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-950">
                                    <p className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">Installed version</p>
                                    <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-zinc-100">
                                        {updater.state.currentVersion ?? '-'}
                                    </p>
                                </div>

                                <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-950">
                                    <p className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">Available version</p>
                                    <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-zinc-100">
                                        {updater.state.availableVersion ?? (updater.state.status === 'idle' && updater.state.lastCheckedAt ? 'Up to date' : '-')}
                                    </p>
                                </div>
                            </div>

                            {/* Status chip row */}
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                {updater.state.status === 'idle' && updater.state.lastCheckedAt && !updater.state.availableVersion && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                        <CheckCircle2 size={12} /> You're on the latest version
                                    </span>
                                )}
                                {updater.state.status === 'checking' && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                                        <LoaderCircle size={12} className="animate-spin" /> Checking for updates...
                                    </span>
                                )}
                                {updater.state.status === 'available' && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                        <ArrowDownToLine size={12} /> Update available - see banner above
                                    </span>
                                )}
                                {updater.state.status === 'downloading' && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                                        <LoaderCircle size={12} className="animate-spin" /> Downloading {updater.state.progressPercent}%
                                    </span>
                                )}
                                {updater.state.status === 'ready' && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                                        <Check size={12} /> Ready to restart
                                    </span>
                                )}

                                <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-500">
                                    <Clock size={11} />
                                    Last checked: {formatLastChecked(updater.state.lastCheckedAt)}
                                </span>
                            </div>

                            {/* Error */}
                            {updater.state.error && (
                                <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-300">
                                    <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                                    <span className="break-all">{updater.state.error}</span>
                                </div>
                            )}

                            {/* Manual check button */}
                            <div className="mt-3 flex items-center gap-2">
                                <button
                                    id="settings-check-updates-btn"
                                    onClick={() => void handleCheckForUpdates()}
                                    disabled={isCheckingUpdate || updater.state.status === 'checking' || updater.state.status === 'downloading'}
                                    className={cn(
                                        'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition',
                                        isCheckingUpdate || updater.state.status === 'checking'
                                            ? 'cursor-wait bg-slate-200 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400'
                                            : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100',
                                        updater.state.status === 'downloading' && 'cursor-not-allowed opacity-60'
                                    )}
                                >
                                    {isCheckingUpdate || updater.state.status === 'checking' ? (
                                        <><LoaderCircle size={13} className="animate-spin" /> Checking...</>
                                    ) : (
                                        <><RefreshCcw size={13} /> Check for updates</>
                                    )}
                                </button>

                                <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-500">
                                    <Info size={12} />
                                    App auto-checks on startup
                                </div>
                            </div>
                        </div>
                        )}

                        {/* Data Management */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                            <div className="flex items-center gap-2">
                                <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('settings.dataManagement')}</h2>
                            </div>
                            <div className="mt-3 rounded-lg border border-red-100 bg-red-50 p-3 dark:border-red-900/30 dark:bg-red-950/10">
                                <p className="text-xs text-red-700 dark:text-red-300">{t('settings.deleteHistoryHint')}</p>
                                <div className="mt-2 flex gap-2">
                                    {!showDeleteConfirm ? (
                                        <button onClick={() => setShowDeleteConfirm(true)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700">{t('settings.deleteHistory')}</button>
                                    ) : (
                                        <>
                                            <button onClick={() => setShowDeleteConfirm(false)} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-800 dark:bg-transparent dark:text-red-300">{t('common.cancel')}</button>
                                            <button onClick={async () => {
                                                setIsDeleting(true);
                                                try {
                                                    // @ts-ignore
                                                    const result = await window.api?.clearTransactionHistory?.();
                                                    alert(result?.success ? 'Transaction history cleared.' : (result?.error || 'Failed to clear history.'));
                                                } finally { setIsDeleting(false); setShowDeleteConfirm(false); }
                                            }} disabled={isDeleting} className="rounded-lg bg-red-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-800 disabled:opacity-60">
                                                {isDeleting ? 'Deleting...' : t('settings.confirmDelete')}
                                            </button>
                                        </>
                                    )}
                                </div>
                                {showDeleteConfirm && (
                                    <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-red-700 dark:border-red-900/30 dark:bg-red-950/10 dark:text-red-300">
                                        <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {t('settings.cannotUndo')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Preview */}
                    <div className="flex flex-col gap-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('settings.receiptPreview')}</h2>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">{t('settings.receiptPreviewPaper', { paper: localBillPaperSize === '3-inch' ? '3 inch' : '4 inch' })}</p>
                                </div>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">{localBillPaperSize === '3-inch' ? '3"' : '4"'}</span>
                            </div>
                            <div className="mt-3 flex justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-3 dark:border-zinc-700 dark:bg-zinc-950">
                                <iframe title="Receipt preview" srcDoc={previewHtml} className={cn('rounded-lg border-0 bg-white shadow-lg', localBillPaperSize === '3-inch' ? 'h-[420px] w-[240px]' : 'h-[420px] w-[300px]')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
