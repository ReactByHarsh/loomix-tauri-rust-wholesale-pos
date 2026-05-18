import { createContext, useContext } from 'react';
import type { AppUpdaterResult } from '../hooks/useAppUpdater';

export const UpdaterContext = createContext<AppUpdaterResult | null>(null);

export function useUpdaterContext(): AppUpdaterResult | null {
    return useContext(UpdaterContext);
}
