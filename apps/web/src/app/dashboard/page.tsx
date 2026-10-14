'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/shared/i18n/I18nContext';
import { AuthGuard } from '@/shared/components/AuthGuard';

function DashboardIndexContent() {
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    router.replace('/projects');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center text-xs text-[#8E8A83]">
      {t('redirecting')}
    </div>
  );
}

export default function DashboardIndexPage() {
  return (
    <AuthGuard>
      <DashboardIndexContent />
    </AuthGuard>
  );
}
