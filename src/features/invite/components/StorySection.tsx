'use client';

import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { WeddingInviteData } from '../types';
import { useI18n } from '@/shared/i18n/I18nContext';

interface StorySectionProps {
  data: WeddingInviteData;
}

export function StorySection({ data }: StorySectionProps) {
  const { t } = useI18n();

  return (
    <section className="py-20 px-6 bg-[#FAF9F5] border-b border-[#E8E5DF] text-center">
      <div className="max-w-md mx-auto space-y-6">
        {/* Monogram Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E5DF] text-[10px] uppercase tracking-widest text-[#8E8A83] font-medium shadow-2xs">
          <Heart className="w-3 h-3 text-[#C5A880] fill-[#C5A880]" />
          <span>{t('ourJourney')}</span>
        </div>

        {/* Section Heading */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D3B36] tracking-tight">
          {data.storyTitle}
        </h2>

        {/* Story Paragraphs */}
        <div className="space-y-4 text-xs sm:text-sm text-[#6A665E] leading-loose font-normal px-2">
          {data.storyContent.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Decorative Divider */}
        <div className="pt-4 flex items-center justify-center gap-3 text-[#C5A880]/60">
          <span className="w-12 h-px bg-[#E8E5DF]" />
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          <span className="w-12 h-px bg-[#E8E5DF]" />
        </div>
      </div>
    </section>
  );
}
