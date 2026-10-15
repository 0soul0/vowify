'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNT } from '@/shared/context/AuthContext';
import { useI18n, LanguageSwitcher } from '@/shared/i18n/I18nContext';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/projects';

  const { login, isAuthenticated } = useAuth();
  const { t } = useI18n();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 若已登入，可直接導向目標頁面
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, redirectPath, router]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      router.replace(redirectPath);
    } else {
      setErrorMsg(result.error || t('invalidCredentials'));
    }
  };

  const handleFillDemo = () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2D3B36] flex flex-col justify-between selection:bg-[#C5A880]/30 selection:text-[#2D3B36]">
      {/* Top Navbar */}
      <header className="px-6 py-5 max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#6A665E] hover:text-[#2D3B36] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>{t('back')}</span>
        </Link>
        <LanguageSwitcher />
      </header>

      {/* Main Login Card */}
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
              {t('loginTitle')}
            </h1>
            <p className="text-xs text-[#8E8A83] max-w-xs mx-auto leading-relaxed">
              {t('loginSubtitle')}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-semibold text-[#4A4844] uppercase tracking-wider">
                  {t('passwordLabel')}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-[#C5A880] hover:text-[#9e835e] font-medium transition-colors"
                >
                  {t('forgotPasswordLink')}
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8E8A83] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] placeholder-[#A6A29A] text-xs focus:outline-hidden focus:border-[#C5A880] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 rounded-2xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-101 active:scale-99 disabled:opacity-50"
            >
              <span>{isSubmitting ? t('loading') : t('loginBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
          </form>

          {/* Quick Demo Fill Pill */}
          <div className="pt-2 border-t border-[#E8E5DF]/70 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#C5A880]/60 hover:bg-[#FAF9F5] text-[#2D3B36] text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors group"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#C5A880] group-hover:scale-110 transition-transform" />
              <span>{t('demoAccountBtn')}</span>
            </button>
          </div>

          {/* Switch to Register */}
          <div className="text-center pt-2 text-xs text-[#8E8A83]">
            <span>{t('dontHaveAccount')} </span>
            <Link
              href={`/register${redirectPath !== '/projects' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
              className="font-semibold text-[#2D3B36] hover:text-[#C5A880] underline underline-offset-4 transition-colors"
            >
              {t('createAccountNow')}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Minimal Copyright */}
      <footer className="py-6 text-center text-xs text-[#8E8A83]">
        <p>© {new Date().getFullYear()} Vowify. Luxury Digital Wedding Platform.</p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center text-xs text-[#8E8A83]">
          Loading...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
