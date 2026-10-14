'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX, Disc } from 'lucide-react';

interface MusicPlayerProps {
  musicUrl: string;
  musicTitle: string;
}

export function MusicPlayer({ musicUrl, musicTitle }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 建立 Audio 實例
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [musicUrl]);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // 瀏覽器未授權自動播放時 fallback
          setIsPlaying(false);
        });
    }
  };

  return (
    <div className="fixed top-5 right-5 z-40">
      <button
        onClick={toggleMusic}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-md border transition-all duration-300 shadow-md ${
          isPlaying
            ? 'bg-[#2D3B36]/90 border-[#C5A880] text-[#FAF9F5]'
            : 'bg-white/80 border-[#E8E5DF] text-[#6A665E] hover:bg-white'
        }`}
        title={isPlaying ? '暫停背景音樂' : '播放婚禮背景音樂'}
      >
        <span
          className={`w-4 h-4 flex items-center justify-center shrink-0 ${
            isPlaying ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '4s' }}
        >
          <Disc className={`w-4 h-4 ${isPlaying ? 'text-[#C5A880]' : 'text-stone-400'}`} />
        </span>

        <span className="text-[11px] font-medium tracking-wide max-w-[100px] truncate">
          {isPlaying ? musicTitle : '播放配樂'}
        </span>

        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 text-[#C5A880]" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-stone-400" />
        )}
      </button>
    </div>
  );
}
