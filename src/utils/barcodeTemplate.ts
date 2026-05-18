const escapeHtml = (value: string) =>
    value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

export interface BarcodeLabelData {
    storeName: string;
    barcodeValue: string;
    svgMarkup: string;
    price: number;
    quantity: number;
    currencySymbol?: string;
}

const renderLabels = (items: BarcodeLabelData[]) => items.flatMap((item) => {
    const copies = Math.max(1, Math.floor(item.quantity || 1));
    const currencySymbol = item.currencySymbol || '₹';

    return Array.from({ length: copies }, (_, index) => `
        <section class="label ${index < copies - 1 ? 'page-break' : ''}">
            <div class="name">${escapeHtml(item.storeName || 'Store')}</div>
            <div class="barcode">${item.svgMarkup}</div>
            <div class="code">${escapeHtml(item.barcodeValue)}</div>
            <div class="price">${escapeHtml(currencySymbol)} ${item.price.toFixed(2)}</div>
        </section>
    `);
}).join('');

export const generateBarcodeBatchHTML = (items: BarcodeLabelData[]) => {
    const labels = renderLabels(items);

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Barcode Labels</title>
        <style>
            @page { size: 50mm 25mm; margin: 0; }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                margin: 0;
                font-family: "Courier New", monospace;
                background: white;
                color: black;
            }
            .label {
                width: 50mm;
                height: 25mm;
                padding: 1.5mm 2mm;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                gap: 0.5mm;
            }
            .page-break {
                page-break-after: always;
            }
            .name {
                font-size: 8px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                line-height: 1.2;
                max-width: 46mm;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .barcode {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .barcode svg {
                width: 100%;
                max-height: 10mm;
            }
            .code {
                font-size: 9px;
                font-weight: bold;
                letter-spacing: 0.5px;
            }
            .price {
                font-size: 10px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>${labels}</body>
    </html>
    `;
};

export const generateBarcodeLabelHTML = (data: BarcodeLabelData) => {
    return `
    ${generateBarcodeBatchHTML([data])}
    `;
};
