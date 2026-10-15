'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  MailCheck,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/shared/context/AuthContext';
import { useI18n, LanguageSwitcher } from '@/shared/i18n/I18nContext';
import { supabase } from '@/lib/supabase';

type Step = 'email' | 'sent';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/projects';

  const { isAuthenticated } = useAuth();
  const { t } = useI18n();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, redirectPath, router]);

  // 倒數計時（重送驗證信冷卻）
  React.useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const sendMagicLink = async (targetEmail: string) => {
    setIsSubmitting(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithOtp({
      email: targetEmail,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/register/complete`,
      },
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
      return false;
    }
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await sendMagicLink(email);
    if (ok) {
      setStep('sent');
      setResendCountdown(60);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    const ok = await sendMagicLink(email);
    if (ok) setResendCountdown(60);
  };

  // ── Card 共用外框 ────────────────────────────────────────────────
  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2D3B36] flex flex-col justify-between selection:bg-[#C5A880]/30">
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

      <div className="w-full max-w-md mx-auto px-6 py-8">
        <div className="bg-white border border-[#E8E5DF] rounded-3xl p-8 sm:p-10 shadow-[0_12px_35px_rgba(45,59,54,0.05)] space-y-7">
          {/* Brand */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 justify-center group mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#2D3B36] flex items-center justify-center text-[#FAF9F5] shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-[#C5A880]" />
              </div>
              <span className="font-serif text-xl font-bold tracking-wider text-[#2D3B36]">VOWIFY</span>
            </Link>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8E8A83] mb-5">
              <div className={`flex items-center gap-1 ${step === 'email' ? 'text-[#2D3B36] font-semibold' : 'text-[#C5A880]'}`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border ${step === 'email' ? 'bg-[#2D3B36] text-white border-[#2D3B36]' : 'bg-[#C5A880]/20 text-[#C5A880] border-[#C5A880]/30'}`}>
                  1
                </div>
                <span>驗證信箱</span>
              </div>
              <div className="w-8 h-px bg-[#E8E5DF]" />
              <div className="flex items-center gap-1 text-[#A6A29A]">
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border border-[#E8E5DF] bg-[#FAF9F5] text-[#A6A29A]">
                  2
                </div>
                <span>完善資料</span>
              </div>
            </div>
          </div>

          {children}

          {/* Switch to Login */}
          <div className="text-center pt-2 text-xs text-[#8E8A83]">
            <span>{t('alreadyHaveAccount')} </span>
            <Link
              href={`/login${redirectPath !== '/projects' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
              className="font-semibold text-[#2D3B36] hover:text-[#C5A880] underline underline-offset-4 transition-colors"
            >
              {t('loginNow')}
            </Link>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-[#8E8A83]">
        <p>© {new Date().getFullYear()} Vowify. Luxury Digital Wedding Platform.</p>
      </footer>
    </div>
  );

  // ── Step 1：輸入 Email ───────────────────────────────────────────
  if (step === 'email') {
    return (
      <Card>
        <div className="space-y-2 text-center">
          <h1 className="font-serif text-2xl font-bold text-[#2D3B36] tracking-tight">
            {t('registerTitle')}
          </h1>
          <p className="text-xs text-[#8E8A83] leading-relaxed">
            輸入您的電子信箱，我們將發送一封驗證連結給您。
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleEmailSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#4A4844] uppercase tracking-wider">
              {t('emailLabel')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8E8A83] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoFocus
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
            className="w-full mt-2 py-3.5 rounded-2xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>發送中...</span>
              </>
            ) : (
              <>
                <span>發送驗證信</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
              </>
            )}
          </button>
        </form>
      </Card>
    );
  }

  // ── Step 2：等待收件 ─────────────────────────────────────────────
  return (
    <Card>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#F0EDE6] border border-[#E8E5DF] flex items-center justify-center mx-auto">
          <MailCheck className="w-8 h-8 text-[#C5A880]" />
        </div>
        <div className="space-y-1">
          <h1 className="font-serif text-xl font-bold text-[#2D3B36] tracking-tight">
            驗證信已發送
          </h1>
          <p className="text-xs text-[#8E8A83] leading-relaxed max-w-xs mx-auto">
            請前往您的信箱
          </p>
          <p className="text-sm font-semibold text-[#2D3B36]">{email}</p>
          <p className="text-xs text-[#8E8A83] leading-relaxed">
            點擊信件中的連結完成驗證，即可繼續設定帳號。
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleResend}
          disabled={resendCountdown > 0 || isSubmitting}
          className="w-full py-3 rounded-2xl border border-[#E8E5DF] bg-[#FAF9F5] text-[#2D3B36] text-xs font-medium flex items-center justify-center gap-2 hover:bg-white hover:border-[#C5A880] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5 text-[#C5A880]" />
          )}
          <span>
            {resendCountdown > 0 ? `重新發送（${resendCountdown}s）` : '重新發送驗證信'}
          </span>
        </button>

        <button
          onClick={() => { setStep('email'); setErrorMsg(''); }}
          className="w-full text-xs text-[#8E8A83] hover:text-[#2D3B36] transition-colors py-1"
        >
          ← 修改電子信箱
        </button>
      </div>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#C5A880] animate-spin" />
      </div>
    }>
      <RegisterFormContent />
    </Suspense>
  );
}
