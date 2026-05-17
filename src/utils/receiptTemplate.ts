import type { ReceiptPaperSize } from '../store/useSettingsStore';

export interface ReceiptData {
    storeName: string;
    storeAddress: string;
    storePhone: string;
    footerMessage: string;
    logo?: string;
    transactionId: string | number;
    date: string;
    items: {
        name: string;
        quantity: number;
        price: number;
        total: number;
    }[];
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

const paperWidth = (paperSize: ReceiptPaperSize) => (paperSize === '4-inch' ? '4in' : '3in');

export const generateReceiptHTML = (
    data: ReceiptData,
    options: ReceiptPrintOptions = {}
) => {
    const width = paperWidth(options.paperSize ?? '3-inch');
    const grossTotal = data.subtotal + data.tax;
    const extraDiscount = data.extraDiscount ?? 0;
    const printScript = options.preview
        ? ''
        : 'window.addEventListener("load", () => { window.print(); window.onafterprint = () => window.close(); });';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Receipt</title>
        <style>
            @page { margin: 0; size: ${width} auto; }
            * { box-sizing: border-box; }
            body {
                margin: 0;
                padding: 0;
                font-family: "Segoe UI", Arial, sans-serif;
                background: #eef2f7;
                color: #111827;
            }
            .page {
                width: ${width};
                margin: 0 auto;
                padding: 10px;
            }
            .receipt {
                background: #ffffff;
                border: 1px solid #d8dee8;
                border-radius: 14px;
                overflow: hidden;
                box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
            }
            .header {
                padding: 14px 14px 10px;
                text-align: center;
                background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
                border-bottom: 1px dashed #cbd5e1;
            }
            .logo {
                max-width: 72px;
                max-height: 48px;
                object-fit: contain;
                margin-bottom: 8px;
            }
            .store-name {
                margin: 0;
                font-size: 18px;
                font-weight: 800;
                letter-spacing: 0.04em;
                text-transform: uppercase;
            }
            .store-line,
            .meta-line,
            .footer-copy {
                margin: 3px 0 0;
                font-size: 11px;
                color: #475569;
            }
            .section {
                padding: 10px 14px;
            }
            .meta-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                font-size: 11px;
                color: #334155;
            }
            .meta-card {
                padding: 8px;
                border: 1px solid #e2e8f0;
                border-radius: 10px;
                background: #f8fafc;
            }
            .meta-label {
                display: block;
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: #64748b;
                margin-bottom: 3px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th {
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: #64748b;
                padding: 0 0 6px;
                border-bottom: 1px dashed #cbd5e1;
            }
            td {
                padding: 7px 0;
                font-size: 12px;
                border-bottom: 1px solid #f1f5f9;
                vertical-align: top;
            }
            th:first-child,
            td:first-child {
                text-align: left;
            }
            th:nth-child(2),
            td:nth-child(2) {
                text-align: center;
                width: 42px;
            }
            th:nth-child(3),
            th:nth-child(4),
            td:nth-child(3),
            td:nth-child(4) {
                text-align: right;
                width: 68px;
            }
            .item-name {
                font-weight: 600;
                color: #0f172a;
                line-height: 1.3;
            }
            .totals {
                display: grid;
                gap: 6px;
                padding-top: 8px;
            }
            .total-row {
                display: flex;
                justify-content: space-between;
                gap: 8px;
                font-size: 12px;
                color: #334155;
            }
            .grand-total {
                margin-top: 4px;
                padding: 10px 12px;
                border-radius: 12px;
                background: #0f172a;
                color: white;
                font-size: 15px;
                font-weight: 800;
            }
            .payment-pill {
                margin-top: 10px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 6px 12px;
                border-radius: 999px;
                background: #e2e8f0;
                color: #0f172a;
                font-size: 11px;
                font-weight: 700;
            }
            .footer {
                padding: 0 14px 14px;
                text-align: center;
            }
            @media print {
                body {
                    background: white;
                }
                .page {
                    width: ${width};
                    padding: 0;
                }
                .receipt {
                    border: none;
                    border-radius: 0;
                    box-shadow: none;
                }
            }
        </style>
    </head>
    <body>
        <div class="page">
            <div class="receipt">
                <div class="header">
                    ${data.logo ? `<img src="${data.logo}" class="logo" alt="Store logo" />` : ''}
                    <h1 class="store-name">${escapeHtml(data.storeName)}</h1>
                    ${data.storeAddress ? `<p class="store-line">${escapeHtml(data.storeAddress)}</p>` : ''}
                    ${data.storePhone ? `<p class="store-line">Phone: ${escapeHtml(data.storePhone)}</p>` : ''}
                </div>

                <div class="section">
                    <div class="meta-grid">
                        <div class="meta-card">
                            <span class="meta-label">Receipt</span>
                            <strong>#${escapeHtml(String(data.transactionId))}</strong>
                        </div>
                        <div class="meta-card">
                            <span class="meta-label">Payment</span>
                            <strong>${escapeHtml(data.paymentMethod)}</strong>
                        </div>
                        <div class="meta-card">
                            <span class="meta-label">Date</span>
                            <span>${escapeHtml(data.date)}</span>
                        </div>
                        <div class="meta-card">
                            <span class="meta-label">Customer</span>
                            <span>${escapeHtml(data.customerName || 'Walk-in')}</span>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.items
                                .map(
                                    (item) => `
                                <tr>
                                    <td><div class="item-name">${escapeHtml(item.name)}</div></td>
                                    <td>${item.quantity}</td>
                                    <td>Rs. ${item.price.toFixed(2)}</td>
                                    <td>Rs. ${item.total.toFixed(2)}</td>
                                </tr>
                            `
                                )
                                .join('')}
                        </tbody>
                    </table>

                    <div class="totals">
                        <div class="total-row">
                            <span>Subtotal</span>
                            <span>Rs. ${data.subtotal.toFixed(2)}</span>
                        </div>
                        ${
                            data.tax > 0
                                ? `
                        <div class="total-row">
                            <span>Tax (${data.taxRate}%)</span>
                            <span>Rs. ${data.tax.toFixed(2)}</span>
                        </div>
                        `
                                : ''
                        }
                        ${
                            extraDiscount > 0
                                ? `
                        <div class="total-row">
                            <span>Gross total</span>
                            <span>Rs. ${grossTotal.toFixed(2)}</span>
                        </div>
                        <div class="total-row">
                            <span>Discount</span>
                            <span>- Rs. ${extraDiscount.toFixed(2)}</span>
                        </div>
                        `
                                : ''
                        }
                        <div class="total-row grand-total">
                            <span>Net total</span>
                            <span>Rs. ${data.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div class="payment-pill">Paid via ${escapeHtml(data.paymentMethod)}</div>
                </div>

                <div class="footer">
                    <p class="footer-copy">${escapeHtml(data.footerMessage || 'Thank you for shopping with us.')}</p>
                    ${
                        data.customerPhone
                            ? `<p class="footer-copy">Customer Phone: ${escapeHtml(data.customerPhone)}</p>`
                            : ''
                    }
                </div>
            </div>
        </div>
        <script>${printScript}</script>
    </body>
    </html>
    `;
};

const openPreviewWindow = (html: string) => {
    const printWindow = window.open('', '_blank', 'width=480,height=760');
    if (!printWindow) {
        alert('Popup blocked. Please allow popups to preview the bill.');
        return false;
    }

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
            const result = await window.api.printReceipt(data, options.printerName, {
                paperSize,
                preview,
            });
            if (!result?.success && preview) {
                openPreviewWindow(html);
            }
            return result;
        } catch (error) {
            if (preview) {
                openPreviewWindow(html);
            }
            return { success: false, error };
        }
    }

    openPreviewWindow(html);
    return { success: true };
};
