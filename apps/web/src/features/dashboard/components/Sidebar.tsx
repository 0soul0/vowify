'use client';

import React from 'react';
import {
  LayoutDashboard,
  Palette,
  Users2,
  Grid2X2,
  Sparkles,
  ExternalLink,
  Heart,
  ChevronRight,
  LogOut,
  CalendarDays,
  FolderHeart,
  X
} from 'lucide-react';
import { DashboardTab, InvitationConfig } from '../types';
import { useI18n } from '../../../shared/i18n/I18nContext';
import { useAuth } from '@/shared/context/AuthContext';
import { LogoutModal } from '@/shared/components/LogoutModal';

interface SidebarProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  config: InvitationConfig;
  daysRemaining: number;
  onPreviewClick: () => void;
  onBackToHub?: () => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  config,
  daysRemaining,
  onPreviewClick,
  onBackToHub,
  isOpenOnMobile,
  onCloseMobile,
}: SidebarProps) {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const navItems = [
    {
      id: 'overview' as DashboardTab,
      label: t('overview'),
      subLabel: 'Overview & Analytics',
      icon: LayoutDashboard,
    },
    {
      id: 'editor' as DashboardTab,
      label: t('editor'),
      subLabel: 'Visual Builder',
      icon: Palette,
      badge: t('liveBadge'),
    },
    {
      id: 'guests' as DashboardTab,
      label: t('guests'),
      subLabel: 'Guest CRM',
      icon: Users2,
    },
    {
      id: 'seating' as DashboardTab,
      label: t('seating'),
      subLabel: 'Seating Planner',
      icon: Grid2X2,
      badge: 'Beta',
    },
  ];

  const handleTabClick = (tab: DashboardTab) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const handleBackToHub = () => {
    if (onCloseMobile) onCloseMobile();
    if (onBackToHub) onBackToHub();
  };

  const renderContent = () => (
    <>
      {/* Top Section */}
      <div>
        {/* Brand Logo */}
        <div className="p-6 border-b border-[#E8E5DF]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2D3B36] flex items-center justify-center text-[#FAF9F5] shadow-sm">
              <Sparkles className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <span className="font-serif text-lg tracking-wider font-semibold text-[#2D3B36] block leading-none">
                VOWIFY
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#8E8A83] font-medium block mt-1">
                Luxury Wedding SaaS
              </span>
            </div>
          </div>

          {/* Wedding Couple Info Card */}
          <div className="mt-5 p-3.5 rounded-xl bg-white border border-[#E8E5DF] shadow-[0_2px_8px_rgba(45,59,54,0.04)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-serif font-medium text-[#2D3B36]">
                <span>{config.groomName.split(' ')[0]}</span>
                <Heart className="w-3 h-3 fill-[#C5A880] text-[#C5A880] inline" />
                <span>{config.brideName.split(' ')[0]}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#2D3B36]/10 text-[#2D3B36]">
                <CalendarDays className="w-3 h-3" />
                D-{daysRemaining > 0 ? daysRemaining : 'Day'}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-[#8E8A83] flex items-center justify-between">
              <span className="truncate">{config.weddingVenue}</span>
            </div>
          </div>

          {/* Back to Projects Hub */}
          {onBackToHub && (
            <button
              onClick={handleBackToHub}
              className="mt-3 w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-[#E8E5DF] hover:border-[#C5A880] text-xs font-medium text-[#2D3B36] transition-colors shadow-2xs"
            >
              <span className="flex items-center gap-2">
                <FolderHeart className="w-3.5 h-3.5 text-[#C5A880]" />
                {t('allProjects')}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] uppercase font-semibold text-[#8E8A83] tracking-wider">
            {t('weddingModules')}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-[#2D3B36] text-[#FAF9F5] shadow-[0_4px_12px_rgba(45,59,54,0.18)]'
                    : 'text-[#4A4844] hover:bg-[#F2EFE9] hover:text-[#2D3B36]'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${isActive ? 'text-[#C5A880]' : 'text-[#8E8A83] group-hover:text-[#2D3B36]'
                      }`}
                  />
                  <div className="text-left">
                    <span className="block leading-tight">{item.label}</span>
                    <span
                      className={`text-[10px] tracking-wide block transition-colors ${isActive ? 'text-[#FAF9F5]/70' : 'text-[#8E8A83]'
                        }`}
                    >
                      {item.subLabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium tracking-tight ${isActive
                          ? 'bg-[#C5A880] text-[#1E2824]'
                          : 'bg-[#EAE5DF] text-[#6A665E]'
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Quick Live Link & Account */}
      <div className="p-4 border-t border-[#E8E5DF]/70 space-y-3">
        {/* Quick Link Card */}
        <button
          onClick={onPreviewClick}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E5DF] hover:border-[#C5A880] text-xs font-medium text-[#2D3B36] transition-all group shadow-xs"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {t('livePreviewLink')}
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-[#8E8A83] group-hover:text-[#2D3B36] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* User profile row */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EAE5DD] border border-[#D9D4CB] flex items-center justify-center text-xs font-medium text-[#2D3B36]">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'EO'}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-[#2D3B36] leading-none truncate max-w-[120px]">
                {user?.name || 'Ethan & Olivia'}
              </p>
              <p className="text-[10px] text-[#8E8A83] mt-0.5">{t('honorPlan')}</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            title={t('logout')}
            className="text-[#8E8A83] hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (lg and above) */}
      <aside className="hidden lg:flex w-72 shrink-0 border-r border-[#E8E5DF] bg-[#FAF9F5] flex-col justify-between min-h-screen select-none sticky top-0 h-screen overflow-y-auto">
        {renderContent()}
      </aside>

      {/* Mobile Drawer (below lg) */}
      {isOpenOnMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#2D3B36]/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onCloseMobile}
          />
          {/* Drawer Panel */}
          <aside className="relative w-72 max-w-[82vw] bg-[#FAF9F5] border-r border-[#E8E5DF] flex flex-col justify-between h-full shadow-2xl z-10 animate-in slide-in-from-left duration-250 select-none overflow-y-auto">
            <div className="absolute top-5 right-4 z-20">
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-xl text-[#8E8A83] hover:text-[#2D3B36] hover:bg-[#EAE5DD] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderContent()}
          </aside>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
      />
    </>
  );
}