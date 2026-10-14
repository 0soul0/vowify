'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  KeyRound 
} from 'lucide-react';
import { useAuth } from '@/shared/context/AuthContext';
import { useI18n, LanguageSwitcher } from '@/shared/i18n/I18nContext';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const { t } = useI18n();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    await forgotPassword(email.trim());
    setIsSubmitting(false);
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2D3B36] flex flex-col justify-between selection:bg-[#C5A880]/30 selection:text-[#2D3B36]">
      {/* Top Navbar */}
      <header className="px-6 py-5 max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#6A665E] hover:text-[#2D3B36] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>{t('backToLogin')}</span>
        </Link>
        <LanguageSwitcher />
      </header>

      {/* Main Card */}
      <div className="w-full max-w-md mx-auto px-6 py-8">
        <div className="bg-white border border-[#E8E5DF] rounded-3xl p-8 sm:p-10 shadow-[0_12px_35px_rgba(45,59,54,0.05)] space-y-7">
          {/* Brand & Heading */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 justify-center group mb-1">
              <div className="w-10 h-10 rounded-xl bg-[#2D3B36] flex items-center justify-center text-[#FAF9F5] shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-[#C5A880]" />
              </div>
              <span className="font-serif text-xl font-bold tracking-wider text-[#2D3B36]">
                VOWIFY
              </span>
            </Link>

            <h1 className="font-serif text-2xl font-bold text-[#2D3B36] tracking-tight">
              {t('forgotPasswordTitle')}
            </h1>
            <p className="text-xs text-[#8E8A83] max-w-xs mx-auto leading-relaxed">
              {t('forgotPasswordSubtitle')}
            </p>
          </div>

          {/* Success State */}
          {isSent ? (
            <div className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#C5A880]/40 text-center space-y-3.5 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-[#2D3B36] text-[#C5A880] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-[#C5A880]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#2D3B36]">
                {t('resetLinkSent')}
              </h3>
              <p className="text-xs text-[#6A665E] leading-relaxed">
                {t('resetLinkSentDesc')}
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>{t('backToLogin')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                </Link>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#4A4844] uppercase tracking-wider">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8E8A83] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] placeholder-[#A6A29A] text-xs focus:outline-hidden focus:border-[#C5A880] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 rounded-2xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-101 active:scale-99 disabled:opacity-50"
              >
                <span>{isSubmitting ? t('loading') : t('forgotPasswordBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          {!isSent && (
            <div className="text-center pt-2 text-xs">
              <Link
                href="/login"
                className="font-medium text-[#6A665E] hover:text-[#2D3B36] transition-colors"
              >
                {t('backToLogin')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer Minimal Copyright */}
      <footer className="py-6 text-center text-xs text-[#8E8A83]">
        <p>© {new Date().getFullYear()} Vowify. Luxury Digital Wedding Platform.</p>
      </footer>
    </div>
  );
}
