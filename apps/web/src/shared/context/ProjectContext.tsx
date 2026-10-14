'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WeddingProject, InvitationConfig, Guest, AttendanceStatus } from '@/features/dashboard/types';
import { initialProjects } from '@/features/dashboard/mockData';

interface ProjectContextType {
  projects: WeddingProject[];
  getProject: (id: string) => WeddingProject | undefined;
  createProject: (project: WeddingProject) => void;
  updateProjectConfig: (projectId: string, config: InvitationConfig) => void;
  updateProjectGuests: (projectId: string, updater: (prev: Guest[]) => Guest[]) => void;
  deleteProject: (projectId: string) => void;
}

const ProjectContext = createContext<ProjectContextType>({
  projects: initialProjects,
  getProject: () => undefined,
  createProject: () => {},
  updateProjectConfig: () => {},
  updateProjectGuests: () => {},
  deleteProject: () => {},
});

const STORAGE_KEY = 'vowify_projects_store';

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<WeddingProject[]>(initialProjects);

  // 初始化時讀取 LocalStorage（避免 SSR Hydration mismatch，在 client side 讀取）
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToStorage = (newProjects: WeddingProject[]) => {
    setProjects(newProjects);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
      }
    } catch {
      // ignore
    }
  };

  const getProject = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  const createProject = (project: WeddingProject) => {
    saveToStorage([project, ...projects]);
  };

  const updateProjectConfig = (projectId: string, newConfig: InvitationConfig) => {
    const updated = projects.map((p) =>
      p.id === projectId
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
    );
    saveToStorage(updated);
  };

  const updateProjectGuests = (projectId: string, updater: (prev: Guest[]) => Guest[]) => {
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, guests: updater(p.guests) } : p
    );
    saveToStorage(updated);
  };

  const deleteProject = (projectId: string) => {
    saveToStorage(projects.filter((p) => p.id !== projectId));
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        getProject,
        createProject,
        updateProjectConfig,
        updateProjectGuests,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectContext);
}
