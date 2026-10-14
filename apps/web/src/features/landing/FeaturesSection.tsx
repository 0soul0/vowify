'use client';

import React from 'react';
import { 
  Sparkles, 
  Clock, 
  BarChart3, 
  Navigation
} from 'lucide-react';
import { useI18n } from '@/shared/i18n/I18nContext';

export function FeaturesSection() {
  const { locale, t } = useI18n();

  const featuresByLocale = {
    'zh-TW': [
      {
        icon: Clock,
        badge: '極簡直覺',
        title: '10 分鐘快速視覺化編輯',
        description: '完全無需設計與程式背景。直覺式區塊控制面板，封面照片、愛情故事、婚紗藝廊與背景音樂，所見即所得，即改即看。',
        subFeatures: ['手機 / 桌面雙視角即時連動', '多款莫蘭迪與香檳金色調切換', '支援自訂背景浪漫鋼琴曲'],
        tagColor: 'text-[#C5A880] bg-[#C5A880]/10',
      },
      {
        icon: BarChart3,
        badge: '婚籌救星',
        title: '智慧 RSVP 統計與 Excel 匯出',
        description: '告別零散的表單與私訊統計。自動即時彙整出席席次、葷素食比例、兒童安全座椅需求，並支援一鍵匯出繁中 Excel/CSV。',
        subFeatures: ['素食 / 幼童餐椅精準數量掌握', '親友溫馨祝賀留言即時看板', '一鍵下載標準 Excel 格式報表'],
        tagColor: 'text-emerald-700 bg-emerald-50',
      },
      {
        icon: Navigation,
        badge: '貼心體驗',
        title: '一鍵地圖導航與行事曆同步',
        description: '讓賓客絕不遲到。內建 Google Maps 飯店導航、大眾運輸指引，並支援 Apple / Google 行事曆一鍵加入婚禮排程。',
        subFeatures: ['Google Maps 快速導航外鏈', '行事曆加入提醒防遺忘', '支援婚宴桌次與廳別指引'],
        tagColor: 'text-[#2D3B36] bg-[#2D3B36]/10',
      },
    ],
    'zh-CN': [
      {
        icon: Clock,
        badge: '极简直觉',
        title: '10 分钟快速可视化编辑',
        description: '完全无需设计与编程基础。直觉式模块控制面板，封面照片、爱情故事、婚纱相册与背景音乐，所见即所得。',
        subFeatures: ['手机 / 桌面双视角实时联动', '多款莫兰迪与香槟金色调切换', '支持自定义背景浪漫钢琴曲'],
        tagColor: 'text-[#C5A880] bg-[#C5A880]/10',
      },
      {
        icon: BarChart3,
        badge: '婚筹救星',
        title: '智能 RSVP 统计与 Excel 导出',
        description: '告别零散的表单与私聊统计。自动实时汇总出席席位、荤素食比例、儿童安全座椅需求，并支持一键导出 Excel/CSV。',
        subFeatures: ['素食 / 幼童餐椅精准数量掌握', '亲友温馨祝贺留言实时看板', '一键下载标准 Excel 格式报表'],
        tagColor: 'text-emerald-700 bg-emerald-50',
      },
      {
        icon: Navigation,
        badge: '贴心体验',
        title: '一键地图导航与日历同步',
        description: '让宾客绝不迟到。内置 Google Maps 酒店导航、公共交通指引，并支持手机日历一键加入婚礼日程。',
        subFeatures: ['Google Maps 快速导航外链', '日历加入提醒防遗忘', '支持婚宴桌次与厅别指引'],
        tagColor: 'text-[#2D3B36] bg-[#2D3B36]/10',
      },
    ],
    'en': [
      {
        icon: Clock,
        badge: 'Intuitive & Fast',
        title: 'Visual Builder in 10 Minutes',
        description: 'Zero design or coding skills required. Real-time preview with block controls for your cover photos, love story, photo gallery, and romantic music.',
        subFeatures: ['Synchronized mobile & desktop views', 'Curated Morandi & champagne color palettes', 'Custom looping romantic background music'],
        tagColor: 'text-[#C5A880] bg-[#C5A880]/10',
      },
      {
        icon: BarChart3,
        badge: 'Planning Lifesaver',
        title: 'Smart RSVP Tracking & CSV Export',
        description: 'Say goodbye to scattered group chats and paper forms. Automatically aggregate headcounts, meal preferences, and booster seats with instant Excel/CSV download.',
        subFeatures: ['Accurate counts for vegetarian & high chairs', 'Live wall for heartfelt guest wishes', 'One-click standard CSV/Excel report'],
        tagColor: 'text-emerald-700 bg-emerald-50',
      },
      {
        icon: Navigation,
        badge: 'Delightful UX',
        title: 'One-Tap Navigation & Calendar Sync',
        description: 'Ensure guests arrive effortlessly. Integrated Google Maps directions, transit info, and one-click sync to Apple & Google calendars.',
        subFeatures: ['Direct Google Maps routing link', 'Calendar reminders to prevent forgetfulness', 'Table & ballroom locator details'],
        tagColor: 'text-[#2D3B36] bg-[#2D3B36]/10',
      },
    ],
    'ja': [
      {
        icon: Clock,
        badge: '直感的・簡単',
        title: '10分で完成するビジュアル編集',
        description: 'デザインやプログラミングの知識は一切不要。表紙、ストーリー、ギャラリー、BGMをプレビューを見ながら直感的に編集できます。',
        subFeatures: ['スマホとPCのリアルタイム連動プレビュー', '上品なニュアンスカラーとシャンパンゴールド', 'こだわりのピアノBGM設定'],
        tagColor: 'text-[#C5A880] bg-[#C5A880]/10',
      },
      {
        icon: BarChart3,
        badge: '準備の救世主',
        title: 'スマートRSVP集計 & CSV書き出し',
        description: '出欠回答、アレルギーや食事制限、お子様用椅子の有無を自動集計。ワンクリックで式場提出用のExcel/CSV形式でダウンロードできます。',
        subFeatures: ['ベジタリアン・お子様椅子の正確な集計', '温かいメッセージが届くお祝い掲示板', 'ワンクリック標準Excelファイル書き出し'],
        tagColor: 'text-emerald-700 bg-emerald-50',
      },
      {
        icon: Navigation,
        badge: 'おもてなし',
        title: 'Googleマップ案内 & カレンダー登録',
        description: '大切なゲストが迷わないように。Google マップによるルート案内と、スマホカレンダーへの予定追加をワンタップで実現。',
        subFeatures: ['Google マップによる会場ナビ', 'カレンダー登録で忘れ防止', '披露宴会場のフロア・卓番案内'],
        tagColor: 'text-[#2D3B36] bg-[#2D3B36]/10',
      },
    ],
  };

  const currentFeatures = featuresByLocale[locale] || featuresByLocale['zh-TW'];

  return (
    <section id="features" className="py-24 bg-white border-y border-[#E8E5DF]/70">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E8E5DF] text-xs font-semibold text-[#8E8A83] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            {t('featuresBadge')}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D3B36] tracking-tight">
            {t('featuresTitle')}
          </h2>
          <p className="text-sm sm:text-base text-[#6A665E] leading-relaxed">
            {t('featuresSubtitle')}
          </p>
        </div>

        {/* 3 Columns Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#FAF9F5] border border-[#E8E5DF] hover:border-[#C5A880] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(45,59,54,0.06)] flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8E5DF] flex items-center justify-center text-[#2D3B36] group-hover:bg-[#2D3B36] group-hover:text-[#FAF9F5] transition-colors shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${feature.tagColor}`}>
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#2D3B36] mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6A665E] leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E8E5DF]/70 space-y-2.5">
                  {feature.subFeatures.map((sub, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#4A4844]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
