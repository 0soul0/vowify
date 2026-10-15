'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Trash2, 
  Heart,
  FolderHeart
} from 'lucide-react';
import { WeddingProject } from '../types';
import { useI18n, LanguageSwitcher } from '@/shared/i18n/I18nContext';
import { UserMenu } from '@/shared/components/UserMenu';

interface ProjectHubProps {
  projects: WeddingProject[];
  onSelectProject: (projectId: string) => void;
  onOpenCreateModal: () => void;
  onDeleteProject: (projectId: string) => void;
}

export function ProjectHub({
  projects,
  onSelectProject,
  onOpenCreateModal,
  onDeleteProject,
}: ProjectHubProps) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2D3B36] p-6 lg:p-12 animate-in fade-in duration-300">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E5DF]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2D3B36] flex items-center justify-center text-[#C5A880]">
                <FolderHeart className="w-4 h-4" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D3B36] tracking-tight">
                {t('projectsHub')}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#8E8A83]">
              {t('projectsHubDesc')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <UserMenu />

            <button
              onClick={onOpenCreateModal}
              className="px-5 py-2.5 rounded-full bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4 text-[#C5A880]" />
              <span>{t('newProject')}</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {projects.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white border border-[#E8E5DF] p-8 shadow-xs max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F5] border border-[#E8E5DF] flex items-center justify-center mx-auto text-[#2D3B36]">
              <Heart className="w-8 h-8 text-[#C5A880]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#2D3B36]">
                {t('emptyProjects')}
              </h3>
              <p className="text-xs text-[#8E8A83]">
                {t('emptyProjectsDesc')}
              </p>
            </div>
            <button
              onClick={onOpenCreateModal}
              className="px-6 py-2.5 rounded-full bg-[#2D3B36] text-[#FAF9F5] text-xs font-medium shadow-xs"
            >
              {t('newProject')}
            </button>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const totalGuests = project.guests.length;
              const attendingCount = project.guests.filter((g) => g.status === 'attending').length;
              const responseRate = totalGuests > 0 ? Math.round((attendingCount / totalGuests) * 100) : 0;

              return (
                <div
                  key={project.id}
                  className="rounded-3xl bg-white border border-[#E8E5DF] overflow-hidden shadow-xs hover:border-[#C5A880] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(45,59,54,0.06)] flex flex-col justify-between group"
                >
                  {/* Card Cover Banner */}
                  <div className="relative h-44 overflow-hidden bg-stone-100">
                    <img
                      src={project.coverPhotoUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.85]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Status Pill */}
                    <div className="absolute top-3.5 left-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md ${
                          project.isPublished
                            ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40'
                            : 'bg-stone-900/80 text-stone-300 border border-white/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            project.isPublished ? 'bg-emerald-400' : 'bg-stone-400'
                          }`}
                        />
                        {project.isPublished ? t('published') : t('draft')}
                      </span>
                    </div>

                    {/* Title & Couple on Image */}
                    <div className="absolute bottom-3.5 inset-x-4 text-white space-y-0.5">
                      <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-medium">
                        {project.groomName} & {project.brideName}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-white truncate">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-4">
                    <div className="space-y-1.5 text-xs text-[#6A665E]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                        <span>{project.weddingDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{project.weddingVenue}</span>
                      </div>
                    </div>

                    {/* RSVP Response Rate Bar */}
                    <div className="space-y-1.5 pt-2 border-t border-[#E8E5DF]/70">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8E8A83]">{t('rsvpProgress')}</span>
                        <span className="font-medium text-[#2D3B36]">
                          {attendingCount} / {totalGuests} {t('confirmedAttending')} ({responseRate}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#FAF9F5] overflow-hidden border border-[#E8E5DF]">
                        <div
                          style={{ width: `${responseRate}%` }}
                          className="h-full bg-[#2D3B36] rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onDeleteProject(project.id)}
                        className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title={t('deleteProject')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onSelectProject(project.id)}
                        className="flex-1 py-2.5 rounded-xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>{t('enterDashboard')}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
