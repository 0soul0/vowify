'use client';

import React, { useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { WeddingInviteData } from '../types';
import { useI18n } from '@/shared/i18n/I18nContext';

interface GallerySectionProps {
  data: WeddingInviteData;
}

export function GallerySection({ data }: GallerySectionProps) {
  const { t } = useI18n();
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  const openLightbox = (index: number) => setActivePhotoIdx(index);
  const closeLightbox = () => setActivePhotoIdx(null);

  const prevPhoto = () => {
    if (activePhotoIdx === null) return;
    setActivePhotoIdx((activePhotoIdx - 1 + data.galleryImages.length) % data.galleryImages.length);
  };

  const nextPhoto = () => {
    if (activePhotoIdx === null) return;
    setActivePhotoIdx((activePhotoIdx + 1) % data.galleryImages.length);
  };

  return (
    <section className="py-20 px-6 bg-white border-b border-[#E8E5DF]">
      <div className="max-w-md mx-auto space-y-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E8E5DF] text-[10px] uppercase tracking-widest text-[#8E8A83] font-medium">
          <Camera className="w-3 h-3 text-[#C5A880]" />
          <span>Memories & Moments</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D3B36] tracking-tight">
          {t('galleryTitle')}
        </h2>

        <p className="text-xs text-[#8E8A83]">
          {t('clickToEnlarge')}
        </p>

        {/* Gallery Grid (Mobile 2 cols) */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {data.galleryImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="relative aspect-3/4 rounded-2xl overflow-hidden cursor-pointer group shadow-2xs bg-stone-100 border border-[#E8E5DF]"
            >
              <img
                src={img.url}
                alt={img.caption || 'Wedding Photo'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Maximize2 className="w-5 h-5 drop-shadow" />
              </div>
              {img.caption && (
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-[10px] text-white text-center truncate">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhotoIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevPhoto}
            className="absolute left-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-md w-full max-h-[85vh] flex flex-col items-center justify-center">
            <img
              src={data.galleryImages[activePhotoIdx].url}
              alt="Fullscreen Preview"
              className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
            />
            {data.galleryImages[activePhotoIdx].caption && (
              <p className="mt-3 text-xs text-white/80 text-center font-serif">
                {data.galleryImages[activePhotoIdx].caption}
              </p>
            )}
            <span className="text-[11px] text-white/50 mt-1">
              {activePhotoIdx + 1} / {data.galleryImages.length}
            </span>
          </div>

          <button
            onClick={nextPhoto}
            className="absolute right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
}
