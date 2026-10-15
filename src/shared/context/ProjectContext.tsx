'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import {
  fetchProjects,
  createProject as dbCreateProject,
  updateProject as dbUpdateProject,
  deleteProject as dbDeleteProject,
  upsertGuests,
  deleteGuest as dbDeleteGuest,
} from '@/lib/db/projects';
import type { WeddingProject, InvitationConfig, Guest } from '@/features/dashboard/types';

interface ProjectContextType {
  projects: WeddingProject[];
  isLoading: boolean;
  error: string | null;
  getProject: (id: string) => WeddingProject | undefined;
  createProject: (project: WeddingProject) => Promise<void>;
  updateProjectConfig: (projectId: string, config: InvitationConfig) => Promise<void>;
  updateProjectGuests: (projectId: string, updater: (prev: Guest[]) => Guest[]) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  isLoading: false,
  error: null,
  getProject: () => undefined,
  createProject: async () => { },
  updateProjectConfig: async () => { },
  updateProjectGuests: async () => { },
  deleteProject: async () => { },
  refetch: async () => { },
});

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<WeddingProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProjects(user.id);
      setProjects(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    } else {
      setProjects([]);
    }
  }, [isAuthenticated, loadProjects]);

  const getProject = (id: string) => projects.find((p) => p.id === id);

  const createProject = async (project: WeddingProject) => {
    if (!user?.id) return;
    const created = await dbCreateProject(user.id, project);
    setProjects((prev) => [created, ...prev]);
  };

  const updateProjectConfig = async (projectId: string, config: InvitationConfig) => {
    await dbUpdateProject(projectId, config);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              title: config.title,
              groomName: config.groomName,
              brideName: config.brideName,
              weddingDate: config.weddingDate,
              weddingVenue: config.weddingVenue,
              coverPhotoUrl: config.coverPhotoUrl,
              isPublished: config.isPublished,
              slug: config.slug,
              invitationConfig: config,
            }
          : p
      )
    );
  };

  const updateProjectGuests = async (projectId: string, updater: (prev: Guest[]) => Guest[]) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const prevGuests = project.guests;
    const newGuests = updater(prevGuests);

    // 找出被刪除的 guests
    const newGuestIds = new Set(newGuests.map((g) => g.id));
    const deletedGuests = prevGuests.filter((g) => !newGuestIds.has(g.id));

    await Promise.all([
      newGuests.length > 0 ? upsertGuests(projectId, newGuests) : Promise.resolve(),
      ...deletedGuests.map((g) => dbDeleteGuest(g.id)),
    ]);

    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, guests: newGuests } : p))
    );
  };

  const deleteProject = async (projectId: string) => {
    await dbDeleteProject(projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        isLoading,
        error,
        getProject,
        createProject,
        updateProjectConfig,
        updateProjectGuests,
        deleteProject,
        refetch: loadProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectContext);
}
