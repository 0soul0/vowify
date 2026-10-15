'use client';

import React, { useState } from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { HeroSection } from './components/HeroSection';
import { StorySection } from './components/StorySection';
import { GallerySection } from './components/GallerySection';
import { VenueSection } from './components/VenueSection';
import { RsvpFormSection } from './components/RsvpFormSection';
import { GuestbookSection } from './components/GuestbookSection';
import { initialInviteData, initialGuestbookEntries } from './mockData';
import { RsvpSubmission, GuestbookEntry, WeddingInviteData } from './types';
import { HeartHandshake } from 'lucide-react';
import { useI18n } from '@/shared/i18n/I18nContext';

interface InvitePageProps {
  customData?: Partial<WeddingInviteData>;
}

export function InvitePage({ customData }: InvitePageProps) {
  const { t } = useI18n();
  const [data] = useState<WeddingInviteData>({
    ...initialInviteData,
    ...customData,
  });

  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(initialGuestbookEntries);

  const handleRsvpSuccess = (submission: RsvpSubmission) => {
    if (submission.message && submission.message.trim().length > 0) {
      const relationLabel =
        submission.relation === 'groom'
          ? t('relationGroom')
          : submission.relation === 'bride'
          ? t('relationBride')
          : submission.relation === 'family'
          ? t('relationFamily')
          : t('relationFriend');

      const newEntry: GuestbookEntry = {
        id: `gb-${Date.now()}`,
        name: submission.name,
        relation: relationLabel,
        message: submission.message,
        date: t('justNow'),
      };
      setGuestbook((prev) => [newEntry, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDE6] flex justify-center selection:bg-[#C5A880]/30 selection:text-[#2D3B36]">
      {/* Mobile Screen Container (Centered on desktop with subtle chic frame) */}
      <div className="w-full max-w-[480px] bg-[#FAF9F5] min-h-screen shadow-[0_0_60px_rgba(45,59,54,0.08)] relative overflow-x-hidden flex flex-col">
        {/* Floating Music Player */}
        <MusicPlayer musicUrl={data.musicUrl} musicTitle={data.musicTitle} />

        {/* 1. Hero Romantic Cover */}
        <HeroSection data={data} />

        {/* 2. Our Story */}
        <StorySection data={data} />

        {/* 3. Wedding Photo Gallery */}
        <GallerySection data={data} />

        {/* 4. Wedding Date & Venue Map Navigation */}
        <VenueSection data={data} />

        {/* 5. Interactive RSVP Form */}
        <RsvpFormSection
          deadline={data.rsvpDeadline}
          onSubmitSuccess={handleRsvpSuccess}
        />

        {/* 6. Guestbook Wall */}
        <GuestbookSection entries={guestbook} />

        {/* Floating Quick RSVP Button (Shows when scrolling) */}
        <div className="sticky bottom-5 inset-x-0 px-6 z-30 pointer-events-none">
          <a
            href="#rsvp"
            className="pointer-events-auto w-full py-3.5 rounded-full bg-[#2D3B36]/95 hover:bg-[#1E2824] backdrop-blur-md border border-[#C5A880]/40 text-[#FAF9F5] text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-102 active:scale-98"
          >
            <HeartHandshake className="w-4 h-4 text-[#C5A880]" />
            <span>{t('floatingRsvpBtn')}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
