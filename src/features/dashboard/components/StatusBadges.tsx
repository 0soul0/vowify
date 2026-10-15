'use client';

import React from 'react';
import { UserCheck, UserX, Clock } from 'lucide-react';
import { AttendanceStatus } from '../types';
import { useI18n } from '@/shared/i18n/I18nContext';

interface AttendanceBadgeProps {
  status: AttendanceStatus;
  className?: string;
}

export function AttendanceBadge({ status, className = '' }: AttendanceBadgeProps) {
  const { t } = useI18n();

  const configs = {
    attending: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: UserCheck,
      text: t('confirmedAttending'),
    },
    declined: {
      bg: 'bg-stone-100 text-stone-600 border-stone-200',
      icon: UserX,
      text: t('declined'),
    },
    pending: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Clock,
      text: t('pending'),
    },
  };

  const current = configs[status];
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${current.bg} ${className}`}
    >
      <Icon className="w-3 h-3" />
      <span>{current.text}</span>
    </span>
  );
}

interface PublishBadgeProps {
  isPublished: boolean;
  className?: string;
  dotOnly?: boolean;
}

export function PublishBadge({ isPublished, className = '' }: PublishBadgeProps) {
  const { t } = useI18n();

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full text-[11px] transition-colors ${
        isPublished
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-stone-100 text-stone-600'
      } ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isPublished ? 'bg-emerald-500' : 'bg-stone-400'
        }`}
      />
      <span>{isPublished ? t('published') : t('draft')}</span>
    </span>
  );
}
