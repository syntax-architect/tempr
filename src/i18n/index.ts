import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';

export type SupportedLanguage = 'en' | 'hi' | 'bn';

export const LANGUAGE_METADATA: Record<SupportedLanguage, { label: string; nativeLabel: string; fontClass: string }> = {
  en: { label: 'English', nativeLabel: 'English', fontClass: 'font-sans' },
  hi: { label: 'Hindi', nativeLabel: 'हिन्दी', fontClass: 'font-hi' },
  bn: { label: 'Bengali', nativeLabel: 'বাংলা', fontClass: 'font-bn' },
};

let savedLang: SupportedLanguage = 'en';
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    savedLang = (window.localStorage.getItem('hl_language') as SupportedLanguage) || 'en';
  }
} catch {
  savedLang = 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      bn: { translation: bn },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

/**
 * Dynamically loads localized font subsets only when the user selects Hindi or Bengali.
 * Prevents unused web font payload on initial English page load.
 */
export function applyLanguageSettings(lang: SupportedLanguage) {
  if (typeof document === 'undefined') return;

  document.documentElement.lang = lang;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('hl_language', lang);
    }
  } catch {}

  // Remove previous font classes
  document.body.classList.remove('font-hi', 'font-bn');

  if (lang === 'hi') {
    document.body.classList.add('font-hi');
    injectFontLink(
      'google-font-noto-devanagari',
      'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap'
    );
  } else if (lang === 'bn') {
    document.body.classList.add('font-bn');
    injectFontLink(
      'google-font-noto-bengali',
      'https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap'
    );
  }
}

function injectFontLink(id: string, href: string) {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

// Initialize font on startup
if (typeof window !== 'undefined') {
  applyLanguageSettings(savedLang);
}

/**
 * Formats numbers into the Indian numbering system (Lakhs and Crores grouping).
 * e.g. 125000 -> "1,25,000" or compact: "1.25 Lakh"
 */
export function formatIndianNumber(value: number, compact: boolean = false): string {
  if (isNaN(value)) return '0';

  if (compact) {
    const absVal = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (absVal >= 10000000) {
      return `${sign}${(absVal / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (absVal >= 100000) {
      return `${sign}${(absVal / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
    }
  }

  // Standard Indian locale number formatting: 1,25,000
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats INR currency in Lakh/Crore grouping: ₹1,25,000 or ₹1.25 Lakh.
 */
export function formatIndianRupees(value: number, compact: boolean = false): string {
  return `₹${formatIndianNumber(value, compact)}`;
}

/**
 * Formats dates into DD-MM-YYYY format per Prompt D10.
 */
export function formatDateIndian(dateInput: string | Date | number): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return String(dateInput);
  }
}

/**
 * Enforces Prompt D10 rule: Keep Heat Numbers strictly in Latin script (e.g. TSJ-26-9021).
 */
export function formatHeatNumber(heatNumber: string): string {
  if (!heatNumber) return '';
  return heatNumber.trim().toUpperCase();
}

/**
 * Enforces Prompt D10 rule: Keep CN Codes strictly in Latin script (e.g. 7304 19 10).
 */
export function formatCnCode(code: string): string {
  if (!code) return '';
  return code.trim();
}

export default i18n;
