'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Navigation, 
  CalendarPlus, 
  Clock, 
  Check,
  Building2
} from 'lucide-react';
import { WeddingInviteData } from '../types';
import { useI18n } from '@/shared/i18n/I18nContext';

interface VenueSectionProps {
  data: WeddingInviteData;
}

export function VenueSection({ data }: VenueSectionProps) {
  const { t } = useI18n();
  const [calendarDownloaded, setCalendarDownloaded] = useState(false);

  // 1. 生成 Google Calendar 連結
  const getGoogleCalendarUrl = () => {
    const startDate = `${data.weddingDate.replace(/-/g, '')}T040000Z`;
    const endDate = `${data.weddingDate.replace(/-/g, '')}T080000Z`;
    const title = encodeURIComponent(`${data.groomNameZh} & ${data.brideNameZh} 婚宴喜宴`);
    const details = encodeURIComponent(`誠摯邀請您蒞臨我們的婚禮盛宴！\n地點：${data.venueName} ${data.hallName}`);
    const location = encodeURIComponent(`${data.venueName}, ${data.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  };

  // 2. 下載標準 Apple / Outlook .ics 行事曆檔案
  const handleDownloadIcs = () => {
    const icsDate = data.weddingDate.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Vowify//Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${data.groomNameZh} & ${data.brideNameZh} 婚禮喜宴`,
      `DESCRIPTION:誠摯邀請您蒞臨我們的幸福婚宴！`,
      `LOCATION:${data.venueName} ${data.hallName}, ${data.address}`,
      `DTSTART:${icsDate}T120000`,
      `DTEND:${icsDate}T160000`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.groomNameZh}_${data.brideNameZh}_婚禮行事曆.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCalendarDownloaded(true);
    setTimeout(() => setCalendarDownloaded(false), 3000);
  };

  return (
    <section className="py-20 px-6 bg-[#FAF9F5] border-b border-[#E8E5DF] text-center">
      <div className="max-w-md mx-auto space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E5DF] text-[10px] uppercase tracking-widest text-[#8E8A83] font-medium">
          <Calendar className="w-3 h-3 text-[#C5A880]" />
          <span>Wedding Date & Venue</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D3B36] tracking-tight">
          {t('ceremonySchedule')}
        </h2>

        {/* Date Box */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E5DF] shadow-xs space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#C5A880] uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" />
            <span>{t('ceremonyTime')}</span>
          </div>

          <div className="space-y-1">
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#2D3B36]">
              {data.weddingDate}
            </p>
            <p className="text-xs text-[#8E8A83]">
              {data.weddingTime} {t('punctual')}
            </p>
          </div>
        </div>

        {/* Venue Box */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E5DF] shadow-xs space-y-4 text-left">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF9F5] border border-[#E8E5DF] flex items-center justify-center text-[#2D3B36] shrink-0">
              <Building2 className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2D3B36]">
                {data.venueName}
              </h3>
              <p className="text-xs text-[#C5A880] font-semibold mt-0.5">
                {data.hallName}
              </p>
              <p className="text-xs text-[#6A665E] mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{data.address}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={data.googleMapUrl}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-4 rounded-xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-xs font-medium flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{t('googleMapsNav')}</span>
            </a>

            <button
              onClick={handleDownloadIcs}
              className="py-3 px-4 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#2D3B36] border border-[#E8E5DF] text-xs font-medium flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              {calendarDownloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('addedCalendar')}</span>
                </>
              ) : (
                <>
                  <CalendarPlus className="w-3.5 h-3.5 text-[#8E8A83]" />
                  <span>{t('addToCalendar')}</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-1">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-[#8E8A83] hover:text-[#2D3B36] underline transition-colors"
            >
              {t('googleWebCalendar')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
