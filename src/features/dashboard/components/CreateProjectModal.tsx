'use client';

import React, { useState } from 'react';
import { X, Sparkles, Calendar, Heart, Building, ArrowRight } from 'lucide-react';
import { WeddingProject, InvitationConfig } from '../types';
import { initialInvitationConfig } from '../mockData';
import { useI18n } from '../../../shared/i18n/I18nContext';
import { Portal } from '@/shared/components/Portal';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: WeddingProject) => void;
}

export function CreateProjectModal({ isOpen, onClose, onCreate }: CreateProjectModalProps) {
  const { t } = useI18n();
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [weddingDate, setWeddingDate] = useState('2027-05-20');
  const [weddingVenue, setWeddingVenue] = useState('台北寒舍艾美酒店');
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groomName.trim() || !brideName.trim()) return;

    const projectTitle = title.trim() || `${groomName} & ${brideName} 幸福婚禮`;
    const newConfig: InvitationConfig = {
      ...initialInvitationConfig,
      id: `inv-${Date.now()}`,
      title: projectTitle,
      slug: `${groomName.toLowerCase()}-and-${brideName.toLowerCase()}-${new Date().getFullYear()}`.replace(/\s+/g, '-'),
      groomName: groomName.trim(),
      brideName: brideName.trim(),
      weddingDate,
      weddingVenue: weddingVenue.trim() || '台北精選婚宴會館',
      isPublished: false,
    };

    const newProject: WeddingProject = {
      id: `proj-${Date.now()}`,
      title: projectTitle,
      groomName: groomName.trim(),
      brideName: brideName.trim(),
      weddingDate,
      weddingVenue: weddingVenue.trim() || '台北精選婚宴會館',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=85&w=800',
      isPublished: false,
      slug: newConfig.slug,
      invitationConfig: newConfig,
      guests: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onCreate(newProject);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="w-full max-w-lg rounded-3xl bg-white border border-[#E8E5DF] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E8E5DF] bg-[#FAF9F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2D3B36] flex items-center justify-center text-[#C5A880]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2D3B36]">
                {t('newProject')}
              </h3>
              <p className="text-xs text-[#8E8A83]">填寫基本資訊，即可快速開啟後台管理</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Couple Names (Required) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                {t('groomNameLabel')} *
              </label>
              <input
                type="text"
                required
                placeholder="例：陳小明"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                {t('brideNameLabel')} *
              </label>
              <input
                type="text"
                required
                placeholder="例：林美麗"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white text-xs"
              />
            </div>
          </div>

          {/* Wedding Date */}
          <div>
            <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
              {t('weddingDateLabel')} *
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white text-xs"
              />
            </div>
          </div>

          {/* Project Title / Nickname */}
          <div>
            <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
              {t('projectTitleLabel')}
            </label>
            <input
              type="text"
              placeholder="例：台北寒舍艾美婚宴 / 高雄歸寧宴"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white text-xs"
            />
          </div>

          {/* Venue (Optional) */}
          <div>
            <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
              {t('venueLabel')}
            </label>
            <input
              type="text"
              placeholder="例：台北寒舍艾美酒店 3F 琥珀廳"
              value={weddingVenue}
              onChange={(e) => setWeddingVenue(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white text-xs"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E5DF]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E8E5DF] text-stone-600 hover:bg-[#FAF9F5] transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] font-medium shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>{t('createAndEnter')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </Portal>
);
}
