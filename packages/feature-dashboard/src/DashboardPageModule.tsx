'use client';

import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { EditorTab } from './components/EditorTab';
import { GuestsTab } from './components/GuestsTab';
import { SeatingTab } from './components/SeatingTab';
import { ToastContainer } from './components/Toast';
import { initialInvitationConfig, initialGuests } from './mockData';
import { DashboardTab, Guest, InvitationConfig, ToastMessage, AttendanceStatus } from './types';

export function DashboardPageModule() {
  const [currentTab, setCurrentTab] = useState<DashboardTab>('overview');
  const [config, setConfig] = useState<InvitationConfig>(initialInvitationConfig);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  // Helper: 新增精緻 Toast
  const addToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'error' = 'success'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 計算婚禮倒數天數
  const daysRemaining = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(config.weddingDate);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [config.weddingDate]);

  // 1. 複製喜帖連結
  const handleCopyLink = () => {
    const publicUrl = `https://vowify.io/i/${config.slug}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(publicUrl);
    }
    setIsCopied(true);
    addToast('喜帖網址已複製到剪貼簿', publicUrl, 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  // 2. 線上預覽喜帖
  const handlePreview = () => {
    setCurrentTab('editor');
    addToast('已切換至即時預覽模式', '您可以在右側檢視手機效果並即時調試文案', 'info');
  };

  // 3. 匯出 Excel / CSV (含 UTF-8 BOM，Excel 中文不亂碼)
  const handleExportCsv = () => {
    const headers = [
      '賓客姓名',
      '聯絡電話',
      '出席狀態',
      '出席席次人數',
      '是否素食',
      '素食數量',
      '是否需要兒童椅',
      '兒童椅數量',
      '親友歸屬',
      '排定桌號',
      '祝福賀詞',
      '回覆登記時間',
    ];

    const rows = guests.map((g) => {
      const statusText =
        g.status === 'attending'
          ? '確認出席'
          : g.status === 'declined'
          ? '遺憾婉拒'
          : '尚未回覆';

      const relationText =
        g.relation === 'groom'
          ? '男方親友'
          : g.relation === 'bride'
          ? '女方親友'
          : g.relation === 'family'
          ? '至親長輩'
          : '共同好友';

      const cleanMessage = (g.message || '').replace(/"/g, '""');

      return [
        `"${g.name}"`,
        `"${g.phone}"`,
        `"${statusText}"`,
        g.attendeesCount,
        g.isVegetarian ? '是' : '否',
        g.vegetarianCount || (g.isVegetarian ? 1 : 0),
        g.needBabyChair ? '是' : '否',
        g.babyChairCount || (g.needBabyChair ? 1 : 0),
        `"${relationText}"`,
        `"${g.tableNumber || '未排定'}"`,
        `"${cleanMessage}"`,
        `"${g.createdAt}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${config.groomName}_${config.brideName}_婚禮賓客名單_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('賓客名冊 CSV 匯出成功', '已自動下載包含完整飲食需求與祝福留言的名單', 'success');
  };

  // 4. 切換喜帖發布狀態
  const handleTogglePublish = () => {
    const nextState = !config.isPublished;
    setConfig((prev) => ({ ...prev, isPublished: nextState }));
    addToast(
      nextState ? '喜帖已發布上線' : '喜帖已轉為私密草稿',
      nextState ? '親友現在可以透過連結瀏覽喜帖與填寫 RSVP' : '外網連結暫時關閉',
      'info'
    );
  };

  // 5. 儲存喜帖設定
  const handleSaveConfig = () => {
    addToast('喜帖內容儲存成功', '所有修改已即時同步至雲端與手機端預覽', 'success');
  };

  // 6. 新增賓客
  const handleAddGuest = (newGuestData: Omit<Guest, 'id' | 'createdAt'>) => {
    const newGuest: Guest = {
      ...newGuestData,
      id: `gst-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setGuests((prev) => [newGuest, ...prev]);
    addToast(`已新增賓客：${newGuest.name}`, `出席狀態：${newGuest.status === 'attending' ? '確認出席' : '待定'}`, 'success');
  };

  // 7. 更新賓客狀態
  const handleUpdateGuestStatus = (id: string, status: AttendanceStatus) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status } : g))
    );
    addToast('賓客出席狀態已更新', undefined, 'info');
  };

  // 8. 刪除賓客
  const handleDeleteGuest = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
    addToast('賓客資料已移除', undefined, 'info');
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2D3B36] flex">
      {/* 側邊欄 Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        config={config}
        daysRemaining={daysRemaining}
        onPreviewClick={handlePreview}
      />

      {/* 主要內容區域 Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          config={config}
          daysRemaining={daysRemaining}
          onCopyLink={handleCopyLink}
          onPreview={handlePreview}
          onExport={handleExportCsv}
          onTogglePublish={handleTogglePublish}
          isCopied={isCopied}
        />

        {/* 頁面分頁內容 */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <OverviewTab
              config={config}
              guests={guests}
              daysRemaining={daysRemaining}
              onSelectTab={setCurrentTab}
              onCopyLink={handleCopyLink}
              onPreview={handlePreview}
              onExport={handleExportCsv}
            />
          )}

          {currentTab === 'editor' && (
            <EditorTab
              config={config}
              onUpdateConfig={setConfig}
              onSave={handleSaveConfig}
              onCopyLink={handleCopyLink}
            />
          )}

          {currentTab === 'guests' && (
            <GuestsTab
              guests={guests}
              onAddGuest={handleAddGuest}
              onUpdateGuestStatus={handleUpdateGuestStatus}
              onDeleteGuest={handleDeleteGuest}
              onExportCsv={handleExportCsv}
            />
          )}

          {currentTab === 'seating' && (
            <SeatingTab guests={guests} />
          )}
        </main>
      </div>

      {/* 全域 Toast 反饋容器 */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}