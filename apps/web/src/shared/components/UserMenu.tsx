'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '@/shared/context/AuthContext';
import { useI18n } from '@/shared/i18n/I18nContext';
import { LogoutModal } from './LogoutModal';

export function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [open, setOpen] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const avatarText = user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME';

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-[#F2EFE9] border border-transparent hover:border-[#E8E5DF] transition-all group"
          aria-label="User menu"
        >
          {/* Avatar circle */}
          <div className="w-7 h-7 rounded-full bg-[#2D3B36] flex items-center justify-center text-[#C5A880] text-[10px] font-bold shrink-0 shadow-sm">
            {avatarText}
          </div>
          <span className="hidden sm:block text-xs font-medium text-[#2D3B36] max-w-[96px] truncate leading-none">
            {user?.name || '—'}
          </span>
          <ChevronDown
            className={`w-3 h-3 text-[#8E8A83] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown panel */}
        {open && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E8E5DF] rounded-2xl shadow-[0_12px_35px_rgba(45,59,54,0.10)] overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-150">
            {/* User info header */}
            <div className="px-4 py-3.5 bg-[#FAF9F5] border-b border-[#E8E5DF]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2D3B36] flex items-center justify-center text-[#C5A880] text-[10px] font-bold shrink-0">
                  {avatarText}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#2D3B36] truncate leading-tight">
                    {user?.name || '—'}
                  </p>
                  <p className="text-[10px] text-[#8E8A83] truncate mt-0.5">
                    {user?.email || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-1.5 space-y-0.5">
              <Link
                href="/user"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-[#2D3B36] hover:bg-[#F2EFE9] transition-colors w-full"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#8E8A83]" />
                {t('userAreaTitle')}
              </Link>

              <div className="h-px bg-[#E8E5DF] my-1" />

              <button
                onClick={() => {
                  setOpen(false);
                  setShowLogoutModal(true);
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors w-full text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t('logout')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Logout Confirm Modal ─── */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
      />
    </>
  );
}
