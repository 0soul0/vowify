'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function handleAuth() {
      const code = searchParams.get('code');
      const next = searchParams.get('next') ?? '/register/complete';

      try {
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('Exchange code error:', error);
            if (mounted) setErrorMsg(error.message);
            return;
          }

          if (data.session) {
            document.cookie = 'vowify_auth=true;path=/;max-age=2592000;SameSite=Lax';
            router.replace(next);
            return;
          }
        }

        // 檢查 hash fragment 或已存在的 session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          document.cookie = 'vowify_auth=true;path=/;max-age=2592000;SameSite=Lax';
          router.replace(next);
          return;
        }

        // 若無 code 也無 session，導向登入頁
        router.replace('/login');
      } catch (err) {
        if (mounted) setErrorMsg((err as Error).message);
      }
    }

    handleAuth();

    return () => {
      mounted = false;
    };
  }, [router, searchParams]);

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white border border-rose-200 rounded-3xl p-8 max-w-sm w-full space-y-4 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="font-serif text-lg font-bold text-[#2D3B36]">驗證失敗</h2>
          <p className="text-xs text-[#8E8A83] leading-relaxed">{errorMsg}</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 rounded-2xl bg-[#2D3B36] text-[#FAF9F5] text-xs font-semibold"
          >
            返回登入頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center space-y-3">
      <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
      <p className="text-xs text-[#8E8A83]">正在完成驗證並跳轉中...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
