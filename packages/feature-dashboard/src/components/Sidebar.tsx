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
  CalendarDays
} from 'lucide-react';
import { DashboardTab, InvitationConfig } from '../types';

interface SidebarProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  config: InvitationConfig;
  daysRemaining: number;
  onPreviewClick: () => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  config,
  daysRemaining,
  onPreviewClick,
}: SidebarProps) {
  const navItems = [
    {
      id: 'overview' as DashboardTab,
      label: '總覽首頁',
      subLabel: 'Overview & Analytics',
      icon: LayoutDashboard,
    },
    {
      id: 'editor' as DashboardTab,
      label: '喜帖編輯器',
      subLabel: 'Visual Builder',
      icon: Palette,
      badge: '即時預覽',
    },
    {
      id: 'guests' as DashboardTab,
      label: '賓客與 RSVP',
      subLabel: 'Guest CRM',
      icon: Users2,
    },
    {
      id: 'seating' as DashboardTab,
      label: '桌次座位安排',
      subLabel: 'Seating Planner',
      icon: Grid2X2,
      badge: 'Beta',
    },
  ];

  return (
    <aside className="w-72 shrink-0 border-r border-[#E8E5DF] bg-[#FAF9F5] flex flex-col justify-between min-h-screen select-none">
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
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] uppercase font-semibold text-[#8E8A83] tracking-wider">
            婚禮管理模組
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#2D3B36] text-[#FAF9F5] shadow-[0_4px_12px_rgba(45,59,54,0.18)]'
                    : 'text-[#4A4844] hover:bg-[#F2EFE9] hover:text-[#2D3B36]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#C5A880]' : 'text-[#8E8A83] group-hover:text-[#2D3B36]'
                    }`}
                  />
                  <div className="text-left">
                    <span className="block leading-tight">{item.label}</span>
                    <span
                      className={`text-[10px] tracking-wide block transition-colors ${
                        isActive ? 'text-[#FAF9F5]/70' : 'text-[#8E8A83]'
                      }`}
                    >
                      {item.subLabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium tracking-tight ${
                        isActive
                          ? 'bg-[#C5A880] text-[#1E2824]'
                          : 'bg-[#EAE5DD] text-[#6A665E]'
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
            喜帖在線預覽
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-[#8E8A83] group-hover:text-[#2D3B36] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* User profile row */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EAE5DD] border border-[#D9D4CB] flex items-center justify-center text-xs font-medium text-[#2D3B36]">
              EO
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-[#2D3B36] leading-none">Ethan & Olivia</p>
              <p className="text-[10px] text-[#8E8A83] mt-0.5">尊榮婚禮方案</p>
            </div>
          </div>
          <button
            title="登出帳號"
            className="text-[#8E8A83] hover:text-stone-700 p-1.5 rounded-lg hover:bg-[#F2EFE9] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
