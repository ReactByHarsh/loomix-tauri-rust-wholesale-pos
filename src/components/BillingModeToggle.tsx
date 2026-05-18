import type { BillingMode } from '../lib/pricing';
import { cn } from '../lib/utils';

interface BillingModeToggleProps {
    value: BillingMode;
    onChange: (value: BillingMode) => void;
    retailLabel: string;
    wholesaleLabel: string;
    className?: string;
}

export function BillingModeToggle({
    value,
    onChange,
    retailLabel,
    wholesaleLabel,
    className,
}: BillingModeToggleProps) {
    return (
        <div className={cn('inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-zinc-700 dark:bg-zinc-900', className)}>
            {([
                { key: 'retail', label: retailLabel },
                { key: 'wholesale', label: wholesaleLabel },
            ] as const).map((item) => (
                <button
                    key={item.key}
                    type="button"
                    onClick={() => onChange(item.key)}
                    className={cn(
                        'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                        value === item.key
                            ? 'bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                            : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                    )}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
