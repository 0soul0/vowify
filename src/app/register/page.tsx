'use client';

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Mail,
  UserPlus,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  MailCheck,
  Loader2,
  Lock,
  RefreshCw,
  Check,
} from 'lucide-react';
import { useAuth } from '@/shared/context/AuthContext';
import { useI18n, LanguageSwitcher } from '@/shared/i18n/I18nContext';
import { ROUTES } from '@/constants/routes';
import { sendVerificationCode, verifyOtp, checkEmailExists, registerUserWithHashedPassword } from '@/actions/auth';

type Step = 'email' | 'otp' | 'info';

interface CardProps {
  step: Step;
  children: React.ReactNode;
  onBack?: () => void;
  backText?: string;
  redirectPath: string;
}

// 抽取至外層避免父層每次 re-render 導致整個 DOM remount
function AuthCard({ step, children, onBack, backText, redirectPath }: CardProps) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2D3B36] flex flex-col justify-between selection:bg-[#C5A880]/30">
      <header className="px-6 py-5 max-w-7xl w-full mx-auto flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#6A665E] hover:text-[#2D3B36] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>{backText || t('back')}</span>
          </button>
        ) : (
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#6A665E] hover:text-[#2D3B36] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>{t('back')}</span>
          </Link>
        )}
        <LanguageSwitcher />
      </header>

      <div className="w-full max-w-md mx-auto px-6 py-8">
        <div className="bg-white border border-[#E8E5DF] rounded-3xl p-8 sm:p-10 shadow-[0_12px_35px_rgba(45,59,54,0.05)] space-y-7">
          {/* Brand */}
          <div className="text-center">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-2 justify-center group mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#2D3B36] flex items-center justify-center text-[#FAF9F5] shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-[#C5A880]" />
              </div>
              <span className="font-serif text-xl font-bold tracking-wider text-[#2D3B36]">VOWIFY</span>
            </Link>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8E8A83] mb-5">
              {/* Step 1: 驗證信箱 */}
              <div
                className={`flex items-center gap-1.5 transition-colors ${step === 'info'
                  ? 'text-[#C5A880] font-medium'
                  : 'text-[#2D3B36] font-semibold'
                  }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border ${step === 'info'
                    ? 'bg-[#C5A880] text-white border-[#C5A880]'
                    : 'bg-[#2D3B36] text-white border-[#2D3B36]'
                    }`}
                >
                  {step === 'info' ? <Check className="w-2.5 h-2.5" /> : '1'}
                </div>
                <span>{t('verificationCode') || '驗證信箱'}</span>
              </div>

              <div className={`w-8 h-px ${step === 'info' ? 'bg-[#C5A880]' : 'bg-[#E8E5DF]'}`} />

              {/* Step 2: 完善資料 */}
              <div
                className={`flex items-center gap-1.5 transition-colors ${step === 'info'
                  ? 'text-[#2D3B36] font-semibold'
                  : 'text-[#A6A29A]'
                  }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border ${step === 'info'
                    ? 'bg-[#2D3B36] text-white border-[#2D3B36]'
                    : 'border-[#E8E5DF] bg-[#FAF9F5] text-[#A6A29A]'
                    }`}
                >
                  2
                </div>
                <span>{t('profileSettingsTitle') || '完善資料'}</span>
              </div>
            </div>
          </div>

          {children}

          {/* Switch to Login */}
          <div className="text-center pt-2 text-xs text-[#8E8A83]">
            <span>{t('alreadyHaveAccount')} </span>
            <Link
              href={ROUTES.buildLoginUrl(redirectPath !== ROUTES.PROJECTS ? redirectPath : undefined)}
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
}

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || ROUTES.PROJECTS;

  const { isAuthenticated, setSessionUser } = useAuth();
  const { t } = useI18n();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // 若已登入直接導向目標頁面
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, redirectPath, router]);

  // 重發驗證碼倒數計時
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // 發送驗證信邏輯（含先檢查 Email 是否已被註冊）
  const handleSendCode = async (targetEmail: string): Promise<boolean> => {
    const cleanEmail = targetEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('請提供有效的電子郵件地址');
      return false;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    try {
      // 1. 註冊新帳號前先檢查 Email 是否已存在
      const checkRes = await checkEmailExists(cleanEmail);
      if (checkRes.exists) {
        setErrorMsg('此電子郵件已被註冊，請直接登入');
        return false;
      }
      if (checkRes.error) {
        setErrorMsg(checkRes.error);
        return false;
      }

      // 2. 未註冊才發送驗證碼
      const result = await sendVerificationCode(cleanEmail);
      if (!result.success) {
        setErrorMsg(result.error || '發送失敗');
        return false;
      }
      return true;
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : '伺服器連線失敗');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: 提交 Email
  const handleEmailSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const ok = await handleSendCode(email);
    if (ok) {
      setStep('otp');
      setResendCountdown(60);
    }
  };

  // 重新發送驗證碼
  const handleResend = async () => {
    if (resendCountdown > 0 || isSubmitting) return;
    const ok = await handleSendCode(email);
    if (ok) {
      setResendCountdown(60);
    }
  };

  // Step 2: 驗證 OTP
  const handleOtpSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setErrorMsg(t('enterCode') || '請輸入完整 6 位數驗證碼');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const result = await verifyOtp(email.trim(), cleanOtp);
      if (result.success) {
        setStep('info');
      } else {
        setErrorMsg(result.error || '驗證碼錯誤或已過期');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : '驗證失敗，請稍後重試');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: 完成註冊並直接登入
  const handleRegisterSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMsg('請輸入姓名');
      return;
    }

    if (password.length < 6) {
      setErrorMsg(t('passwordMinLength'));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(t('passwordMismatch'));
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const result = await registerUserWithHashedPassword(email.trim(), password, cleanName);
      if (result.success && result.user) {
        // 註冊成功後直接登入
        setSessionUser(result.user);
        router.replace(redirectPath);
      } else {
        setErrorMsg(result.error || '註冊失敗');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : '註冊發生未預期錯誤');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 1：輸入 Email ───────────────────────────────────────────
  if (step === 'email') {
    return (
      <AuthCard step="email" redirectPath={redirectPath}>
        <div className="space-y-2 text-center">
          <h1 className="font-serif text-2xl font-bold text-[#2D3B36] tracking-tight">
            {t('registerTitle')}
          </h1>
          <p className="text-xs text-[#8E8A83] leading-relaxed">
            {t('registerSubtitle') || '輸入您的電子郵件信箱，我們將發送驗證碼給您。'}
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] placeholder-[#A6A29A] text-xs focus:outline-hidden focus:border-[#C5A880] focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full mt-2 py-3.5 rounded-2xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
      </AuthCard>
    );
  }

  // ── Step 2：輸入 6 位數驗證碼 ──────────────────────────────────────
  if (step === 'otp') {
    return (
      <AuthCard
        step="otp"
        redirectPath={redirectPath}
        onBack={() => {
          setStep('email');
          setErrorMsg('');
        }}
        backText={t('backToEmailInput')}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F0EDE6] border border-[#E8E5DF] flex items-center justify-center mx-auto">
            <MailCheck className="w-8 h-8 text-[#C5A880]" />
          </div>
          <div className="space-y-1">
            <h1 className="font-serif text-xl font-bold text-[#2D3B36] tracking-tight">
              驗證碼已發送
            </h1>
            <p className="text-xs text-[#8E8A83] leading-relaxed max-w-xs mx-auto">
              我們已發送 6 位數驗證碼至
            </p>
            <p className="text-sm font-semibold text-[#2D3B36]">{email}</p>
            <p className="text-xs text-[#8E8A83] leading-relaxed">
              請在 5 分鐘內輸入驗證碼完成驗證。
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-4">
          <form onSubmit={handleOtpSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#4A4844] uppercase tracking-wider">
                {t('verificationCode')}
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-[#8E8A83] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  placeholder={t('enterCode')}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] placeholder-[#A6A29A] text-sm tracking-widest font-mono focus:outline-hidden focus:border-[#C5A880] focus:bg-white transition-all text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otp.trim().length !== 6}
              className="w-full py-3.5 rounded-2xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>驗證中...</span>
                </>
              ) : (
                <>
                  <span>確定驗證碼</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                </>
              )}
            </button>
          </form>

          <div className="flex flex-col gap-2 pt-1 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCountdown > 0 || isSubmitting}
              className="w-full py-2.5 rounded-xl border border-[#E8E5DF] bg-[#FAF9F5] text-[#2D3B36] text-xs font-medium flex items-center justify-center gap-2 hover:bg-white hover:border-[#C5A880] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3 text-[#C5A880]" />
              )}
              <span>
                {resendCountdown > 0
                  ? `${t('resendCode')} (${resendCountdown}s)`
                  : t('resendCode')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('email');
                setErrorMsg('');
              }}
              className="text-xs text-[#8E8A83] hover:text-[#2D3B36] transition-colors py-1 cursor-pointer"
            >
              {t('backToEmailInput')}
            </button>
          </div>
        </div>
      </AuthCard>
    );
  }

  // ── Step 3：填寫註冊資料 ──────────────────────────────────────────
  return (
    <AuthCard
      step="info"
      redirectPath={redirectPath}
      onBack={() => {
        setStep('otp');
        setErrorMsg('');
      }}
      backText="返回驗證碼"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#F0EDE6] border border-[#E8E5DF] flex items-center justify-center mx-auto">
          <UserPlus className="w-8 h-8 text-[#C5A880]" />
        </div>
        <div className="space-y-1">
          <h1 className="font-serif text-xl font-bold text-[#2D3B36] tracking-tight">
            {t('registerTitle') || '建立新帳號'}
          </h1>
          <p className="text-xs text-[#8E8A83] leading-relaxed max-w-xs mx-auto">
            {t('registerSubtitle') || '信箱已通過驗證，請填寫以下資訊完成註冊'}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
        {/* 姓名/用戶名 */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#4A4844] uppercase tracking-wider">
            {t('fullNameLabel') || '姓名'}
          </label>
          <div className="relative">
            <UserPlus className="w-4 h-4 text-[#8E8A83] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              autoFocus
              placeholder="請輸入姓名"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] placeholder-[#A6A29A] text-xs focus:outline-hidden focus:border-[#C5A880] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* 已驗證的 Email */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#4A4844] uppercase tracking-wider">
            {t('emailLabel')}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8E8A83] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              readOnly
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#F0EDE6]/60 border border-[#E8E5DF] text-[#6A665E] text-xs cursor-not-allowed select-none"
            />
            <Check className="w-4 h-4 text-[#C5A880] absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* 密碼 */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#4A4844] uppercase tracking-wider">
            {t('passwordLabel')}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8E8A83] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              placeholder={t('passwordPlaceholder') || '至少 6 位字元'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] placeholder-[#A6A29A] text-xs focus:outline-hidden focus:border-[#C5A880] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* 確認密碼 */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#4A4844] uppercase tracking-wider">
            {t('confirmPasswordLabel') || '確認密碼'}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8E8A83] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              placeholder={t('confirmPasswordPlaceholder') || '再次確認密碼'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] placeholder-[#A6A29A] text-xs focus:outline-hidden focus:border-[#C5A880] focus:bg-white transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 py-3.5 rounded-2xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>註冊中...</span>
            </>
          ) : (
            <span>{t('submitRegister') || '註冊帳號'}</span>
          )}
        </button>
      </form>
    </AuthCard>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#C5A880] animate-spin" />
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
