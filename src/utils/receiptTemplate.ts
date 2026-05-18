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
    currencySymbol?: string;
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
const separator = '--------------------------------';

const formatCurrency = (amount: number, currencySymbol = '₹') => `${currencySymbol}${amount.toFixed(2)}`;

const normalizeFooterLines = (footerMessage: string) => {
    const lines = footerMessage
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.length > 0) {
        return lines;
    }

    return ['Thank you for your business!', 'Please visit again!'];
};

export const generateReceiptHTML = (
    data: ReceiptData,
    options: ReceiptPrintOptions = {}
) => {
    const width = paperWidth(options.paperSize ?? '3-inch');
    const extraDiscount = data.extraDiscount ?? 0;
    const currencySymbol = data.currencySymbol || '₹';
    const footerLines = normalizeFooterLines(data.footerMessage);
    const customerName = data.customerName?.trim() || 'Walk-in';
    const customerPhone = data.customerPhone?.trim();
    const printScript = options.preview
        ? ''
        : 'window.addEventListener("load", () => { window.print(); window.onafterprint = () => window.close(); });';

    const itemsHtml = data.items.map((item) => `
        <div class="item-row">
            <div class="item-name">${escapeHtml(item.name)}</div>
            <div class="qty">${item.quantity}</div>
            <div class="rate">${item.price.toFixed(0)}</div>
            <div class="amount">${item.total.toFixed(0)}</div>
        </div>
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
            background: #f3f4f6;
            color: #000;
            font-size: 13px;
            line-height: 1.35;
        }
        .page {
            width: ${width};
            margin: 0 auto;
            padding: 10px;
        }
        .receipt {
            background: #fff;
            padding: 12px 10px 10px;
        }
        .center { text-align: center; }
        .store-name {
            font-size: 18px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .meta-line {
            margin-top: 2px;
            font-size: 12px;
            font-weight: 700;
        }
        .info-line {
            margin-top: 3px;
            font-size: 12px;
            font-weight: 700;
        }
        .separator {
            margin: 10px 0 8px;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.3px;
            white-space: nowrap;
            overflow: hidden;
        }
        .table-header,
        .item-row,
        .total-row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 42px 58px 64px;
            gap: 6px;
            align-items: baseline;
        }
        .table-header {
            font-size: 13px;
            font-weight: 800;
            margin-bottom: 6px;
        }
        .item-row {
            margin-bottom: 6px;
            font-size: 13px;
            font-weight: 700;
        }
        .qty,
        .rate,
        .amount {
            text-align: right;
            white-space: nowrap;
        }
        .item-name {
            overflow-wrap: anywhere;
        }
        .totals {
            margin-top: 4px;
        }
        .total-row {
            margin-bottom: 4px;
            font-size: 13px;
            font-weight: 700;
        }
        .total-row .label {
            grid-column: 1 / span 3;
        }
        .amount-value {
            text-align: right;
            white-space: nowrap;
        }
        .grand-total {
            border-top: 3px solid #000;
            padding-top: 4px;
            font-size: 17px;
            font-weight: 800;
        }
        .payment {
            text-align: center;
            font-size: 14px;
            font-weight: 800;
            margin: 10px 0 8px;
        }
        .footer {
            text-align: center;
            font-size: 13px;
            font-weight: 700;
        }
        .footer-line + .footer-line { margin-top: 2px; }
        @media print {
            body { background: white; }
            .page { width: ${width}; padding: 0; }
            .receipt { padding: 10px 8px 8px; }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="receipt">
            <div class="center">
                <div class="store-name">${escapeHtml(data.storeName)}</div>
                <div class="meta-line">${escapeHtml(data.date)}</div>
                <div class="info-line">Customer: ${escapeHtml(customerName)}</div>
                ${customerPhone ? `<div class="info-line">Ph: ${escapeHtml(customerPhone)}</div>` : ''}
            </div>

            <div class="separator">${separator}</div>

            <div class="table-header">
                <div>ITEM</div>
                <div class="qty">QTY</div>
                <div class="rate">RATE</div>
                <div class="amount">AMT</div>
            </div>
            ${itemsHtml}

            <div class="separator">${separator}</div>

            <div class="totals">
                <div class="total-row">
                    <span class="label">Subtotal</span>
                    <span class="amount-value">${formatCurrency(data.subtotal, currencySymbol)}</span>
                </div>
                ${data.tax > 0 ? `
                <div class="total-row">
                    <span class="label">Tax (${data.taxRate}%)</span>
                    <span class="amount-value">${formatCurrency(data.tax, currencySymbol)}</span>
                </div>
                ` : ''}
                ${extraDiscount > 0 ? `
                <div class="total-row">
                    <span class="label">Discount</span>
                    <span class="amount-value">-${formatCurrency(extraDiscount, currencySymbol)}</span>
                </div>
                ` : ''}
                <div class="total-row grand-total">
                    <span class="label">TOTAL</span>
                    <span class="amount-value">${formatCurrency(data.total, currencySymbol)}</span>
                </div>
            </div>

            <div class="separator">${separator}</div>
            <div class="payment">[ ${escapeHtml(data.paymentMethod)} ]</div>
            <div class="separator">${separator}</div>

            <div class="footer">
                ${footerLines.map((line) => `<div class="footer-line">${escapeHtml(line)}</div>`).join('')}
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
