import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, ShoppingCart, Package, ArrowUpRight } from 'lucide-react';
import type { DashboardData } from '../types';
import { useSettingsStore, getCurrencySymbol } from '../store/useSettingsStore';

export function DashboardPage() {
    const { currency } = useSettingsStore();
    const currencySymbol = getCurrencySymbol(currency);
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        // @ts-ignore
        if (window.api?.getDashboardStats) {
            // @ts-ignore
            window.api.getDashboardStats().then((result: DashboardData) => {
                setData(result);
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 p-5 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-400 rounded-full mx-auto"></div>
                    <p className="mt-3 text-zinc-500 dark:text-zinc-400 font-medium text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 p-5 flex items-center justify-center">
                <div className="text-center">
                    <BarChart3 size={40} className="mx-auto mb-3 text-zinc-400" />
                    <p className="text-zinc-500 text-sm">Unable to load dashboard data</p>
                </div>
            </div>
        );
    }

    const { stats, chart } = data;

    return (
        <div className="h-full overflow-y-auto bg-zinc-100 dark:bg-zinc-900">
            <div className="p-5 max-w-7xl mx-auto space-y-4">
                {/* Header - Compact */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 rounded-lg">
                            <BarChart3 size={20} className="text-zinc-700 dark:text-zinc-300" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                                Dashboard
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                                Business overview
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">Live</span>
                    </div>
                </div>

                {/* Stats Cards - Compact 4-column */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Sales Card (Today & Total) */}
                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Sales</span>
                            <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                            {currencySymbol}{stats.today_sales.toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <ArrowUpRight size={12} />
                                <span className="text-xs font-medium">Today</span>
                            </div>
                            <span className="text-xs text-zinc-400">Total: {currencySymbol}{(stats.total_sales || 0).toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    {/* Total Transactions */}
                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Transactions</span>
                            <ShoppingCart size={16} className="text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                            {stats.total_transactions.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-zinc-500 dark:text-zinc-400">
                            <BarChart3 size={12} />
                            <span className="text-xs font-medium">All time</span>
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    <div className={`p-4 rounded-xl border ${stats.low_stock_items > 0
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50'
                        : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Low Stock</span>
                            <AlertTriangle size={16} className={stats.low_stock_items > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-400'} />
                        </div>
                        <div className={`text-2xl font-bold ${stats.low_stock_items > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-800 dark:text-zinc-100'}`}>
                            {stats.low_stock_items}
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${stats.low_stock_items > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-400'}`}>
                            <Package size={12} />
                            <span className="text-xs font-medium">{stats.low_stock_items > 0 ? 'Need restock' : 'All stocked'}</span>
                        </div>
                    </div>

                    {/* Profit Card (Today & Total) */}
                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Profit</span>
                            {/* Reusing DollarSign equivalent or generic Trend for Profit, using BarChart3 as placeholder if needed but lucide-react has many. Using TrendingUp with blue distinct color */}
                            <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                            {currencySymbol}{stats.today_profit.toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                <ArrowUpRight size={12} />
                                <span className="text-xs font-medium">Today</span>
                            </div>
                            <span className="text-xs text-zinc-400">Total: {currencySymbol}{(stats.total_profit || 0).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* Chart - Compact */}
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Sales Trend</h3>
                            <p className="text-xs text-zinc-500 mt-0.5">Last 7 days</p>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-md">
                            <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
                            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Revenue</span>
                        </div>
                    </div>
                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chart}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#71717a" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#71717a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    stroke="#a1a1aa"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={8}
                                />
                                <YAxis
                                    stroke="#a1a1aa"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${currencySymbol}${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                                    dx={-8}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#27272a',
                                        border: '1px solid #3f3f46',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '12px'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: number | undefined) => [`${currencySymbol}${(value || 0).toLocaleString('en-IN')}`, 'Revenue']}
                                    labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                                />
                                <Area
                                    isAnimationActive={false}
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#52525b"
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                    strokeWidth={2}
                                    dot={{ fill: '#52525b', strokeWidth: 0, r: 3 }}
                                    activeDot={{ fill: '#3f3f46', strokeWidth: 0, r: 5 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions Row - Compact */}
                <div className="grid grid-cols-3 gap-3">
                    <a href="#/pos" className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer">
                        <ShoppingCart size={18} className="text-zinc-600 dark:text-zinc-400" />
                        <div>
                            <p className="font-medium text-sm text-zinc-800 dark:text-zinc-100">POS Terminal</p>
                            <p className="text-xs text-zinc-500">Start transaction</p>
                        </div>
                    </a>
                    <a href="#/inventory" className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer">
                        <Package size={18} className="text-zinc-600 dark:text-zinc-400" />
                        <div>
                            <p className="font-medium text-sm text-zinc-800 dark:text-zinc-100">Inventory</p>
                            <p className="text-xs text-zinc-500">Manage products</p>
                        </div>
                    </a>
                    <a href="#/history" className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 cursor-pointer">
                        <BarChart3 size={18} className="text-zinc-600 dark:text-zinc-400" />
                        <div>
                            <p className="font-medium text-sm text-zinc-800 dark:text-zinc-100">History</p>
                            <p className="text-xs text-zinc-500">View transactions</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
