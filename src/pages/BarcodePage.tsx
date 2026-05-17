import { useEffect, useMemo, useRef, useState } from 'react';
import { Barcode, Check, Copy, Download, Info, Printer, RefreshCw, Store, Tag } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { useSettingsStore } from '../store/useSettingsStore';
import { generateBarcodeLabelHTML } from '../utils/barcodeTemplate';

function cn(...classes: (string | undefined | null | false)[]) { return classes.filter(Boolean).join(' '); }

type BarcodeFormat = 'CODE128' | 'EAN13' | 'EAN8' | 'UPC' | 'CODE39';

export function BarcodePage() {
    const { storeName, barcodePrinter } = useSettingsStore();
    const [barcodeValue, setBarcodeValue] = useState('');
    const [format, setFormat] = useState<BarcodeFormat>('CODE128');
    const [price, setPrice] = useState('0');
    const [quantity, setQuantity] = useState('1');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [printStatus, setPrintStatus] = useState<'idle' | 'printing' | 'done'>('idle');
    const svgRef = useRef<SVGSVGElement>(null);

    const totalCopies = useMemo(() => Math.max(1, parseInt(quantity || '1', 10) || 1), [quantity]);
    const parsedPrice = useMemo(() => Math.max(0, parseFloat(price || '0') || 0), [price]);

    useEffect(() => {
        if (!barcodeValue || !svgRef.current) { setError(''); return; }
        try {
            JsBarcode(svgRef.current, barcodeValue, { format, width: 2, height: 48, displayValue: true, fontSize: 12, margin: 0, background: '#ffffff', lineColor: '#000000' });
            setError('');
        } catch (e: any) { setError(`Invalid barcode: ${e.message || 'Check format and value'}`); }
    }, [barcodeValue, format]);

    const handleDownload = () => {
        if (!svgRef.current || error) return;
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
        const svgMarkup = new XMLSerializer().serializeToString(svgRef.current);
        const html = generateBarcodeLabelHTML({ storeName: storeName || 'Store', barcodeValue, svgMarkup, price: parsedPrice, quantity: totalCopies });
        setPrintStatus('printing');
        try {
            // @ts-ignore
            const result = await window.api?.printBarcode?.(html, barcodePrinter || undefined);
            if (!result || result.success) { setPrintStatus('done'); setTimeout(() => setPrintStatus('idle'), 1800); return; }
            setPrintStatus('idle');
            alert(result.error || 'Unable to print barcode labels.');
        } catch { setPrintStatus('idle'); alert('Unable to print barcode labels.'); }
    };

    const formatHints: Record<BarcodeFormat, string> = {
        CODE128: 'Best for mixed letters and numbers',
        EAN13: 'Retail standard with 12 or 13 digits',
        EAN8: 'Compact retail format with 7 or 8 digits',
        UPC: 'Common retail format with 11 or 12 digits',
        CODE39: 'Industrial code using uppercase text',
    };

    return (
        <div className="h-full overflow-y-auto bg-slate-50 dark:bg-zinc-950">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-slate-900 p-2 text-white dark:bg-white dark:text-zinc-900">
                            <Barcode size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Barcode Studio</h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">Print clean barcode labels</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800">
                        <Store size={12} className="text-slate-400" />
                        <span className="font-medium text-slate-700 dark:text-zinc-200">{storeName || 'Add in Settings'}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                    {/* Inputs */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Create Label</h2>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">{formatHints[format]}</span>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">Barcode Value</label>
                                <div className="relative">
                                    <input type="text" value={barcodeValue} onChange={(e) => setBarcodeValue(e.target.value)} placeholder="Enter code or scan here"
                                        className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                                    <button onClick={handleCopy} disabled={!barcodeValue} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 dark:hover:bg-zinc-800">
                                        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">Format</label>
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
                                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">Rs.</span>
                                    <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
                                        className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-zinc-400">Copies</label>
                                <input type="number" min="1" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                            </div>

                            <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/60">
                                <Tag size={14} className="text-slate-400" />
                                <span className="text-xs text-slate-600 dark:text-zinc-300">Rs. {parsedPrice.toFixed(2)} x {totalCopies} copy{totalCopies > 1 ? 'ies' : ''}</span>
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
                                <RefreshCw size={13} /> Clear
                            </button>
                            <button onClick={handleDownload} disabled={!barcodeValue || !!error}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                <Download size={13} /> Download SVG
                            </button>
                            <button onClick={handlePrint} disabled={!barcodeValue || !!error}
                                className={cn('inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white transition',
                                    !barcodeValue || !!error ? 'cursor-not-allowed bg-slate-300 dark:bg-zinc-700' : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100')}
                            >
                                {printStatus === 'printing' ? 'Printing...' : printStatus === 'done' ? 'Printed' : 'Print Labels'}
                                <Printer size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Live Preview</h2>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">Label that will go to the printer</p>

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
                                            <div className="mt-1 text-center text-[10px] font-bold text-black">Rs. {parsedPrice.toFixed(2)}</div>
                                        </div>
                                    )
                                ) : (
                                    <div className="py-8 text-center text-slate-400">
                                        <Barcode size={32} className="mx-auto opacity-40" />
                                        <p className="mt-2 text-xs font-medium">Enter a barcode value to preview</p>
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
                                <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">Rs. {parsedPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
