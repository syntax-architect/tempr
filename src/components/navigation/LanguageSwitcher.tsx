import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage, LANGUAGE_METADATA, applyLanguageSettings } from '../../i18n';

export interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  compact = false,
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = (i18n.language as SupportedLanguage) || 'en';
  const currentMeta = LANGUAGE_METADATA[currentLang] || LANGUAGE_METADATA.en;

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
    applyLanguageSettings(lang);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select Interface Language"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface-2 border border-border hover:border-border-hover text-text font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span className="font-semibold">{currentMeta.nativeLabel}</span>
        <ChevronDown className={`w-3 h-3 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Available Languages"
          className="absolute right-0 mt-1.5 w-36 rounded-xl bg-surface border border-border shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {(Object.keys(LANGUAGE_METADATA) as SupportedLanguage[]).map((lang) => {
            const isSelected = currentLang === lang;
            const meta = LANGUAGE_METADATA[lang];
            return (
              <li key={lang} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => handleSelectLanguage(lang)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-left transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/15 text-emerald-400 font-bold'
                      : 'text-text hover:bg-surface-2'
                  }`}
                >
                  <span>{meta.nativeLabel}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
