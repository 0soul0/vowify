'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Check, 
  Plus, 
  FolderHeart 
} from 'lucide-react';
import { WeddingProject } from '../types';
import { useI18n } from '@/shared/i18n/I18nContext';

interface ProjectSwitcherProps {
  projects: WeddingProject[];
  currentProjectId: string;
  onSelectProject: (projectId: string) => void;
  onOpenCreateModal: () => void;
  onBackToHub: () => void;
}

export function ProjectSwitcher({
  projects,
  currentProjectId,
  onSelectProject,
  onOpenCreateModal,
  onBackToHub,
}: ProjectSwitcherProps) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E5DF] hover:border-[#C5A880] transition-all text-xs font-medium text-[#2D3B36] shadow-2xs group"
      >
        <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
        <span className="font-semibold max-w-[170px] truncate text-left">
          {currentProject?.title || t('switchProject')}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8E8A83] group-hover:text-[#2D3B36] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-white border border-[#E8E5DF] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
          {/* Section: Project Switch List */}
          <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-[#8E8A83] tracking-wider">
            {t('switchProject')} ({projects.length})
          </div>

          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {projects.map((project) => {
              const isSelected = project.id === currentProjectId;
              return (
                <button
                  key={project.id}
                  onClick={() => {
                    onSelectProject(project.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors text-left ${
                    isSelected
                      ? 'bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] font-semibold'
                      : 'hover:bg-[#FAF9F5] text-stone-600'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="truncate leading-tight text-xs">{project.title}</p>
                    <p className="text-[10px] text-[#8E8A83] mt-0.5">
                      {project.weddingDate} • {project.isPublished ? t('published') : t('draft')}
                    </p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#C5A880] shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Action Links */}
          <div className="pt-2 border-t border-[#E8E5DF] space-y-1">
            <button
              onClick={() => {
                onOpenCreateModal();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-[#2D3B36] hover:bg-[#FAF9F5] font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{t('newProject')}</span>
            </button>

            <button
              onClick={() => {
                onBackToHub();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-stone-600 hover:bg-[#FAF9F5] transition-colors"
            >
              <FolderHeart className="w-3.5 h-3.5 text-stone-400" />
              <span>{t('allProjects')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
