import { useSettingsStore, type AppLanguage } from './store/useSettingsStore';

type TranslationKey =
    | 'common.add'
    | 'common.all'
    | 'common.cancel'
    | 'common.clear'
    | 'common.close'
    | 'common.copies'
    | 'common.date'
    | 'common.delete'
    | 'common.discount'
    | 'common.download'
    | 'common.edit'
    | 'common.export'
    | 'common.hidden'
    | 'common.import'
    | 'common.loading'
    | 'common.name'
    | 'common.next'
    | 'common.optional'
    | 'common.phone'
    | 'common.preview'
    | 'common.prev'
    | 'common.price'
    | 'common.print'
    | 'common.quantity'
    | 'common.rate'
    | 'common.ready'
    | 'common.retry'
    | 'common.save'
    | 'common.saved'
    | 'common.saving'
    | 'common.search'
    | 'common.stock'
    | 'common.total'
    | 'common.update'
    | 'common.visible'
    | 'layout.dashboard'
    | 'layout.pos'
    | 'layout.inventory'
    | 'layout.vendors'
    | 'layout.history'
    | 'layout.barcode'
    | 'layout.settings'
    | 'layout.retailPos'
    | 'settings.title'
    | 'settings.subtitle'
    | 'settings.storeIdentity'
    | 'settings.storeName'
    | 'settings.address'
    | 'settings.receiptFooter'
    | 'settings.printerRouting'
    | 'settings.billPrinter'
    | 'settings.barcodePrinter'
    | 'settings.selectBillPrinter'
    | 'settings.selectBarcodePrinter'
    | 'settings.thermalBillSize'
    | 'settings.compactCounterBill'
    | 'settings.widerLayout'
    | 'settings.appearanceBilling'
    | 'settings.theme'
    | 'settings.system'
    | 'settings.light'
    | 'settings.dark'
    | 'settings.themeHint'
    | 'settings.taxRate'
    | 'settings.taxOn'
    | 'settings.taxOff'
    | 'settings.currency'
    | 'settings.modulesLanguage'
    | 'settings.language'
    | 'settings.languageHint'
    | 'settings.defaultBillingMode'
    | 'settings.defaultBillingModeHint'
    | 'settings.vendorsPage'
    | 'settings.vendorsPageHint'
    | 'settings.receiptPreview'
    | 'settings.receiptPreviewPaper'
    | 'settings.dataManagement'
    | 'settings.deleteHistory'
    | 'settings.deleteHistoryHint'
    | 'settings.confirmDelete'
    | 'settings.cannotUndo'
    | 'settings.retail'
    | 'settings.wholesale'
    | 'settings.english'
    | 'settings.hindi'
    | 'settings.marathi'
    | 'settings.bengali'
    | 'settings.gujarati'
    | 'pos.title'
    | 'pos.subtitle'
    | 'pos.searchPlaceholder'
    | 'pos.order'
    | 'pos.productsEmpty'
    | 'pos.cartEmpty'
    | 'pos.addCustomer'
    | 'pos.noPhone'
    | 'pos.extraDiscount'
    | 'pos.checkout'
    | 'pos.printCheckout'
    | 'pos.transactionRecorded'
    | 'pos.success'
    | 'pos.customerName'
    | 'pos.dateOfBirth'
    | 'pos.customerOptional'
    | 'pos.scanOrClick'
    | 'pos.outOfStock'
    | 'pos.productOutOfStock'
    | 'pos.billingMode'
    | 'pos.retailPrice'
    | 'pos.wholesalePrice'
    | 'pos.priceFallback'
    | 'pos.payment.cash'
    | 'pos.payment.card'
    | 'pos.payment.upi'
    | 'inventory.title'
    | 'inventory.subtitle'
    | 'inventory.products'
    | 'inventory.value'
    | 'inventory.lowStock'
    | 'inventory.out'
    | 'inventory.template'
    | 'inventory.addProduct'
    | 'inventory.searchPlaceholder'
    | 'inventory.product'
    | 'inventory.sku'
    | 'inventory.category'
    | 'inventory.retailPrice'
    | 'inventory.wholesalePrice'
    | 'inventory.costPrice'
    | 'inventory.actions'
    | 'inventory.loading'
    | 'inventory.noProducts'
    | 'inventory.addFirstProduct'
    | 'inventory.adjustFilters'
    | 'inventory.editProduct'
    | 'inventory.updateDetails'
    | 'inventory.enterInformation'
    | 'inventory.skuBarcode'
    | 'inventory.productName'
    | 'inventory.generateAuto'
    | 'inventory.stockStatus.out'
    | 'inventory.stockStatus.low'
    | 'inventory.stockStatus.ok'
    | 'history.title'
    | 'history.subtitle'
    | 'history.searchPlaceholder'
    | 'history.total'
    | 'history.today'
    | 'history.average'
    | 'history.showing'
    | 'history.orders'
    | 'history.perOrder'
    | 'history.order'
    | 'history.dateTime'
    | 'history.payment'
    | 'history.amount'
    | 'history.view'
    | 'history.print'
    | 'history.allPayments'
    | 'history.noTransactions'
    | 'history.adjustFilters'
    | 'history.viewReprint'
    | 'history.each'
    | 'history.allTime'
    | 'vendors.title'
    | 'vendors.subtitle'
    | 'vendors.allSummary'
    | 'vendors.selectVendor'
    | 'vendors.addTransaction'
    | 'vendors.records'
    | 'vendors.totalPurchase'
    | 'vendors.totalPaid'
    | 'vendors.pending'
    | 'vendors.searchPlaceholder'
    | 'vendors.allTime'
    | 'vendors.today'
    | 'vendors.week'
    | 'vendors.month'
    | 'vendors.vendor'
    | 'vendors.purchaseAmount'
    | 'vendors.paymentAmount'
    | 'vendors.pendingAmount'
    | 'vendors.notes'
    | 'vendors.noRecords'
    | 'vendors.addFirstRecord'
    | 'vendors.record'
    | 'vendors.purchaseDetails'
    | 'vendors.paymentDetails'
    | 'vendors.purchaseBillImage'
    | 'vendors.paymentBillImage'
    | 'vendors.uploadImage'
    | 'vendors.changeImage'
    | 'vendors.totalAmount'
    | 'vendors.paidAmount'
    | 'vendors.addVendor'
    | 'vendors.vendorName'
    | 'vendors.createVendor'
    | 'dashboard.title'
    | 'dashboard.subtitle'
    | 'dashboard.live'
    | 'dashboard.sales'
    | 'dashboard.today'
    | 'dashboard.total'
    | 'dashboard.transactions'
    | 'dashboard.allTime'
    | 'dashboard.lowStock'
    | 'dashboard.needRestock'
    | 'dashboard.allStocked'
    | 'dashboard.profit'
    | 'dashboard.salesTrend'
    | 'dashboard.last7Days'
    | 'dashboard.revenue'
    | 'dashboard.loading'
    | 'dashboard.unavailable'
    | 'dashboard.startTransaction'
    | 'dashboard.manageProducts'
    | 'dashboard.viewTransactions'
    | 'barcode.title'
    | 'barcode.subtitle'
    | 'barcode.createLabel'
    | 'barcode.barcodeValue'
    | 'barcode.enterCode'
    | 'barcode.format'
    | 'barcode.copiesSummary'
    | 'barcode.downloadSvg'
    | 'barcode.printLabels'
    | 'barcode.printing'
    | 'barcode.printed'
    | 'barcode.livePreview'
    | 'barcode.previewHint'
    | 'barcode.enterPreview'
    | 'barcode.invalid'
    | 'barcode.hint.code128'
    | 'barcode.hint.ean13'
    | 'barcode.hint.ean8'
    | 'barcode.hint.upc'
    | 'barcode.hint.code39'
    | 'receipt.customer'
    | 'receipt.phone'
    | 'receipt.item'
    | 'receipt.amount'
    | 'receipt.subtotal'
    | 'receipt.tax'
    | 'receipt.total'
    | 'receipt.walkIn'
    | 'receipt.visitAgain'
    | 'time.today'
    | 'time.yesterday';

type TranslationTable = Record<TranslationKey, string>;

const en: TranslationTable = {
    'common.add': 'Add',
    'common.all': 'All',
    'common.cancel': 'Cancel',
    'common.clear': 'Clear',
    'common.close': 'Close',
    'common.copies': 'Copies',
    'common.date': 'Date',
    'common.delete': 'Delete',
    'common.discount': 'Discount',
    'common.download': 'Download',
    'common.edit': 'Edit',
    'common.export': 'Export',
    'common.hidden': 'Hidden',
    'common.import': 'Import',
    'common.loading': 'Loading...',
    'common.name': 'Name',
    'common.next': 'Next',
    'common.optional': 'Optional',
    'common.phone': 'Phone',
    'common.preview': 'Preview',
    'common.prev': 'Prev',
    'common.price': 'Price',
    'common.print': 'Print',
    'common.quantity': 'Qty',
    'common.rate': 'Rate',
    'common.ready': 'Ready',
    'common.retry': 'Retry',
    'common.save': 'Save Settings',
    'common.saved': 'Saved',
    'common.saving': 'Saving...',
    'common.search': 'Search',
    'common.stock': 'Stock',
    'common.total': 'Total',
    'common.update': 'Update',
    'common.visible': 'Visible',
    'layout.dashboard': 'Dashboard',
    'layout.pos': 'POS',
    'layout.inventory': 'Inventory',
    'layout.vendors': 'Vendors',
    'layout.history': 'History',
    'layout.barcode': 'Barcode',
    'layout.settings': 'Settings',
    'layout.retailPos': 'Retail POS',
    'settings.title': 'Store Settings',
    'settings.subtitle': 'Configure printers, language, modules, and billing defaults',
    'settings.storeIdentity': 'Store Identity',
    'settings.storeName': 'Store Name',
    'settings.address': 'Address',
    'settings.receiptFooter': 'Receipt Footer',
    'settings.printerRouting': 'Printer Routing',
    'settings.billPrinter': 'Bill Printer',
    'settings.barcodePrinter': 'Barcode Printer',
    'settings.selectBillPrinter': 'Select bill printer',
    'settings.selectBarcodePrinter': 'Select barcode printer',
    'settings.thermalBillSize': 'Thermal Bill Size',
    'settings.compactCounterBill': 'Compact counter bill',
    'settings.widerLayout': 'Wider layout',
    'settings.appearanceBilling': 'Appearance & Billing',
    'settings.theme': 'Theme',
    'settings.system': 'System',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.themeHint': 'Theme will apply after saving settings',
    'settings.taxRate': 'Tax Rate (%)',
    'settings.taxOn': 'Tax On',
    'settings.taxOff': 'Tax Off',
    'settings.currency': 'Currency',
    'settings.modulesLanguage': 'Modules & Language',
    'settings.language': 'Language',
    'settings.languageHint': 'This translates the main user interface across the app.',
    'settings.defaultBillingMode': 'Default Billing Mode',
    'settings.defaultBillingModeHint': 'POS opens with this pricing mode by default.',
    'settings.vendorsPage': 'Vendors Page',
    'settings.vendorsPageHint': 'Show or hide vendor management from the sidebar and routes.',
    'settings.receiptPreview': 'Thermal Receipt Preview',
    'settings.receiptPreviewPaper': '{paper} paper',
    'settings.dataManagement': 'Data Management',
    'settings.deleteHistory': 'Delete History',
    'settings.deleteHistoryHint': 'Clearing transaction history removes old bill records permanently.',
    'settings.confirmDelete': 'Confirm Delete',
    'settings.cannotUndo': 'This action cannot be undone.',
    'settings.retail': 'Retail',
    'settings.wholesale': 'Wholesale',
    'settings.english': 'English',
    'settings.hindi': 'Hindi',
    'settings.marathi': 'Marathi',
    'settings.bengali': 'Bengali',
    'settings.gujarati': 'Gujarati',
    'pos.title': 'POS Terminal',
    'pos.subtitle': 'Scan or click to add',
    'pos.searchPlaceholder': 'Search by name or SKU...',
    'pos.order': 'Order',
    'pos.productsEmpty': 'No products found',
    'pos.cartEmpty': 'Cart empty',
    'pos.addCustomer': 'Add Customer',
    'pos.noPhone': 'No phone',
    'pos.extraDiscount': 'Extra Discount',
    'pos.checkout': 'Checkout',
    'pos.printCheckout': 'Print & Checkout',
    'pos.transactionRecorded': 'Transaction recorded',
    'pos.success': 'Success!',
    'pos.customerName': 'Customer name',
    'pos.dateOfBirth': 'Date of Birth',
    'pos.customerOptional': 'Optional',
    'pos.scanOrClick': 'Scan or click to add',
    'pos.outOfStock': 'Out of stock!',
    'pos.productOutOfStock': 'Product out of stock!',
    'pos.billingMode': 'Billing Mode',
    'pos.retailPrice': 'Retail Price',
    'pos.wholesalePrice': 'Wholesale Price',
    'pos.priceFallback': 'Retail fallback',
    'pos.payment.cash': 'Cash',
    'pos.payment.card': 'Card',
    'pos.payment.upi': 'UPI',
    'inventory.title': 'Inventory',
    'inventory.subtitle': 'Manage products',
    'inventory.products': 'Products',
    'inventory.value': 'Value',
    'inventory.lowStock': 'Low Stock',
    'inventory.out': 'Out',
    'inventory.template': 'Template',
    'inventory.addProduct': 'Add Product',
    'inventory.searchPlaceholder': 'Search by name or SKU...',
    'inventory.product': 'Product',
    'inventory.sku': 'SKU',
    'inventory.category': 'Category',
    'inventory.retailPrice': 'Retail',
    'inventory.wholesalePrice': 'Wholesale',
    'inventory.costPrice': 'Cost',
    'inventory.actions': 'Actions',
    'inventory.loading': 'Loading...',
    'inventory.noProducts': 'No products found',
    'inventory.addFirstProduct': 'Add your first product.',
    'inventory.adjustFilters': 'Try adjusting filters.',
    'inventory.editProduct': 'Edit Product',
    'inventory.updateDetails': 'Update details',
    'inventory.enterInformation': 'Enter information',
    'inventory.skuBarcode': 'SKU / Barcode',
    'inventory.productName': 'Product Name',
    'inventory.generateAuto': 'Auto',
    'inventory.stockStatus.out': 'Out',
    'inventory.stockStatus.low': 'Low',
    'inventory.stockStatus.ok': 'In Stock',
    'history.title': 'Transaction History',
    'history.subtitle': 'View and reprint receipts',
    'history.searchPlaceholder': 'Search by ID...',
    'history.total': 'Total',
    'history.today': 'Today',
    'history.average': 'Average',
    'history.showing': 'Showing',
    'history.orders': 'orders',
    'history.perOrder': 'Per order',
    'history.order': 'Order',
    'history.dateTime': 'Date & Time',
    'history.payment': 'Payment',
    'history.amount': 'Amount',
    'history.view': 'View',
    'history.print': 'Print',
    'history.allPayments': 'All Payments',
    'history.noTransactions': 'No transactions found',
    'history.adjustFilters': 'Try adjusting filters.',
    'history.viewReprint': 'View and reprint receipts',
    'history.each': 'each',
    'history.allTime': 'All time',
    'vendors.title': 'Vendor Management',
    'vendors.subtitle': 'Track purchases & payments',
    'vendors.allSummary': 'All Vendors (Summary)',
    'vendors.selectVendor': 'Select Vendor',
    'vendors.addTransaction': 'Add Transaction',
    'vendors.records': 'Records',
    'vendors.totalPurchase': 'Total Purchase',
    'vendors.totalPaid': 'Total Paid',
    'vendors.pending': 'Pending',
    'vendors.searchPlaceholder': 'Search by vendor name or notes...',
    'vendors.allTime': 'All Time',
    'vendors.today': 'Today',
    'vendors.week': 'Week',
    'vendors.month': 'Month',
    'vendors.vendor': 'Vendor',
    'vendors.purchaseAmount': 'Purchase Amount',
    'vendors.paymentAmount': 'Payment Amount',
    'vendors.pendingAmount': 'Pending Amount',
    'vendors.notes': 'Notes',
    'vendors.noRecords': 'No vendor records found',
    'vendors.addFirstRecord': 'Add your first vendor record.',
    'vendors.record': 'Record',
    'vendors.purchaseDetails': 'Purchase Details',
    'vendors.paymentDetails': 'Payment Details',
    'vendors.purchaseBillImage': 'Purchase Bill Image',
    'vendors.paymentBillImage': 'Payment Bill Image',
    'vendors.uploadImage': 'Upload Image',
    'vendors.changeImage': 'Change Image',
    'vendors.totalAmount': 'Total Amount',
    'vendors.paidAmount': 'Paid Amount',
    'vendors.addVendor': 'Add New Vendor',
    'vendors.vendorName': 'Vendor Name',
    'vendors.createVendor': 'Create Vendor',
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Business overview',
    'dashboard.live': 'Live',
    'dashboard.sales': 'Sales',
    'dashboard.today': 'Today',
    'dashboard.total': 'Total',
    'dashboard.transactions': 'Transactions',
    'dashboard.allTime': 'All time',
    'dashboard.lowStock': 'Low Stock',
    'dashboard.needRestock': 'Need restock',
    'dashboard.allStocked': 'All stocked',
    'dashboard.profit': 'Profit',
    'dashboard.salesTrend': 'Sales Trend',
    'dashboard.last7Days': 'Last 7 days',
    'dashboard.revenue': 'Revenue',
    'dashboard.loading': 'Loading dashboard...',
    'dashboard.unavailable': 'Unable to load dashboard data',
    'dashboard.startTransaction': 'Start transaction',
    'dashboard.manageProducts': 'Manage products',
    'dashboard.viewTransactions': 'View transactions',
    'barcode.title': 'Barcode Studio',
    'barcode.subtitle': 'Print clean barcode labels',
    'barcode.createLabel': 'Create Label',
    'barcode.barcodeValue': 'Barcode Value',
    'barcode.enterCode': 'Enter code or scan here',
    'barcode.format': 'Format',
    'barcode.copiesSummary': '{price} x {count} {copies}',
    'barcode.downloadSvg': 'Download SVG',
    'barcode.printLabels': 'Print Labels',
    'barcode.printing': 'Printing...',
    'barcode.printed': 'Printed',
    'barcode.livePreview': 'Live Preview',
    'barcode.previewHint': 'Label that will go to the printer',
    'barcode.enterPreview': 'Enter a barcode value to preview',
    'barcode.invalid': 'Invalid barcode: {message}',
    'barcode.hint.code128': 'Best for mixed letters and numbers',
    'barcode.hint.ean13': 'Retail standard with 12 or 13 digits',
    'barcode.hint.ean8': 'Compact retail format with 7 or 8 digits',
    'barcode.hint.upc': 'Common retail format with 11 or 12 digits',
    'barcode.hint.code39': 'Industrial code using uppercase text',
    'receipt.customer': 'Customer',
    'receipt.phone': 'Ph',
    'receipt.item': 'ITEM',
    'receipt.amount': 'AMT',
    'receipt.subtotal': 'Subtotal',
    'receipt.tax': 'Tax ({rate}%)',
    'receipt.total': 'TOTAL',
    'receipt.walkIn': 'Walk-in',
    'receipt.visitAgain': 'Please visit again!',
    'time.today': 'Today',
    'time.yesterday': 'Yesterday',
};

const hi: Partial<TranslationTable> = {
    'common.add': 'जोड़ें',
    'common.all': 'सभी',
    'common.cancel': 'रद्द करें',
    'common.clear': 'साफ करें',
    'common.close': 'बंद करें',
    'common.copies': 'कॉपी',
    'common.date': 'तारीख',
    'common.delete': 'हटाएँ',
    'common.download': 'डाउनलोड',
    'common.edit': 'संपादित करें',
    'common.export': 'एक्सपोर्ट',
    'common.hidden': 'छिपा हुआ',
    'common.import': 'इम्पोर्ट',
    'common.loading': 'लोड हो रहा है...',
    'common.name': 'नाम',
    'common.next': 'अगला',
    'common.optional': 'वैकल्पिक',
    'common.phone': 'फोन',
    'common.preview': 'पूर्वावलोकन',
    'common.prev': 'पिछला',
    'common.price': 'कीमत',
    'common.print': 'प्रिंट',
    'common.quantity': 'मात्रा',
    'common.rate': 'रेट',
    'common.ready': 'तैयार',
    'common.save': 'सेटिंग्स सेव करें',
    'common.saved': 'सेव हो गया',
    'common.saving': 'सेव हो रहा है...',
    'common.search': 'खोजें',
    'common.stock': 'स्टॉक',
    'common.total': 'कुल',
    'common.update': 'अपडेट',
    'common.visible': 'दिखाएँ',
    'layout.dashboard': 'डैशबोर्ड',
    'layout.pos': 'पीओएस',
    'layout.inventory': 'इन्वेंटरी',
    'layout.vendors': 'वेंडर्स',
    'layout.history': 'हिस्ट्री',
    'layout.barcode': 'बारकोड',
    'layout.settings': 'सेटिंग्स',
    'settings.title': 'स्टोर सेटिंग्स',
    'settings.subtitle': 'प्रिंटर, भाषा, मॉड्यूल और बिलिंग डिफॉल्ट सेट करें',
    'settings.storeIdentity': 'स्टोर जानकारी',
    'settings.storeName': 'स्टोर नाम',
    'settings.address': 'पता',
    'settings.receiptFooter': 'रसीद फुटर',
    'settings.printerRouting': 'प्रिंटर रूटिंग',
    'settings.appearanceBilling': 'दिखावट और बिलिंग',
    'settings.modulesLanguage': 'मॉड्यूल और भाषा',
    'settings.language': 'भाषा',
    'settings.defaultBillingMode': 'डिफॉल्ट बिलिंग मोड',
    'settings.vendorsPage': 'वेंडर्स पेज',
    'settings.receiptPreview': 'थर्मल रसीद प्रीव्यू',
    'settings.dataManagement': 'डेटा प्रबंधन',
    'settings.deleteHistory': 'हिस्ट्री हटाएँ',
    'settings.retail': 'रिटेल',
    'settings.wholesale': 'होलसेल',
    'settings.english': 'अंग्रेज़ी',
    'settings.hindi': 'हिंदी',
    'settings.marathi': 'मराठी',
    'settings.bengali': 'बंगाली',
    'settings.gujarati': 'गुजराती',
    'pos.title': 'पीओएस टर्मिनल',
    'pos.subtitle': 'स्कैन करें या क्लिक करके जोड़ें',
    'pos.searchPlaceholder': 'नाम या SKU से खोजें...',
    'pos.order': 'ऑर्डर',
    'pos.productsEmpty': 'कोई प्रोडक्ट नहीं मिला',
    'pos.cartEmpty': 'कार्ट खाली है',
    'pos.addCustomer': 'ग्राहक जोड़ें',
    'pos.extraDiscount': 'अतिरिक्त छूट',
    'pos.checkout': 'चेकआउट',
    'pos.printCheckout': 'प्रिंट और चेकआउट',
    'pos.transactionRecorded': 'लेनदेन दर्ज हो गया',
    'pos.success': 'सफल!',
    'pos.billingMode': 'बिलिंग मोड',
    'pos.retailPrice': 'रिटेल कीमत',
    'pos.wholesalePrice': 'होलसेल कीमत',
    'inventory.title': 'इन्वेंटरी',
    'inventory.subtitle': 'प्रोडक्ट प्रबंधित करें',
    'inventory.addProduct': 'प्रोडक्ट जोड़ें',
    'history.title': 'लेनदेन इतिहास',
    'history.subtitle': 'रसीद देखें और दोबारा प्रिंट करें',
    'vendors.title': 'वेंडर प्रबंधन',
    'vendors.subtitle': 'खरीद और भुगतान ट्रैक करें',
    'dashboard.title': 'डैशबोर्ड',
    'dashboard.subtitle': 'बिज़नेस ओवरव्यू',
    'barcode.title': 'बारकोड स्टूडियो',
    'barcode.subtitle': 'साफ बारकोड लेबल प्रिंट करें',
    'receipt.customer': 'ग्राहक',
    'receipt.subtotal': 'उप-योग',
};

const mr: Partial<TranslationTable> = {
    'common.add': 'जोडा',
    'common.cancel': 'रद्द करा',
    'common.save': 'सेटिंग्ज सेव्ह करा',
    'layout.dashboard': 'डॅशबोर्ड',
    'layout.inventory': 'इन्व्हेंटरी',
    'layout.history': 'इतिहास',
    'layout.settings': 'सेटिंग्ज',
    'settings.title': 'स्टोअर सेटिंग्ज',
    'settings.defaultBillingMode': 'डीफॉल्ट बिलिंग मोड',
    'settings.retail': 'रिटेल',
    'settings.wholesale': 'घाऊक',
    'settings.language': 'भाषा',
    'pos.title': 'पीओएस टर्मिनल',
    'inventory.title': 'इन्व्हेंटरी',
    'history.title': 'व्यवहार इतिहास',
    'vendors.title': 'विक्रेता व्यवस्थापन',
    'dashboard.title': 'डॅशबोर्ड',
    'barcode.title': 'बारकोड स्टुडिओ',
};

const bn: Partial<TranslationTable> = {
    'common.add': 'যোগ করুন',
    'common.cancel': 'বাতিল করুন',
    'common.save': 'সেটিংস সংরক্ষণ করুন',
    'layout.dashboard': 'ড্যাশবোর্ড',
    'layout.inventory': 'ইনভেন্টরি',
    'layout.history': 'ইতিহাস',
    'layout.settings': 'সেটিংস',
    'settings.title': 'স্টোর সেটিংস',
    'settings.language': 'ভাষা',
    'settings.defaultBillingMode': 'ডিফল্ট বিলিং মোড',
    'settings.retail': 'রিটেইল',
    'settings.wholesale': 'হোলসেল',
    'pos.title': 'পিওএস টার্মিনাল',
    'inventory.title': 'ইনভেন্টরি',
    'history.title': 'লেনদেনের ইতিহাস',
    'vendors.title': 'ভেন্ডর ম্যানেজমেন্ট',
    'dashboard.title': 'ড্যাশবোর্ড',
    'barcode.title': 'বারকোড স্টুডিও',
};

const gu: Partial<TranslationTable> = {
    'common.add': 'ઉમેરો',
    'common.cancel': 'રદ કરો',
    'common.save': 'સેટિંગ્સ સેવ કરો',
    'layout.dashboard': 'ડેશબોર્ડ',
    'layout.inventory': 'ઇન્વેન્ટરી',
    'layout.history': 'ઇતિહાસ',
    'layout.settings': 'સેટિંગ્સ',
    'settings.title': 'સ્ટોર સેટિંગ્સ',
    'settings.language': 'ભાષા',
    'settings.defaultBillingMode': 'ડિફૉલ્ટ બિલિંગ મોડ',
    'settings.retail': 'રિટેલ',
    'settings.wholesale': 'થોક',
    'pos.title': 'પીઓએસ ટર્મિનલ',
    'inventory.title': 'ઇન્વેન્ટરી',
    'history.title': 'ટ્રાન્ઝેક્શન ઇતિહાસ',
    'vendors.title': 'વિક્રेता મેનેજમેન્ટ',
    'dashboard.title': 'ડેશબોર્ડ',
    'barcode.title': 'બારકોડ સ્ટુડિયો',
};

const translations: Record<AppLanguage, Partial<TranslationTable>> = {
    en,
    hi,
    mr,
    bn,
    gu,
};

export function translate(language: AppLanguage, key: TranslationKey, values?: Record<string, string | number>) {
    const table = translations[language] ?? translations.en;
    let message = table[key] ?? translations.en[key] ?? key;

    if (!values) {
        return message;
    }

    for (const [name, value] of Object.entries(values)) {
        message = message.replaceAll(`{${name}}`, String(value));
    }

    return message;
}

export function useI18n() {
    const language = useSettingsStore((state) => state.language);

    return {
        language,
        t: (key: TranslationKey, values?: Record<string, string | number>) => translate(language, key, values),
    };
}
