import { useEffect, useRef, useState } from 'react';
import { getVersion } from '@tauri-apps/api/app';
import { isTauri } from '@tauri-apps/api/core';
import { relaunch } from '@tauri-apps/plugin-process';
import { check, type DownloadEvent, type Update } from '@tauri-apps/plugin-updater';

export type AppUpdaterStatus = 'idle' | 'checking' | 'available' | 'downloading' | 'ready';

export interface AppUpdaterState {
    status: AppUpdaterStatus;
    currentVersion: string | null;
    availableVersion: string | null;
    notes: string | null;
    publishedAt: string | null;
    downloadedBytes: number;
    contentLength: number | null;
    progressPercent: number;
    error: string | null;
    lastCheckedAt: Date | null;
}

export interface AppUpdaterResult {
    state: AppUpdaterState;
    installUpdate: () => Promise<void>;
    restartToApply: () => Promise<void>;
    dismissUpdate: () => Promise<void>;
    checkForUpdates: () => Promise<void>;
}

const initialState: AppUpdaterState = {
    status: 'idle',
    currentVersion: null,
    availableVersion: null,
    notes: null,
    publishedAt: null,
    downloadedBytes: 0,
    contentLength: null,
    progressPercent: 0,
    error: null,
    lastCheckedAt: null,
};

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return 'Unknown updater error';
}

export function useAppUpdater(): AppUpdaterResult {
    const [state, setState] = useState<AppUpdaterState>(initialState);
    const activeUpdateRef = useRef<Update | null>(null);
    const isCheckingRef = useRef(false);

    useEffect(() => {
        if (!isTauri()) {
            return;
        }

        let cancelled = false;

        const closeActiveUpdate = async () => {
            const activeUpdate = activeUpdateRef.current;
            activeUpdateRef.current = null;

            if (activeUpdate) {
                await activeUpdate.close().catch(() => undefined);
            }
        };

        const runUpdateCheck = async (silent = true) => {
            if (isCheckingRef.current) return;
            isCheckingRef.current = true;

            const currentVersion = await getVersion().catch(() => null);

            if (!silent && cancelled) {
                isCheckingRef.current = false;
                return;
            }

            setState((previous) => ({
                ...previous,
                currentVersion,
                status: 'checking',
                error: null,
            }));

            try {
                const update = await check();

                if (cancelled) {
                    await update?.close().catch(() => undefined);
                    isCheckingRef.current = false;
                    return;
                }

                if (!update) {
                    setState((previous) => ({
                        ...previous,
                        status: 'idle',
                        availableVersion: null,
                        notes: null,
                        publishedAt: null,
                        downloadedBytes: 0,
                        contentLength: null,
                        progressPercent: 0,
                        lastCheckedAt: new Date(),
                    }));
                    isCheckingRef.current = false;
                    return;
                }

                await closeActiveUpdate();
                activeUpdateRef.current = update;

                setState((previous) => ({
                    ...previous,
                    status: 'available',
                    availableVersion: update.version,
                    notes: update.body?.trim() || null,
                    publishedAt: update.date ?? null,
                    downloadedBytes: 0,
                    contentLength: null,
                    progressPercent: 0,
                    error: null,
                    lastCheckedAt: new Date(),
                }));
            } catch (error) {
                console.warn('Updater check failed:', error);

                if (!cancelled) {
                    setState((previous) => ({
                        ...previous,
                        status: 'idle',
                        error: getErrorMessage(error),
                        lastCheckedAt: new Date(),
                    }));
                }
            } finally {
                isCheckingRef.current = false;
            }
        };

        void runUpdateCheck(true);

        return () => {
            cancelled = true;
            void closeActiveUpdate();
        };
    }, []);

    const installUpdate = async () => {
        const update = activeUpdateRef.current;

        if (!update) {
            return;
        }

        setState((previous) => ({
            ...previous,
            status: 'downloading',
            downloadedBytes: 0,
            contentLength: null,
            progressPercent: 0,
            error: null,
        }));

        try {
            await update.downloadAndInstall((event: DownloadEvent) => {
                if (event.event === 'Started') {
                    setState((previous) => ({
                        ...previous,
                        contentLength: event.data.contentLength ?? null,
                        downloadedBytes: 0,
                        progressPercent: 0,
                    }));
                    return;
                }

                if (event.event === 'Progress') {
                    setState((previous) => {
                        const downloadedBytes = previous.downloadedBytes + event.data.chunkLength;
                        const progressPercent = previous.contentLength && previous.contentLength > 0
                            ? Math.min(100, Math.round((downloadedBytes / previous.contentLength) * 100))
                            : previous.progressPercent;

                        return {
                            ...previous,
                            downloadedBytes,
                            progressPercent,
                        };
                    });
                    return;
                }

                setState((previous) => ({
                    ...previous,
                    progressPercent: 100,
                }));
            });

            await update.close().catch(() => undefined);
            activeUpdateRef.current = null;

            setState((previous) => ({
                ...previous,
                status: 'ready',
                progressPercent: 100,
            }));
        } catch (error) {
            setState((previous) => ({
                ...previous,
                status: 'available',
                error: getErrorMessage(error),
            }));
        }
    };

    const restartToApply = async () => {
        await relaunch();
    };

    const dismissUpdate = async () => {
        const update = activeUpdateRef.current;
        activeUpdateRef.current = null;

        if (update) {
            await update.close().catch(() => undefined);
        }

        setState((previous) => ({
            ...previous,
            status: 'idle',
            availableVersion: null,
            notes: null,
            publishedAt: null,
            downloadedBytes: 0,
            contentLength: null,
            progressPercent: 0,
        }));
    };

    const checkForUpdates = async () => {
        if (!isTauri()) return;
        if (isCheckingRef.current) return;
        if (state.status === 'downloading') return;

        let cancelled = false;

        const closeActiveUpdate = async () => {
            const activeUpdate = activeUpdateRef.current;
            activeUpdateRef.current = null;
            if (activeUpdate) {
                await activeUpdate.close().catch(() => undefined);
            }
        };

        isCheckingRef.current = true;

        const currentVersion = await getVersion().catch(() => null);

        setState((previous) => ({
            ...previous,
            currentVersion,
            status: 'checking',
            error: null,
        }));

        try {
            const update = await check();

            if (cancelled) {
                await update?.close().catch(() => undefined);
                return;
            }

            if (!update) {
                setState((previous) => ({
                    ...previous,
                    status: 'idle',
                    availableVersion: null,
                    notes: null,
                    publishedAt: null,
                    downloadedBytes: 0,
                    contentLength: null,
                    progressPercent: 0,
                    lastCheckedAt: new Date(),
                }));
                return;
            }

            await closeActiveUpdate();
            activeUpdateRef.current = update;

            setState((previous) => ({
                ...previous,
                status: 'available',
                availableVersion: update.version,
                notes: update.body?.trim() || null,
                publishedAt: update.date ?? null,
                downloadedBytes: 0,
                contentLength: null,
                progressPercent: 0,
                error: null,
                lastCheckedAt: new Date(),
            }));
        } catch (error) {
            console.warn('Manual updater check failed:', error);
            setState((previous) => ({
                ...previous,
                status: 'idle',
                error: getErrorMessage(error),
                lastCheckedAt: new Date(),
            }));
        } finally {
            isCheckingRef.current = false;
        }

    };

    return {
        state,
        installUpdate,
        restartToApply,
        dismissUpdate,
        checkForUpdates,
    };
}
