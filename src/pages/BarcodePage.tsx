import { useEffect, useRef, useState } from 'react';
import { Barcode, Check, Package, Printer, Save, Search, Trash2 } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { useLocation } from 'react-router-dom';
import { getCurrencySymbol, useSettingsStore } from '../store/useSettingsStore';
import { generateBarcodeBatchHTML } from '../utils/barcodeTemplate';
import type { Product } from '../types';
import { useI18n } from '../i18n';

type WindowWithApi = Window & {
    api?: {
        getProducts?: (args: { page: number; pageSize: number; search: string; category: string }) => Promise<{ products?: Product[] }>;
        printBarcode?: (html: string, printerName?: string) => Promise<{ success?: boolean; error?: string }>;
    };
};

interface SavedBarcode {
    id: string;
    sku: string;
    title: string;
    priceOption: 'retail' | 'wholesale';
    printedPrice: number;
    quantity: number;
    storeLabelName: string;
    showStoreName: boolean;
    showTitle: boolean;
    createdAt: string;
}

const STORAGE_KEY = 'loomix-barcode-printing-tray';
const MAX_SAVED_BARCODES = 100;

function createBarcodeSvgMarkup(barcodeValue: string) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    JsBarcode(svg, barcodeValue, {
        format: 'CODE128',
        width: 1.7,
        height: 38,
        displayValue: true,
        fontSize: 11,
        margin: 0,
        background: '#ffffff',
        lineColor: '#000000',
    });
    return new XMLSerializer().serializeToString(svg);
}

function formatDate(value: string) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Saved';
    return parsed.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
}

function LiveBarcodePreview({
    sku,
    title,
    printedPrice,
    storeLabelName,
    showStoreName,
    showTitle,
    priceOption,
    emptyLabel,
    retailLabel,
    wholesaleLabel,
}: {
    sku: string;
    title: string;
    printedPrice: string;
    storeLabelName: string;
    showStoreName: boolean;
    showTitle: boolean;
    priceOption: 'retail' | 'wholesale';
    emptyLabel: string;
    retailLabel: string;
    wholesaleLabel: string;
}) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !sku) return;
        try {
            JsBarcode(svgRef.current, sku, {
                format: 'CODE128',
                width: 1.55,
                height: 34,
                displayValue: true,
                fontSize: 10,
                margin: 0,
                background: '#ffffff',
                lineColor: '#000000',
            });
        } catch {
            svgRef.current.innerHTML = '';
        }
    }, [sku]);

    if (!sku) {
        return (
            <div className="flex h-28 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white text-slate-400 dark:border-zinc-700 dark:bg-zinc-950">
                <Barcode size={24} className="opacity-40" />
                <p className="mt-2 text-xs font-semibold">{emptyLabel}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto flex min-h-[118px] w-full max-w-[220px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-black shadow-sm">
            {showStoreName && storeLabelName ? (
                <div className="mb-0.5 max-w-full truncate text-center text-[9px] font-black uppercase tracking-wider">
                    {storeLabelName}
                </div>
            ) : null}
            {showTitle && title ? (
                <div className="mb-1 max-w-full truncate text-center text-[10px] font-semibold">{title}</div>
            ) : null}
            <svg ref={svgRef} className="max-w-full" />
            <div className="mt-1 text-center text-[10px] font-black">
                {priceOption === 'retail' ? retailLabel : wholesaleLabel}: {printedPrice}
            </div>
        </div>
    );
}

export function BarcodePage() {
    const { storeName, barcodePrinter, currency } = useSettingsStore();
    const { t } = useI18n();
    const currencySymbol = getCurrencySymbol(currency);
    const location = useLocation();

    const [sku, setSku] = useState('');
    const [title, setTitle] = useState('');
    const [priceOption, setPriceOption] = useState<'retail' | 'wholesale'>('retail');
    const [printedPrice, setPrintedPrice] = useState(0);
    const [quantity, setQuantity] = useState(10);
    const [storeLabelName, setStoreLabelName] = useState(storeName || 'My Store');
    const [showStoreName, setShowStoreName] = useState(true);
    const [showTitle, setShowTitle] = useState(true);

    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [savedBarcodes, setSavedBarcodes] = useState<SavedBarcode[]>([]);
    const [printing, setPrinting] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);

    useEffect(() => {
        const stateProd = location.state?.product as Product | undefined;
        if (stateProd) selectProduct(stateProd);
    }, [location.state]);

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw) as SavedBarcode[];
            if (Array.isArray(parsed)) setSavedBarcodes(parsed.slice(0, MAX_SAVED_BARCODES));
        } catch {
            setSavedBarcodes([]);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBarcodes.slice(0, MAX_SAVED_BARCODES)));
    }, [savedBarcodes]);

    const selectProduct = (product: Product) => {
        setSku(product.sku);
        setTitle(product.name);
        setPriceOption('retail');
        setPrintedPrice(product.price);
        setQuantity(10);
        setSearchQuery('');
        setShowSearchDropdown(false);
        setError('');
    };

    const loadSavedBarcode = (item: SavedBarcode) => {
        setSku(item.sku);
        setTitle(item.title);
        setPriceOption(item.priceOption);
        setPrintedPrice(item.printedPrice);
        setQuantity(item.quantity);
        setStoreLabelName(item.storeLabelName);
        setShowStoreName(item.showStoreName);
        setShowTitle(item.showTitle);
        setError('');
        setStatus(t('barcode.loadedMockup'));
        window.setTimeout(() => setStatus(''), 1200);
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }

        setIsSearching(true);
        setShowSearchDropdown(true);
        try {
            const response = await (window as WindowWithApi).api?.getProducts?.({ page: 1, pageSize: 10, search: query, category: 'all' });
            setSearchResults(response?.products || []);
        } catch {
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const saveCurrentBarcode = () => {
        if (!sku.trim()) {
            setError(t('barcode.skuRequiredSave'));
            return;
        }

        const item: SavedBarcode = {
            id: `${Date.now()}-${sku}`,
            sku: sku.trim(),
            title: title.trim(),
            priceOption,
            printedPrice: Number(printedPrice) || 0,
            quantity: Math.max(1, Number(quantity) || 1),
            storeLabelName: storeLabelName.trim() || 'Store',
            showStoreName,
            showTitle,
            createdAt: new Date().toISOString(),
        };

        setSavedBarcodes((previous) => [item, ...previous.filter((saved) => saved.sku !== item.sku)].slice(0, MAX_SAVED_BARCODES));
        setError('');
        setStatus(
            t('barcode.savedStatus', {
                count: Math.min(savedBarcodes.length + 1, MAX_SAVED_BARCODES),
                limit: MAX_SAVED_BARCODES,
            })
        );
        window.setTimeout(() => setStatus(''), 1600);
    };

    const removeSavedBarcode = (id: string) => {
        setSavedBarcodes((previous) => previous.filter((item) => item.id !== id));
    };

    const printCurrentBarcode = async () => {
        if (!sku.trim()) {
            setError(t('barcode.skuRequiredPrint'));
            return;
        }

        setPrinting(true);
        setError('');

        const html = generateBarcodeBatchHTML([
            {
                storeName: showStoreName ? storeLabelName : '',
                title: showTitle ? title : '',
                barcodeValue: sku.trim(),
                svgMarkup: createBarcodeSvgMarkup(sku.trim()),
                price: Number(printedPrice) || 0,
                priceLabel: `${priceOption === 'retail' ? t('barcode.retail') : t('barcode.wholesale')}: ${currencySymbol}${Number(printedPrice || 0).toFixed(2)}`,
                quantity: Math.max(1, Number(quantity) || 1),
                currencySymbol,
            },
        ]);

        try {
            const result = await (window as WindowWithApi).api?.printBarcode?.(html, barcodePrinter || undefined);
            if (result?.success === false) {
                setError(result.error || t('barcode.printFailed'));
            } else {
                setStatus(t('barcode.printDialogOpened'));
                window.setTimeout(() => setStatus(''), 1400);
            }
        } catch {
            setError(t('barcode.printFailed'));
        } finally {
            setPrinting(false);
        }
    };

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden overscroll-contain bg-slate-50 dark:bg-zinc-950/50">
            <div className="mx-auto flex h-full min-h-0 w-full max-w-[1900px] flex-col p-4">
            <div className="mb-3 flex shrink-0 flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-slate-950 p-2 text-white shadow-sm dark:bg-white dark:text-zinc-950">
                        <Barcode size={21} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-slate-900 dark:text-white">{t('barcode.title')}</h1>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">{t('barcode.subtitle')}</p>
                    </div>
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                    {t('barcode.savedCount', { count: savedBarcodes.length, limit: MAX_SAVED_BARCODES })}
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-4 2xl:grid 2xl:grid-cols-[minmax(520px,0.92fr)_minmax(580px,1.08fr)]">
                <section className="shrink-0 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 2xl:flex 2xl:min-h-0 2xl:flex-col 2xl:overflow-hidden">
                    <div className="p-4 2xl:min-h-0 2xl:flex-1">
                        <div className="grid gap-4 lg:grid-cols-[minmax(300px,380px)_minmax(0,1fr)]">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                                <div className="mb-2 flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-zinc-200">
                                        <Package size={14} /> {t('barcode.liveMockup')}
                                    </h2>
                                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-black text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                        {quantity}x
                                    </span>
                                </div>
                                <LiveBarcodePreview
                                    sku={sku}
                                    title={title}
                                    printedPrice={`${currencySymbol}${Number(printedPrice || 0).toFixed(2)}`}
                                    storeLabelName={storeLabelName}
                                    showStoreName={showStoreName}
                                    showTitle={showTitle}
                                    priceOption={priceOption}
                                    emptyLabel={t('barcode.searchOrEnterSku')}
                                    retailLabel={t('barcode.retail')}
                                    wholesaleLabel={t('barcode.wholesale')}
                                />
                                <button
                                    onClick={printCurrentBarcode}
                                    disabled={printing || !sku}
                                    className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-white dark:text-zinc-950"
                                >
                                    <Printer size={15} /> {printing ? t('barcode.openingPrint') : t('barcode.printLabel')}
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="relative">
                                    <label className="mb-1 block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                                        {t('barcode.searchProduct')}
                                    </label>
                                    <Search size={15} className="absolute left-3 top-[34px] text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(event) => void handleSearch(event.target.value)}
                                        placeholder={t('barcode.skuOrName')}
                                        className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                                    />
                                    {showSearchDropdown ? (
                                        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
                                            {isSearching ? (
                                                <div className="p-3 text-center text-xs text-slate-500">{t('barcode.searching')}</div>
                                            ) : searchResults.length > 0 ? (
                                                searchResults.map((product) => (
                                                    <button
                                                        key={product.id}
                                                        onClick={() => selectProduct(product)}
                                                        className="flex w-full items-center justify-between border-b border-slate-100 p-3 text-left last:border-0 hover:bg-slate-50 dark:border-zinc-700/50 dark:hover:bg-zinc-700/50"
                                                    >
                                                        <span className="min-w-0">
                                                            <span className="block truncate text-sm font-bold text-slate-800 dark:text-zinc-100">{product.name}</span>
                                                            <span className="block font-mono text-xs text-slate-500">{product.sku}</span>
                                                        </span>
                                                        <span className="shrink-0 text-sm font-black text-indigo-600">{currencySymbol}{product.price}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-3 text-center text-xs text-slate-500">{t('barcode.noProductsFound')}</div>
                                            )}
                                        </div>
                                    ) : null}
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field label={t('barcode.sku')}>
                                        <input value={sku} onChange={(event) => setSku(event.target.value)} className={inputClassName} />
                                    </Field>
                                    <Field label={t('barcode.productTitle')}>
                                        <input value={title} onChange={(event) => setTitle(event.target.value)} className={inputClassName} />
                                    </Field>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    <Field label={t('barcode.priceType')}>
                                        <select value={priceOption} onChange={(event) => setPriceOption(event.target.value as 'retail' | 'wholesale')} className={inputClassName}>
                                            <option value="retail">{t('barcode.retail')}</option>
                                            <option value="wholesale">{t('barcode.wholesale')}</option>
                                        </select>
                                    </Field>
                                    <Field label={t('barcode.price', { currency: currencySymbol })}>
                                        <input type="number" value={printedPrice} onChange={(event) => setPrintedPrice(Number(event.target.value))} className={inputClassName} />
                                    </Field>
                                    <Field label={t('barcode.qty')}>
                                        <input type="number" min="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className={inputClassName} />
                                    </Field>
                                </div>

                                <Field label={t('barcode.storeLabel')}>
                                    <input value={storeLabelName} onChange={(event) => setStoreLabelName(event.target.value)} className={inputClassName} />
                                </Field>

                                <div className="grid gap-2 sm:grid-cols-2">
                                    <Toggle checked={showStoreName} label={t('barcode.showStoreName')} onChange={setShowStoreName} />
                                    <Toggle checked={showTitle} label={t('barcode.showTitle')} onChange={setShowTitle} />
                                </div>

                                {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600">{error}</p> : null}
                                {status ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">{status}</p> : null}
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 border-t border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                        <button
                            onClick={saveCurrentBarcode}
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-black text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <Save size={16} /> {t('barcode.saveBarcode')}
                        </button>
                    </div>
                </section>

                <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-zinc-800">
                        <div>
                            <h2 className="text-sm font-black text-slate-900 dark:text-white">{t('barcode.savedBarcodes')}</h2>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">{t('barcode.loadSavedHint')}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                            {t('barcode.maxCount', { limit: MAX_SAVED_BARCODES })}
                        </span>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto p-4">
                        {savedBarcodes.length === 0 ? (
                            <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 dark:border-zinc-700">
                                <Barcode size={30} className="mb-2 opacity-40" />
                                <p className="text-sm font-black">{t('barcode.noSavedBarcodes')}</p>
                                <p className="mt-1 text-xs">{t('barcode.createAndSaveHint')}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3">
                                {savedBarcodes.map((item) => (
                                    <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/70">
                                        <div className="mb-2 flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-black text-slate-900 dark:text-white">{item.title || t('barcode.untitledProduct')}</p>
                                                <p className="font-mono text-xs text-slate-500">{item.sku}</p>
                                            </div>
                                            <button onClick={() => removeSavedBarcode(item.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 dark:border-zinc-800">
                                            <LiveBarcodePreview
                                                sku={item.sku}
                                                title={item.title}
                                                printedPrice={`${currencySymbol}${Number(item.printedPrice || 0).toFixed(2)}`}
                                                storeLabelName={item.storeLabelName}
                                                showStoreName={item.showStoreName}
                                                showTitle={item.showTitle}
                                                priceOption={item.priceOption}
                                                emptyLabel={t('barcode.searchOrEnterSku')}
                                                retailLabel={t('barcode.retail')}
                                                wholesaleLabel={t('barcode.wholesale')}
                                            />
                                        </div>

                                        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
                                            <Stat label={t('barcode.qty')} value={`${item.quantity}`} />
                                            <Stat label={t('barcode.type')} value={item.priceOption === 'retail' ? t('barcode.retail') : t('barcode.wholesale')} />
                                            <Stat label={t('barcode.savedOn')} value={formatDate(item.createdAt)} />
                                        </div>

                                        <button
                                            onClick={() => loadSavedBarcode(item)}
                                            className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-black text-white transition hover:bg-slate-800 dark:bg-white dark:text-zinc-950"
                                        >
                                            <Check size={14} /> {t('barcode.loadToMockup')}
                                        </button>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
            </div>
        </div>
    );
}

const inputClassName = 'h-9 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="mb-1 block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">{label}</span>
            {children}
        </label>
    );
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`flex h-9 items-center justify-between rounded-xl border px-3 text-xs font-black transition ${
                checked
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/40 dark:text-indigo-300'
                    : 'border-slate-200 bg-white text-slate-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400'
            }`}
        >
            <span>{label}</span>
            <span className={`h-2.5 w-2.5 rounded-full ${checked ? 'bg-indigo-600' : 'bg-slate-300'}`} />
        </button>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg bg-white px-2 py-1.5 dark:bg-zinc-900">
            <p className="font-black uppercase tracking-wider text-slate-400">{label}</p>
            <p className="truncate font-black capitalize text-slate-700 dark:text-zinc-200">{value}</p>
        </div>
    );
}
