import { supabase } from '@/lib/supabase';
import type { WeddingProject, Guest, InvitationConfig } from '@/features/dashboard/types';
import { initialProjects } from '@/features/dashboard/mockData';

// ─── DB row 型別 (符合實際 Supabase 02_vowify_projects schema) ───────────────

export interface DbProject {
  id: string;
  user_id: string;
  project_name: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string | null;
  slug: string;
  settings?: InvitationConfig | null;
  created_at: string;
}

export interface DbGuest {
  id: string;
  project_id: string;
  name: string;
  phone: string;
  email: string | null;
  status?: 'attending' | 'declined' | 'pending';
  attendee_count?: number;
  attendees_count?: number;
  is_vegetarian?: boolean;
  vegetarian_count?: number;
  need_baby_chair?: boolean;
  baby_chair_count?: number;
  relation?: 'groom' | 'bride' | 'mutual' | 'family';
  table_number?: string | null;
  message?: string | null;
  created_at: string;
}

const LOCAL_STORAGE_PROJECTS_KEY = 'vowify_saved_projects';

function getLocalProjects(): WeddingProject[] {
  if (typeof window === 'undefined') return initialProjects;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return initialProjects;
}

function saveLocalProjects(projects: WeddingProject[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
  } catch {
    // ignore
  }
}

// ─── mapper: DB row → Frontend type ─────────────────────────────────────────

export function mapDbProjectToFrontend(row: DbProject, guests: Guest[] = []): WeddingProject {
  const config = row.settings ?? buildDefaultConfig(row);
  return {
    id: row.id,
    title: row.project_name || config.title || '婚禮邀請函',
    groomName: row.groom_name || config.groomName,
    brideName: row.bride_name || config.brideName,
    weddingDate: row.wedding_date ?? config.weddingDate ?? '',
    weddingVenue: config.weddingVenue ?? '',
    coverPhotoUrl: config.coverPhotoUrl ?? '',
    isPublished: config.isPublished ?? true,
    slug: row.slug || config.slug,
    invitationConfig: config,
    guests,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

function buildDefaultConfig(row: DbProject): InvitationConfig {
  return {
    id: row.id,
    title: row.project_name,
    slug: row.slug,
    isPublished: true,
    groomName: row.groom_name,
    brideName: row.bride_name,
    weddingDate: row.wedding_date ?? '',
    weddingTime: '12:00',
    weddingVenue: '',
    banquetHall: '',
    address: '',
    googleMapUrl: '',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=85&w=1200',
    coverQuote: '「在浩瀚宇宙中，我們於此相遇、許下永恆諾言。」',
    themeStyle: 'champagne',
    storyTitle: 'Our Love Story',
    storyDescription: '',
    milestones: [],
    gallery: [],
    musicUrl: '',
    musicTitle: '',
    musicAutoPlay: false,
    rsvpDeadline: '',
    rsvpNotice: '',
    allowPlusOne: true,
    allowBabyChair: true,
  };
}

export function mapDbGuestToFrontend(row: DbGuest): Guest {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email ?? undefined,
    status: row.status ?? 'pending',
    attendeesCount: row.attendees_count ?? row.attendee_count ?? 1,
    isVegetarian: row.is_vegetarian ?? false,
    vegetarianCount: row.vegetarian_count ?? 0,
    needBabyChair: row.need_baby_chair ?? false,
    babyChairCount: row.baby_chair_count ?? 0,
    relation: row.relation ?? 'mutual',
    tableNumber: row.table_number ?? undefined,
    message: row.message ?? undefined,
    createdAt: row.created_at,
  };
}

// ─── Projects CRUD ───────────────────────────────────────────────────────────

export async function fetchProjects(userId: string): Promise<WeddingProject[]> {
  // Demo 帳號直接使用本地專案
  if (userId === 'demo-user-id') {
    return getLocalProjects();
  }

  try {
    const { data: projectRows, error } = await supabase
      .from('02_vowify_projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!projectRows || projectRows.length === 0) {
      return getLocalProjects();
    }

    const projectIds = projectRows.map((p: DbProject) => p.id);

    let guestsByProject: Record<string, Guest[]> = {};
    try {
      const { data: guestRows } = await supabase
        .from('02_vowify_guests')
        .select('*')
        .in('project_id', projectIds);

      for (const g of (guestRows ?? []) as DbGuest[]) {
        if (!guestsByProject[g.project_id]) guestsByProject[g.project_id] = [];
        guestsByProject[g.project_id].push(mapDbGuestToFrontend(g));
      }
    } catch {
      // 容許 guests 表異常時依然讀取 projects
    }

    const result = projectRows.map((row: DbProject) =>
      mapDbProjectToFrontend(row, guestsByProject[row.id] ?? [])
    );
    saveLocalProjects(result);
    return result;
  } catch (err) {
    console.warn('Supabase fetchProjects fallback to local:', err);
    return getLocalProjects();
  }
}

export async function createProject(
  userId: string,
  project: WeddingProject
): Promise<WeddingProject> {
  const localList = getLocalProjects();
  const updatedLocal = [project, ...localList.filter((p) => p.id !== project.id)];
  saveLocalProjects(updatedLocal);

  if (userId === 'demo-user-id') {
    return project;
  }

  try {
    const { data, error } = await supabase
      .from('02_vowify_projects')
      .insert({
        id: project.id,
        user_id: userId,
        project_name: project.title,
        groom_name: project.groomName,
        bride_name: project.brideName,
        wedding_date: project.weddingDate || null,
        slug: project.slug,
        settings: project.invitationConfig,
      })
      .select()
      .single();

    if (error) throw error;
    return mapDbProjectToFrontend(data as DbProject, project.guests);
  } catch (err) {
    console.warn('createProject fallback to local storage:', err);
    return project;
  }
}

export async function updateProject(
  projectId: string,
  config: InvitationConfig
): Promise<void> {
  const localList = getLocalProjects();
  const updated = localList.map((p) =>
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
  );
  saveLocalProjects(updated);

  try {
    await supabase
      .from('02_vowify_projects')
      .update({
        project_name: config.title,
        groom_name: config.groomName,
        bride_name: config.brideName,
        wedding_date: config.weddingDate || null,
        slug: config.slug,
        settings: config,
      })
      .eq('id', projectId);
  } catch (err) {
    console.warn('updateProject fallback local:', err);
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  const localList = getLocalProjects();
  saveLocalProjects(localList.filter((p) => p.id !== projectId));

  try {
    await supabase
      .from('02_vowify_projects')
      .delete()
      .eq('id', projectId);
  } catch (err) {
    console.warn('deleteProject fallback local:', err);
  }
}

// ─── Guests CRUD ─────────────────────────────────────────────────────────────

export async function upsertGuests(projectId: string, guests: Guest[]): Promise<Guest[]> {
  const localList = getLocalProjects();
  const updated = localList.map((p) => (p.id === projectId ? { ...p, guests } : p));
  saveLocalProjects(updated);
  return guests;
}

export async function deleteGuest(guestId: string): Promise<void> {
  const localList = getLocalProjects();
  const updated = localList.map((p) => ({
    ...p,
    guests: p.guests.filter((g) => g.id !== guestId),
  }));
  saveLocalProjects(updated);
}
