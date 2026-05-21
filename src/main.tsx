import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ActivationPage } from './pages/ActivationPage'
import { SplashPage } from './pages/SplashPage'
import { api } from './tauri-api'

const root = createRoot(document.getElementById('root')!)

function Main() {
  const [status, setStatus] = useState<'loading' | 'active' | 'activation'>('loading');

  useEffect(() => {
    const init = async () => {
      try {
        // Initial delay for splash effect
        await new Promise(resolve => setTimeout(resolve, 2000));

        const result = await api.checkLicense(); // This performs online check if needed
        if (result) {
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

  return <App />;
}

// Global polyfill assignment
// @ts-ignore
window.api = api;

root.render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
