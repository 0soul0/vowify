'use client';

import React, { useMemo } from 'react';
import { Calendar, ChevronDown, Heart, Sparkles } from 'lucide-react';
import { WeddingInviteData } from '../types';
import { useI18n, LanguageSwitcher } from '@/shared/i18n/I18nContext';

interface HeroSectionProps {
  data: WeddingInviteData;
}

export function HeroSection({ data }: HeroSectionProps) {
  const { t } = useI18n();

  // 倒數天數計算
  const daysLeft = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(data.weddingDate);
    target.setHours(0, 0, 0, 0);
    return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  }, [data.weddingDate]);

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-stone-900 text-white select-none">
      {/* Background Wedding Photo with Soft Vignette */}
      <div className="absolute inset-0">
        <img
          src={data.coverImageUrl}
          alt="Wedding Cover"
          className="w-full h-full object-cover object-center brightness-[0.78] transition-transform duration-1000 ease-out scale-102"
        />
        {/* Subtle Luxury Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/35" />
      </div>

      {/* Top Wedding Invitation Monogram Pill & Language Switcher */}
      <div className="relative z-10 pt-8 px-6 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] uppercase tracking-[0.2em] text-[#C5A880] font-medium">
          <Sparkles className="w-3 h-3 text-[#C5A880]" />
          <span>{t('weddingInvitation')}</span>
        </div>
        <LanguageSwitcher variant="dark" />
      </div>

      {/* Center & Bottom: Names, Quote, and Countdown */}
      <div className="relative z-10 px-6 pb-12 max-w-lg mx-auto w-full text-center space-y-6">
        {/* Names */}
        <div className="space-y-2">
          <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-wide text-white drop-shadow-md">
            {data.groomName}
            <span className="text-[#C5A880] font-light mx-3 italic">&</span>
            {data.brideName}
          </h1>

          <div className="flex items-center justify-center gap-2 text-xs font-serif text-white/80 tracking-widest pt-1">
            <span>{data.groomNameZh}</span>
            <Heart className="w-3 h-3 fill-[#C5A880] text-[#C5A880]" />
            <span>{data.brideNameZh}</span>
          </div>
        </div>

        {/* Romantic Quote */}
        <p className="text-xs sm:text-sm text-white/90 font-serif italic max-w-xs mx-auto leading-relaxed drop-shadow-sm">
          {data.romanticQuote}
        </p>

        {/* Date & Countdown Box */}
        <div className="pt-2">
          <div className="inline-block p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 shadow-xl max-w-xs w-full space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs text-white/90">
              <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="font-medium tracking-wide">{data.weddingDate}</span>
              <span>•</span>
              <span>{data.weddingTime} {t('punctual')}</span>
            </div>

            <div className="pt-1 border-t border-white/10 flex items-center justify-center gap-1.5 text-xs">
              <span className="text-white/70">{t('countdownDays')}</span>
              <span className="text-lg font-serif font-bold text-[#C5A880] tracking-tight">
                {daysLeft}
              </span>
              <span className="text-white/70">{t('days')}</span>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="pt-4 flex flex-col items-center gap-1 text-white/60 animate-bounce">
          <span className="text-[10px] tracking-widest uppercase">Scroll Down</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
}
