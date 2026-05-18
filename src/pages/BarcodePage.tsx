import { useEffect, useMemo, useRef, useState } from 'react';
import { Barcode, Check, Copy, Download, History, Printer, RefreshCw, Square, Store, Tag, Trash2 } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { getCurrencySymbol, useSettingsStore } from '../store/useSettingsStore';
import { generateBarcodeBatchHTML, generateBarcodeLabelHTML } from '../utils/barcodeTemplate';
import { useI18n } from '../i18n';

function cn(...classes: (string | undefined | null | false)[]) { return classes.filter(Boolean).join(' '); }

type BarcodeFormat = 'CODE128' | 'EAN13' | 'EAN8' | 'UPC' | 'CODE39';

interface SavedBarcode {
    id: string;
    barcodeValue: string;
    format: BarcodeFormat;
    price: number;
    quantity: number;
    createdAt: string;
}

const STORAGE_KEY = 'loomix-barcode-history';
const MAX_SAVED_BARCODES = 100;

function createBarcodeSvgMarkup(barcodeValue: string, format: BarcodeFormat) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    JsBarcode(svg, barcodeValue, {
        format,
        width: 2,
        height: 48,
        displayValue: true,
        fontSize: 12,
        margin: 0,
        background: '#ffffff',
        lineColor: '#000000',
    });
    return new XMLSerializer().serializeToString(svg);
}

function formatSavedTime(value: string) {
    const date = new Date(value);
    return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function SavedBarcodePreview({ barcodeValue, format }: { barcodeValue: string; format: BarcodeFormat; }) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;
        try {
            JsBarcode(svgRef.current, barcodeValue, {
                format,
                width: 1.4,
                height: 26,
                displayValue: false,
                margin: 0,
                background: '#ffffff',
                lineColor: '#111827',
            });
        } catch {
            svgRef.current.innerHTML = '';
        }
    }, [barcodeValue, format]);

    return <svg ref={svgRef} className="h-8 w-full"></svg>;
}

export function BarcodePage() {
    const { storeName, barcodePrinter, currency } = useSettingsStore();
    const { t } = useI18n();
    const currencySymbol = getCurrencySymbol(currency);
    const [barcodeValue, setBarcodeValue] = useState('');
    const [format, setFormat] = useState<BarcodeFormat>('CODE128');
    const [price, setPrice] = useState('0');
    const [quantity, setQuantity] = useState('1');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [printStatus, setPrintStatus] = useState<'idle' | 'printing' | 'done'>('idle');
    const [savedBarcodes, setSavedBarcodes] = useState<SavedBarcode[]>([]);
    const [selectedSavedIds, setSelectedSavedIds] = useState<string[]>([]);
    const [savedMessage, setSavedMessage] = useState<'idle' | 'saved'>('idle');
    const [bulkPrintStatus, setBulkPrintStatus] = useState<'idle' | 'printing' | 'done'>('idle');
    const svgRef = useRef<SVGSVGElement>(null);

    const totalCopies = useMemo(() => Math.max(1, parseInt(quantity || '1', 10) || 1), [quantity]);
    const parsedPrice = useMemo(() => Math.max(0, parseFloat(price || '0') || 0), [price]);

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw) as SavedBarcode[];
            if (Array.isArray(parsed)) {
                setSavedBarcodes(parsed.slice(0, MAX_SAVED_BARCODES));
            }
        } catch {
            setSavedBarcodes([]);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBarcodes.slice(0, MAX_SAVED_BARCODES)));
    }, [savedBarcodes]);

    useEffect(() => {
        if (!barcodeValue || !svgRef.current) { setError(''); return; }
        try {
            JsBarcode(svgRef.current, barcodeValue, { format, width: 2, height: 48, displayValue: true, fontSize: 12, margin: 0, background: '#ffffff', lineColor: '#000000' });
            setError('');
        } catch (e: any) { setError(t('barcode.invalid', { message: e.message || 'Check format and value' })); }
    }, [barcodeValue, format, t]);

    const formatHints: Record<BarcodeFormat, string> = {
        CODE128: t('barcode.hint.code128'),
        EAN13: t('barcode.hint.ean13'),
        EAN8: t('barcode.hint.ean8'),
        UPC: t('barcode.hint.upc'),
        CODE39: t('barcode.hint.code39'),
    };

    const canUseCurrentBarcode = Boolean(barcodeValue.trim()) && !error;
    const allSelected = savedBarcodes.length > 0 && selectedSavedIds.length === savedBarcodes.length;
    const selectedBarcodes = savedBarcodes.filter((item) => selectedSavedIds.includes(item.id));

    const getCurrentSavedBarcode = (): SavedBarcode | null => {
        if (!canUseCurrentBarcode) return null;
        return {
            id: `${format}:${barcodeValue.trim()}`,
            barcodeValue: barcodeValue.trim(),
            format,
            price: parsedPrice,
            quantity: totalCopies,
            createdAt: new Date().toISOString(),
        };
    };

    const saveBarcode = (entry: SavedBarcode) => {
        setSavedBarcodes((current) => {
            const next = [entry, ...current.filter((item) => item.id !== entry.id)];
            return next.slice(0, MAX_SAVED_BARCODES);
        });
        setSavedMessage('saved');
        window.setTimeout(() => setSavedMessage('idle'), 1500);
    };

    const handleSaveCurrent = () => {
        const entry = getCurrentSavedBarcode();
        if (!entry) return;
        saveBarcode(entry);
    };

    const printHtml = async (html: string, mode: 'single' | 'bulk') => {
        if (mode === 'single') setPrintStatus('printing');
        if (mode === 'bulk') setBulkPrintStatus('printing');

        try {
            // @ts-ignore
            const result = await window.api?.printBarcode?.(html, barcodePrinter || undefined);
            if (!result || result.success) {
                if (mode === 'single') {
                    setPrintStatus('done');
                    window.setTimeout(() => setPrintStatus('idle'), 1800);
                } else {
                    setBulkPrintStatus('done');
                    window.setTimeout(() => setBulkPrintStatus('idle'), 1800);
                }
                return;
            }

            if (mode === 'single') setPrintStatus('idle');
            if (mode === 'bulk') setBulkPrintStatus('idle');
            alert(result.error || 'Unable to print barcode labels.');
        } catch {
            if (mode === 'single') setPrintStatus('idle');
            if (mode === 'bulk') setBulkPrintStatus('idle');
            alert('Unable to print barcode labels.');
        }
    };

    const buildSavedBarcodeHtml = (items: SavedBarcode[]) => {
        const labels = items.map((item) => ({
            storeName: storeName || 'Store',
            barcodeValue: item.barcodeValue,
            svgMarkup: createBarcodeSvgMarkup(item.barcodeValue, item.format),
            price: item.price,
            quantity: item.quantity,
            currencySymbol,
        }));
        return generateBarcodeBatchHTML(labels);
    };

    const handleDownload = () => {
        if (!svgRef.current || error) return;
        const current = getCurrentSavedBarcode();
        if (current) saveBarcode(current);

        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `barcode_${barcodeValue}.svg`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleCopy = async () => {
        if (!barcodeValue) return;
        await navigator.clipboard.writeText(barcodeValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const handlePrint = async () => {
        if (!barcodeValue || !svgRef.current || error) return;
        const current = getCurrentSavedBarcode();
        if (current) saveBarcode(current);
        const svgMarkup = new XMLSerializer().serializeToString(svgRef.current);
        const html = generateBarcodeLabelHTML({
            storeName: storeName || 'Store',
            barcodeValue,
            svgMarkup,
            price: parsedPrice,
            quantity: totalCopies,
            currencySymbol,
        });
        await printHtml(html, 'single');
    };

    const handleQuickPrintSaved = async (item: SavedBarcode) => {
        const html = buildSavedBarcodeHtml([item]);
        await printHtml(html, 'bulk');
    };

    const handlePrintSelected = async () => {
        if (selectedBarcodes.length === 0) return;
        const html = buildSavedBarcodeHtml(selectedBarcodes);
        await printHtml(html, 'bulk');
    };

    const handleLoadSaved = (item: SavedBarcode) => {
        setBarcodeValue(item.barcodeValue);
        setFormat(item.format);
        setPrice(item.price.toString());
        setQuantity(item.quantity.toString());
    };

    const toggleSelected = (id: string) => {
        setSelectedSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    };

    const toggleSelectAll = () => {
        setSelectedSavedIds(allSelected ? [] : savedBarcodes.map((item) => item.id));
    };

    const clearSavedBarcodes = () => {
        setSavedBarcodes([]);
        setSelectedSavedIds([]);
    };

    const removeSavedBarcode = (id: string) => {
        setSavedBarcodes((current) => current.filter((item) => item.id !== id));
        setSelectedSavedIds((current) => current.filter((item) => item !== id));
    };

    return (
        <div className="h-full overflow-y-auto bg-slate-50 dark:bg-zinc-950">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-slate-900 p-2 text-white dark:bg-white dark:text-zinc-900">
                            <Barcode size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white">{t('barcode.title')}</h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">{t('barcode.subtitle')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800">
                        <Store size={12} className="text-slate-400" />
                        <span className="font-medium text-slate-700 dark:text-zinc-200">{storeName || 'Add in Settings'}</span>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('barcode.createLabel')}</h2>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">{formatHints[format]}</span>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('barcode.barcodeValue')}</label>
                                <div className="relative">
                                    <input type="text" value={barcodeValue} onChange={(e) => setBarcodeValue(e.target.value)} placeholder={t('barcode.enterCode')}
                                        className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                                    <button onClick={handleCopy} disabled={!barcodeValue} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 dark:hover:bg-zinc-800">
                                        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('barcode.format')}</label>
                                <select value={format} onChange={(e) => setFormat(e.target.value as BarcodeFormat)}
                                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
                                    <option value="CODE128">CODE 128</option>
                                    <option value="EAN13">EAN-13</option>
                                    <option value="EAN8">EAN-8</option>
                                    <option value="UPC">UPC</option>
                                    <option value="CODE39">CODE 39</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('common.price')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{currencySymbol}</span>
                                    <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
                                        className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t('common.copies')}</label>
                                <input type="number" min="1" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                            </div>

                            <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/60">
                                <Tag size={14} className="text-slate-400" />
                                <span className="text-xs text-slate-600 dark:text-zinc-300">{t('barcode.copiesSummary', { price: `${currencySymbol} ${parsedPrice.toFixed(2)}`, count: totalCopies, copies: totalCopies > 1 ? 'copies' : 'copy' })}</span>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
                                {error}
                            </div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                            <button onClick={() => { setBarcodeValue(''); setPrice('0'); setQuantity('1'); }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                <RefreshCw size={13} /> {t('common.clear')}
                            </button>
                            <button onClick={handleSaveCurrent} disabled={!canUseCurrentBarcode}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                <History size={13} /> {savedMessage === 'saved' ? 'Saved' : 'Save to Recent'}
                            </button>
                            <button onClick={handleDownload} disabled={!barcodeValue || !!error}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                <Download size={13} /> {t('barcode.downloadSvg')}
                            </button>
                            <button onClick={handlePrint} disabled={!barcodeValue || !!error}
                                className={cn('inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white transition',
                                    !barcodeValue || !!error ? 'cursor-not-allowed bg-slate-300 dark:bg-zinc-700' : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100')}
                            >
                                {printStatus === 'printing' ? t('barcode.printing') : printStatus === 'done' ? t('barcode.printed') : t('barcode.printLabels')}
                                <Printer size={13} />
                            </button>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('barcode.livePreview')}</h2>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">{t('barcode.previewHint')}</p>

                        <div className="mt-4 flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 dark:border-zinc-700 dark:bg-zinc-950">
                            <div className="w-full max-w-[260px] rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-white">
                                {barcodeValue ? (
                                    error ? (
                                        <div className="text-center text-xs font-medium text-red-500">{error}</div>
                                    ) : (
                                        <div className="w-full">
                                            <div className="text-center text-[10px] font-bold uppercase tracking-wider text-black">{storeName || 'Store Name'}</div>
                                            <div className="mt-1 flex justify-center">
                                                <svg ref={svgRef}></svg>
                                            </div>
                                            <div className="mt-1 text-center text-[10px] font-bold text-black">{currencySymbol} {parsedPrice.toFixed(2)}</div>
                                        </div>
                                    )
                                ) : (
                                    <div className="py-8 text-center text-slate-400">
                                        <Barcode size={32} className="mx-auto opacity-40" />
                                        <p className="mt-2 text-xs font-medium">{t('barcode.enterPreview')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/60">
                                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Copies</p>
                                <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">{totalCopies}</p>
                            </div>
                            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/60">
                                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Price</p>
                                <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">{currencySymbol} {parsedPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <History size={16} className="text-slate-600 dark:text-zinc-300" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Saved Barcodes</h2>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">The latest 100 barcode labels are saved here for quick reprint and reuse.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:bg-zinc-800 dark:text-zinc-300">
                                {selectedSavedIds.length} selected
                            </span>
                            <button
                                onClick={toggleSelectAll}
                                disabled={savedBarcodes.length === 0}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                {allSelected ? 'Unselect All' : 'Select All'}
                            </button>
                            <button
                                onClick={handlePrintSelected}
                                disabled={selectedBarcodes.length === 0}
                                className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                            >
                                {bulkPrintStatus === 'printing' ? 'Printing...' : bulkPrintStatus === 'done' ? 'Printed' : 'Print Selected'}
                            </button>
                            <button
                                onClick={clearSavedBarcodes}
                                disabled={savedBarcodes.length === 0}
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-40 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300"
                            >
                                Clear Saved
                            </button>
                        </div>
                    </div>

                    {savedBarcodes.length === 0 ? (
                        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center dark:border-zinc-700 dark:bg-zinc-950/60">
                            <Barcode size={28} className="mx-auto text-slate-300 dark:text-zinc-600" />
                            <p className="mt-2 text-sm font-medium text-slate-600 dark:text-zinc-300">No saved barcodes yet</p>
                            <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">Save or print a barcode once and it will appear here.</p>
                        </div>
                    ) : (
                        <div className="mt-4 grid gap-3 lg:grid-cols-2">
                            {savedBarcodes.map((item) => {
                                const isSelected = selectedSavedIds.includes(item.id);
                                return (
                                    <div key={item.id} className={cn(
                                        'rounded-xl border p-3 transition',
                                        isSelected
                                            ? 'border-slate-900 bg-slate-50 dark:border-white dark:bg-zinc-950'
                                            : 'border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-950/50'
                                    )}>
                                        <div className="flex items-start justify-between gap-3">
                                            <button
                                                onClick={() => toggleSelected(item.id)}
                                                className="mt-0.5 text-slate-500 transition hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100"
                                            >
                                                {isSelected ? <Check size={16} /> : <Square size={16} />}
                                            </button>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="truncate font-mono text-sm font-bold text-slate-900 dark:text-white">{item.barcodeValue}</p>
                                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-zinc-800 dark:text-zinc-300">{item.format}</span>
                                                </div>
                                                <div className="mt-2 rounded-lg border border-slate-200 bg-white px-2 py-2 dark:border-zinc-700">
                                                    <SavedBarcodePreview barcodeValue={item.barcodeValue} format={item.format} />
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
                                                    <span>{currencySymbol} {item.price.toFixed(2)}</span>
                                                    <span>{item.quantity} copies</span>
                                                    <span>{formatSavedTime(item.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleLoadSaved(item)}
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                            >
                                                Load
                                            </button>
                                            <button
                                                onClick={() => void handleQuickPrintSaved(item)}
                                                className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                                            >
                                                Print
                                            </button>
                                            <button
                                                onClick={() => removeSavedBarcode(item.id)}
                                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
