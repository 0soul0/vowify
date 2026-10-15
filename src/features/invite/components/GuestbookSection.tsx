'use client';

import React from 'react';
import { MessageSquareHeart, Heart } from 'lucide-react';
import { GuestbookEntry } from '../types';
import { useI18n } from '@/shared/i18n/I18nContext';

interface GuestbookSectionProps {
  entries: GuestbookEntry[];
}

export function GuestbookSection({ entries }: GuestbookSectionProps) {
  const { t } = useI18n();

  return (
    <section className="py-20 px-6 bg-[#FAF9F5] text-center">
      <div className="max-w-md mx-auto space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E5DF] text-[10px] uppercase tracking-widest text-[#8E8A83] font-medium">
          <MessageSquareHeart className="w-3 h-3 text-[#C5A880]" />
          <span>Guestbook Wall</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D3B36] tracking-tight">
          {t('guestbookTitle')}
        </h2>

        <p className="text-xs text-[#8E8A83]">
          {t('guestbookSub')}
        </p>

        {/* Guestbook Cards List */}
        <div className="space-y-3 pt-2 text-left">
          {entries.length === 0 ? (
            <p className="text-xs text-stone-400 py-8 text-center italic">
              成為第一位留下暖心祝福的賓客吧！
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-white border border-[#E8E5DF] shadow-2xs space-y-2 hover:border-[#C5A880]/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#2D3B36]">
                      {entry.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF9F5] text-[#8E8A83] border border-[#E8E5DF]">
                      {entry.relation}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {entry.date}
                  </span>
                </div>

                <p className="text-xs text-[#6A665E] leading-relaxed italic">
                  "{entry.message}"
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer Signature within Invitation */}
        <div className="pt-12 space-y-2 text-stone-400">
          <Heart className="w-4 h-4 text-[#C5A880] mx-auto fill-[#C5A880]" />
          <p className="font-serif text-sm tracking-widest text-[#2D3B36]">
            Ethan & Olivia
          </p>
          <p className="text-[10px] tracking-wider uppercase">
            With Love & Gratitude
          </p>
        </div>
      </div>
    </section>
  );
}
