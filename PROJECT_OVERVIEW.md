# Loomix - Project Overview

## 1. Security Architecture
The application implements a multi-layered security approach designed to protect intellectual property, prevent unauthorized usage, and ensure runtime integrity.

### 1.1 Runtime Security
*   **Context Isolation (`contextIsolation: true`)**: The renderer process (UI) runs in a separate context from the main process (backend). This prevents malicious code in the UI from accessing internal Electron APIs or Node.js primitives directly.
*   **Node Integration Disabled (`nodeIntegration: false`)**: Disables Node.js environment in the renderer, significantly reducing the attack surface against Cross-Site Scripting (XSS) attacks.
*   **Secure IPC Bridge (`contextBridge`)**: A whitelist-based API (via `preload.ts`) exposes *only* specific, necessary functions (e.g., `getProducts`, `activateLicense`) to the frontend. Direct access to arbitrary IPC channels is blocked.
*   **Anti-Debugging**: Production builds automatically block standard DevTools keyboard shortcuts (F12, Ctrl+Shift+I/J/C) to deter casual inspection and tampering.

### 1.2 Data Security
*   **Encrypted Local Storage**: License data is stored using `electron-store` with an `encryptionKey` obfuscation layer. This prevents users from easily editing the `license-data.json` file to modify their license status or expiry.
*   **Database Integrity**: Uses SQLite with WAL (Write-Ahead Logging) mode for robust data handling.

### 1.3 Anti-Piracy & Integrity
*   **Machine Binding**: Licenses are bound to the specific device's hardware signature (`node-machine-id`). This prevents copying a valid license file to another computer.
*   **Anti-Tampering (Time Bomb Defense)**: The `LicenseManager` tracks a monotonic "Last Known Date". On every launch, it checks if the system clock has been wound back (e.g., to extend a trial or bypass expiry). If tampering is detected, the license is immediately invalidated.
*   **Strict Online Verification**: The application enforces an internet connection check on startup to validate the license against the remote server, preventing offline cracks or "frozen" states.

---

## 2. Activation System
The activation logic is centralized in `electron/LicenseManager.ts`.

### 2.1 Workflow
1.  **Initialization**: On app startup, the `LicenseManager` initializes and checks for local clock tampering.
2.  **Validation**: It retrieves the stored license key.
    *   **If missing**: Redirects to **Activation Window**.
    *   **If present**: Performs a live verification against the licensing server (`https://electron-licensing-server.vercel.app/api/verify`).
3.  **Server Check**:
    *   Sends `licenseKey`, `machineId`, and `softwareType`.
    *   Server response determines validity and expiry.
4.  **Granting Access**:
    *   **Valid**: Application launches (`createWindow()`).
    *   **Invalid/Expired**: Application redirects to Authorization Window (`createActivationWindow()`).

### 2.2 License Data Structure
Stored locally (encrypted):
```typescript
interface LicenseData {
    key: string | null;
    status: 'active' | 'invalid' | 'expired';
    lastCheck: number;      // Timestamp of last verification
    expiry: number | null;  // Expiry timestamp
    lastKnownDate: number;  // Monotonic timestamp for anti-tamper
}
```

---

## 3. Feature Set

### 3.1 Point of Sale (POS)
*   **Rapid Transaction Processing**: Built for speed with barcode scanning support.
*   **Cart Management**: Add/remove items, adjust quantities.
*   **Dynamic Pricing**: Records "Price at Sale" to ensure historical accuracy even if product prices change later.
*   **Receipt Printing**: Direct thermal printer integration (`print-receipt` IPC).

### 3.2 Inventory Management
*   **Product CRUD**: Create, Read, Update, Delete products.
*   **Stock Tracking**: Real-time inventory deduction upon sale.
*   **Low Stock Alerts**: Automatic indicators for items with low quantity (<10).
*   **Bulk Operations**: Import and Export products via CSV/JSON.

### 3.3 Dashboard (Analytics)
*   **Sales Metrics**: Real-time view of **Today's Sales** and **Total Sales**.
*   **Profit Tracking**: Automated calculation of **Gross Profit** (Revenue - Cost) for both daily and all-time periods.
*   **Transactions Counter**: Total number of completed sales.
*   **Visual Charts**: Trend graph showing sales over the last 7 days.

### 3.4 Vendor Management
*   **Vendor Profiles**: Manage supplier contact details.
*   **Purchase Ledger**: Track "Purchase Amount", "Paid Amount", and "Pending Amount" per transaction.
*   **Bill Management**: Upload and view images of Purchase Bills and Payment Proofs.
*   **Financial Summary**: Aggregate view of total debt to vendors.
*   **Custom Dropdown UI**: Enhanced UX for vendor selection with search-ready structure.

### 3.5 Customer History
*   **Purchase Tracking**: Lookup past transactions by Customer Phone Number.
*   **CRM Basics**: View customer purchase frequency and total spend.

### 3.6 Settings
*   **Currency Support**: Configurable currency symbols (₹, $, €, etc.).
*   **Store Customization**: Set store name and address for receipts.

---

## 4. Improvements & Recommendations

### 4.1 Security Enhancements
*   **Key Management**: The encryption key (`'loomix-secure-rec-key'`) is hardcoded. Consider using OS-native secure storage (like `safeStorage` API on Electron or `keytar`) to store sensitive tokens.
*   **Request Signing**: Implement HMAC request signing for calls to the licensing server to prevent request tampering or replay attacks.
*   **Obfuscation**: Use a JavaScript obfuscator for the production build to make reverse-engineering the `LicenseManager` logic significantly harder.

### 4.2 Feature Enhancements
*   **Offline Activation**: Add a "Challenge-Response" manual activation method for users with restricted internet access.
*   **Role-Based Access**: Implement "Admin" vs "Cashier" logins to restrict access to Settings, Vendor Management, or history deletion.
*   **Backup & Restore**: Add a built-in utility to backup the SQLite database (`loomix.db`) to a user-selected location.
*   **Report Generation**: Add PDF export for "End of Day" or "Monthly Sales" reports.
