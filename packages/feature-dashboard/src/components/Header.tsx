'use client';

import React from 'react';
import { 
  Copy, 
  ExternalLink, 
  Bell, 
  Check, 
  Globe2, 
  Sparkles,
  Download
} from 'lucide-react';
import { DashboardTab, InvitationConfig } from '../types';

interface HeaderProps {
  currentTab: DashboardTab;
  config: InvitationConfig;
  daysRemaining: number;
  onCopyLink: () => void;
  onPreview: () => void;
  onExport: () => void;
  onTogglePublish: () => void;
  isCopied: boolean;
}

const tabTitles: Record<DashboardTab, { title: string; subtitle: string }> = {
  overview: {
    title: '籌備總覽',
    subtitle: '掌握婚宴籌備即時數據、RSVP出席動態與核心進度',
  },
  editor: {
    title: '喜帖視覺編輯器',
    subtitle: '所見即所得（WYSIWYG），客製化新人專屬極簡電子喜帖',
  },
  guests: {
    title: '賓客與 RSVP 管理',
    subtitle: '掌握賓客出席意願、特殊飲食需求、兒童椅與祝福賀詞',
  },
  seating: {
    title: '桌次座位安排',
    subtitle: '視覺化桌次規劃、賓客快速入座與桌長指定（Beta）',
  },
};

export function Header({
  currentTab,
  config,
  daysRemaining,
  onCopyLink,
  onPreview,
  onExport,
  onTogglePublish,
  isCopied,
}: HeaderProps) {
  const info = tabTitles[currentTab];

  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E8E5DF] px-8 py-4 flex items-center justify-between transition-all">
      {/* Left: Tab Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#8E8A83] mb-1">
          <span>婚禮管理後台</span>
          <span>/</span>
          <span className="text-[#2D3B36] font-medium">{info.title}</span>
        </div>
        <h1 className="text-xl font-serif font-bold text-[#2D3B36] tracking-tight">
          {info.title}
        </h1>
        <p className="text-xs text-[#6A665E] hidden sm:block mt-0.5">
          {info.subtitle}
        </p>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2.5">
        {/* Publish Status Toggle */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8E5DF] text-xs">
          <Globe2 className="w-3.5 h-3.5 text-[#8E8A83]" />
          <span className="text-[#6A665E]">喜帖狀態：</span>
          <button
            onClick={onTogglePublish}
            className={`inline-flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full text-[11px] transition-colors ${
              config.isPublished
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                config.isPublished ? 'bg-emerald-500' : 'bg-stone-400'
              }`}
            />
            {config.isPublished ? '已發布上線' : '草稿狀態'}
          </button>
        </div>

        {/* Copy Link Button */}
        <button
          onClick={onCopyLink}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
            isCopied
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-white border-[#E8E5DF] text-[#2D3B36] hover:border-[#C5A880] hover:bg-[#FAF9F5]'
          }`}
          title="複製電子喜帖專屬網址"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>已複製連結</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#8E8A83]" />
              <span>複製喜帖連結</span>
            </>
          )}
        </button>

        {/* Live Preview Button */}
        <button
          onClick={onPreview}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#2D3B36] text-[#FAF9F5] hover:bg-[#1E2824] shadow-xs transition-colors"
          title="預覽完整喜帖網頁"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>預覽喜帖</span>
        </button>

        {/* Export Button (Shows on Overview & Guests) */}
        {(currentTab === 'overview' || currentTab === 'guests') && (
          <button
            onClick={onExport}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white border border-[#E8E5DF] text-[#2D3B36] hover:bg-[#F2EFE9] transition-colors"
            title="匯出賓客名單 CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#8E8A83]" />
            <span>匯出名單</span>
          </button>
        )}
      </div>
    </header>
  );
}
