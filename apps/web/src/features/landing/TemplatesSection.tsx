'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Eye, 
  Check, 
  Palette,
  ExternalLink,
  X
} from 'lucide-react';
import { useI18n } from '@/shared/i18n/I18nContext';

interface TemplateItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  image: string;
  tag: string;
  quote: string;
  colorHex: string;
}

export function TemplatesSection() {
  const { locale, t } = useI18n();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [demoModalTemplate, setDemoModalTemplate] = useState<TemplateItem | null>(null);

  const templatesByLocale: Record<string, { categories: { id: string; label: string }[]; items: TemplateItem[] }> = {
    'zh-TW': {
      categories: [
        { id: 'all', label: '全部風格模版' },
        { id: 'korean', label: '韓系清新' },
        { id: 'minimalist', label: '美式極簡' },
        { id: 'chateau', label: '法式莊園' },
        { id: 'vintage', label: '復古摩登' },
      ],
      items: [
        {
          id: 'tmpl-1',
          name: 'Serenade 韓系純白微光',
          subtitle: '極簡白與溫潤奶茶色調，溫柔如晨曦',
          category: 'korean',
          image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
          tag: '熱門首選',
          quote: '「在相遇的那一刻起，宇宙有了聲音。」',
          colorHex: '#FAF9F5',
        },
        {
          id: 'tmpl-2',
          name: 'Modernity 美式極簡黑白',
          subtitle: '當代高雅襯線排版，高級時裝畫報質感',
          category: 'minimalist',
          image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
          tag: '時尚新人推薦',
          quote: '「Forever begins in a moment of truth.」',
          colorHex: '#1E2824',
        },
        {
          id: 'tmpl-3',
          name: 'Château 法式莊園墨綠',
          subtitle: '古典墨綠與香檳金箔點綴，沉穩浪漫',
          category: 'chateau',
          image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
          tag: '經典奢華',
          quote: '「願我們的愛，在歲月中沉澱出甘甜。」',
          colorHex: '#2D3B36',
        },
        {
          id: 'tmpl-4',
          name: 'Vintage 復古摩登玫瑰',
          subtitle: '暖橘焦糖與玫瑰色系，充滿復古電影氛圍',
          category: 'vintage',
          image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800',
          tag: '電影質感',
          quote: '「就像一部經典老電影，歷久彌新。」',
          colorHex: '#D4A373',
        },
      ],
    },
    'zh-CN': {
      categories: [
        { id: 'all', label: '全部风格模版' },
        { id: 'korean', label: '韩系清新' },
        { id: 'minimalist', label: '美式极简' },
        { id: 'chateau', label: '法式庄园' },
        { id: 'vintage', label: '复古摩登' },
      ],
      items: [
        {
          id: 'tmpl-1',
          name: 'Serenade 韩系纯白微光',
          subtitle: '极简白与温润奶茶色调，温柔如晨曦',
          category: 'korean',
          image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
          tag: '热门首选',
          quote: '「在相遇的那一刻起，宇宙有了声音。」',
          colorHex: '#FAF9F5',
        },
        {
          id: 'tmpl-2',
          name: 'Modernity 美式极简黑白',
          subtitle: '当代高雅衬线排版，高级时装画报质感',
          category: 'minimalist',
          image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
          tag: '时尚新人推荐',
          quote: '「Forever begins in a moment of truth.」',
          colorHex: '#1E2824',
        },
        {
          id: 'tmpl-3',
          name: 'Château 法式庄园墨绿',
          subtitle: '古典墨绿与香槟金箔点缀，沉稳浪漫',
          category: 'chateau',
          image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
          tag: '经典奢华',
          quote: '「愿我们的爱，在岁月中沉淀出甘甜。」',
          colorHex: '#2D3B36',
        },
        {
          id: 'tmpl-4',
          name: 'Vintage 复古摩登玫瑰',
          subtitle: '暖橘焦糖与玫瑰色系，充满复古电影氛围',
          category: 'vintage',
          image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800',
          tag: '电影质感',
          quote: '「就像一部经典老电影，历久弥新。」',
          colorHex: '#D4A373',
        },
      ],
    },
    'en': {
      categories: [
        { id: 'all', label: 'All Templates' },
        { id: 'korean', label: 'Korean Pastel' },
        { id: 'minimalist', label: 'Minimalist Chic' },
        { id: 'chateau', label: 'French Château' },
        { id: 'vintage', label: 'Vintage Modern' },
      ],
      items: [
        {
          id: 'tmpl-1',
          name: 'Serenade Aurora',
          subtitle: 'Warm milk tea & ivory, gentle as morning light',
          category: 'korean',
          image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
          tag: 'Most Popular',
          quote: '“The moment we met, the universe found its melody.”',
          colorHex: '#FAF9F5',
        },
        {
          id: 'tmpl-2',
          name: 'Modernity Editorial',
          subtitle: 'Contemporary serif typography with fashion magazine aesthetic',
          category: 'minimalist',
          image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
          tag: 'Stylist Choice',
          quote: '“Forever begins in a moment of truth.”',
          colorHex: '#1E2824',
        },
        {
          id: 'tmpl-3',
          name: 'Château Emerald',
          subtitle: 'Deep forest green paired with subtle champagne gold',
          category: 'chateau',
          image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
          tag: 'Classic Luxury',
          quote: '“May our love ripen gracefully through the years.”',
          colorHex: '#2D3B36',
        },
        {
          id: 'tmpl-4',
          name: 'Vintage Rose',
          subtitle: 'Warm caramel and muted rose with cinematic warmth',
          category: 'vintage',
          image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800',
          tag: 'Cinematic Feel',
          quote: '“Just like a vintage movie, timeless and true.”',
          colorHex: '#D4A373',
        },
      ],
    },
    'ja': {
      categories: [
        { id: 'all', label: 'すべてのデザイン' },
        { id: 'korean', label: '韓国風ナチュラル' },
        { id: 'minimalist', label: 'モダンミニマル' },
        { id: 'chateau', label: 'フレンチシャトー' },
        { id: 'vintage', label: 'ヴィンテージ' },
      ],
      items: [
        {
          id: 'tmpl-1',
          name: 'Serenade セレナーデ',
          subtitle: 'やわらかなアイボリーとミルクティーの温もり',
          category: 'korean',
          image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
          tag: '一番人気',
          quote: '「出会った瞬間、世界は色づきはじめた。」',
          colorHex: '#FAF9F5',
        },
        {
          id: 'tmpl-2',
          name: 'Modernity モダニティ',
          subtitle: 'ハイブランドの雑誌を思わせる洗練された文字組',
          category: 'minimalist',
          image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
          tag: '花嫁おすすめ',
          quote: '「Forever begins in a moment of truth.」',
          colorHex: '#1E2824',
        },
        {
          id: 'tmpl-3',
          name: 'Château シャトー',
          subtitle: 'クラシックな深緑とシャンパンゴールドの品格',
          category: 'chateau',
          image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
          tag: '格調高き王道',
          quote: '「時を重ねるごとに深まる、かけがえのない絆。」',
          colorHex: '#2D3B36',
        },
        {
          id: 'tmpl-4',
          name: 'Vintage ヴィンテージ',
          subtitle: 'ノスタルジックなシネマ風のキャラメル＆ローズ',
          category: 'vintage',
          image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800',
          tag: 'シネマティック',
          quote: '「色褪せることのない、名作映画のように。」',
          colorHex: '#D4A373',
        },
      ],
    },
  };

  const currentData = templatesByLocale[locale] || templatesByLocale['zh-TW'];

  const filteredTemplates = activeCategory === 'all'
    ? currentData.items
    : currentData.items.filter((item) => item.category === activeCategory);

  return (
    <section id="templates" className="py-24 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E5DF] text-xs font-semibold text-[#8E8A83] uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5 text-[#C5A880]" />
            {t('templatesBadge')}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D3B36] tracking-tight">
            {t('templatesTitle')}
          </h2>
          <p className="text-sm sm:text-base text-[#6A665E]">
            {t('templatesSubtitle')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-12 overflow-x-auto pb-2 scrollbar-none">
          {currentData.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#2D3B36] text-[#FAF9F5] shadow-xs'
                  : 'bg-white border border-[#E8E5DF] text-[#6A665E] hover:border-[#C5A880]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {filteredTemplates.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-white border border-[#E8E5DF] overflow-hidden shadow-xs hover:border-[#C5A880] transition-all duration-300 hover:shadow-[0_16px_35px_rgba(45,59,54,0.08)] flex flex-col justify-between group"
            >
              {/* Image Preview Window */}
              <div className="relative aspect-3/4 overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                {/* Badge Tag */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-[#2D3B36]">
                    {item.tag}
                  </span>
                </div>

                {/* Bottom Quote & Name on Image */}
                <div className="absolute bottom-3.5 inset-x-3.5 text-white space-y-1">
                  <p className="text-[11px] font-serif italic text-white/90 line-clamp-2">
                    {item.quote}
                  </p>
                </div>
              </div>

              {/* Info & Action Buttons */}
              <div className="p-5 flex flex-col justify-between flex-1 bg-white">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#2D3B36] group-hover:text-[#C5A880] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#8E8A83] mt-1 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E8E5DF]/70 flex items-center gap-2">
                  <button
                    onClick={() => setDemoModalTemplate(item)}
                    className="flex-1 py-2 rounded-xl border border-[#E8E5DF] hover:border-[#2D3B36] text-[11px] font-medium text-[#2D3B36] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3 h-3 text-[#C5A880]" />
                    <span>{t('previewDemo')}</span>
                  </button>
                  <Link
                    href="/projects"
                    className="flex-1 py-2 rounded-xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>{t('useTemplate')}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Modal */}
      {demoModalTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-[#E8E5DF] animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[#E8E5DF] flex items-center justify-between">
              <span className="font-serif text-sm font-bold text-[#2D3B36]">
                {demoModalTemplate.name}
              </span>
              <button
                onClick={() => setDemoModalTemplate(null)}
                className="p-1.5 rounded-full hover:bg-stone-200/60 text-[#8E8A83]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-3/4">
              <img
                src={demoModalTemplate.image}
                alt={demoModalTemplate.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 space-y-3">
              <p className="text-xs text-[#6A665E]">
                {demoModalTemplate.subtitle}
              </p>
              <Link
                href="/invite"
                target="_blank"
                className="w-full py-2.5 rounded-xl bg-[#2D3B36] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>{t('previewInvite')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
