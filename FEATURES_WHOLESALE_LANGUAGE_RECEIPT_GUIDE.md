# Loomix Feature Guide

This document explains the new wholesale/retail billing flow, language support, vendors visibility toggle, sticky headers, pagination behavior, and the new receipt layout.

## What Was Implemented

### 1. Wholesale and Retail billing mode

- A saved default billing mode now exists in Settings.
- Supported modes:
  - `Retail`
  - `Wholesale`
- The POS page now shows a billing mode toggle in the top area.
- When the POS mode changes:
  - product prices update
  - cart line prices update
  - totals update
  - checkout stores the billing mode with the transaction

### 2. Wholesale price in inventory

- Products now support:
  - retail price
  - wholesale price
  - cost price
- Inventory table now includes a wholesale price column.
- Add/Edit product form now includes wholesale price.
- CSV import/export/template now supports `wholesale_price`.
- Existing products can be opened in Edit and given a wholesale price later.

### 3. Language support

- App settings now include language selection.
- Current options:
  - English
  - Hindi
  - Marathi
  - Bengali
  - Gujarati
- English is the default.
- Main UI labels now read from the new translation layer.
- If a translation key is missing in a non-English language, the app falls back to English automatically.

### 4. Vendors page visibility toggle

- Settings now include a Vendors visibility control.
- When Vendors is hidden:
  - the sidebar item is removed
  - `/vendors` redirects back to the dashboard

### 5. Sticky headers and pagination

- Settings header is now sticky.
- Sticky top sections were added or preserved on the large data screens.
- Pagination is working on:
  - Inventory
  - Vendors
  - History

### 6. Receipt redesign

- Receipt HTML was rebuilt to match your sample much more closely.
- New layout includes:
  - centered store title
  - centered date and customer block
  - dashed separators
  - `ITEM / QTY / RATE / AMT` layout
  - bold subtotal and tax rows
  - bold final total
  - centered `[ UPI ]` style payment line
  - two-line thank-you footer

## How To Use It

### Set the default billing mode

1. Open `Settings`.
2. Go to `Modules & Language`.
3. Choose `Retail` or `Wholesale`.
4. Save settings.
5. Open POS.
6. The POS screen will start in that saved mode.

### Change billing mode while billing

1. Open POS.
2. Use the `Retail / Wholesale` toggle at the top.
3. Product listing prices will switch.
4. Cart prices will switch.
5. Final totals will recalculate.

Note:
- If a product does not have a wholesale price yet, the app falls back to the retail price and shows a small fallback note in wholesale mode.

### Add wholesale prices to products

1. Open `Inventory`.
2. Click `Edit` on a product.
3. Enter a value in `Wholesale`.
4. Save.

You can also add wholesale prices during bulk import by including the `wholesale_price` column.

### Change app language

1. Open `Settings`.
2. Go to `Modules & Language`.
3. Select the language.
4. Click `Save Settings`.

Behavior:
- The interface updates using the saved language.
- Missing translated labels fall back to English instead of breaking.

### Show or hide vendors

1. Open `Settings`.
2. Go to `Modules & Language`.
3. Set `Vendors Page` to `Visible` or `Hidden`.
4. Save settings.

## Database Changes

The local SQLite database now stores extra billing information.

### New product field

- `wholesale_price REAL DEFAULT 0`

### New transaction field

- `billing_mode TEXT DEFAULT 'retail'`

This means:
- old products still work
- old transactions still work
- the database migrates forward automatically on app start

## Files Changed

### Frontend pricing and settings

- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\lib\pricing.ts`
- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\store\useCartStore.ts`
- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\store\useSettingsStore.ts`
- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\components\BillingModeToggle.tsx`
- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\pages\SettingsPage.tsx`
- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\pages\POSPage.tsx`

### Translation support

- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\i18n.ts`
- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\App.tsx`
- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\components\Layout.tsx`
- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\pages\DashboardPage.tsx`
- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\pages\BarcodePage.tsx`
- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\pages\InventoryPage.tsx`
- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\pages\HistoryPage.tsx`
- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\pages\VendorsPage.tsx`

### Backend and types

- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src-tauri\src\db.rs`
- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\types\index.ts`

### Receipt

- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\utils\receiptTemplate.ts`

## Important Notes For You Later

### 1. Translation coverage

The translation system is working now, but not every single string in every deep modal has a custom translation yet.

Current behavior is safe:
- translated keys use the selected language
- anything not translated falls back to English

If you want fuller language coverage later, keep adding keys in:

- `D:\RustSoftwaresOnly\ClothingSoftwareRust\src\i18n.ts`

### 2. Wholesale behavior rule

Current rule:
- if wholesale mode is selected and a product has no wholesale price, retail price is used

If you want stricter behavior later, you can change it to:
- block adding that item in wholesale mode
- warn before checkout
- require wholesale price before sale

### 3. Receipt logo

The receipt engine still supports store logo data in the payload, but the current printed template intentionally follows your cleaner sample and does not display the logo block.

### 4. Currency display

INR is now displayed as `₹` across shared currency formatting.

## Your Testing Checklist

Please test these flows manually after opening the app:

1. Create or edit a product and add a wholesale price.
2. Save `Wholesale` as the default mode in Settings.
3. Open POS and verify prices open in wholesale mode.
4. Toggle back to retail on POS and verify cart totals change.
5. Checkout one retail and one wholesale bill.
6. Reprint both from History.
7. Change the app language and check the main pages.
8. Hide Vendors from Settings and confirm the menu disappears.
9. Re-enable Vendors and confirm it returns.
10. Check Inventory, Vendors, and History pagination.
11. Print a receipt and compare spacing with your sample.

## Commands Already Verified

These passed after implementation:

```powershell
npm run build
cargo check --manifest-path src-tauri\Cargo.toml
```

## Recommended Next Improvements

If you want the next best upgrades after this, I recommend this order:

1. Finish deeper translation coverage for every modal and helper text.
2. Add a transaction filter in History for `retail` vs `wholesale`.
3. Show both retail and wholesale price on product detail hover/cards in POS.
4. Add an optional warning when wholesale mode is used without wholesale pricing.
5. Add print preview tuning with exact thermal width calibration from your printer model.
