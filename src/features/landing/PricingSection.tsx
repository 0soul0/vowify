'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { useI18n } from '@/shared/i18n/I18nContext';
import { ROUTES } from '@/constants/routes';

export function PricingSection() {
  const { locale, t } = useI18n();

  const plansByLocale = {
    'zh-TW': [
      {
        name: '免費體驗版',
        badge: '無痛試用',
        price: '0',
        period: '永久免費體驗',
        description: '適合想要先動手排版、預覽電子喜帖效果的新人。',
        highlight: false,
        ctaText: '立即免費製作',
        ctaLink: ROUTES.PROJECTS,
        features: [
          '全套精美模版自由切換',
          '所見即所得視覺化編輯器',
          '上限 20 組親友 RSVP 回覆',
          'Google Maps 婚宴導航連結',
          '基礎浮水印標示',
        ],
        notIncluded: [
          '無限制 RSVP 賓客回覆',
          'Excel / CSV 賓客清單匯出',
          '自訂背景浪漫鋼琴音樂',
          '桌次座位智慧安排系統',
        ],
        subText: '無需綁定任何信用卡',
      },
      {
        name: '尊榮無限版',
        badge: '90% 新人推薦首選',
        price: '1,680',
        period: '單場婚禮買斷 • 永久保存',
        description: '完整解鎖所有高階功能，從喜帖發送到婚禮當日座位排表一站搞定。',
        highlight: true,
        ctaText: '立即解鎖尊榮版',
        ctaLink: ROUTES.PROJECTS,
        features: [
          '包含免費體驗版所有功能',
          '無限制親友 RSVP 回覆量 (支援破千席)',
          '一鍵匯出標準 Excel / CSV 席位報表',
          '精準掌握素食套餐與幼兒安全座椅需求',
          '親友溫馨祝賀留言即時互動看板',
          '自訂專屬背景配樂 (支援自動循環播放)',
          '移除所有平台浮水印，尊榮純淨視覺',
          '桌次座位排定助手 (Seating Planner)',
          '雲端紀念相簿永久保存珍藏',
        ],
        notIncluded: [],
        subText: '支援信用卡、LINE Pay 與 Apple Pay 快速付款',
      },
    ],
    'zh-CN': [
      {
        name: '免费体验版',
        badge: '轻松试用',
        price: '0',
        period: '永久免费体验',
        description: '适合想要先动手排版、预览电子请帖效果的新人。',
        highlight: false,
        ctaText: '立即免费制作',
        ctaLink: ROUTES.PROJECTS,
        features: [
          '全套精美模版自由切换',
          '所见即所得可视化编辑器',
          '上限 20 组亲友 RSVP 回复',
          'Google Maps 婚宴导航链接',
          '基础水印标识',
        ],
        notIncluded: [
          '无限制 RSVP 宾客回复',
          'Excel / CSV 宾客清单导出',
          '自定义背景浪漫钢琴音乐',
          '桌次座位智能安排系统',
        ],
        subText: '无需绑定任何信用卡',
      },
      {
        name: '尊荣无限版',
        badge: '90% 新人推荐首选',
        price: '388',
        period: '单场婚礼买断 • 永久保存',
        description: '完整解锁所有高阶功能，从请帖发送到婚礼当日座位排表一站搞定。',
        highlight: true,
        ctaText: '立即解锁尊荣版',
        ctaLink: ROUTES.PROJECTS,
        features: [
          '包含免费体验版所有功能',
          '无限制亲友 RSVP 回复量 (支持破千席)',
          '一键导出标准 Excel / CSV 席位报表',
          '精准掌握素食套餐与幼儿安全座椅需求',
          '亲友温馨祝贺留言实时互动看板',
          '自定义专属背景配乐 (支持自动循环播放)',
          '移除所有平台水印，尊荣纯净视觉',
          '桌次座位排定助手 (Seating Planner)',
          '云端纪念相册永久保存珍藏',
        ],
        notIncluded: [],
        subText: '支持微信支付与支付宝快捷付款',
      },
    ],
    'en': [
      {
        name: 'Free Starter',
        badge: 'Free Trial',
        price: '0',
        period: 'Forever Free',
        description: 'Perfect for couples wanting to design layouts and preview their online invitations.',
        highlight: false,
        ctaText: 'Start for Free',
        ctaLink: ROUTES.PROJECTS,
        features: [
          'All designer templates included',
          'Full visual WYSIWYG editor',
          'Up to 20 guest RSVP submissions',
          'Google Maps venue link',
          'Standard Vowify watermark',
        ],
        notIncluded: [
          'Unlimited RSVP submissions',
          'Excel / CSV guest export',
          'Custom background music',
          'Visual seating arrangement planner',
        ],
        subText: 'No credit card required',
      },
      {
        name: 'Prestige Plan',
        badge: 'Couples Favorite (90%)',
        price: '59',
        period: 'One-time payment • Lifetime archive',
        description: 'Unlock everything from invitation distribution to guest RSVP tracking and table seating.',
        highlight: true,
        ctaText: 'Unlock Full Access',
        ctaLink: ROUTES.PROJECTS,
        features: [
          'Everything in Free Starter',
          'Unlimited RSVP submissions & guests',
          'One-click Excel / CSV guest export',
          'Dietary & high-chair requirement tracking',
          'Real-time interactive guestbook wall',
          'Custom romantic background music',
          'Remove all Vowify branding / watermarks',
          'Visual Table & Seating Planner',
          'Permanent cloud anniversary memory book',
        ],
        notIncluded: [],
        subText: 'Secure checkout via Credit Card & Apple Pay',
      },
    ],
    'ja': [
      {
        name: 'フリープラン',
        badge: '無料体験',
        price: '0',
        period: '永久無料',
        description: 'まずは自由にデザインを作成し、実際のプレビューを確認したい新郎新婦様に。',
        highlight: false,
        ctaText: '無料で作成する',
        ctaLink: ROUTES.PROJECTS,
        features: [
          'すべてのデザインテンプレート利用可能',
          '直感的なビジュアルエディタ',
          '最大 20 組までの出欠回答',
          'Google マップ会場案内',
          'Vowify ロゴ表示あり',
        ],
        notIncluded: [
          '無制限の出欠回答受付',
          'Excel / CSV ゲスト名簿の書き出し',
          'オリジナルBGM音楽の設定',
          'スマート配席・テーブルプラン機能',
        ],
        subText: 'クレジットカード登録不要',
      },
      {
        name: 'プレミアムプラン',
        badge: '90%の新郎新婦が選択',
        price: '7,800',
        period: '買い切り • 永久保存アーカイブ',
        description: '招待状の送信から当日の配席・食事希望集計まで、すべての機能を完全開放。',
        highlight: true,
        ctaText: 'プレミアム版を利用する',
        ctaLink: ROUTES.PROJECTS,
        features: [
          'フリープランの全機能を含む',
          '出欠回答の受付が無制限 (何名様でも対応)',
          '式場提出用の Excel / CSV 名簿書き出し',
          'アレルギー・食事制限とお子様椅子の正確な集計',
          'お祝いメッセージ掲示板',
          'お好みのオリジナルピアノBGM設定',
          'すべてのロゴ・ウォーターマークを非表示',
          'ビジュアル配席・テーブルプラン管理',
          '大切な思い出をずっと残せるクラウド永久保存',
        ],
        notIncluded: [],
        subText: 'クレジットカード・各種キャッシュレス対応',
      },
    ],
  };

  const currentPlans = plansByLocale[locale] || plansByLocale['zh-TW'];

  const currencySymbol = locale === 'en' ? '$' : locale === 'ja' ? '¥' : locale === 'zh-CN' ? '¥' : 'NT$';

  return (
    <section id="pricing" className="py-24 bg-white border-b border-[#E8E5DF]/70">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E8E5DF] text-xs font-semibold text-[#8E8A83] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            {t('pricingBadge')}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D3B36] tracking-tight">
            {t('pricingTitle')}
          </h2>
          <p className="text-sm sm:text-base text-[#6A665E]">
            {t('pricingSubtitle')}
          </p>
        </div>

        {/* Pricing Cards Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {currentPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 relative ${
                plan.highlight
                  ? 'bg-gradient-to-b from-[#2D3B36] to-[#1E2824] text-[#FAF9F5] shadow-[0_20px_50px_rgba(45,59,54,0.22)] border-2 border-[#C5A880]'
                  : 'bg-[#FAF9F5] text-[#2D3B36] border border-[#E8E5DF] shadow-xs hover:border-[#C5A880]/60'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#C5A880] text-[#1E2824] text-[11px] font-bold tracking-wide shadow-xs">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-2xl font-bold tracking-tight">
                    {plan.name}
                  </h3>
                  {!plan.highlight && (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-200/60 text-[#6A665E] font-medium">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p
                  className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                    plan.highlight ? 'text-[#FAF9F5]/75' : 'text-[#6A665E]'
                  }`}
                >
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1.5 pb-6 border-b border-[#E8E5DF]/30">
                  <span className="text-sm font-semibold">{currencySymbol}</span>
                  <span className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">
                    {plan.price}
                  </span>
                  <span
                    className={`text-xs ml-2 ${
                      plan.highlight ? 'text-[#C5A880]' : 'text-[#8E8A83]'
                    }`}
                  >
                    / {plan.period}
                  </span>
                </div>

                {/* Features List */}
                <div className="py-6 space-y-3.5 text-xs sm:text-sm">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.highlight
                            ? 'bg-[#C5A880] text-[#1E2824]'
                            : 'bg-[#2D3B36] text-white'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className={plan.highlight ? 'text-white/90' : 'text-[#4A4844]'}>
                        {feat}
                      </span>
                    </div>
                  ))}

                  {plan.notIncluded.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 opacity-40">
                      <div className="w-4 h-4 rounded-full bg-stone-300 text-stone-600 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] leading-none">✕</span>
                      </div>
                      <span className="text-stone-400 line-through">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="pt-6">
                <Link
                  href={plan.ctaLink}
                  className={`w-full py-4 rounded-full text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-xs ${
                    plan.highlight
                      ? 'bg-[#C5A880] hover:bg-[#b89a71] text-[#1E2824]'
                      : 'bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5]'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-center mt-3 opacity-60">
                  {plan.subText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
