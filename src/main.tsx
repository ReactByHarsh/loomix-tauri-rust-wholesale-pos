import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ActivationPage } from './pages/ActivationPage'
import { SplashPage } from './pages/SplashPage'
import { api } from './tauri-api'
import {
  LICENSE_CONTACT_EMAIL,
  LICENSE_CONTACT_PHONE,
  formatLicenseCountdown,
  formatLicenseExpiryDate,
  isLicenseExpired,
  shouldShowDailyExpiryWarning,
  type LicenseStatusData,
} from './licenseExpiry'

const root = createRoot(document.getElementById('root')!)

function Main() {
  const [status, setStatus] = useState<'loading' | 'active' | 'activation'>('loading');
  const [expiringLicense, setExpiringLicense] = useState<LicenseStatusData | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Initial delay for splash effect
        await new Promise(resolve => setTimeout(resolve, 2000));

        const result = await api.checkLicense(); // This performs online check if needed
        if (result) {
          const licenseStatus = await api.getLicenseStatus() as LicenseStatusData;
          if (isLicenseExpired(licenseStatus.expiry)) {
            setStatus('activation');
            return;
          }
          if (shouldShowDailyExpiryWarning('Loomix', licenseStatus.expiry)) {
            setExpiringLicense(licenseStatus);
          }
          setStatus('active');
        } else {
          setStatus('activation');
        }
      } catch (e) {
        console.error(e);
        setStatus('activation');
      }
    };
    init();
  }, []);

  if (status === 'loading') {
    return <SplashPage />;
  }

  if (status === 'activation') {
    return <ActivationPage onActivated={() => setStatus('active')} />;
  }

  return (
    <>
      <App />
      {expiringLicense?.expiry ? (
        <LicenseExpiryWarning
          expiry={expiringLicense.expiry}
          onClose={() => setExpiringLicense(null)}
          onReactivate={() => {
            setExpiringLicense(null);
            setStatus('activation');
          }}
        />
      ) : null}
    </>
  );
}

function LicenseExpiryWarning({
  expiry,
  onClose,
  onReactivate,
}: {
  expiry: number;
  onClose: () => void;
  onReactivate: () => void;
}) {
  const [countdown, setCountdown] = useState(() => formatLicenseCountdown(expiry));

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(formatLicenseCountdown(expiry)), 60_000);
    return () => window.clearInterval(timer);
  }, [expiry]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/70 p-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-amber-300/40 bg-white p-6 text-zinc-950 shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-600">License Expiring</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight">Loomix license expires soon</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Your software license is going to expire in <span className="font-bold text-zinc-950">{countdown}</span>.
          A new activation key is needed to continue using the software without interruption.
        </p>
        <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-bold">Expiry: {formatLicenseExpiryDate(expiry)}</p>
          <p className="mt-2">Contact for key or admin reactivation:</p>
          <p className="font-semibold">{LICENSE_CONTACT_EMAIL}</p>
          <p className="font-semibold">{LICENSE_CONTACT_PHONE}</p>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button onClick={onClose} className="h-11 rounded-xl border border-zinc-200 font-bold text-zinc-700">
            Continue for now
          </button>
          <button onClick={onReactivate} className="h-11 rounded-xl bg-zinc-950 font-bold text-white">
            Enter activation key
          </button>
        </div>
      </div>
    </div>
  );
}

// Global polyfill assignment
// @ts-ignore
window.api = api;

root.render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
