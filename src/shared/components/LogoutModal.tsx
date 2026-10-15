'use client';

import React, { useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { Portal } from './Portal';
import { useI18n } from '@/shared/i18n/I18nContext';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  const { t } = useI18n();

  // 監聽鍵盤 ESC 關閉 & 鎖定背景捲動
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 grid place-items-center p-4 bg-transparent"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        {/* Fullscreen Backdrop */}
        <div className="fixed inset-0 bg-[#2D3B36]/35 backdrop-blur-xs pointer-events-none animate-in fade-in duration-200" />

        {/* Modal Card (100% 居中於螢幕正中央) */}
        <div
          className="relative bg-white border border-[#E8E5DF] rounded-3xl p-6 sm:p-8 shadow-[0_24px_60px_rgba(45,59,54,0.18)] max-w-sm w-full animate-in zoom-in-95 fade-in duration-200 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Danger Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shadow-xs">
              <LogOut className="w-6 h-6 text-rose-500" />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-2 mb-7">
            <h2
              id="logout-modal-title"
              className="font-serif text-lg font-bold text-[#2D3B36]"
            >
              {t('logoutConfirmTitle')}
            </h2>
            <p className="text-xs text-[#8E8A83] leading-relaxed max-w-xs mx-auto">
              {t('logoutConfirmDesc')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                onClose();
                onConfirm();
              }}
              className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('logoutConfirm')}</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#F2EFE9] hover:bg-[#EAE5DF] text-[#4A4844] text-xs font-medium transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
