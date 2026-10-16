'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Calendar, 
  CheckCircle2, 
  Star, 
  Users, 
  Music, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useI18n } from '../../shared/i18n/I18nContext';
import { ROUTES } from '@/constants/routes';

export function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-[#F9F8F6]">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#C5A880]/15 to-[#2D3B36]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copywriting & CTAs (7 Cols) */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E5DF] text-xs font-medium text-[#2D3B36] shadow-2xs mx-auto lg:mx-0">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{t('heroBadge')}</span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2D3B36] font-bold tracking-tight leading-[1.18]">
              {t('heroTitle1')}
              <span className="relative inline-block mx-2 text-[#2D3B36]">
                {t('heroTitleHighlight')}
                <svg
                  className="absolute left-0 -bottom-2 w-full h-3 text-[#C5A880]/60"
                  viewBox="0 0 250 12"
                  fill="none"
                >
                  <path
                    d="M3 9C60 3 190 3 247 9"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              {t('heroTitle2')}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#6A665E] max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              {t('heroSubtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href={ROUTES.PROJECTS}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-sm font-medium tracking-wide shadow-md transition-all hover:scale-102 flex items-center justify-center gap-2 group"
              >
                <span>{t('freeCreate')}</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#templates"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-[#FAF9F5] text-[#2D3B36] border border-[#E8E5DF] text-sm font-medium shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                <span>{t('viewDemos')}</span>
                <ExternalLink className="w-4 h-4 text-[#8E8A83]" />
              </a>
            </div>

            {/* Social Proof Stats */}
            <div className="pt-6 border-t border-[#E8E5DF]/80 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs text-[#6A665E]">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#EAE5DD] border border-white flex items-center justify-center text-[9px] font-bold text-[#2D3B36]">E</div>
                  <div className="w-6 h-6 rounded-full bg-[#C5A880] border border-white flex items-center justify-center text-[9px] font-bold text-white">O</div>
                  <div className="w-6 h-6 rounded-full bg-[#2D3B36] border border-white flex items-center justify-center text-[9px] font-bold text-white">L</div>
                </div>
                <span>{t('accompaniedCouples')}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>{t('ratingProof')}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2D3B36]" />
                <span>無痛匯出 Excel 報表</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Mockup (5 Cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Main Phone Mockup */}
            <div className="w-[310px] sm:w-[330px] rounded-[46px] p-3.5 bg-stone-900 border-[6px] border-stone-800 shadow-[0_30px_70px_-15px_rgba(45,59,54,0.35)] relative transition-transform hover:-translate-y-1 duration-300">
              {/* Dynamic Island */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 w-24 h-5 bg-black rounded-full" />

              {/* Screen Inner */}
              <div className="w-full rounded-[36px] overflow-hidden bg-[#FAF9F5] text-[#2D3B36] relative flex flex-col">
                {/* Cover Picture */}
                <div className="relative h-[340px]">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=85&w=800"
                    alt="Wedding Hero"
                    className="w-full h-full object-cover brightness-[0.82]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-5 inset-x-0 text-center text-white space-y-1.5 px-4">
                    <span className="text-[10px] tracking-widest uppercase text-[#C5A880] font-medium block">
                      Wedding Invitation
                    </span>
                    <h2 className="font-serif text-2xl font-normal tracking-wide">
                      Ethan & Olivia
                    </h2>
                    <p className="text-[11px] text-white/80 italic font-serif">
                      「在浩瀚宇宙中，我們許下永恆諾言」
                    </p>
                    <div className="pt-1 text-[11px] text-white/90 font-mono">
                      2026.11.28 • 台北萬豪酒店
                    </div>
                  </div>
                </div>

                {/* Lower Card inside Phone */}
                <div className="p-4 bg-white space-y-3 text-center">
                  <div className="flex items-center justify-between text-[11px] px-2 py-1 rounded-full bg-[#FAF9F5] border border-[#E8E5DF]">
                    <span className="text-[#8E8A83]">婚禮倒數計時</span>
                    <span className="font-semibold text-[#2D3B36]">D-46 天</span>
                  </div>
                  <div className="py-2.5 rounded-xl bg-[#2D3B36] text-[#FAF9F5] text-xs font-medium tracking-wide">
                    填寫出席回覆 (RSVP)
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Floating Card 1: RSVP Real-time Notification */}
            <div className="absolute -left-6 sm:-left-12 top-16 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E5DF] shadow-[0_12px_30px_rgba(45,59,54,0.12)] flex items-center gap-3 animate-in fade-in slide-in-from-left duration-500">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-[#2D3B36]">林家豪 已填寫 RSVP</p>
                <p className="text-[11px] text-[#8E8A83]">確認出席 • 2 位入席</p>
              </div>
            </div>

            {/* Floating Card 2: Music Playing Badge */}
            <div className="absolute -right-4 sm:-right-8 bottom-16 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E5DF] shadow-[0_12px_30px_rgba(45,59,54,0.12)] flex items-center gap-3 animate-in fade-in slide-in-from-right duration-500">
              <div className="w-9 h-9 rounded-xl bg-[#2D3B36] flex items-center justify-center text-[#C5A880]">
                <Music className="w-4 h-4 animate-bounce" />
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-[#2D3B36]">婚禮配樂播放中</p>
                <p className="text-[11px] text-[#8E8A83]">Canon in D (Piano)</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
