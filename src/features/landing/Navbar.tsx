'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';
import { LanguageSwitcher, useI18n } from '@/shared/i18n/I18nContext';
import { useAuth } from '@/shared/context/AuthContext';
import { ROUTES } from '@/constants/routes';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#F9F8F6]/85 backdrop-blur-md border-b border-[#E8E5DF] transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#2D3B36] flex items-center justify-center text-[#FAF9F5] shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-[#C5A880]" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-wider text-[#2D3B36] block leading-none">
              VOWIFY
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#8E8A83] font-medium block mt-1">
              {t('digitalWeddingInvitation')}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4A4844]">
          <a href="#features" className="hover:text-[#2D3B36] transition-colors">
            {t('navFeatures')}
          </a>
          <a href="#templates" className="hover:text-[#2D3B36] transition-colors">
            {t('navTemplates')}
          </a>
          <a href="#pricing" className="hover:text-[#2D3B36] transition-colors">
            {t('navPricing')}
          </a>
          <a href="#faq" className="hover:text-[#2D3B36] transition-colors">
            {t('navFaq')}
          </a>
        </nav>

        {/* Desktop Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={isAuthenticated ? ROUTES.PROJECTS : ROUTES.LOGIN}
            className="px-5 py-2.5 rounded-full bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-xs font-medium tracking-wide shadow-xs transition-all hover:scale-102 flex items-center gap-1.5">
            <span>{t('freeCreate')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
          </Link>
          <LanguageSwitcher />
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#2D3B36] hover:bg-[#FAF9F5]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8E5DF] bg-[#FAF9F5] px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[#2D3B36]">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#C5A880]"
            >
              {t('navFeatures')}
            </a>
            <a
              href="#templates"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#C5A880]"
            >
              {t('navTemplates')}
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#C5A880]"
            >
              {t('navPricing')}
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#C5A880]"
            >
              {t('navFaq')}
            </a>
          </nav>

          <div className="pt-4 border-t border-[#E8E5DF] flex flex-col gap-3">
            <Link
              href={isAuthenticated ? ROUTES.PROJECTS : ROUTES.LOGIN}
              className="w-full text-center py-2.5 text-xs font-medium bg-[#2D3B36] text-[#FAF9F5] rounded-xl"
            >
              {t('freeCreate')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
