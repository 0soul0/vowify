'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, translations, TranslationKey, SUPPORTED_LOCALES } from './translations';
import { Globe } from 'lucide-react';
import { object } from 'framer-motion/client';

const VOWIFY_LOCALE_COOKIE = "vowify_locale"

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'zh-TW',
  setLocale: () => { },
  t: (key) => translations['zh-TW'][key] || key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(SUPPORTED_LOCALES.zhTW.value);

  useEffect(() => {
    if (typeof window == 'undefined') return
    const urlParams = new URLSearchParams(window.location.search);
    const queryLocale = (urlParams.get('locale') || urlParams.get('lang')) as Locale;
    const savedLocale = localStorage.getItem(VOWIFY_LOCALE_COOKIE) as Locale;
    const navLang = (queryLocale || savedLocale || navigator.language).toLowerCase();

    Object.values(SUPPORTED_LOCALES).forEach((locale) => {
      const prefix = navLang.split("-")[0]

      if (locale.value.startsWith(prefix)) {

        if (navLang.startsWith("zh-tw")) {
          setLocale("zh-TW");
        } else if (navLang.startsWith("zh-cn")) {
          setLocale("zh-CN");
        } else {
          setLocale(navLang as Locale);
        }
      }

    });
  }, []);

  const setLocale = (l: Locale) => {
    if (typeof window === 'undefined') return;
    setLocaleState(l);
    localStorage.setItem(VOWIFY_LOCALE_COOKIE, l);
    document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000`;
  };

  const t = (key: TranslationKey): string => {
    const currentDict = translations[locale] || translations[SUPPORTED_LOCALES.zhTW.value];
    return currentDict[key] || translations[SUPPORTED_LOCALES.zhTW.value][key] || (key as string);
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

  const options = Object.values(SUPPORTED_LOCALES).map((v) => {
    return {
      label: v.label,
      value: v.value,
    }
  })

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
