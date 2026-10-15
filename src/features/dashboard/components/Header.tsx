'use client';

import React from 'react';
import { 
  Copy, 
  ExternalLink, 
  Check, 
  Globe2, 
  Download,
  Menu
} from 'lucide-react';
import { DashboardTab, InvitationConfig, WeddingProject } from '../types';
import { ProjectSwitcher } from './ProjectSwitcher';
import { useI18n, LanguageSwitcher } from '@/shared/i18n/I18nContext';
import { UserMenu } from '@/shared/components/UserMenu';

interface HeaderProps {
  currentTab: DashboardTab;
  config: InvitationConfig;
  daysRemaining: number;
  projects: WeddingProject[];
  currentProjectId: string;
  onSelectProject: (id: string) => void;
  onOpenCreateModal: () => void;
  onBackToHub: () => void;
  onCopyLink: () => void;
  onPreview: () => void;
  onExport: () => void;
  onTogglePublish: () => void;
  isCopied: boolean;
  onOpenMobileMenu?: () => void;
}

export function Header({
  currentTab,
  config,
  daysRemaining,
  projects,
  currentProjectId,
  onSelectProject,
  onOpenCreateModal,
  onBackToHub,
  onCopyLink,
  onPreview,
  onExport,
  onTogglePublish,
  isCopied,
  onOpenMobileMenu,
}: HeaderProps) {
  const { t } = useI18n();

  const tabTitles: Record<DashboardTab, { title: string; subtitle: string }> = {
    overview: {
      title: t('overview'),
      subtitle: t('overviewDesc'),
    },
    editor: {
      title: t('editor'),
      subtitle: t('editorDesc'),
    },
    guests: {
      title: t('guests'),
      subtitle: t('guestsDesc'),
    },
    seating: {
      title: t('seating'),
      subtitle: t('seatingDesc'),
    },
  };

  const info = tabTitles[currentTab];

  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E8E5DF] px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between transition-all">
      {/* Left: Hamburger (Mobile) + Project Switcher & Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 -ml-1 rounded-xl text-[#2D3B36] hover:bg-[#EAE5DD] transition-colors shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Project Switcher Dropdown */}
        <ProjectSwitcher
          projects={projects}
          currentProjectId={currentProjectId}
          onSelectProject={onSelectProject}
          onOpenCreateModal={onOpenCreateModal}
          onBackToHub={onBackToHub}
        />

        <div className="h-6 w-px bg-[#E8E5DF] hidden sm:block shrink-0" />

        <div className="hidden sm:block min-w-0">
          <div className="flex items-center gap-2 text-xs text-[#8E8A83]">
            <span>VOWIFY</span>
            <span>/</span>
            <span className="text-[#2D3B36] font-medium truncate">{info.title}</span>
          </div>
          <h1 className="text-base font-serif font-bold text-[#2D3B36] tracking-tight leading-tight truncate">
            {info.title}
          </h1>
        </div>
      </div>

      {/* Right: Actions & Language Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <LanguageSwitcher />

        {/* Publish Status Toggle */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8E5DF] text-xs">
          <Globe2 className="w-3.5 h-3.5 text-[#8E8A83]" />
          <span className="text-[#6A665E]">{t('status')}：</span>
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
            {config.isPublished ? t('published') : t('draft')}
          </button>
        </div>

        {/* Copy Link Button */}
        <button
          onClick={onCopyLink}
          className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            isCopied
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-white border-[#E8E5DF] text-[#2D3B36] hover:border-[#C5A880] hover:bg-[#FAF9F5]'
          }`}
          title="複製電子喜帖專屬網址"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">{t('copied')}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#8E8A83]" />
              <span className="hidden sm:inline">{t('copyLink')}</span>
            </>
          )}
        </button>

        {/* Live Preview Button */}
        <button
          onClick={onPreview}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-medium bg-[#2D3B36] text-[#FAF9F5] hover:bg-[#1E2824] shadow-xs transition-colors"
          title="預覽完整喜帖網頁"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#C5A880]" />
          <span className="hidden sm:inline">{t('previewInvite')}</span>
        </button>

        {/* Export Button */}
        {(currentTab === 'overview' || currentTab === 'guests') && (
          <button
            onClick={onExport}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-[#E8E5DF] text-[#2D3B36] hover:bg-[#F2EFE9] transition-colors"
            title="匯出賓客名單 CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#8E8A83]" />
            <span>{t('exportList')}</span>
          </button>
        )}

        <div className="h-5 w-px bg-[#E8E5DF] mx-0.5" />
        <UserMenu />
      </div>
    </header>
  );
}
