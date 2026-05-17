import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrencyCode = 'INR' | 'USD' | 'EUR';
export type ThemeMode = 'system' | 'light' | 'dark';
export type ReceiptPaperSize = '3-inch' | '4-inch';

export interface SettingsState {
    storeName: string;
    taxRate: number;
    taxEnabled: boolean;
    currency: CurrencyCode;
    theme: ThemeMode;
    selectedPrinter: string;
    billPrinter: string;
    barcodePrinter: string;
    billPaperSize: ReceiptPaperSize;
    profileImage: string | null;
    storeAddress: string;
    storePhone: string;
    receiptFooter: string;
    setStoreName: (name: string) => void;
    setStoreAddress: (address: string) => void;
    setStorePhone: (phone: string) => void;
    setReceiptFooter: (footer: string) => void;
    setTaxRate: (rate: number) => void;
    setTaxEnabled: (enabled: boolean) => void;
    setCurrency: (currency: CurrencyCode) => void;
    setTheme: (theme: ThemeMode) => void;
    setSelectedPrinter: (printer: string) => void;
    setBillPrinter: (printer: string) => void;
    setBarcodePrinter: (printer: string) => void;
    setBillPaperSize: (size: ReceiptPaperSize) => void;
    setProfileImage: (image: string | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            storeName: 'Loomix',
            storeAddress: '',
            storePhone: '',
            receiptFooter: 'Thank you for your business!',
            taxRate: 8,
            taxEnabled: true,
            currency: 'INR',
            theme: 'system',
            selectedPrinter: '',
            billPrinter: '',
            barcodePrinter: '',
            billPaperSize: '3-inch',
            profileImage: null,
            setStoreName: (name) => set({ storeName: name }),
            setStoreAddress: (address) => set({ storeAddress: address }),
            setStorePhone: (phone) => set({ storePhone: phone }),
            setReceiptFooter: (footer) => set({ receiptFooter: footer }),
            setTaxRate: (rate) => set({ taxRate: rate }),
            setTaxEnabled: (enabled) => set({ taxEnabled: enabled }),
            setCurrency: (currency) => set({ currency }),
            setTheme: (theme) => set({ theme }),
            setSelectedPrinter: (printer) => set({ selectedPrinter: printer, billPrinter: printer }),
            setBillPrinter: (printer) => set({ billPrinter: printer, selectedPrinter: printer }),
            setBarcodePrinter: (printer) => set({ barcodePrinter: printer }),
            setBillPaperSize: (size) => set({ billPaperSize: size }),
            setProfileImage: (image) => set({ profileImage: image }),
        }),
        {
            name: 'loomix-settings',
            version: 2,
            migrate: (persistedState: unknown) => {
                const state = (persistedState as Partial<SettingsState> | undefined) ?? {};
                const selectedPrinter = state.billPrinter ?? state.selectedPrinter ?? '';
                return {
                    ...state,
                    selectedPrinter,
                    billPrinter: selectedPrinter,
                    barcodePrinter: state.barcodePrinter ?? '',
                    billPaperSize: state.billPaperSize ?? '3-inch',
                } as SettingsState;
            },
        }
    )
);

export const getCurrencySymbol = (currency: CurrencyCode) => {
    switch (currency) {
        case 'INR':
            return 'Rs.';
        case 'USD':
            return '$';
        case 'EUR':
            return 'EUR';
        default:
            return 'Rs.';
    }
};
