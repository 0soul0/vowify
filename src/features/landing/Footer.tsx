'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Mail, MessageCircle, ArrowUpRight } from 'lucide-react';
import { useI18n, LanguageSwitcher } from '@/shared/i18n/I18nContext';
import { ROUTES } from '@/constants/routes';

export function Footer() {
  const { locale, t } = useI18n();

  const footerTexts = {
    'zh-TW': {
      desc: '致力於為當代新人打造最優雅、便捷的雲端電子喜帖。免去繁複溝通，讓科技承載每一份溫暖心意。',
      features: '產品功能',
      f1: '視覺喜帖編輯器',
      f2: 'RSVP 出席統計',
      f3: 'Excel / CSV 匯出',
      f4: '桌次座位安排系統',
      templates: '風格模版',
      t1: '韓系純白微光',
      t2: '美式極簡黑白',
      t3: '法式莊園墨綠',
      t4: '復古摩登玫瑰',
      quick: '快速通道',
      q1: '專案管理總覽',
      q2: '方案與價格',
      q3: '常見問答',
      q4: '聯絡婚宴專員',
      privacy: '隱私權政策',
      terms: '服務條款',
      rights: '保留一切權利。浪漫從此永恆。',
    },
    'zh-CN': {
      desc: '致力于为当代新人打造最优雅、便捷的云端电子请帖。免去繁复沟通，让科技承载每一份温暖心意。',
      features: '产品功能',
      f1: '视觉请帖编辑器',
      f2: 'RSVP 出席统计',
      f3: 'Excel / CSV 导出',
      f4: '桌次座位安排系统',
      templates: '风格模版',
      t1: '韩系纯白微光',
      t2: '美式极简黑白',
      t3: '法式庄园墨绿',
      t4: '复古摩登玫瑰',
      quick: '快速通道',
      q1: '项目管理总览',
      q2: '方案与价格',
      q3: '常见问答',
      q4: '联系婚礼专员',
      privacy: '隐私政策',
      terms: '服务条款',
      rights: '保留一切权利。浪漫从此永恒。',
    },
    'en': {
      desc: 'Dedicated to helping modern couples design timeless, effortless digital wedding invitations. Elevating weddings through design and technology.',
      features: 'Features',
      f1: 'Visual Builder',
      f2: 'RSVP Headcount',
      f3: 'Excel / CSV Export',
      f4: 'Seating Planner',
      templates: 'Templates',
      t1: 'Serenade Aurora',
      t2: 'Modernity Editorial',
      t3: 'Château Emerald',
      t4: 'Vintage Rose',
      quick: 'Quick Links',
      q1: 'Projects Hub',
      q2: 'Pricing & Plans',
      q3: 'FAQ',
      q4: 'Contact Concierge',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      rights: 'All rights reserved. Forever starts here.',
    },
    'ja': {
      desc: '現代の新郎新婦のための、もっとも美しく使いやすいデジタル招待状プラットフォーム。お二人の門出をテクノロジーとデザインで彩ります。',
      features: '機能一覧',
      f1: 'ビジュアルエディタ',
      f2: 'RSVP出欠集計',
      f3: 'Excel / CSV書き出し',
      f4: '配席・テーブルプラン',
      templates: 'デザイン',
      t1: '韓国風ナチュラル',
      t2: 'モダンミニマル',
      t3: 'フレンチシャトー',
      t4: 'ヴィンテージ',
      quick: 'クイックリンク',
      q1: 'プロジェクト一覧',
      q2: '料金プラン',
      q3: 'よくある質問',
      q4: 'ウェディング相談',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      rights: 'All rights reserved. 永遠の愛に祝福を。',
    },
  };

  const text = footerTexts[locale] || footerTexts['zh-TW'];

  return (
    <footer className="bg-[#1E2824] text-[#FAF9F5] border-t border-[#2D3B36] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2D3B36] flex items-center justify-center text-[#FAF9F5] border border-white/10">
                <Sparkles className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-wider text-white block leading-none">
                  VOWIFY
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-medium block mt-1">
                  Luxury Wedding SaaS
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/70 max-w-sm leading-relaxed">
              {text.desc}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <LanguageSwitcher variant="dark" />
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 transition-colors"
                  title="Instagram"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="mailto:contact@vowify.io"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 transition-colors"
                  title="Email Support"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links (7 Cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div className="space-y-3">
              <h4 className="font-semibold text-white/90 uppercase tracking-wider text-[11px]">
                {text.features}
              </h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#features" className="hover:text-white transition-colors">{text.f1}</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">{text.f2}</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">{text.f3}</a></li>
                <li><Link href={ROUTES.PROJECTS} className="hover:text-white transition-colors">{text.f4}</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-white/90 uppercase tracking-wider text-[11px]">
                {text.templates}
              </h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#templates" className="hover:text-white transition-colors">{text.t1}</a></li>
                <li><a href="#templates" className="hover:text-white transition-colors">{text.t2}</a></li>
                <li><a href="#templates" className="hover:text-white transition-colors">{text.t3}</a></li>
                <li><a href="#templates" className="hover:text-white transition-colors">{text.t4}</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-white/90 uppercase tracking-wider text-[11px]">
                {text.quick}
              </h4>
              <ul className="space-y-2 text-white/60">
                <li><Link href={ROUTES.PROJECTS} className="hover:text-[#C5A880] transition-colors flex items-center gap-1">{text.q1} <ArrowUpRight className="w-3 h-3" /></Link></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{text.q2}</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">{text.q3}</a></li>
                <li><a href="mailto:support@vowify.io" className="hover:text-white transition-colors">{text.q4}</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Vowify Inc. {text.rights}</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">{text.privacy}</span>
            <span className="hover:text-white transition-colors cursor-pointer">{text.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
