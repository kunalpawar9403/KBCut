import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from './en';
import { mr } from './mr';
import { hi } from './hi';

export type Language = 'en' | 'mr' | 'hi';

const translations = { en, mr, hi };

type TranslationTree = typeof en;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (keyPath: string, replacements?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('kbcut_lang') as Language;
    if (saved && (saved === 'en' || saved === 'mr' || saved === 'hi')) return saved;
    // Auto-detect browser Marathi/Hindi if present
    const navLang = navigator.language?.toLowerCase() || '';
    if (navLang.startsWith('mr')) return 'mr';
    if (navLang.startsWith('hi')) return 'hi';
    return 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('kbcut_lang', newLang);
  };

  const t = (keyPath: string, replacements?: Record<string, string | number>): string => {
    const keys = keyPath.split('.');
    let current: any = translations[lang] || translations.en;
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Fallback to English
        let fallback: any = translations.en;
        for (const fb of keys) {
          if (fallback && typeof fallback === 'object' && fb in fallback) {
            fallback = fallback[fb];
          } else {
            return keyPath;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== 'string') return keyPath;

    if (replacements) {
      let str = current;
      for (const [k, v] of Object.entries(replacements)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
      return str;
    }

    return current;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
