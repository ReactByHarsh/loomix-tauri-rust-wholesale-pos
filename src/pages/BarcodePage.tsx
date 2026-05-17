import { useEffect, useMemo, useRef, useState } from 'react';
import { Barcode, Check, Copy, Download, Info, Printer, RefreshCw, Store, Tag } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { useSettingsStore } from '../store/useSettingsStore';
import { generateBarcodeLabelHTML } from '../utils/barcodeTemplate';

type BarcodeFormat = 'CODE128' | 'EAN13' | 'EAN8' | 'UPC' | 'CODE39';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

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
        if (!barcodeValue || !svgRef.current) {
            setError('');
            return;
        }

        try {
            JsBarcode(svgRef.current, barcodeValue, {
                format,
                width: 2,
                height: 52,
                displayValue: true,
                fontSize: 12,
                margin: 0,
                background: '#ffffff',
                lineColor: '#000000',
            });
            setError('');
        } catch (currentError: any) {
            setError(`Invalid barcode: ${currentError.message || 'Check format and value'}`);
        }
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
        const html = generateBarcodeLabelHTML({
            storeName: storeName || 'Store',
            barcodeValue,
            svgMarkup,
            price: parsedPrice,
            quantity: totalCopies,
        });

        setPrintStatus('printing');

        try {
            // @ts-ignore
            const result = await window.api?.printBarcode?.(html, barcodePrinter || undefined);
            if (!result || result.success) {
                setPrintStatus('done');
                setTimeout(() => setPrintStatus('idle'), 1800);
                return;
            }

            setPrintStatus('idle');
            alert(result.error || 'Unable to print barcode labels.');
        } catch (currentError) {
            setPrintStatus('idle');
            alert('Unable to print barcode labels.');
        }
    };

    const formatHints: Record<BarcodeFormat, string> = {
        CODE128: 'Best for mixed letters and numbers',
        EAN13: 'Retail standard with 12 or 13 digits',
        EAN8: 'Compact retail format with 7 or 8 digits',
        UPC: 'Common retail format with 11 or 12 digits',
        CODE39: 'Industrial code using uppercase text',
    };

    return (
        <div className="h-full overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_38%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.16),_transparent_30%),linear-gradient(180deg,_#09090b_0%,_#18181b_100%)]">
            <div className="mx-auto flex max-w-6xl flex-col gap-5 p-5">
                <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/75">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="rounded-2xl bg-[linear-gradient(135deg,#0f172a,#334155)] p-3 text-white shadow-lg">
                                <Barcode size={22} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Barcode Studio</h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                                    Print clean labels with shop name, price, and quantity in one flow.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                                    <Store size={12} />
                                    Shop Name
                                </div>
                                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-zinc-100">{storeName || 'Add this in Settings'}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                                    <Printer size={12} />
                                    Barcode Printer
                                </div>
                                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-zinc-100">{barcodePrinter || 'Choose in Settings'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
                    <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/75">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Label Inputs</p>
                                <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Create barcode label</h2>
                            </div>
                            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-zinc-800 dark:text-zinc-300">
                                {formatHints[format]}
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
                                    Barcode Value
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={barcodeValue}
                                        onChange={(event) => setBarcodeValue(event.target.value)}
                                        placeholder="Enter code or scan here"
                                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-500"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        disabled={!barcodeValue}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                        title="Copy barcode value"
                                    >
                                        {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
                                    Barcode Format
                                </label>
                                <select
                                    value={format}
                                    onChange={(event) => setFormat(event.target.value as BarcodeFormat)}
                                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-500"
                                >
                                    <option value="CODE128">CODE 128</option>
                                    <option value="EAN13">EAN-13</option>
                                    <option value="EAN8">EAN-8</option>
                                    <option value="UPC">UPC</option>
                                    <option value="CODE39">CODE 39</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
                                    Price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 dark:text-zinc-500">Rs.</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={price}
                                        onChange={(event) => setPrice(event.target.value)}
                                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
                                    Quantity / Copies
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={quantity}
                                    onChange={(event) => setQuantity(event.target.value)}
                                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-500"
                                />
                            </div>

                            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/60 dark:bg-amber-950/30">
                                <div className="flex items-start gap-2 text-amber-700 dark:text-amber-300">
                                    <Info size={16} className="mt-0.5 shrink-0" />
                                    <p className="text-sm">
                                        If quantity is <strong>{totalCopies}</strong>, the printer will receive <strong>{totalCopies}</strong> labels one by one.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                                    <Tag size={12} />
                                    Label Summary
                                </div>
                                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-zinc-100">
                                    Rs. {parsedPrice.toFixed(2)} x {totalCopies} copy{totalCopies > 1 ? 'ies' : ''}
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                                {error}
                            </div>
                        )}

                        <div className="mt-5 flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    setBarcodeValue('');
                                    setPrice('0');
                                    setQuantity('1');
                                }}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                <RefreshCw size={15} />
                                Clear
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={!barcodeValue || !!error}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                <Download size={15} />
                                Download SVG
                            </button>
                            <button
                                onClick={handlePrint}
                                disabled={!barcodeValue || !!error}
                                className={cn(
                                    'inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white transition',
                                    !barcodeValue || !!error
                                        ? 'cursor-not-allowed bg-slate-300 dark:bg-zinc-700'
                                        : 'bg-[linear-gradient(135deg,#0f172a,#334155)] shadow-[0_18px_35px_rgba(15,23,42,0.25)] hover:translate-y-[-1px]'
                                )}
                            >
                                {printStatus === 'printing' ? 'Printing...' : printStatus === 'done' ? 'Printed' : 'Print Labels'}
                                <Printer size={15} />
                            </button>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/75">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Live Preview</p>
                        <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Printed label</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                            This is the label style that will go to the barcode printer.
                        </p>

                        <div className="mt-5 rounded-[28px] border border-dashed border-slate-300 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 dark:border-zinc-700 dark:bg-[linear-gradient(180deg,#111827_0%,#09090b_100%)]">
                            <div className="mx-auto flex min-h-[250px] w-full max-w-[320px] items-center justify-center rounded-[24px] border border-slate-200 bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-zinc-800 dark:bg-white">
                                {barcodeValue ? (
                                    error ? (
                                        <div className="text-center text-sm font-medium text-red-500">{error}</div>
                                    ) : (
                                        <div className="w-full">
                                            <div className="text-center text-xs font-black uppercase tracking-[0.24em] text-black">
                                                {storeName || 'Store Name'}
                                            </div>
                                            <div className="mt-2 flex justify-center">
                                                <svg ref={svgRef}></svg>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between gap-2 text-[11px] font-bold text-black">
                                                <span className="rounded-full border border-black px-3 py-1">Price: Rs. {parsedPrice.toFixed(2)}</span>
                                                <span className="rounded-full border border-black px-3 py-1">Qty: {totalCopies}</span>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center text-slate-400">
                                        <Barcode size={44} className="mx-auto opacity-40" />
                                        <p className="mt-3 text-sm font-medium">Enter a barcode value to preview the label.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Print Count</p>
                                <p className="mt-2 text-xl font-black text-slate-900 dark:text-white">{totalCopies}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Label Price</p>
                                <p className="mt-2 text-xl font-black text-slate-900 dark:text-white">Rs. {parsedPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
