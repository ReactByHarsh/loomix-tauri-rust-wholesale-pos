import { invoke } from '@tauri-apps/api/core';
import { generateReceiptHTML } from './utils/receiptTemplate';

export const api = {
    // Products
    getProducts: async (args: any) => {
        // Map args
        const mappedArgs = {
            page: args?.page || 1,
            pageSize: args?.pageSize || 50,
            search: args?.search || "",
            category: args?.category || "all"
        };
        // We return { products: [], total: 0 } as per electron code
        const products = await invoke('get_products', {
            page: mappedArgs.page,
            pageSize: mappedArgs.pageSize,
            search: mappedArgs.search,
            category: mappedArgs.category
        });
        const total = await invoke('get_products_count', {
            search: mappedArgs.search,
            category: mappedArgs.category
        });
        return { products, total };
    },
    getProductBySku: (sku: string) => invoke('get_product_by_sku', { sku }),
    addProduct: (product: any) => invoke('add_product', { product }),
    updateProduct: (product: any) => invoke('update_product', { product }),
    deleteProduct: (id: number) => invoke('delete_product', { id }),

    // Transactions
    createTransaction: (data: any) => invoke('create_transaction', { data }),
    getDashboardStats: () => invoke('get_dashboard_stats'),

    // Printing
    printReceipt: async (data: any, _printerName?: string, options?: { paperSize?: '3-inch' | '4-inch'; preview?: boolean }) => {
        const html = generateReceiptHTML(data, {
            paperSize: options?.paperSize ?? '3-inch',
            preview: options?.preview ?? false,
        });
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write(html);
            doc.close();

            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
        }

        setTimeout(() => {
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }
        }, 1000); // Give time for print dialog
        return { success: true };
    },
    printBarcode: async (html: string) => {
        const printWindow = window.open('', '_blank', 'width=420,height=320');
        if (!printWindow) {
            return { success: false, error: 'Popup blocked' };
        }
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        return { success: true };
    },
    getPrinters: async () => {
        return { success: true, printers: [] };
    },
    getSuggestedPrinter: async () => null,

    // Transaction History
    getTransactionHistory: async (args: any) => {
        // Support both old (limit, offset) and new (object) signatures if needed, but HistoryPage passes object
        // Args: { page, pageSize, search, paymentFilter, dateFilter }
        const params = {
            page: args?.page || 1,
            pageSize: args?.pageSize || 50,
            search: args?.search || "",
            paymentFilter: args?.paymentFilter || "all",
            dateFilter: args?.dateFilter || "all"
        };

        return invoke('get_transaction_history', params);
    },
    getTransactionById: (id: number) => invoke('get_transaction_by_id', { id }),

    // License
    activateLicense: (key: string) => invoke('activate_license', { key }),
    getLicenseStatus: () => invoke('get_license_status'),
    checkLicense: () => invoke('check_license'),
    retryLicenseCheck: () => invoke('retry_license_check'),

    // Vendors
    getVendorProfiles: () => invoke('get_vendor_profiles'),
    addVendorProfile: (profile: any) => invoke('add_vendor_profile', { profile }),
    getVendors: async (args: any) => {
        // args: { page, pageSize, search, dateFilter, vendorId }
        const mappedArgs = {
            page: args?.page || 1,
            pageSize: args?.pageSize || 50,
            search: args?.search || "",
            dateFilter: args?.dateFilter || "all",
            vendorId: args?.vendorId
        };
        return invoke('get_vendors', mappedArgs);
    },
    getVendorStats: (vendorId?: number) => invoke('get_vendor_stats', { vendorId }),
    addVendor: (record: any) => invoke('add_vendor', { record }),
    updateVendor: (record: any) => invoke('update_vendor', { record }),
    deleteVendor: (id: number) => invoke('delete_vendor', { id }),

    // Export/Import
    exportProducts: () => invoke('export_products'),
    exportTransactions: () => invoke('export_transactions'),
    importProducts: (products: any[]) => invoke('import_products', { products }),
    restoreProductsBackup: (products: any[]) => invoke('restore_products_backup', { products }),
    exportTransactionBackup: () => invoke('export_transaction_backup'),
    restoreTransactionBackup: (backup: any) => invoke('restore_transaction_backup', { backup }),
    clearTransactionHistory: () => invoke('clear_transaction_history'),
    exportFullBackup: () => invoke('export_full_backup'),
    restoreFullBackup: (backup: any) => invoke('restore_full_backup', { backup }),
};

// Global assignment
// @ts-ignore
window.api = api;
