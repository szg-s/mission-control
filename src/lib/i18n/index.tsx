'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import en from './locales/en.json';
import zh from './locales/zh.json';

export type Locale = 'en' | 'zh';

const messages: Record<Locale, Record<string, unknown>> = { en, zh };

const STORAGE_KEY = 'mc-locale';

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : path;
}

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'zh',
  setLocale: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && (saved === 'en' || saved === 'zh')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale === 'zh' ? 'zh-CN' : 'en';
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let text = getNestedValue(messages[locale] as Record<string, unknown>, key);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v));
        });
      }
      return text;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-mc-border hover:border-mc-accent/50 text-sm transition-colors ${className || ''}`}
      title={locale === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <span className="text-base">{locale === 'zh' ? '🇺🇸' : '🇨🇳'}</span>
      <span className="text-mc-text-secondary">{locale === 'zh' ? 'EN' : '中文'}</span>
    </button>
  );
}
