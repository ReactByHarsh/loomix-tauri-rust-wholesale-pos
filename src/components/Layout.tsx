import { Outlet, NavLink } from 'react-router-dom';
import { Barcode, History, LayoutDashboard, Package, Settings, ShoppingCart, Sparkles, Store, Truck } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSettingsStore } from '../store/useSettingsStore';

export function Layout() {
    const { storeName, profileImage } = useSettingsStore();
    const initial = storeName.charAt(0) || 'L';

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', description: 'Sales overview' },
        { path: '/pos', icon: ShoppingCart, label: 'POS Terminal', description: 'Billing counter' },
        { path: '/inventory', icon: Package, label: 'Inventory', description: 'Products & stock' },
        { path: '/vendors', icon: Truck, label: 'Vendors', description: 'Purchases & dues' },
        { path: '/history', icon: History, label: 'History', description: 'Old bills' },
        { path: '/barcode', icon: Barcode, label: 'Barcode', description: 'Print labels' },
        { path: '/settings', icon: Settings, label: 'Settings', description: 'Printers & store' },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[linear-gradient(180deg,#f5f7fb_0%,#e9edf5_100%)] text-slate-900 dark:bg-[linear-gradient(180deg,#09090b_0%,#18181b_100%)] dark:text-slate-50">
            <aside className="relative hidden h-screen w-[280px] shrink-0 overflow-hidden border-r border-white/60 bg-[linear-gradient(180deg,rgba(15,23,42,0.96)_0%,rgba(15,23,42,0.90)_45%,rgba(30,41,59,0.92)_100%)] px-4 py-5 shadow-[30px_0_80px_rgba(15,23,42,0.18)] lg:flex lg:flex-col">
                <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.22),transparent_70%)]" />

                <div className="relative flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white text-lg font-black text-slate-900 shadow-lg">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            initial
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                            <Sparkles size={12} />
                            Retail OS
                        </div>
                        <p className="mt-1 truncate text-lg font-black tracking-tight text-white">{storeName || 'Loomix'}</p>
                        <p className="text-sm text-slate-400">Clothing software workspace</p>
                    </div>
                </div>

                <nav className="relative mt-5 flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    'group flex items-center gap-3 rounded-2xl px-3 py-3 transition',
                                    isActive
                                        ? 'bg-white text-slate-900 shadow-[0_20px_40px_rgba(255,255,255,0.15)]'
                                        : 'text-slate-300 hover:bg-white/8 hover:text-white'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl transition', isActive ? 'bg-slate-100 text-slate-900' : 'bg-white/6 text-slate-300 group-hover:bg-white/12 group-hover:text-white')}>
                                        <item.icon size={18} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className={cn('truncate text-sm font-bold', isActive ? 'text-slate-900' : 'text-white')}>{item.label}</p>
                                        <p className={cn('truncate text-xs', isActive ? 'text-slate-500' : 'text-slate-400')}>{item.description}</p>
                                    </div>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="relative mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        <Store size={12} />
                        System Status
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">Ready for billing</p>
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            Online
                        </span>
                    </div>
                </div>
            </aside>

            <aside className="flex h-screen w-[88px] shrink-0 flex-col items-center border-r border-slate-200/70 bg-white/90 px-3 py-5 shadow-[20px_0_50px_rgba(148,163,184,0.14)] backdrop-blur lg:hidden dark:border-zinc-800 dark:bg-zinc-950/90">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 text-lg font-black text-white">
                    {profileImage ? <img src={profileImage} alt="Profile" className="h-full w-full object-cover" /> : initial}
                </div>
                <nav className="mt-5 flex flex-1 flex-col gap-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    'flex h-12 w-12 items-center justify-center rounded-2xl transition',
                                    isActive ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                )
                            }
                            title={item.label}
                        >
                            <item.icon size={18} />
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <main className="relative flex-1 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(148,163,184,0.12),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(30,41,59,0.18),transparent_28%)]" />
                <div className="relative h-full overflow-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
