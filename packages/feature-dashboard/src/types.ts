export type AttendanceStatus = 'attending' | 'declined' | 'pending';

export interface Guest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: AttendanceStatus;
  attendeesCount: number; // 包含賓客本人與攜伴人數
  isVegetarian: boolean;
  vegetarianCount?: number;
  needBabyChair: boolean;
  babyChairCount?: number;
  relation: 'groom' | 'bride' | 'mutual' | 'family';
  tableNumber?: string;
  message?: string;
  createdAt: string;
}

export interface LoveStoryMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
}

export interface InvitationConfig {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  groomName: string;
  brideName: string;
  weddingDate: string; // YYYY-MM-DD
  weddingTime: string; // HH:mm
  weddingVenue: string;
  banquetHall: string;
  address: string;
  googleMapUrl: string;
  coverPhotoUrl: string;
  coverQuote: string;
  themeStyle: 'champagne' | 'forest' | 'rose' | 'minimal';
  storyTitle: string;
  storyDescription: string;
  milestones: LoveStoryMilestone[];
  gallery: GalleryPhoto[];
  musicUrl: string;
  musicTitle: string;
  musicAutoPlay: boolean;
  rsvpDeadline: string;
  rsvpNotice: string;
  allowPlusOne: boolean;
  allowBabyChair: boolean;
}

export type DashboardTab = 'overview' | 'editor' | 'guests' | 'seating';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'error';
}
