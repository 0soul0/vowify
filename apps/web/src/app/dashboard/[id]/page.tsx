'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProjects } from '@/shared/context/ProjectContext';
import { Sidebar } from '@/features/dashboard/components/Sidebar';
import { Header } from '@/features/dashboard/components/Header';
import { OverviewTab } from '@/features/dashboard/components/OverviewTab';
import { EditorTab } from '@/features/dashboard/components/EditorTab';
import { GuestsTab } from '@/features/dashboard/components/GuestsTab';
import { SeatingTab } from '@/features/dashboard/components/SeatingTab';
import { CreateProjectModal } from '@/features/dashboard/components/CreateProjectModal';
import { MobileBottomNav } from '@/features/dashboard/components/MobileBottomNav';
import { ToastContainer } from '@/features/dashboard/components/Toast';
import { calculateDaysRemaining } from '@/shared/utils/date';
import { exportGuestsToCsv } from '@/shared/utils/csv';
import { copyToClipboard } from '@/shared/utils/clipboard';
import { 
  DashboardTab, 
  Guest, 
  InvitationConfig, 
  ToastMessage, 
  AttendanceStatus,
  WeddingProject
} from '@/features/dashboard/types';
import Link from 'next/link';
import { ArrowLeft, FolderHeart } from 'lucide-react';
import { useI18n } from '@/shared/i18n/I18nContext';
import { AuthGuard } from '@/shared/components/AuthGuard';

export default function ProjectDashboardPage() {
  const { t } = useI18n();
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const { 
    projects, 
    getProject, 
    createProject, 
    updateProjectConfig, 
    updateProjectGuests 
  } = useProjects();

  const [currentTab, setCurrentTab] = useState<DashboardTab>('overview');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 取得當前專案
  const currentProject = getProject(projectId) || projects[0];

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

  const daysRemaining = useMemo(() => {
    return currentProject ? calculateDaysRemaining(currentProject.weddingDate) : 0;
  }, [currentProject]);

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8E5DF] flex items-center justify-center mb-4">
          <FolderHeart className="w-8 h-8 text-[#C5A880]" />
        </div>
        <h2 className="font-serif text-xl font-bold text-[#2D3B36] mb-2">
          {t('projectNotFound')}
        </h2>
        <p className="text-xs text-[#8E8A83] mb-6">
          {t('projectNotFoundDesc')}
        </p>
        <Link
          href="/projects"
          className="px-6 py-2.5 rounded-full bg-[#2D3B36] text-[#FAF9F5] text-xs font-medium flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('backToHub')}</span>
        </Link>
      </div>
    );
  }

  // 1. 複製喜帖專屬連結
  const handleCopyLink = async () => {
    const publicUrl = `https://vowify.io/i/${currentProject.slug}`;
    const success = await copyToClipboard(publicUrl);
    if (success) {
      setIsCopied(true);
      addToast(t('copied'), publicUrl, 'success');
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // 2. 預覽喜帖
  const handlePreview = () => {
    if (typeof window !== 'undefined') {
      window.open(`/invite`, '_blank');
    }
    addToast(t('previewInvite'), undefined, 'info');
  };

  // 3. 匯出 CSV
  const handleExportCsv = () => {
    exportGuestsToCsv(currentProject.guests, currentProject.title);
    addToast(t('exportSuccess'), t('exportSuccessDesc'), 'success');
  };

  // 4. 切換發布狀態
  const handleTogglePublish = () => {
    const nextState = !currentProject.isPublished;
    updateProjectConfig(currentProject.id, {
      ...currentProject.invitationConfig,
      isPublished: nextState,
    });
    addToast(
      nextState ? t('published') : t('draft'),
      undefined,
      'info'
    );
  };

  // 5. 新增賓客
  const handleAddGuest = (newGuestData: Omit<Guest, 'id' | 'createdAt'>) => {
    const newGuest: Guest = {
      ...newGuestData,
      id: `gst-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    updateProjectGuests(currentProject.id, (prev) => [newGuest, ...prev]);
    addToast(`${t('guestAdded')}：${newGuest.name}`, undefined, 'success');
  };

  // 6. 更新賓客狀態
  const handleUpdateGuestStatus = (guestId: string, status: AttendanceStatus) => {
    updateProjectGuests(currentProject.id, (prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, status } : g))
    );
    addToast(t('statusUpdated'), undefined, 'info');
  };

  // 7. 刪除賓客
  const handleDeleteGuest = (guestId: string) => {
    updateProjectGuests(currentProject.id, (prev) =>
      prev.filter((g) => g.id !== guestId)
    );
    addToast(t('guestDeleted'), undefined, 'info');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F9F8F6] text-[#2D3B36] flex">
      {/* 側邊欄 Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        config={currentProject.invitationConfig}
        daysRemaining={daysRemaining}
        onPreviewClick={handlePreview}
        onBackToHub={() => router.push('/projects')}
        isOpenOnMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 主要內容區域 Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          config={currentProject.invitationConfig}
          daysRemaining={daysRemaining}
          projects={projects}
          currentProjectId={currentProject.id}
          onSelectProject={(id) => router.push(`/dashboard/${id}`)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onBackToHub={() => router.push('/projects')}
          onCopyLink={handleCopyLink}
          onPreview={handlePreview}
          onExport={handleExportCsv}
          onTogglePublish={handleTogglePublish}
          isCopied={isCopied}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* 各頁籤內容 */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
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
              onUpdateConfig={(newCfg) => updateProjectConfig(currentProject.id, newCfg)}
              onSave={() => addToast(t('editorSaved'), undefined, 'success')}
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

      {/* 行動端底部導覽列 */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      {/* 新增專案彈窗 */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(newP) => {
          createProject(newP);
          setIsCreateModalOpen(false);
          router.push(`/dashboard/${newP.id}`);
        }}
      />

      {/* 全域 Toast 通知容器 */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
    </AuthGuard>
  );
}
