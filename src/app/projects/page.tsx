'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectHub } from '@/features/dashboard/components/ProjectHub';
import { CreateProjectModal } from '@/features/dashboard/components/CreateProjectModal';
import { useProjects } from '@/shared/context/ProjectContext';
import { WeddingProject } from '@/features/dashboard/types';
import { AuthGuard } from '@/shared/components/AuthGuard';
import { ROUTES } from '@/constants/routes';

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, createProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectProject = (projectId: string) => {
    router.push(ROUTES.DASHBOARD_DETAIL(projectId));
  };

  const handleCreateProject = async (newProject: WeddingProject) => {
    await createProject(newProject);
    setIsModalOpen(false);
    router.push(ROUTES.DASHBOARD_DETAIL(newProject.id));
  };

  return (
    <AuthGuard>
      <ProjectHub
        projects={projects}
        onSelectProject={handleSelectProject}
        onOpenCreateModal={() => setIsModalOpen(true)}
        onDeleteProject={deleteProject}
      />

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </AuthGuard>
  );
}
