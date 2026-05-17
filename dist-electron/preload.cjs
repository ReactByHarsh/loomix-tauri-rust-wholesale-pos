"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...payload) => listener(event, ...payload));
  },
  off(...args) {
    const [channel, ...rest] = args;
    return ipcRenderer.off(channel, ...rest);
  },
  send(...args) {
    const [channel, ...rest] = args;
    return ipcRenderer.send(channel, ...rest);
  },
  invoke(...args) {
    const [channel, ...rest] = args;
    return ipcRenderer.invoke(channel, ...rest);
  },
});

contextBridge.exposeInMainWorld("api", {
  getProducts: () => ipcRenderer.invoke("get-products"),
  getProductBySku: (sku) => ipcRenderer.invoke("get-product-by-sku", sku),
  addProduct: (product) => ipcRenderer.invoke("add-product", product),
  updateProduct: (product) => ipcRenderer.invoke("update-product", product),
  deleteProduct: (id) => ipcRenderer.invoke("delete-product", id),
  createTransaction: (payload) => ipcRenderer.invoke("create-transaction", payload),
  getDashboardStats: () => ipcRenderer.invoke("get-dashboard-stats"),
  printReceipt: (data, printerName, options) => ipcRenderer.invoke("print-receipt", data, printerName, options),
  printBarcode: (html, printerName) => ipcRenderer.invoke("print-barcode", html, printerName),
  getPrinters: () => ipcRenderer.invoke("get-printers"),
  getSuggestedPrinter: () => ipcRenderer.invoke("get-suggested-printer"),
  getTransactionHistory: (args, legacyArgs) => ipcRenderer.invoke("get-transaction-history", args, legacyArgs),
  getTransactionById: (id) => ipcRenderer.invoke("get-transaction-by-id", id),
  exportProducts: () => ipcRenderer.invoke("export-products"),
  importProducts: (products) => ipcRenderer.invoke("import-products", products),
  exportTransactions: () => ipcRenderer.invoke("export-transactions"),
  clearTransactionHistory: () => ipcRenderer.invoke("clear-transaction-history"),
  activateLicense: (key) => ipcRenderer.invoke("activate-license", key),
  retryLicenseCheck: () => ipcRenderer.invoke("retry-license-check"),
  getLicenseStatus: () => ipcRenderer.invoke("get-license-status"),
  getCustomersList: (value) => ipcRenderer.invoke("get-customers-list", value),
  getCustomerHistory: (value) => ipcRenderer.invoke("get-customer-history", value),
  getVendorProfiles: () => ipcRenderer.invoke("get-vendor-profiles"),
  addVendorProfile: (profile) => ipcRenderer.invoke("add-vendor-profile", profile),
  getVendors: (args) => ipcRenderer.invoke("get-vendors", args),
  getVendorById: (id) => ipcRenderer.invoke("get-vendor-by-id", id),
  addVendor: (record) => ipcRenderer.invoke("add-vendor", record),
  updateVendor: (record) => ipcRenderer.invoke("update-vendor", record),
  deleteVendor: (id) => ipcRenderer.invoke("delete-vendor", id),
  getVendorStats: (id) => ipcRenderer.invoke("get-vendor-stats", id),
});
