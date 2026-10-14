'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Palette, 
  Users2, 
  Grid2X2 
} from 'lucide-react';
import { DashboardTab } from '../types';
import { useI18n } from '@/shared/i18n/I18nContext';

interface MobileBottomNavProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
}

export function MobileBottomNav({
  currentTab,
  onSelectTab,
}: MobileBottomNavProps) {
  const { t } = useI18n();

  const navItems = [
    {
      id: 'overview' as DashboardTab,
      label: t('overview'),
      icon: LayoutDashboard,
    },
    {
      id: 'editor' as DashboardTab,
      label: t('editor'),
      icon: Palette,
    },
    {
      id: 'guests' as DashboardTab,
      label: t('guests'),
      icon: Users2,
    },
    {
      id: 'seating' as DashboardTab,
      label: t('seating'),
      icon: Grid2X2,
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-lg border-t border-[#E8E5DF] px-3 py-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(45,59,54,0.06)]"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      aria-label="Mobile Navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-150 relative ${
              isActive
                ? 'text-[#2D3B36] font-semibold'
                : 'text-[#8E8A83] hover:text-[#2D3B36]'
            }`}
          >
            {/* Active Pill Indicator */}
            {isActive && (
              <span className="absolute -top-1 w-8 h-1 rounded-full bg-[#C5A880]" />
            )}
            <div
              className={`p-1.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#2D3B36] text-[#FAF9F5] shadow-xs'
                  : 'bg-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] tracking-tight mt-1 leading-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
