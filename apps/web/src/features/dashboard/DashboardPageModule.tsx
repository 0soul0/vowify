'use client';

import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { EditorTab } from './components/EditorTab';
import { GuestsTab } from './components/GuestsTab';
import { SeatingTab } from './components/SeatingTab';
import { ProjectHub } from './components/ProjectHub';
import { CreateProjectModal } from './components/CreateProjectModal';
import { ToastContainer } from './components/Toast';
import { initialProjects } from './mockData';
import { 
  DashboardTab, 
  Guest, 
  InvitationConfig, 
  WeddingProject, 
  ToastMessage, 
  AttendanceStatus 
} from './types';

export function DashboardPageModule() {
  // 專案清單與當前選中專案 (預設先在 Hub，需選擇或建立專案才進入 Dashboard)
  const [projects, setProjects] = useState<WeddingProject[]>(initialProjects);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 當前功能 Tab
  const [currentTab, setCurrentTab] = useState<DashboardTab>('overview');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  // 當前選中的專案物件
  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === currentProjectId) || null;
  }, [projects, currentProjectId]);

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

  // 1. 建立新專案
  const handleCreateProject = (newProject: WeddingProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setCurrentProjectId(newProject.id);
    setIsCreateModalOpen(false);
    setCurrentTab('overview');
    addToast(
      `專案建立成功！已進入「${newProject.title}」`,
      '現在您可以開始客製喜帖內容與設定婚期',
      'success'
    );
  };

  // 2. 刪除專案
  const handleDeleteProject = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (currentProjectId === projectId) {
      setCurrentProjectId(null);
    }
    addToast(`已刪除專案：${target?.title || ''}`, undefined, 'info');
  };

  // 3. 更新當前專案的喜帖設定
  const handleUpdateConfig = (newConfig: InvitationConfig) => {
    if (!currentProjectId) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === currentProjectId
          ? {
              ...p,
              title: newConfig.title,
              weddingDate: newConfig.weddingDate,
              weddingVenue: newConfig.weddingVenue,
              groomName: newConfig.groomName,
              brideName: newConfig.brideName,
              isPublished: newConfig.isPublished,
              invitationConfig: newConfig,
            }
          : p
      )
    );
  };

  // 4. 更新當前專案的賓客名冊
  const handleUpdateGuests = (updater: (prevGuests: Guest[]) => Guest[]) => {
    if (!currentProjectId) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === currentProjectId
          ? { ...p, guests: updater(p.guests) }
          : p
      )
    );
  };

  // 計算當前婚禮倒數天數
  const daysRemaining = useMemo(() => {
    if (!currentProject) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(currentProject.weddingDate);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [currentProject]);

  // 複製喜帖連結
  const handleCopyLink = () => {
    if (!currentProject) return;
    const publicUrl = `https://vowify.io/i/${currentProject.slug}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(publicUrl);
    }
    setIsCopied(true);
    addToast('喜帖網址已複製到剪貼簿', publicUrl, 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  // 預覽喜帖
  const handlePreview = () => {
    if (typeof window !== 'undefined') {
      window.open('/invite', '_blank');
    }
    addToast('已於新分頁開啟賓客喜帖', '可實際體驗手機端效果與 RSVP 填寫', 'info');
  };

  // 匯出 CSV (含 UTF-8 BOM)
  const handleExportCsv = () => {
    if (!currentProject) return;
    const headers = [
      '賓客姓名',
      '聯絡電話',
      '出席狀態',
      '席位人數',
      '是否素食',
      '素食數量',
      '是否需要兒童椅',
      '兒童椅數量',
      '親友歸屬',
      '排定桌號',
      '祝福賀詞',
      '回覆登記時間',
    ];

    const rows = currentProject.guests.map((g) => {
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
    link.download = `${currentProject.title}_賓客名單_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('賓客名冊 CSV 匯出成功', '已下載包含完整飲食與座位需求的名單', 'success');
  };

  // 切換發布狀態
  const handleTogglePublish = () => {
    if (!currentProject) return;
    const nextState = !currentProject.isPublished;
    handleUpdateConfig({
      ...currentProject.invitationConfig,
      isPublished: nextState,
    });
    addToast(
      nextState ? '喜帖已發布上線' : '喜帖已轉為草稿',
      nextState ? '親友現在可以透過專屬連結填寫 RSVP' : '外網連結暫時關閉',
      'info'
    );
  };

  // 新增賓客
  const handleAddGuest = (newGuestData: Omit<Guest, 'id' | 'createdAt'>) => {
    const newGuest: Guest = {
      ...newGuestData,
      id: `gst-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    handleUpdateGuests((prev) => [newGuest, ...prev]);
    addToast(`已新增賓客：${newGuest.name}`, undefined, 'success');
  };

  // 更新賓客狀態
  const handleUpdateGuestStatus = (id: string, status: AttendanceStatus) => {
    handleUpdateGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status } : g))
    );
    addToast('賓客出席狀態已更新', undefined, 'info');
  };

  // 刪除賓客
  const handleDeleteGuest = (id: string) => {
    handleUpdateGuests((prev) => prev.filter((g) => g.id !== id));
    addToast('賓客資料已移除', undefined, 'info');
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2D3B36]">
      {/* 流程模式 1：若未選擇專案，展示「多專案列表總覽頁 (Project Hub)」 */}
      {!currentProject ? (
        <ProjectHub
          projects={projects}
          onSelectProject={(id) => {
            setCurrentProjectId(id);
            setCurrentTab('overview');
          }}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onDeleteProject={handleDeleteProject}
        />
      ) : (
        /* 流程模式 2：已選定專案，進入該專案的後台 Dashboard */
        <div className="flex min-h-screen">
          {/* 側邊欄 Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            config={currentProject.invitationConfig}
            daysRemaining={daysRemaining}
            onPreviewClick={handlePreview}
            onBackToHub={() => setCurrentProjectId(null)}
          />

          {/* 主要區域 Main Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <Header
              currentTab={currentTab}
              config={currentProject.invitationConfig}
              daysRemaining={daysRemaining}
              projects={projects}
              currentProjectId={currentProject.id}
              onSelectProject={(id) => setCurrentProjectId(id)}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onBackToHub={() => setCurrentProjectId(null)}
              onCopyLink={handleCopyLink}
              onPreview={handlePreview}
              onExport={handleExportCsv}
              onTogglePublish={handleTogglePublish}
              isCopied={isCopied}
            />

            {/* 各頁籤內容 */}
            <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {currentTab === 'overview' && (
                <OverviewTab
                  config={currentProject.invitationConfig}
                  guests={currentProject.guests}
                  daysRemaining={daysRemaining}
                  onSelectTab={setCurrentTab}
                  onCopyLink={handleCopyLink}
                  onPreview={handlePreview}
                  onExport={handleExportCsv}
                />
              )}

              {currentTab === 'editor' && (
                <EditorTab
                  config={currentProject.invitationConfig}
                  onUpdateConfig={handleUpdateConfig}
                  onSave={() => addToast('喜帖內容儲存成功', undefined, 'success')}
                  onCopyLink={handleCopyLink}
                />
              )}

              {currentTab === 'guests' && (
                <GuestsTab
                  guests={currentProject.guests}
                  onAddGuest={handleAddGuest}
                  onUpdateGuestStatus={handleUpdateGuestStatus}
                  onDeleteGuest={handleDeleteGuest}
                  onExportCsv={handleExportCsv}
                />
              )}

              {currentTab === 'seating' && (
                <SeatingTab guests={currentProject.guests} />
              )}
            </main>
          </div>
        </div>
      )}

      {/* 新增專案彈窗 */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProject}
      />

      {/* 全域 Toast 通知容器 */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}