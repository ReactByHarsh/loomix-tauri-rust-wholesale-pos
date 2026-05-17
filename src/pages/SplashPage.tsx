import { useEffect, useState } from 'react';

export const SplashPage = () => {
    const [status, setStatus] = useState('Initializing...');

    useEffect(() => {
        const statuses = [
            'Initializing secure environment...',
            'Verifying security protocols...',
            'Connecting to license server...',
            'Validating credentials...'
        ];
        let i = 0;
        const interval = setInterval(() => { i = (i + 1) % statuses.length; setStatus(statuses[i]); }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center p-8 select-none text-white">
            <div className="flex flex-col items-center gap-5">
                {/* Lock Icon - Metallic */}
                <div className="flex items-center justify-center">
                    <div className="h-16 w-16 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-2xl flex items-center justify-center text-zinc-300 border border-zinc-600 shadow-[0_0_30px_-5px_theme(colors.zinc.500)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                </div>

                {/* Brand */}
                <div className="text-center space-y-1">
                    <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">Loomix</h1>
                    <p className="text-zinc-500 text-xs font-medium tracking-wide uppercase">Secure Point of Sale</p>
                </div>
            </div>

            {/* Loading Bar */}
            <div className="absolute bottom-12 flex flex-col items-center gap-3 w-full px-16">
                <div className="w-full max-w-xs h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-600 w-1/3 rounded-full" style={{
                        animation: 'shimmer 1.5s infinite linear',
                        backgroundSize: '200% 100%'
                    }}></div>
                </div>
                <p className="text-[11px] text-zinc-500 font-mono">{status}</p>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
            `}</style>
        </div>
    );
};
