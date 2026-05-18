import { useEffect, useState, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, X, Calendar, DollarSign, FileImage, Truck, Eye, CheckCircle, Clock, Receipt, UserPlus, Users, ChevronDown } from 'lucide-react';
import { useSettingsStore, getCurrencySymbol } from '../store/useSettingsStore';
import { useI18n } from '../i18n';

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

interface VendorProfile {
    id: number;
    name: string;
    phone: string;
    address: string;
}

interface VendorRecord {
    id?: number;
    vendor_id?: number;
    vendor_name?: string;
    date: string;
    purchase_bill_image?: string;
    purchase_amount: number;
    payment_bill_image?: string;
    payment_amount: number;
    total_amount: number;
    paid_amount: number;
    pending_amount: number;
    notes?: string;
}

export function VendorsPage() {
    const { currency } = useSettingsStore();
    const { t } = useI18n();
    const currencySymbol = getCurrencySymbol(currency);
    const [profiles, setProfiles] = useState<VendorProfile[]>([]);
    const [selectedProfileId, setSelectedProfileId] = useState<number | 'all'>('all');
    const [isVendorDropdownOpen, setIsVendorDropdownOpen] = useState(false);
    const [showAddProfile, setShowAddProfile] = useState(false);
    const [newProfile, setNewProfile] = useState({ name: '', phone: '', address: '' });

    const [vendors, setVendors] = useState<VendorRecord[]>([]);
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingVendor, setEditingVendor] = useState<VendorRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(50);
    const [totalVendors, setTotalVendors] = useState(0);

    const [formData, setFormData] = useState<Partial<VendorRecord>>({
        vendor_id: undefined,
        date: new Date().toISOString().split('T')[0],
        purchase_amount: 0,
        payment_amount: 0,
        total_amount: 0,
        paid_amount: 0,
        pending_amount: 0
    });

    const [stats, setStats] = useState({
        total_purchase: 0,
        total_paid: 0,
        total_pending: 0,
        vendor_count: 0
    });

    const purchaseImageRef = useRef<HTMLInputElement>(null);
    const paymentImageRef = useRef<HTMLInputElement>(null);

    const fetchProfiles = async () => {
        try {
            // @ts-ignore
            if (!window.api?.getVendorProfiles) return;
            // @ts-ignore
            const data = await window.api.getVendorProfiles();
            setProfiles(data || []);
        } catch (error) { }
    };

    const fetchVendors = async () => {
        setIsLoading(true);
        try {
            // @ts-ignore
            if (!window.api?.getVendors) return;
            // @ts-ignore
            const response = await window.api.getVendors({
                page: currentPage,
                pageSize,
                search,
                dateFilter,
                vendorId: selectedProfileId === 'all' ? undefined : selectedProfileId
            });
            setVendors(response.vendors);
            setTotalVendors(response.total);
            setTotalPages(Math.ceil(response.total / pageSize));
        } catch (error) { }
        setIsLoading(false);
    };

    const fetchStats = async () => {
        try {
            // @ts-ignore
            if (!window.api?.getVendorStats) return;
            // @ts-ignore
            const data = await window.api.getVendorStats(selectedProfileId === 'all' ? undefined : selectedProfileId);
            setStats(data);
        } catch (error) { }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchVendors();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, dateFilter, selectedProfileId]);

    useEffect(() => {
        fetchVendors();
        fetchStats();
    }, [currentPage, selectedProfileId]); // Add selectedProfileId here to refresh stats too

    const handleAddProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // @ts-ignore
            if (!window.api?.addVendorProfile) return;
            // @ts-ignore
            const result = await window.api.addVendorProfile(newProfile);
            if (result.success) {
                setShowAddProfile(false);
                setNewProfile({ name: '', phone: '', address: '' });
                fetchProfiles();
                // Select the new vendor
                if (result.data?.lastInsertRowid) {
                    setSelectedProfileId(Number(result.data.lastInsertRowid));
                }
            } else { alert("Error: " + result.error); }
        } catch (e) { alert("Failed to add vendor"); }
    };

    // Auto-calculate pending amount
    useEffect(() => {
        const total = Number(formData.total_amount) || 0;
        const paid = Number(formData.paid_amount) || 0;
        setFormData(prev => ({ ...prev, pending_amount: total - paid }));
    }, [formData.total_amount, formData.paid_amount]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'purchase' | 'payment') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            if (type === 'purchase') {
                setFormData(prev => ({ ...prev, purchase_bill_image: base64 }));
            } else {
                setFormData(prev => ({ ...prev, payment_bill_image: base64 }));
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // @ts-ignore
            if (!window.api?.addVendor) { alert("API not available"); return; }
            // @ts-ignore
            const result = await window.api.addVendor({
                ...formData,
                purchase_amount: Number(formData.purchase_amount) || 0,
                payment_amount: Number(formData.payment_amount) || 0,
                total_amount: Number(formData.total_amount) || 0,
                paid_amount: Number(formData.paid_amount) || 0,
                pending_amount: Number(formData.pending_amount) || 0
            });
            if (result.success) {
                setIsDialogOpen(false);
                resetForm();
                fetchVendors();
                fetchStats();
            } else {
                alert("Error: " + (result.error || "Unknown error"));
            }
        } catch (error) { alert("Error adding vendor record"); }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // @ts-ignore
            if (!window.api?.updateVendor) { alert("API not available"); return; }
            // @ts-ignore
            const result = await window.api.updateVendor({
                id: editingVendor?.id,
                ...formData,
                purchase_amount: Number(formData.purchase_amount) || 0,
                payment_amount: Number(formData.payment_amount) || 0,
                total_amount: Number(formData.total_amount) || 0,
                paid_amount: Number(formData.paid_amount) || 0,
                pending_amount: Number(formData.pending_amount) || 0
            });
            if (result.success) {
                setIsDialogOpen(false);
                setIsEditing(false);
                setEditingVendor(null);
                resetForm();
                fetchVendors();
                fetchStats();
            } else {
                alert("Error: " + (result.error || "Unknown error"));
            }
        } catch (error) { alert("Error updating vendor record"); }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this vendor record?')) {
            try {
                // @ts-ignore
                if (!window.api?.deleteVendor) return;
                // @ts-ignore
                await window.api.deleteVendor(id);
                fetchVendors();
                fetchStats();
            } catch (error) { alert("Error deleting vendor record"); }
        }
    };

    const handleEdit = (vendor: VendorRecord) => {
        setEditingVendor(vendor);
        setFormData({
            vendor_name: vendor.vendor_name || '',
            date: vendor.date,
            purchase_bill_image: vendor.purchase_bill_image,
            purchase_amount: vendor.purchase_amount,
            payment_bill_image: vendor.payment_bill_image,
            payment_amount: vendor.payment_amount,
            total_amount: vendor.total_amount,
            paid_amount: vendor.paid_amount,
            pending_amount: vendor.pending_amount,
            notes: vendor.notes || ''
        });
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            date: new Date().toISOString().split('T')[0],
            purchase_amount: 0,
            payment_amount: 0,
            total_amount: 0,
            paid_amount: 0,
            pending_amount: 0
        });
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setIsEditing(false);
        setEditingVendor(null);
        resetForm();
    };

    return (
        <div className="flex flex-col h-full bg-zinc-100 dark:bg-zinc-900">
            {/* Compact Header */}
            <div className="sticky top-0 z-20 shrink-0 border-b border-zinc-200 bg-white/95 p-4 backdrop-blur dark:border-zinc-700 dark:bg-zinc-800/95">
                <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-600 dark:to-zinc-700 rounded-lg">
                            <Truck size={18} className="text-zinc-700 dark:text-zinc-300" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{t('vendors.title')}</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('vendors.subtitle')}</p>
                        </div>
                    </div>
                </div>

                {/* Vendor Selection Bar */}
                <div className="flex items-center gap-3 mb-4 bg-zinc-50 dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <div className="relative flex-1">
                        <button
                            onClick={() => setIsVendorDropdownOpen(!isVendorDropdownOpen)}
                            className="w-full flex items-center justify-between gap-2 px-2 py-1 bg-transparent rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group"
                        >
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-zinc-500" />
                                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                                    {selectedProfileId === 'all'
                                        ? t('vendors.allSummary')
                                        : profiles.find(p => p.id === selectedProfileId)?.name || t('vendors.selectVendor')}
                                </span>
                            </div>
                            <ChevronDown size={16} className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                        </button>

                        {isVendorDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsVendorDropdownOpen(false)}></div>
                                <div className="absolute top-full left-0 z-20 w-full mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl max-h-60 overflow-y-auto p-1 custom-scrollbar">
                                    <button
                                        onClick={() => { setSelectedProfileId('all'); setIsVendorDropdownOpen(false); }}
                                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${selectedProfileId === 'all'
                                            ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                                            }`}
                                    >
                                        {t('vendors.allSummary')}
                                    </button>
                                    {profiles.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => { setSelectedProfileId(p.id); setIsVendorDropdownOpen(false); }}
                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${selectedProfileId === p.id
                                                ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                                                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                                                }`}
                                        >
                                            {p.name}
                                        </button>
                                    ))}
                                    {profiles.length === 0 && (
                                        <div className="px-3 py-4 text-center text-xs text-zinc-500">
                                            No vendor profiles found.
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    <button onClick={() => setShowAddProfile(true)} className="p-1.5 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg text-zinc-700 dark:text-zinc-300" title="Add New Vendor Profile">
                        <UserPlus size={16} />
                    </button>
                    <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-600 mx-1"></div>
                    <button onClick={() => {
                        resetForm();
                        // If specific vendor selected, pre-fill
                        if (selectedProfileId !== 'all') {
                            const profile = profiles.find(p => p.id === selectedProfileId);
                            setFormData(prev => ({ ...prev, vendor_id: selectedProfileId as number, vendor_name: profile?.name }));
                        }
                        setIsDialogOpen(true);
                    }} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium text-xs">
                        <Plus size={14} /> {t('vendors.addTransaction')}
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium text-zinc-500 uppercase">{t('vendors.records')}</span>
                            <Receipt size={12} className="text-zinc-400" />
                        </div>
                        <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{stats.vendor_count}</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium text-zinc-500 uppercase">{t('vendors.totalPurchase')}</span>
                            <DollarSign size={12} className="text-zinc-400" />
                        </div>
                        <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{currencySymbol}{stats.total_purchase.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium text-zinc-500 uppercase">{t('vendors.totalPaid')}</span>
                            <CheckCircle size={12} className="text-emerald-500" />
                        </div>
                        <p className="text-lg font-bold text-emerald-600">{currencySymbol}{stats.total_paid.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium text-zinc-500 uppercase">{t('vendors.pending')}</span>
                            <Clock size={12} className={stats.total_pending > 0 ? "text-amber-500" : "text-zinc-400"} />
                        </div>
                        <p className={cn("text-lg font-bold", stats.total_pending > 0 ? "text-amber-600" : "text-zinc-800 dark:text-zinc-100")}>{currencySymbol}{stats.total_pending.toLocaleString('en-IN')}</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input type="text" placeholder={t('vendors.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm" />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-zinc-400" />
                        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
                            className="px-2 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm">
                            <option value="all">{t('vendors.allTime')}</option>
                            <option value="today">{t('vendors.today')}</option>
                            <option value="week">{t('vendors.week')}</option>
                            <option value="month">{t('vendors.month')}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden flex flex-col h-full">
                    {isLoading ? (
                        <div className="p-8 flex flex-col items-center justify-center">
                            <div className="w-8 h-8 border-3 border-zinc-300 border-t-violet-600 dark:border-zinc-600 dark:border-t-violet-400 rounded-full animate-spin"></div>
                            <p className="mt-3 text-zinc-500 text-sm">Loading...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left">
                                    <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500">Date</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500">Vendor</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-center">Purchase Bill</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-right">Purchase Amt</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-center">Payment Bill</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-right">Payment Amt</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-right">Total</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-right">Paid</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-right">Pending</th>
                                            <th className="px-4 py-2 font-semibold text-[10px] uppercase tracking-wider text-zinc-500 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                                        {vendors.map(vendor => (
                                            <tr key={vendor.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-700/30">
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={12} className="text-zinc-400" />
                                                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{vendor.date}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className="font-medium text-sm text-zinc-800 dark:text-zinc-100">{vendor.vendor_name || '-'}</span>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    {vendor.purchase_bill_image ? (
                                                        <button onClick={() => setImagePreview(vendor.purchase_bill_image!)} className="p-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded hover:bg-violet-200 dark:hover:bg-violet-900/50">
                                                            <Eye size={14} />
                                                        </button>
                                                    ) : (
                                                        <span className="text-zinc-400 text-xs">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-right font-medium text-sm text-zinc-800 dark:text-zinc-100">{currencySymbol}{vendor.purchase_amount.toLocaleString('en-IN')}</td>
                                                <td className="px-4 py-2 text-center">
                                                    {vendor.payment_bill_image ? (
                                                        <button onClick={() => setImagePreview(vendor.payment_bill_image!)} className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded hover:bg-emerald-200 dark:hover:bg-emerald-900/50">
                                                            <Eye size={14} />
                                                        </button>
                                                    ) : (
                                                        <span className="text-zinc-400 text-xs">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-right font-medium text-sm text-zinc-800 dark:text-zinc-100">{currencySymbol}{vendor.payment_amount.toLocaleString('en-IN')}</td>
                                                <td className="px-4 py-2 text-right font-bold text-sm text-zinc-800 dark:text-zinc-100">{currencySymbol}{vendor.total_amount.toLocaleString('en-IN')}</td>
                                                <td className="px-4 py-2 text-right">
                                                    <span className="text-sm font-medium text-emerald-600">{currencySymbol}{vendor.paid_amount.toLocaleString('en-IN')}</span>
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1",
                                                        vendor.pending_amount <= 0 ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                            : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                                    )}>
                                                        {vendor.pending_amount <= 0 ? <><CheckCircle size={10} /> Paid</> : <><Clock size={10} /> {currencySymbol}{vendor.pending_amount.toLocaleString('en-IN')}</>}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <div className="flex items-center justify-end gap-0.5">
                                                        <button onClick={() => handleEdit(vendor)} className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded" title="Edit">
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button onClick={() => handleDelete(vendor.id!)} className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" title="Delete">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="p-3 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
                                <p className="text-xs text-zinc-500">{vendors.length} of {totalVendors} records</p>
                                <div className="flex items-center gap-1.5">
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        className="px-2 py-1 text-xs font-medium rounded border border-zinc-300 dark:border-zinc-600 hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-50">{t('common.prev')}</button>
                                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{currentPage}/{totalPages}</span>
                                    <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        className="px-2 py-1 text-xs font-medium rounded border border-zinc-300 dark:border-zinc-600 hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-50">{t('common.next')}</button>
                                </div>
                            </div>

                            {vendors.length === 0 && (
                                <div className="p-8 text-center">
                                    <Truck size={32} className="mx-auto mb-3 text-zinc-300 dark:text-zinc-600" />
                                    <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-1">{t('vendors.noRecords')}</h3>
                                    <p className="text-zinc-500 text-xs">{totalVendors === 0 ? t('vendors.addFirstRecord') : t('inventory.adjustFilters')}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeDialog}>
                    <div className="bg-white dark:bg-zinc-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="relative bg-gradient-to-r from-violet-600 to-purple-700 p-4 text-white">
                            <button onClick={closeDialog} className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full"><X size={16} /></button>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white/20 rounded-lg">{isEditing ? <Edit2 size={16} /> : <Plus size={16} />}</div>
                                <div>
                                    <h2 className="text-base font-bold">{isEditing ? 'Edit Vendor Record' : 'Add Vendor Record'}</h2>
                                    <p className="text-violet-200 text-xs">{isEditing ? 'Update details' : 'Enter vendor information'}</p>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Vendor *</label>
                                    <div className="flex gap-1.5">
                                        <select required className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
                                            value={formData.vendor_id || ''}
                                            onChange={e => {
                                                const id = Number(e.target.value);
                                                const p = profiles.find(pr => pr.id === id);
                                                setFormData({ ...formData, vendor_id: id, vendor_name: p?.name });
                                            }}>
                                            <option value="">Select Vendor</option>
                                            {profiles.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                        <button type="button" onClick={() => setShowAddProfile(true)} className="p-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg text-zinc-600 dark:text-zinc-300" title="Add New Vendor">
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Date *</label>
                                    <div className="relative">
                                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input required type="date" className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
                                            value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            {/* Purchase Section */}
                            <div className="border border-zinc-200 dark:border-zinc-600 rounded-lg p-3">
                                <h3 className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2 uppercase">Purchase Details</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Purchase Bill Image</label>
                                        <div className="flex items-center gap-2">
                                            <input ref={purchaseImageRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'purchase')} />
                                            <button type="button" onClick={() => purchaseImageRef.current?.click()}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg hover:border-violet-400 text-sm text-zinc-500">
                                                <FileImage size={16} />
                                                {formData.purchase_bill_image ? 'Change Image' : 'Upload Image'}
                                            </button>
                                            {formData.purchase_bill_image && (
                                                <button type="button" onClick={() => setImagePreview(formData.purchase_bill_image!)} className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 rounded-lg">
                                                    <Eye size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Purchase Amount ({currencySymbol})</label>
                                        <div className="relative">
                                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                            <input type="number" step="0.01" className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
                                                value={formData.purchase_amount || ''} onChange={e => setFormData({ ...formData, purchase_amount: Number(e.target.value) })} placeholder="0.00" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="border border-zinc-200 dark:border-zinc-600 rounded-lg p-3">
                                <h3 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2 uppercase">Payment Details</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Payment Bill Image</label>
                                        <div className="flex items-center gap-2">
                                            <input ref={paymentImageRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'payment')} />
                                            <button type="button" onClick={() => paymentImageRef.current?.click()}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg hover:border-emerald-400 text-sm text-zinc-500">
                                                <FileImage size={16} />
                                                {formData.payment_bill_image ? 'Change Image' : 'Upload Image'}
                                            </button>
                                            {formData.payment_bill_image && (
                                                <button type="button" onClick={() => setImagePreview(formData.payment_bill_image!)} className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                                                    <Eye size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Payment Amount ({currencySymbol})</label>
                                        <div className="relative">
                                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                            <input type="number" step="0.01" className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
                                                value={formData.payment_amount || ''} onChange={e => setFormData({ ...formData, payment_amount: Number(e.target.value) })} placeholder="0.00" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Amount Summary */}
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Total Amount ({currencySymbol})</label>
                                    <input type="number" step="0.01" className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
                                        value={formData.total_amount || ''} onChange={e => setFormData({ ...formData, total_amount: Number(e.target.value) })} placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Paid Amount ({currencySymbol})</label>
                                    <input type="number" step="0.01" className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
                                        value={formData.paid_amount || ''} onChange={e => setFormData({ ...formData, paid_amount: Number(e.target.value) })} placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Pending Amount ({currencySymbol})</label>
                                    <input type="number" step="0.01" readOnly className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-sm font-bold text-amber-600"
                                        value={formData.pending_amount || 0} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Notes</label>
                                <textarea className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm resize-none"
                                    rows={2} value={formData.notes || ''} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="Optional notes..." />
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button type="button" onClick={closeDialog} className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 font-medium text-sm">Cancel</button>
                                <button type="submit" className="flex-1 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm">{isEditing ? 'Update' : 'Add Record'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {imagePreview && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4" onClick={() => setImagePreview(null)}>
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <button onClick={() => setImagePreview(null)} className="absolute -top-10 right-0 p-2 text-white hover:bg-white/20 rounded-full">
                            <X size={24} />
                        </button>
                        <img src={imagePreview} alt="Bill Preview" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
                    </div>
                </div>
            )}

            {/* Add Vendor Profile Modal */}
            {showAddProfile && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={() => setShowAddProfile(false)}>
                    <div className="bg-white dark:bg-zinc-800 w-full max-w-sm rounded-xl shadow-2xl p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-zinc-800 dark:text-zinc-100">Add New Vendor</h3>
                            <button onClick={() => setShowAddProfile(false)}><X size={16} className="text-zinc-500" /></button>
                        </div>
                        <form onSubmit={handleAddProfile} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Vendor Name *</label>
                                <input type="text" required className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
                                    value={newProfile.name} onChange={e => setNewProfile({ ...newProfile, name: e.target.value })} placeholder="Business or Person Name" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Phone</label>
                                <input type="tel" className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
                                    value={newProfile.phone} onChange={e => setNewProfile({ ...newProfile, phone: e.target.value })} placeholder="Contact Number" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">Address</label>
                                <input type="text" className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
                                    value={newProfile.address} onChange={e => setNewProfile({ ...newProfile, address: e.target.value })} placeholder="Location" />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setShowAddProfile(false)} className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 text-sm">Cancel</button>
                                <button type="submit" className="flex-1 px-3 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium">Create Vendor</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
