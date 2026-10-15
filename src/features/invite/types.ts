export interface WeddingInviteData {
  groomName: string;
  brideName: string;
  groomNameZh: string;
  brideNameZh: string;
  weddingDate: string; // '2026-11-28'
  lunarDate: string; // '歲次丙午年 十月二十日'
  weddingTime: string; // '12:00'
  venueName: string;
  hallName: string;
  address: string;
  googleMapUrl: string;
  coverImageUrl: string;
  romanticQuote: string;
  storyTitle: string;
  storyContent: string[];
  galleryImages: {
    id: string;
    url: string;
    caption?: string;
  }[];
  musicUrl: string;
  musicTitle: string;
  rsvpDeadline: string;
}

export interface RsvpSubmission {
  name: string;
  phone: string;
  attending: boolean;
  attendeesCount: number;
  isVegetarian: boolean;
  vegetarianCount: number;
  needBabyChair: boolean;
  babyChairCount: number;
  relation: 'groom' | 'bride' | 'mutual' | 'family';
  message: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  relation: string;
  message: string;
  date: string;
}
