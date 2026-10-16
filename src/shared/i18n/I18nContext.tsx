'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Locale, translations, TranslationKey, SUPPORTED_LOCALES } from './translations';
import { Globe, ChevronDown } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000`;
    localStorage.setItem('VOWIFY_LOCALE_COOKIE', l);

    setLocaleState(l)

    // 保留原本的 Query 參數，並更新語系參數
    const params = new URLSearchParams(searchParams.toString());
    params.set('locale', l);

    router.push(`${pathname}?${params.toString()}`);
    router.refresh();
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 整理 options 資料
  const options = Object.values(SUPPORTED_LOCALES).map((v) => ({
    label: v.label,
    value: v.value,
  }));

  // 取得目前選中的語系 Label
  const currentOption = options.find((opt) => opt.value === locale) || options[0];

  // 點擊外部自動收合選單
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 樣式變體對應
  const baseStyle =
    variant === 'dark'
      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
      : variant === 'glass'
        ? 'bg-white/70 backdrop-blur-md border-[#E8E5DF] text-[#2D3B36] hover:bg-white/90'
        : 'bg-white border-[#E8E5DF] text-[#2D3B36] hover:bg-gray-50';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* 1. 觸發按鈕（膠囊外觀） */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs shadow-2xs transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer ${baseStyle} ${className}`}
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 opacity-60 shrink-0" />
        <span className="font-medium">{currentOption.label}</span>
        <ChevronDown
          className={`w-3 h-3 opacity-50 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>

      {/* 2. 展開的清單面板（完美圓角、置中、質感陰影） */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-28 origin-top-right rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-gray-100 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          {options.map((opt) => {
            const isSelected = opt.value === locale;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setLocale(opt.value as Locale);
                  setIsOpen(false);
                }}
                className={`w-full text-center px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-[#2D3B36] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                  }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
