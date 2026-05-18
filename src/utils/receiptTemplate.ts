import type { ReceiptPaperSize } from '../store/useSettingsStore';

export interface ReceiptData {
    storeName: string;
    storeAddress: string;
    storePhone: string;
    footerMessage: string;
    logo?: string;
    transactionId: string | number;
    date: string;
    items: { name: string; quantity: number; price: number; total: number; }[];
    subtotal: number;
    tax: number;
    taxRate: number;
    total: number;
    extraDiscount?: number;
    paymentMethod: string;
    customerName?: string;
    customerPhone?: string;
}

export interface ReceiptPrintOptions {
    paperSize?: ReceiptPaperSize;
    printerName?: string;
    preview?: boolean;
}

const escapeHtml = (value: string) =>
    value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

const paperWidth = (paperSize: ReceiptPaperSize) => (paperSize === '4-inch' ? '80mm' : '58mm');

export const generateReceiptHTML = (
    data: ReceiptData,
    options: ReceiptPrintOptions = {}
) => {
    const width = paperWidth(options.paperSize ?? '3-inch');
    const extraDiscount = data.extraDiscount ?? 0;
    const printScript = options.preview
        ? ''
        : 'window.addEventListener("load", () => { window.print(); window.onafterprint = () => window.close(); });';

    const itemsHtml = data.items.map(item => `
        <tr>
            <td class="item-name">${escapeHtml(item.name)}</td>
            <td class="qty">${item.quantity}</td>
            <td class="rate">${item.price.toFixed(2)}</td>
            <td class="total">${item.total.toFixed(2)}</td>
        </tr>
    `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt</title>
    <style>
        @page { margin: 0; size: ${width} auto; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: "Courier New", "Consolas", monospace;
            background: #f5f5f5;
            color: #000;
            font-size: 12px;
            line-height: 1.4;
        }
        .page {
            width: ${width};
            margin: 0 auto;
            padding: 8px;
        }
        .receipt {
            background: #fff;
            padding: 8px;
        }
        .center { text-align: center; }
        .header {
            border-bottom: 1px dashed #000;
            padding-bottom: 6px;
            margin-bottom: 6px;
        }
        .store-name {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .store-info {
            font-size: 10px;
            color: #333;
            margin-top: 2px;
        }
        .meta {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            margin-bottom: 6px;
            padding-bottom: 4px;
            border-bottom: 1px dashed #000;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-bottom: 6px;
        }
        thead th {
            text-align: left;
            border-bottom: 1px dashed #000;
            padding-bottom: 3px;
            font-size: 10px;
            font-weight: bold;
        }
        thead th.qty, thead th.rate, thead th.total {
            text-align: right;
        }
        tbody td {
            padding: 3px 0;
            vertical-align: top;
        }
        td.qty, td.rate, td.total {
            text-align: right;
            white-space: nowrap;
        }
        .item-name {
            max-width: ${width === '58mm' ? '28mm' : '40mm'};
            word-wrap: break-word;
        }
        .totals {
            border-top: 1px dashed #000;
            padding-top: 6px;
            font-size: 11px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
        }
        .grand-total {
            font-size: 13px;
            font-weight: bold;
            border-top: 1px solid #000;
            padding-top: 4px;
            margin-top: 4px;
        }
        .payment {
            text-align: center;
            font-size: 11px;
            font-weight: bold;
            margin: 6px 0;
            padding: 3px 0;
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
        }
        .footer {
            text-align: center;
            font-size: 10px;
            margin-top: 6px;
            padding-top: 4px;
            border-top: 1px dashed #000;
        }
        @media print {
            body { background: white; }
            .page { width: ${width}; padding: 0; }
            .receipt { padding: 4px; }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="receipt">
            <div class="header center">
                <div class="store-name">${escapeHtml(data.storeName)}</div>
                ${data.storeAddress ? `<div class="store-info">${escapeHtml(data.storeAddress)}</div>` : ''}
                ${data.storePhone ? `<div class="store-info">Ph: ${escapeHtml(data.storePhone)}</div>` : ''}
            </div>

            <div class="meta">
                <span>Bill: #${escapeHtml(String(data.transactionId))}</span>
                <span>${escapeHtml(data.paymentMethod)}</span>
            </div>
            <div class="meta">
                <span>${escapeHtml(data.date)}</span>
                <span>${escapeHtml(data.customerName || 'Walk-in')}</span>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th class="qty">Qty</th>
                        <th class="rate">Rate</th>
                        <th class="total">Amt</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <div class="totals">
                <div class="total-row">
                    <span>Subtotal</span>
                    <span>${data.subtotal.toFixed(2)}</span>
                </div>
                ${data.tax > 0 ? `
                <div class="total-row">
                    <span>Tax (${data.taxRate}%)</span>
                    <span>${data.tax.toFixed(2)}</span>
                </div>
                ` : ''}
                ${extraDiscount > 0 ? `
                <div class="total-row">
                    <span>Discount</span>
                    <span>-${extraDiscount.toFixed(2)}</span>
                </div>
                ` : ''}
                <div class="total-row grand-total">
                    <span>TOTAL</span>
                    <span>${data.total.toFixed(2)}</span>
                </div>
            </div>

            <div class="payment">Paid via ${escapeHtml(data.paymentMethod)}</div>

            <div class="footer">
                <div>${escapeHtml(data.footerMessage || 'Thank you!')}</div>
                ${data.customerPhone ? `<div>Customer: ${escapeHtml(data.customerPhone)}</div>` : ''}
            </div>
        </div>
    </div>
    <script>${printScript}</script>
</body>
</html>`;
};

const openPreviewWindow = (html: string) => {
    const printWindow = window.open('', '_blank', 'width=420,height=680');
    if (!printWindow) { alert('Popup blocked. Please allow popups to preview the bill.'); return false; }
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    return true;
};

export const printReceipt = async (
    data: ReceiptData,
    options: ReceiptPrintOptions = {}
) => {
    const paperSize = options.paperSize ?? '3-inch';
    const preview = options.preview ?? false;
    const html = generateReceiptHTML(data, { ...options, paperSize, preview });

    // @ts-ignore
    if (window.api?.printReceipt) {
        try {
            // @ts-ignore
            const result = await window.api.printReceipt(data, options.printerName, { paperSize, preview });
            if (!result?.success && preview) { openPreviewWindow(html); }
            return result;
        } catch (error) {
            if (preview) { openPreviewWindow(html); }
            return { success: false, error };
        }
    }

    openPreviewWindow(html);
    return { success: true };
};
