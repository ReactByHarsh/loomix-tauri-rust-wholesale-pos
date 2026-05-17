import { Outlet, NavLink } from 'react-router-dom';
import { Barcode, History, LayoutDashboard, Package, Settings, ShoppingCart, Truck } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSettingsStore } from '../store/useSettingsStore';

export function Layout() {
    const { storeName, profileImage } = useSettingsStore();
    const initial = storeName.charAt(0) || 'L';

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/pos', icon: ShoppingCart, label: 'POS' },
        { path: '/inventory', icon: Package, label: 'Inventory' },
        { path: '/vendors', icon: Truck, label: 'Vendors' },
        { path: '/history', icon: History, label: 'History' },
        { path: '/barcode', icon: Barcode, label: 'Barcode' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100">
            {/* Desktop Sidebar */}
            <aside className="hidden h-screen w-[220px] shrink-0 flex-col border-r border-slate-200 bg-white lg:flex dark:border-zinc-800 dark:bg-zinc-900">
                {/* Logo / Store */}
                <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 dark:border-zinc-800">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            initial
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{storeName || 'Loomix'}</p>
                        <p className="truncate text-[11px] text-slate-400">Retail POS</p>
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
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                                    isActive
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-zinc-900'
                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                                )
                            }
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="border-t border-slate-100 px-4 py-3 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Ready</span>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <aside className="flex h-screen w-16 shrink-0 flex-col items-center border-r border-slate-200 bg-white py-4 lg:hidden dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">
                    {profileImage ? <img src={profileImage} alt="Profile" className="h-full w-full object-cover" /> : initial}
                </div>
                <nav className="mt-4 flex flex-1 flex-col gap-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    'flex h-10 w-10 items-center justify-center rounded-lg transition',
                                    isActive ? 'bg-slate-900 text-white dark:bg-white dark:text-zinc-900' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-zinc-800'
                                )
                            }
                            title={item.label}
                        >
                            <item.icon size={18} />
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="relative flex-1 overflow-hidden">
                <div className="relative h-full overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
