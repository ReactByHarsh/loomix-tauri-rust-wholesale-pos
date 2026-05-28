export const LICENSE_CONTACT_EMAIL = 'cognilabs.dev@gmail.com';
export const LICENSE_CONTACT_PHONE = '9028709575';

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const EXPIRY_WARNING_WINDOW_MS = 7 * DAY_MS;

export type LicenseStatusData = {
  key?: string | null;
  status?: string;
  expiry?: number | null;
};

export function isLicenseExpired(expiry?: number | null, now = Date.now()): boolean {
  return typeof expiry === 'number' && expiry <= now;
}

export function isLicenseExpiringSoon(expiry?: number | null, now = Date.now()): boolean {
  if (typeof expiry !== 'number') return false;
  const remaining = expiry - now;
  return remaining > 0 && remaining <= EXPIRY_WARNING_WINDOW_MS;
}

export function formatLicenseCountdown(expiry?: number | null, now = Date.now()): string {
  if (typeof expiry !== 'number') return 'unknown time';

  const remaining = Math.max(0, expiry - now);
  const days = Math.floor(remaining / DAY_MS);
  const hours = Math.floor((remaining % DAY_MS) / HOUR_MS);
  const minutes = Math.ceil((remaining % HOUR_MS) / MINUTE_MS);

  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ${hours} hour${hours === 1 ? '' : 's'}`;
  }

  if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ${minutes} minute${minutes === 1 ? '' : 's'}`;
  }

  return `${Math.max(1, minutes)} minute${minutes === 1 ? '' : 's'}`;
}

export function formatLicenseExpiryDate(expiry?: number | null): string {
  if (typeof expiry !== 'number') return 'Unknown';
  return new Date(expiry).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function shouldShowDailyExpiryWarning(productName: string, expiry?: number | null): boolean {
  if (!isLicenseExpiringSoon(expiry)) return false;

  const today = new Date().toLocaleDateString('en-CA');
  const key = `license-expiry-warning:${productName}:${today}`;
  if (localStorage.getItem(key) === 'shown') return false;

  localStorage.setItem(key, 'shown');
  return true;
}
