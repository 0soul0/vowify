'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/shared/context/AuthContext';
import { useI18n } from '@/shared/i18n/I18nContext';
import { ROUTES } from '@/constants/routes';
import { Sparkles } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = ROUTES.buildLoginUrl(pathname || undefined);
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center text-center p-6 select-none">
        <div className="w-12 h-12 rounded-2xl bg-[#2D3B36] flex items-center justify-center text-[#C5A880] shadow-md animate-pulse mb-4">
          <Sparkles className="w-6 h-6 animate-spin duration-1000" />
        </div>
        <p className="font-serif text-sm font-medium text-[#2D3B36] tracking-wide">
          {t('loading')}
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center text-center p-6 select-none">
        <div className="w-12 h-12 rounded-2xl bg-[#2D3B36] flex items-center justify-center text-[#C5A880] shadow-md mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="font-serif text-sm font-medium text-[#2D3B36] tracking-wide mb-2">
          {t('loginRequiredMsg')}
        </p>
        <span className="text-xs text-[#8E8A83]">{t('redirecting')}</span>
      </div>
    );
  }

  return <>{children}</>;
}
