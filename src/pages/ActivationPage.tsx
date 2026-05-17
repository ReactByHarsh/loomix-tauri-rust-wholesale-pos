import { useState, useEffect, type ChangeEvent } from 'react';
import { Key, RefreshCw, Wifi, AlertCircle } from 'lucide-react';

interface ActivationPageProps {
    onActivated?: () => void;
}

export const ActivationPage = ({ onActivated }: ActivationPageProps) => {
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasStoredKey, setHasStoredKey] = useState(false);

    const formatKey = (value: string) => {
        const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
        const chunks = cleaned.match(/.{1,4}/g) || [];
        return chunks.join('-').slice(0, 19);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setKey(formatKey(e.target.value));

    useEffect(() => {
        const checkExisting = async () => {
            try {
                const status = await (window as any).api.getLicenseStatus();
                if (status.key) setHasStoredKey(true);
            } catch (err) { console.error('Failed to check license status', err); }
        };
        checkExisting();
    }, []);

    const handleRetry = async () => {
        setLoading(true); setError(null);
        try {
            const result = await (window as any).api.retryLicenseCheck();
            if (result.success) {
                if (onActivated) onActivated();
            }
            else setError(result.message || 'Retry failed. Check connection.');
        } catch (e: any) { setError(e.message || 'Retry failed'); }
        finally { setLoading(false); }
    };

    const handleActivate = async () => {
        if (key.length < 19) return;
        setLoading(true); setError(null);
        try {
            const result = await (window as any).api.activateLicense(key);
            if (result.success) {
                if (onActivated) onActivated();
            }
            else setError(result.message || 'Activation failed');
        } catch (e: any) { setError(e.message || 'An error occurred'); }
        finally { setLoading(false); }
    };

    return (
        <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center p-8 select-none">
            <div className="w-full max-w-sm space-y-6">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="flex justify-center mb-4">
                        <div className="h-14 w-14 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-2xl flex items-center justify-center text-zinc-300 border border-zinc-600 shadow-[0_0_25px_-5px_theme(colors.zinc.500)]">
                            <Key size={24} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">Loomix</h1>
                    <p className="text-zinc-500 text-sm">Enter your license key to activate</p>
                </div>

                <div className="space-y-4">
                    {/* Retry Section for Existing Key */}
                    {hasStoredKey && (
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center space-y-3">
                            <div className="flex items-center justify-center gap-2 text-zinc-400">
                                <Key size={14} />
                                <p className="text-sm font-medium">Existing license found</p>
                            </div>
                            <button onClick={handleRetry} disabled={loading}
                                className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-medium text-sm disabled:opacity-50">
                                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                                {loading ? 'Checking...' : 'Retry Connection'}
                            </button>
                            <p className="text-[11px] text-zinc-600">Click if you just connected to the internet</p>
                        </div>
                    )}

                    {/* License Key Input */}
                    <div className="space-y-2">
                        <label htmlFor="license-key" className="block text-xs font-medium text-zinc-400">
                            {hasStoredKey ? 'Or Enter New Key' : 'License Key'}
                        </label>
                        <input id="license-key" type="text" placeholder="XXXX-XXXX-XXXX-XXXX" value={key} onChange={handleChange}
                            className="w-full h-11 px-4 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent uppercase font-mono tracking-widest text-center" />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-400 font-medium bg-red-900/20 border border-red-900/50 p-3 rounded-lg">
                            <AlertCircle size={14} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Activate Button */}
                    <button onClick={handleActivate} disabled={loading || key.length < 19}
                        className="w-full h-11 rounded-lg bg-gradient-to-r from-zinc-600 to-zinc-700 hover:from-zinc-500 hover:to-zinc-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Verifying...' : 'Activate License'}
                    </button>

                    {/* Footer Info */}
                    <div className="text-center space-y-1.5 pt-2">
                        <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
                            <Wifi size={12} /> Active Internet Required
                        </p>
                        <p className="text-[10px] text-zinc-600">
                            License validated online on every launch
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
