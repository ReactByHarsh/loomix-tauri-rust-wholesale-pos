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
}

export const generateBarcodeLabelHTML = (data: BarcodeLabelData) => {
    const copies = Math.max(1, Math.floor(data.quantity || 1));
    const labels = Array.from({ length: copies }, (_, index) => `
        <section class="label ${index < copies - 1 ? 'page-break' : ''}">
            <div class="store-name">${escapeHtml(data.storeName || 'Store')}</div>
            <div class="barcode">${data.svgMarkup}</div>
            <div class="meta-row">
                <span class="meta-pill">Price: Rs. ${data.price.toFixed(2)}</span>
                <span class="meta-pill">Qty: ${copies}</span>
            </div>
        </section>
    `).join('');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Barcode Labels</title>
        <style>
            @page { size: 58mm 34mm; margin: 0; }
            * { box-sizing: border-box; }
            body {
                margin: 0;
                font-family: "Segoe UI", Arial, sans-serif;
                background: white;
                color: black;
            }
            .label {
                width: 58mm;
                min-height: 34mm;
                padding: 2.5mm 2.5mm 1.5mm;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                gap: 1.5mm;
            }
            .page-break {
                page-break-after: always;
            }
            .store-name {
                width: 100%;
                font-size: 11px;
                font-weight: 800;
                line-height: 1.2;
                text-transform: uppercase;
                letter-spacing: 0.06em;
            }
            .barcode {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .barcode svg {
                width: 100%;
                max-height: 15mm;
            }
            .meta-row {
                width: 100%;
                display: flex;
                justify-content: space-between;
                gap: 2mm;
                font-size: 10px;
                font-weight: 700;
            }
            .meta-pill {
                flex: 1;
                border: 1px solid #000;
                border-radius: 999px;
                padding: 1mm 1.5mm;
            }
        </style>
    </head>
    <body>${labels}</body>
    </html>
    `;
};
