'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, translations, TranslationKey } from './translations';
import { Globe } from 'lucide-react';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'zh-TW',
  setLocale: () => {},
  t: (key) => translations['zh-TW'][key] || key,
});

const VALID_LOCALES: Locale[] = ['zh-TW', 'zh-CN', 'en', 'ja'];

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh-TW');

  useEffect(() => {
    // 1. 優先從 URL query parameter 取得 (e.g. ?lang=en 或 ?locale=ja)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryLocale = (urlParams.get('locale') || urlParams.get('lang')) as Locale;
      if (queryLocale && VALID_LOCALES.includes(queryLocale)) {
        setLocaleState(queryLocale);
        localStorage.setItem('vowify_locale', queryLocale);
        document.cookie = `NEXT_LOCALE=${queryLocale};path=/;max-age=31536000`;
        return;
      }

      // 2. 次之從 localStorage 讀取
      const saved = localStorage.getItem('vowify_locale') as Locale;
      if (saved && VALID_LOCALES.includes(saved)) {
        setLocaleState(saved);
        return;
      }

      // 3. 預設檢查瀏覽器系統語系
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith('zh-cn') || navLang.startsWith('zh-sg')) {
        setLocaleState('zh-CN');
      } else if (navLang.startsWith('zh')) {
        setLocaleState('zh-TW');
      } else if (navLang.startsWith('ja')) {
        setLocaleState('ja');
      } else if (navLang.startsWith('en')) {
        setLocaleState('en');
      }
    }
  }, []);

  const setLocale = (l: Locale) => {
    if (!VALID_LOCALES.includes(l)) return;
    setLocaleState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vowify_locale', l);
      document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000`;
    }
  };

  const t = (key: TranslationKey): string => {
    const currentDict = translations[locale] || translations['zh-TW'];
    return currentDict[key] || translations['zh-TW'][key] || (key as string);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'light' | 'dark' | 'glass';
}

export function LanguageSwitcher({
  className = '',
  variant = 'light',
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();

  const options: { label: string; value: Locale }[] = [
    { label: '繁體中文', value: 'zh-TW' },
    { label: '简体中文', value: 'zh-CN' },
    { label: 'English', value: 'en' },
    { label: '日本語', value: 'ja' },
  ];

  const baseStyle =
    variant === 'dark'
      ? 'bg-white/10 border-white/20 text-white'
      : variant === 'glass'
      ? 'bg-white/70 backdrop-blur-md border-[#E8E5DF] text-[#2D3B36]'
      : 'bg-white border-[#E8E5DF] text-[#2D3B36]';

  return (
    <div
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs shadow-2xs transition-colors ${baseStyle} ${className}`}
    >
      <Globe className="w-3.5 h-3.5 opacity-60" />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="bg-transparent font-medium text-xs focus:outline-hidden cursor-pointer"
        aria-label="Select Language"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-[#2D3B36] bg-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
