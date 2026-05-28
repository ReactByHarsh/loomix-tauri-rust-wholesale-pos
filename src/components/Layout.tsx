import { Outlet, NavLink } from 'react-router-dom';
import { Barcode, History, LayoutDashboard, Package, Settings, ShoppingCart, Truck } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSettingsStore } from '../store/useSettingsStore';
import { UpdateBanner } from './UpdateBanner';
import { useAppUpdater } from '../hooks/useAppUpdater';
import { UpdaterContext } from '../context/UpdaterContext';
import { useI18n } from '../i18n';

export function Layout() {
    const { storeName, profileImage, vendorsEnabled } = useSettingsStore();
    const { t } = useI18n();
    const updater = useAppUpdater();
    const initial = storeName.charAt(0) || 'L';

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: t('layout.dashboard') },
        { path: '/pos', icon: ShoppingCart, label: t('layout.pos') },
        { path: '/inventory', icon: Package, label: t('layout.inventory') },
        { path: '/vendors', icon: Truck, label: t('layout.vendors'), hidden: !vendorsEnabled },
        { path: '/history', icon: History, label: t('layout.history') },
        { path: '/barcode', icon: Barcode, label: t('layout.barcode') },
        { path: '/settings', icon: Settings, label: t('layout.settings') },
    ].filter((item) => !item.hidden);

    return (
        <UpdaterContext.Provider value={updater}>
        <div className="flex h-screen overflow-hidden overscroll-none bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100">
            {/* Desktop Sidebar */}
            <aside className="hidden h-screen w-[220px] shrink-0 flex-col border-r border-slate-200 bg-white xl:flex 2xl:w-[250px] dark:border-zinc-800 dark:bg-zinc-900">
                {/* Logo / Store */}
                <div className="flex items-center px-5 py-6">
                    <div className="min-w-0">
                        <p className="truncate text-xl font-black tracking-tight text-slate-950 dark:text-white">Loomix POS</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-3">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all mb-1',
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-900/40 dark:text-indigo-300'
                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100'
                                )
                            }
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer / Profile */}
                <div className="border-t border-slate-100 p-4 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 shadow-sm dark:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                initial
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{storeName || 'Loomix'}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="truncate text-[10px] font-medium text-slate-500 dark:text-zinc-400">{t('common.ready')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <aside className="flex h-screen w-16 shrink-0 flex-col items-center border-r border-slate-200 bg-white py-4 xl:hidden dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4 text-center text-[10px] font-black tracking-tighter text-indigo-600 dark:text-indigo-400">
                    POS
                </div>
                <nav className="flex flex-1 flex-col gap-2 w-full px-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    'flex h-12 w-full items-center justify-center rounded-xl transition-all',
                                    isActive ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-zinc-800'
                                )
                            }
                            title={item.label}
                        >
                            <item.icon size={20} />
                        </NavLink>
                    ))}
                </nav>
                <div className="mt-auto pt-4 flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 shadow-sm dark:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {profileImage ? <img src={profileImage} alt="Profile" className="h-full w-full object-cover" /> : initial}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="relative min-w-0 flex-1 overflow-hidden overscroll-none">
                <div className="relative flex h-full flex-col overflow-hidden overscroll-none">
                    <UpdateBanner updater={updater} />
                    <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
        </UpdaterContext.Provider>
    );
}
