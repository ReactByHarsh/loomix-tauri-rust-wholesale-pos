import { ArrowDownToLine, LoaderCircle, RefreshCcw, X } from 'lucide-react';
import type { AppUpdaterResult } from '../hooks/useAppUpdater';

interface UpdateBannerProps {
    updater: AppUpdaterResult;
}

function formatPublishedAt(value: string | null) {
    if (!value) {
        return null;
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed.toLocaleDateString();
}

export function UpdateBanner({ updater }: UpdateBannerProps) {
    const { state, installUpdate, restartToApply, dismissUpdate } = updater;

    if (!['available', 'downloading', 'ready'].includes(state.status)) {
        return null;
    }

    const publishedAt = formatPublishedAt(state.publishedAt);
    const isDownloading = state.status === 'downloading';
    const isReady = state.status === 'ready';

    let title = `Loomix ${state.availableVersion} is available`;
    let description = 'Download and install the latest version without affecting your local database or settings.';

    if (isDownloading) {
        title = `Installing Loomix ${state.availableVersion}`;
        description = state.contentLength && state.contentLength > 0
            ? `Downloading update files: ${state.progressPercent}% complete.`
            : 'Downloading update files in the background.';
    } else if (isReady) {
        title = `Loomix ${state.availableVersion} is ready`;
        description = 'Restart the app to finish applying the update.';
    }

    return (
        <div className="border-b border-sky-200/80 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-4 py-3 dark:border-sky-900/60 dark:from-sky-950/70 dark:via-zinc-950 dark:to-cyan-950/60">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-semibold text-sky-950 dark:text-sky-100">
                        {isDownloading ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : isReady ? (
                            <RefreshCcw className="h-4 w-4" />
                        ) : (
                            <ArrowDownToLine className="h-4 w-4" />
                        )}
                        <span>{title}</span>
                    </div>

                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>Current: {state.currentVersion ?? 'unknown'}</span>
                        <span>Next: {state.availableVersion}</span>
                        {publishedAt ? <span>Published: {publishedAt}</span> : null}
                    </div>

                    {state.notes ? (
                        <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {state.notes}
                        </p>
                    ) : null}

                    {(isDownloading || isReady) ? (
                        <div className="mt-3 h-2 w-full max-w-xl overflow-hidden rounded-full bg-sky-100 dark:bg-sky-950">
                            <div
                                className="h-full rounded-full bg-sky-500 transition-[width] duration-300 dark:bg-sky-400"
                                style={{ width: `${Math.max(state.progressPercent, isReady ? 100 : 6)}%` }}
                            />
                        </div>
                    ) : null}
                </div>

                <div className="flex items-center gap-2 self-start lg:self-center">
                    {isReady ? (
                        <button
                            type="button"
                            onClick={() => void restartToApply()}
                            className="inline-flex items-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-slate-200"
                        >
                            Restart now
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => void installUpdate()}
                            disabled={isDownloading}
                            className="inline-flex items-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-slate-200"
                        >
                            {isDownloading ? 'Installing...' : 'Update now'}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => void dismissUpdate()}
                        className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
                        aria-label="Dismiss update banner"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
