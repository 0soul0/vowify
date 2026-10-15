'use client';

import React, { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Music, 
  MapPin, 
  Calendar, 
  Heart, 
  Image as ImageIcon, 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  Volume2, 
  VolumeX, 
  Clock,
  Play,
  Pause,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check
} from 'lucide-react';
import { InvitationConfig, GalleryPhoto, LoveStoryMilestone } from '../types';
import { useI18n } from '../../../shared/i18n/I18nContext';

interface EditorTabProps {
  config: InvitationConfig;
  onUpdateConfig: (newConfig: InvitationConfig) => void;
  onSave: () => void;
  onCopyLink: () => void;
}

export function EditorTab({
  config,
  onUpdateConfig,
  onSave,
  onCopyLink,
}: EditorTabProps) {
  const { t } = useI18n();
  // 視角切換：mobile (手機) 或 desktop (桌面)
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  // 控制面板當前展開的區塊
  const [activeSection, setActiveSection] = useState<string>('cover');
  // 預覽手機內部音樂播放模擬狀態
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  // 藝廊預覽選中照片
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  // 行動端視角切換 (settings 或 preview)
  const [mobileActiveView, setMobileActiveView] = useState<'settings' | 'preview'>('settings');

  // 輔助函式：更新欄位
  const handleChange = <K extends keyof InvitationConfig>(key: K, value: InvitationConfig[K]) => {
    onUpdateConfig({
      ...config,
      [key]: value,
    });
  };

  // 新增藝廊相片
  const handleAddPhoto = () => {
    const newPhoto: GalleryPhoto = {
      id: `g-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      caption: '美好瞬間',
    };
    handleChange('gallery', [...config.gallery, newPhoto]);
  };

  // 刪除藝廊相片
  const handleRemovePhoto = (id: string) => {
    handleChange(
      'gallery',
      config.gallery.filter((p) => p.id !== id)
    );
  };

  // 更新藝廊相片
  const handleUpdatePhoto = (id: string, url: string, caption?: string) => {
    handleChange(
      'gallery',
      config.gallery.map((p) => (p.id === id ? { ...p, url, caption } : p))
    );
  };

  // 新增愛情里程碑
  const handleAddMilestone = () => {
    const newM: LoveStoryMilestone = {
      id: `m-${Date.now()}`,
      year: new Date().getFullYear().toString(),
      title: '新的里程碑',
      description: '寫下屬於你們的珍貴回憶與細節...',
    };
    handleChange('milestones', [...config.milestones, newM]);
  };

  // 刪除里程碑
  const handleRemoveMilestone = (id: string) => {
    handleChange(
      'milestones',
      config.milestones.filter((m) => m.id !== id)
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Mobile View Switcher (< xl) */}
      <div className="xl:hidden w-full flex items-center justify-center">
        <div className="inline-flex p-1 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs">
          <button
            type="button"
            onClick={() => setMobileActiveView('settings')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              mobileActiveView === 'settings'
                ? 'bg-[#2D3B36] text-[#FAF9F5] shadow-xs'
                : 'text-[#6A665E] hover:text-[#2D3B36]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>喜帖設定</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileActiveView('preview')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              mobileActiveView === 'preview'
                ? 'bg-[#2D3B36] text-[#FAF9F5] shadow-xs'
                : 'text-[#6A665E] hover:text-[#2D3B36]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{t('previewInvite')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* =========================================
            LEFT: Section Control Panels (5 Cols)
        ========================================= */}
        <div className={`xl:col-span-5 space-y-4 ${mobileActiveView === 'preview' ? 'hidden xl:block' : 'block'}`}>
        {/* Editor Top Bar with Save */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#C5A880]" />
            <span className="font-serif text-sm font-bold text-[#2D3B36]">
              喜帖頁面區塊控制
            </span>
          </div>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{t('editorSave')}</span>
          </button>
        </div>

        {/* Section 1: 封面與新人姓名 */}
        <div className="rounded-2xl bg-white border border-[#E8E5DF] overflow-hidden shadow-xs transition-all">
          <button
            onClick={() => setActiveSection(activeSection === 'cover' ? '' : 'cover')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF9F5]/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FAF9F5] border border-[#E8E5DF] flex items-center justify-center text-[#2D3B36]">
                <Heart className="w-4 h-4 text-[#C5A880]" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-[#2D3B36]">{t('sectionCover')}</h3>
                <p className="text-[11px] text-[#8E8A83]">喜帖標題、封面照片、浪漫引言</p>
              </div>
            </div>
            {activeSection === 'cover' ? (
              <ChevronUp className="w-4 h-4 text-[#8E8A83]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8E8A83]" />
            )}
          </button>

          {activeSection === 'cover' && (
            <div className="p-4 pt-1 border-t border-[#E8E5DF]/70 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                    新郎姓名 (Groom)
                  </label>
                  <input
                    type="text"
                    value={config.groomName}
                    onChange={(e) => handleChange('groomName', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                    新娘姓名 (Bride)
                  </label>
                  <input
                    type="text"
                    value={config.brideName}
                    onChange={(e) => handleChange('brideName', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                  封面浪漫箴言 / 引言
                </label>
                <input
                  type="text"
                  value={config.coverQuote}
                  onChange={(e) => handleChange('coverQuote', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                  封面照片 URL (高解析直式推薦)
                </label>
                <input
                  type="text"
                  value={config.coverPhotoUrl}
                  onChange={(e) => handleChange('coverPhotoUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white transition-colors"
                />
              </div>

              {/* Theme Palette Switcher */}
              <div>
                <label className="block text-[11px] font-medium text-[#6A665E] mb-1.5">
                  喜帖主視覺氛圍色系
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'forest', name: '沉穩墨綠', color: '#2D3B36' },
                    { id: 'champagne', name: '奢華香檳', color: '#C5A880' },
                    { id: 'rose', name: '莫蘭迪粉', color: '#D4A373' },
                    { id: 'minimal', name: '典雅白沙', color: '#EAE5DD' },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleChange('themeStyle', theme.id as any)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                        config.themeStyle === theme.id
                          ? 'border-[#2D3B36] bg-[#FAF9F5] shadow-xs'
                          : 'border-[#E8E5DF] hover:bg-[#FAF9F5]'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/10"
                        style={{ backgroundColor: theme.color }}
                      />
                      <span className="text-[10px] text-[#4A4844]">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: 婚宴時間與地點 */}
        <div className="rounded-2xl bg-white border border-[#E8E5DF] overflow-hidden shadow-xs transition-all">
          <button
            onClick={() => setActiveSection(activeSection === 'venue' ? '' : 'venue')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF9F5]/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FAF9F5] border border-[#E8E5DF] flex items-center justify-center text-[#2D3B36]">
                <MapPin className="w-4 h-4 text-[#C5A880]" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-[#2D3B36]">{t('sectionVenue')}</h3>
                <p className="text-[11px] text-[#8E8A83]">宴會日期、廳別、交通導航連結</p>
              </div>
            </div>
            {activeSection === 'venue' ? (
              <ChevronUp className="w-4 h-4 text-[#8E8A83]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8E8A83]" />
            )}
          </button>

          {activeSection === 'venue' && (
            <div className="p-4 pt-1 border-t border-[#E8E5DF]/70 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                    婚禮日期 (YYYY-MM-DD)
                  </label>
                  <input
                    type="date"
                    value={config.weddingDate}
                    onChange={(e) => handleChange('weddingDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                    入席時間 (HH:mm)
                  </label>
                  <input
                    type="text"
                    value={config.weddingTime}
                    onChange={(e) => handleChange('weddingTime', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                  飯店 / 宴會場所名稱
                </label>
                <input
                  type="text"
                  value={config.weddingVenue}
                  onChange={(e) => handleChange('weddingVenue', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                  宴會廳別 (例如：5F 萬豪廳)
                </label>
                <input
                  type="text"
                  value={config.banquetHall}
                  onChange={(e) => handleChange('banquetHall', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                  詳細地址 (供賓客導航)
                </label>
                <input
                  type="text"
                  value={config.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 3: 愛情故事 */}
        <div className="rounded-2xl bg-white border border-[#E8E5DF] overflow-hidden shadow-xs transition-all">
          <button
            onClick={() => setActiveSection(activeSection === 'story' ? '' : 'story')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF9F5]/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FAF9F5] border border-[#E8E5DF] flex items-center justify-center text-[#2D3B36]">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-[#2D3B36]">{t('sectionStory')}</h3>
                <p className="text-[11px] text-[#8E8A83]">相識歷程、重要里程碑記述</p>
              </div>
            </div>
            {activeSection === 'story' ? (
              <ChevronUp className="w-4 h-4 text-[#8E8A83]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8E8A83]" />
            )}
          </button>

          {activeSection === 'story' && (
            <div className="p-4 pt-1 border-t border-[#E8E5DF]/70 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                  故事專題標題
                </label>
                <input
                  type="text"
                  value={config.storyTitle}
                  onChange={(e) => handleChange('storyTitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                  故事感言內文
                </label>
                <textarea
                  rows={3}
                  value={config.storyDescription}
                  onChange={(e) => handleChange('storyDescription', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white leading-relaxed"
                />
              </div>

              {/* Milestones list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-[#6A665E]">
                    愛情旅程時間軸 ({config.milestones.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="inline-flex items-center gap-1 text-[11px] text-[#2D3B36] hover:text-[#C5A880] font-medium"
                  >
                    <Plus className="w-3 h-3" />
                    新增里程碑
                  </button>
                </div>

                <div className="space-y-2">
                  {config.milestones.map((m, index) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={m.year}
                          onChange={(e) => {
                            const newM = [...config.milestones];
                            newM[index].year = e.target.value;
                            handleChange('milestones', newM);
                          }}
                          className="w-16 px-2 py-1 text-xs rounded-lg bg-white border border-[#E8E5DF] font-semibold text-[#2D3B36]"
                          placeholder="年份"
                        />
                        <input
                          type="text"
                          value={m.title}
                          onChange={(e) => {
                            const newM = [...config.milestones];
                            newM[index].title = e.target.value;
                            handleChange('milestones', newM);
                          }}
                          className="flex-1 px-2 py-1 text-xs rounded-lg bg-white border border-[#E8E5DF] text-[#2D3B36]"
                          placeholder="事件標題"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(m.id)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={m.description}
                        onChange={(e) => {
                          const newM = [...config.milestones];
                          newM[index].description = e.target.value;
                          handleChange('milestones', newM);
                        }}
                        className="w-full px-2 py-1 text-xs rounded-lg bg-white border border-[#E8E5DF] text-stone-600"
                        placeholder="詳細描述"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: 婚紗藝廊相簿 */}
        <div className="rounded-2xl bg-white border border-[#E8E5DF] overflow-hidden shadow-xs transition-all">
          <button
            onClick={() => setActiveSection(activeSection === 'gallery' ? '' : 'gallery')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF9F5]/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FAF9F5] border border-[#E8E5DF] flex items-center justify-center text-[#2D3B36]">
                <ImageIcon className="w-4 h-4 text-[#C5A880]" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-[#2D3B36]">{t('sectionGallery')}</h3>
                <p className="text-[11px] text-[#8E8A83]">已上傳 {config.gallery.length} 張精選婚紗照</p>
              </div>
            </div>
            {activeSection === 'gallery' ? (
              <ChevronUp className="w-4 h-4 text-[#8E8A83]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8E8A83]" />
            )}
          </button>

          {activeSection === 'gallery' && (
            <div className="p-4 pt-1 border-t border-[#E8E5DF]/70 space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#8E8A83]">
                  建議使用 4:5 或 16:9 優質婚紗圖檔
                </span>
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="inline-flex items-center gap-1 text-[11px] text-[#2D3B36] hover:text-[#C5A880] font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  新增照片
                </button>
              </div>

              <div className="space-y-2.5">
                {config.gallery.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF]"
                  >
                    {/* Thumbnail */}
                    <img
                      src={photo.url}
                      alt="Thumbnail"
                      className="w-12 h-12 rounded-lg object-cover border border-[#E8E5DF] shrink-0"
                    />
                    <div className="flex-1 space-y-1 min-w-0">
                      <input
                        type="text"
                        value={photo.url}
                        onChange={(e) =>
                          handleUpdatePhoto(photo.id, e.target.value, photo.caption)
                        }
                        className="w-full px-2 py-1 text-[11px] rounded bg-white border border-[#E8E5DF] text-[#2D3B36] truncate"
                        placeholder="圖片網址 URL"
                      />
                      <input
                        type="text"
                        value={photo.caption || ''}
                        onChange={(e) =>
                          handleUpdatePhoto(photo.id, photo.url, e.target.value)
                        }
                        className="w-full px-2 py-0.5 text-[10px] rounded bg-white border border-[#E8E5DF] text-[#6A665E]"
                        placeholder="圖片圖說 (可選)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 shrink-0"
                      title="刪除照片"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 5: 背景音樂與 RSVP 設定 */}
        <div className="rounded-2xl bg-white border border-[#E8E5DF] overflow-hidden shadow-xs transition-all">
          <button
            onClick={() => setActiveSection(activeSection === 'audio' ? '' : 'audio')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF9F5]/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FAF9F5] border border-[#E8E5DF] flex items-center justify-center text-[#2D3B36]">
                <Music className="w-4 h-4 text-[#C5A880]" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-[#2D3B36]">{t('sectionAudio')}</h3>
                <p className="text-[11px] text-[#8E8A83]">自動播放、音樂曲目、截止日期設定</p>
              </div>
            </div>
            {activeSection === 'audio' ? (
              <ChevronUp className="w-4 h-4 text-[#8E8A83]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8E8A83]" />
            )}
          </button>

          {activeSection === 'audio' && (
            <div className="p-4 pt-1 border-t border-[#E8E5DF]/70 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                  背景音樂曲名 (BGM Title)
                </label>
                <input
                  type="text"
                  value={config.musicTitle}
                  onChange={(e) => handleChange('musicTitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                  音訊 MP3 連結 (Direct URL)
                </label>
                <input
                  type="text"
                  value={config.musicUrl}
                  onChange={(e) => handleChange('musicUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                />
              </div>

              <div className="pt-2 border-t border-[#E8E5DF]/70">
                <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                  RSVP 回覆截止日
                </label>
                <input
                  type="date"
                  value={config.rsvpDeadline}
                  onChange={(e) => handleChange('rsvpDeadline', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                  溫馨提醒小語
                </label>
                <textarea
                  rows={2}
                  value={config.rsvpNotice}
                  onChange={(e) => handleChange('rsvpNotice', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          RIGHT: WYSIWYG Mockup Live Preview (7 Cols)
      ========================================= */}
      <div className={`xl:col-span-7 flex flex-col items-center ${mobileActiveView === 'settings' ? 'hidden xl:flex' : 'flex'}`}>
        {/* Device Switcher Bar */}
        <div className="w-full max-w-md flex items-center justify-between mb-4 px-4 py-2 rounded-full bg-white border border-[#E8E5DF] shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-[#2D3B36]">{t('liveSync')}</span>
          </div>

          <div className="flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-full border border-[#E8E5DF]">
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                previewDevice === 'mobile'
                  ? 'bg-[#2D3B36] text-[#FAF9F5] shadow-xs'
                  : 'text-[#8E8A83] hover:text-[#2D3B36]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t('mobileView')}</span>
            </button>
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                previewDevice === 'desktop'
                  ? 'bg-[#2D3B36] text-[#FAF9F5] shadow-xs'
                  : 'text-[#8E8A83] hover:text-[#2D3B36]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{t('desktopView')}</span>
            </button>
          </div>
        </div>

        {/* =========================================
            iPhone 15 Pro Mockup Frame
        ========================================= */}
        <div
          className={`transition-all duration-300 ${
            previewDevice === 'mobile'
              ? 'w-full max-w-[340px] sm:max-w-[390px] h-[680px] sm:h-[780px]'
              : 'w-full max-w-2xl h-[680px] sm:h-[780px]'
          } rounded-[36px] sm:rounded-[44px] p-2.5 sm:p-3 bg-stone-900 border-[6px] sm:border-[7px] border-stone-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] relative flex flex-col`}
        >
          {/* Dynamic Island / Speaker Pill */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-800 border border-stone-700/50" />
            <span className="w-2 h-2 rounded-full bg-blue-950/60" />
          </div>

          {/* Screen Content Wrapper (Scrollable Inner Wedding Invitation) */}
          <div className="w-full h-full rounded-[34px] overflow-y-auto bg-[#F9F8F6] text-[#2D3B36] relative flex flex-col select-none scrollbar-none">
            {/* Floating Music Control Badge in Invitation */}
            <div className="sticky top-4 right-4 z-20 self-end mr-4">
              <button
                onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#E8E5DF] shadow-md text-[11px] font-medium text-[#2D3B36] transition-transform active:scale-95"
              >
                {isPlayingMusic ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#C5A880] animate-bounce" />
                    <span className="truncate max-w-[90px]">{config.musicTitle}</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                    <span>播放配樂</span>
                  </>
                )}
              </button>
            </div>

            {/* 1. Cover Hero Section */}
            <div className="relative min-h-[460px] flex flex-col justify-end p-6 text-white overflow-hidden shrink-0">
              {/* Cover Image Background */}
              <img
                src={config.coverPhotoUrl}
                alt="Wedding Cover"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.82] transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

              {/* Cover Typography */}
              <div className="relative z-10 text-center space-y-3 pb-2">
                <span className="text-[11px] uppercase tracking-[0.3em] text-[#C5A880] font-medium block">
                  Wedding Invitation
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl tracking-wide font-normal text-white">
                  {config.groomName.split(' ')[0]}
                  <span className="text-[#C5A880] font-light mx-2">&</span>
                  {config.brideName.split(' ')[0]}
                </h1>
                <p className="text-xs text-white/90 italic font-serif px-4 line-clamp-2">
                  {config.coverQuote}
                </p>

                <div className="pt-2 flex items-center justify-center gap-2 text-xs font-sans text-white/80">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{config.weddingDate}</span>
                  <span>•</span>
                  <span>{config.weddingTime}</span>
                </div>
              </div>
            </div>

            {/* 2. Venue & Schedule Section */}
            <div className="p-6 text-center space-y-4 bg-white border-b border-[#E8E5DF]">
              <div className="inline-block px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E8E5DF] text-[10px] uppercase tracking-widest text-[#8E8A83] font-medium">
                Wedding Ceremony & Banquet
              </div>

              <div className="space-y-1">
                <h2 className="font-serif text-lg font-bold text-[#2D3B36]">
                  {config.weddingVenue}
                </h2>
                <p className="text-xs text-[#C5A880] font-medium">
                  {config.banquetHall}
                </p>
                <p className="text-xs text-stone-500 pt-1 flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  {config.address}
                </p>
              </div>

              <a
                href={config.googleMapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF9F5] border border-[#E8E5DF] text-xs font-medium text-[#2D3B36] hover:bg-[#F2EFE9] transition-colors"
              >
                <span>查看 Google 地圖導航</span>
                <ExternalLink className="w-3 h-3 text-[#C5A880]" />
              </a>
            </div>

            {/* 3. Love Story Section */}
            <div className="p-6 bg-[#FAF9F5] space-y-5 border-b border-[#E8E5DF]">
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                  Our Journey
                </span>
                <h3 className="font-serif text-xl font-bold text-[#2D3B36]">
                  {config.storyTitle}
                </h3>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed font-sans text-center px-2">
                {config.storyDescription}
              </p>

              {/* Milestones timeline */}
              <div className="space-y-3 pt-2">
                {config.milestones.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E8E5DF]/70 text-left shadow-2xs"
                  >
                    <span className="text-xs font-bold text-[#C5A880] font-serif shrink-0 pt-0.5">
                      {m.year}
                    </span>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-semibold text-[#2D3B36]">
                        {m.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 leading-snug">
                        {m.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Wedding Gallery Preview */}
            <div className="p-6 bg-white space-y-4 border-b border-[#E8E5DF]">
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                  Memories
                </span>
                <h3 className="font-serif text-lg font-bold text-[#2D3B36]">
                  婚紗相片藝廊
                </h3>
              </div>

              {/* Main Photo Viewer */}
              {config.gallery.length > 0 && (
                <div className="space-y-2">
                  <div className="aspect-4/3 rounded-2xl overflow-hidden border border-[#E8E5DF] relative">
                    <img
                      src={config.gallery[selectedPhotoIndex]?.url || config.coverPhotoUrl}
                      alt="Gallery Feature"
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                    {config.gallery[selectedPhotoIndex]?.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-[11px] text-center">
                        {config.gallery[selectedPhotoIndex].caption}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {config.gallery.map((photo, i) => (
                      <button
                        key={photo.id}
                        onClick={() => setSelectedPhotoIndex(i)}
                        className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          selectedPhotoIndex === i
                            ? 'border-[#2D3B36] scale-105 shadow-xs'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt="thumb"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. RSVP Simulation Section */}
            <div className="p-6 bg-[#FAF9F5] text-center space-y-4">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-[#2D3B36]">
                  出席意願回覆 (RSVP)
                </h3>
                <p className="text-xs text-stone-500">
                  敬請於 {config.rsvpDeadline} 前填寫，讓我們為您準備席位
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF] text-left space-y-3">
                <div>
                  <span className="block text-[11px] font-medium text-stone-500 mb-1">
                    賓客姓名
                  </span>
                  <div className="px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#E8E5DF] text-xs text-stone-400">
                    王小明
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 py-2 text-center text-xs rounded-lg bg-[#2D3B36] text-[#FAF9F5] font-medium">
                    開心出席
                  </div>
                  <div className="flex-1 py-2 text-center text-xs rounded-lg bg-[#FAF9F5] border border-[#E8E5DF] text-stone-500">
                    遺憾婉拒
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-[#C5A880] text-[#1E2824] text-xs font-semibold shadow-xs"
                >
                  送出 RSVP 回覆（預覽）
                </button>
              </div>

              <p className="text-[10px] text-stone-400 pb-4">
                © {new Date().getFullYear()} Vowify Luxury Digital Invitation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
