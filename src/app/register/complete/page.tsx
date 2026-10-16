'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, User as UserIcon, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/shared/context/AuthContext';
import { ROUTES } from '@/constants/routes';

function CompleteContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // 確認已有 session，否則退回 register
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace(ROUTES.REGISTER);
      } else {
        // 如果已有名字（重複訪問），直接跳轉
        const existingName = session.user.user_metadata?.name as string | undefined;
        if (existingName) {
          router.replace(ROUTES.PROJECTS);
        }
      }
      setIsCheckingSession(false);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setErrorMsg('');

    const { error } = await supabase.auth.updateUser({
      data: { name: name.trim() },
    });

    if (error) {
      setErrorMsg(error.message);
      setIsSubmitting(false);
      return;
    }

    router.replace(ROUTES.PROJECTS);
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#C5A880] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2D3B36] flex flex-col justify-between">
      <header className="px-6 py-5 max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link href={ROUTES.HOME} className="inline-flex items-center gap-2 text-xs font-medium text-[#6A665E] hover:text-[#2D3B36] transition-colors group">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          <span className="font-serif font-bold tracking-wider">VOWIFY</span>
        </Link>
      </header>

      <div className="w-full max-w-md mx-auto px-6 py-8">
        <div className="bg-white border border-[#E8E5DF] rounded-3xl p-8 sm:p-10 shadow-[0_12px_35px_rgba(45,59,54,0.05)] space-y-7">
          {/* Step indicator */}
          <div className="flex items-center gap-3 text-xs text-[#8E8A83]">
            <div className="flex items-center gap-1.5 text-[#C5A880]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-medium">電子信箱驗證</span>
            </div>
            <div className="flex-1 h-px bg-[#E8E5DF]" />
            <div className="flex items-center gap-1.5 text-[#2D3B36] font-semibold">
              <div className="w-4 h-4 rounded-full bg-[#2D3B36] text-white flex items-center justify-center text-[10px]">2</div>
              <span>完善個人資料</span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#F0EDE6] border border-[#E8E5DF] flex items-center justify-center mx-auto mb-1">
              <UserIcon className="w-6 h-6 text-[#C5A880]" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#2D3B36] tracking-tight">
              最後一步
            </h1>
            <p className="text-xs text-[#8E8A83] leading-relaxed">
              請輸入您的姓名，讓賓客認出是誰邀請他們。
              {user?.email && (
                <span className="block mt-1 text-[#4A4844] font-medium">{user.email}</span>
              )}
            </p>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#4A4844] uppercase tracking-wider">
                您的姓名 / 稱謂
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8E8A83] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Ethan & Olivia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] placeholder-[#A6A29A] text-xs focus:outline-hidden focus:border-[#C5A880] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full mt-2 py-3.5 rounded-2xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <span>{isSubmitting ? '建立中...' : '完成註冊，開始使用'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
          </form>
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-[#8E8A83]">
        <p>© {new Date().getFullYear()} Vowify. Luxury Digital Wedding Platform.</p>
      </footer>
    </div>
  );
}

export default function RegisterCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#C5A880] animate-spin" />
      </div>
    }>
      <CompleteContent />
    </Suspense>
  );
}
