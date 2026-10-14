'use client';

import React from 'react';
import { 
  Users, 
  UserCheck, 
  UtensilsCrossed, 
  Baby, 
  Clock, 
  Calendar, 
  HeartHandshake, 
  Copy, 
  ExternalLink, 
  Download, 
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  MessageSquareHeart,
  ChevronRight
} from 'lucide-react';
import { Guest, InvitationConfig, DashboardTab } from '../types';

interface OverviewTabProps {
  config: InvitationConfig;
  guests: Guest[];
  daysRemaining: number;
  onSelectTab: (tab: DashboardTab) => void;
  onCopyLink: () => void;
  onPreview: () => void;
  onExport: () => void;
}

export function OverviewTab({
  config,
  guests,
  daysRemaining,
  onSelectTab,
  onCopyLink,
  onPreview,
  onExport,
}: OverviewTabProps) {
  // 統計數據計算
  const totalInvitedGuests = guests.length;
  const attendingGuests = guests.filter((g) => g.status === 'attending');
  const declinedGuests = guests.filter((g) => g.status === 'declined');
  const pendingGuests = guests.filter((g) => g.status === 'pending');

  // 實際出席總人數（包含攜伴）
  const totalAttendingSeats = attendingGuests.reduce(
    (acc, g) => acc + g.attendeesCount,
    0
  );

  // 回覆率計算
  const respondedCount = attendingGuests.length + declinedGuests.length;
  const responseRate = totalInvitedGuests > 0 
    ? Math.round((respondedCount / totalInvitedGuests) * 100) 
    : 0;

  // 出席率 (以已回覆中出席者為基準)
  const attendanceRate = respondedCount > 0 
    ? Math.round((attendingGuests.length / respondedCount) * 100) 
    : 0;

  // 素食統計 (依人數計算)
  const totalVegetarian = guests.reduce((acc, g) => {
    if (g.status === 'attending' && g.isVegetarian) {
      return acc + (g.vegetarianCount || 1);
    }
    return acc;
  }, 0);

  // 兒童椅統計
  const totalBabyChairs = guests.reduce((acc, g) => {
    if (g.status === 'attending' && g.needBabyChair) {
      return acc + (g.babyChairCount || 1);
    }
    return acc;
  }, 0);

  // 祝賀留言數量
  const messagesWithWishes = guests.filter(
    (g) => g.message && g.message.trim().length > 0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Hero Countdown & Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2D3B36] to-[#1E2824] text-[#FAF9F5] p-8 shadow-[0_12px_30px_rgba(45,59,54,0.15)] border border-[#3E4F49]">
        {/* Decorative subtle texture / glow */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#C5A880]/15 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-16 w-48 h-48 rounded-full bg-[#FAF9F5]/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F5]/10 backdrop-blur-sm border border-[#FAF9F5]/15 text-xs text-[#C5A880] font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>親愛的 {config.groomName.split(' ')[0]} & {config.brideName.split(' ')[0]}，婚禮籌備進行中</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif tracking-tight font-medium">
              距離我們的美好婚禮，還有{' '}
              <span className="text-[#C5A880] font-sans font-bold underline decoration-[#C5A880]/40 decoration-wavy underline-offset-6">
                {daysRemaining > 0 ? daysRemaining : 0}
              </span>{' '}
              天
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF9F5]/70 flex items-center gap-2 pt-1 font-sans">
              <Calendar className="w-4 h-4 text-[#C5A880]" />
              <span>{config.weddingDate} ({config.weddingTime})</span>
              <span>•</span>
              <span>{config.weddingVenue}</span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onCopyLink}
              className="px-4 py-2.5 rounded-xl bg-[#FAF9F5]/10 hover:bg-[#FAF9F5]/20 backdrop-blur-md border border-[#FAF9F5]/20 text-xs font-medium text-[#FAF9F5] transition-all flex items-center gap-2 shadow-xs"
            >
              <Copy className="w-4 h-4 text-[#C5A880]" />
              <span>複製喜帖連結</span>
            </button>
            <button
              onClick={onPreview}
              className="px-4 py-2.5 rounded-xl bg-[#FAF9F5]/10 hover:bg-[#FAF9F5]/20 backdrop-blur-md border border-[#FAF9F5]/20 text-xs font-medium text-[#FAF9F5] transition-all flex items-center gap-2 shadow-xs"
            >
              <ExternalLink className="w-4 h-4 text-[#C5A880]" />
              <span>線上即時預覽</span>
            </button>
            <button
              onClick={onExport}
              className="px-4 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#b89a71] text-[#1E2824] font-medium text-xs transition-all flex items-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>匯出賓客名單</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Core Data Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: 總邀請名單 */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8E5DF] shadow-[0_2px_12px_rgba(45,59,54,0.03)] hover:border-[#C5A880]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8A83] tracking-wide">總邀請名額</span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] flex items-center justify-center text-[#2D3B36]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#2D3B36] tracking-tight">
                {totalInvitedGuests}
              </span>
              <span className="text-xs text-[#8E8A83]">組賓客</span>
            </div>
            <div className="mt-2 text-xs text-[#6A665E] flex items-center gap-1.5">
              <span className="text-emerald-700 font-medium">已回覆 {respondedCount} 組</span>
              <span>•</span>
              <span className="text-amber-700 font-medium">{pendingGuests.length} 組待回覆</span>
            </div>
          </div>
        </div>

        {/* Card 2: 出席率與出席總人次 */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8E5DF] shadow-[0_2px_12px_rgba(45,59,54,0.03)] hover:border-[#C5A880]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8A83] tracking-wide">出席總人數 (含攜伴)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#2D3B36] tracking-tight">
                {totalAttendingSeats}
              </span>
              <span className="text-xs text-[#8E8A83]">位席次</span>
            </div>
            <div className="mt-2 text-xs text-[#6A665E] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>出席率 {attendanceRate}%</span>
              <span className="text-[#8E8A83]">({attendingGuests.length} 組確認)</span>
            </div>
          </div>
        </div>

        {/* Card 3: 素食需求統計 */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8E5DF] shadow-[0_2px_12px_rgba(45,59,54,0.03)] hover:border-[#C5A880]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8A83] tracking-wide">素食餐點需求</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-800">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#2D3B36] tracking-tight">
                {totalVegetarian}
              </span>
              <span className="text-xs text-[#8E8A83]">份素食套餐</span>
            </div>
            <div className="mt-2 text-xs text-[#6A665E]">
              佔確認出席者的 {totalAttendingSeats > 0 ? Math.round((totalVegetarian / totalAttendingSeats) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Card 4: 兒童座椅需求 */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8E5DF] shadow-[0_2px_12px_rgba(45,59,54,0.03)] hover:border-[#C5A880]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8A83] tracking-wide">兒童安全座椅</span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] flex items-center justify-center text-[#2D3B36]">
              <Baby className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#2D3B36] tracking-tight">
                {totalBabyChairs}
              </span>
              <span className="text-xs text-[#8E8A83]">張需求</span>
            </div>
            <div className="mt-2 text-xs text-[#6A665E]">
              飯店婚宴專員已同步登記
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Progress & Live Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: RSVP Status Visualizer & Quick Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E8E5DF] shadow-[0_2px_12px_rgba(45,59,54,0.03)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-[#2D3B36]">
                  RSVP 回覆進度概況
                </h3>
                <p className="text-xs text-[#8E8A83] mt-0.5">
                  目前整體回覆進度為 {responseRate}%，截止日為 {config.rsvpDeadline}
                </p>
              </div>
              <button
                onClick={() => onSelectTab('guests')}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#2D3B36] hover:text-[#C5A880] transition-colors"
              >
                查看完整名單
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Segmented Progress Bar */}
            <div className="space-y-2">
              <div className="h-3 w-full rounded-full bg-[#FAF9F5] overflow-hidden flex border border-[#E8E5DF]/70">
                <div
                  style={{ width: `${(attendingGuests.length / totalInvitedGuests) * 100}%` }}
                  className="bg-[#2D3B36] h-full transition-all duration-500"
                  title="確認出席"
                />
                <div
                  style={{ width: `${(declinedGuests.length / totalInvitedGuests) * 100}%` }}
                  className="bg-stone-300 h-full transition-all duration-500"
                  title="無法出席"
                />
                <div
                  style={{ width: `${(pendingGuests.length / totalInvitedGuests) * 100}%` }}
                  className="bg-amber-200 h-full transition-all duration-500"
                  title="待確認"
                />
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-2 pt-3 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF]/50">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2D3B36]" />
                  <div>
                    <span className="block font-medium text-[#2D3B36]">
                      出席：{attendingGuests.length} 組
                    </span>
                    <span className="text-[11px] text-[#8E8A83]">
                      共 {totalAttendingSeats} 人入席
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF]/50">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                  <div>
                    <span className="block font-medium text-[#2D3B36]">
                      婉拒：{declinedGuests.length} 組
                    </span>
                    <span className="text-[11px] text-[#8E8A83]">
                      心意祝福致意
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF]/50">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div>
                    <span className="block font-medium text-[#2D3B36]">
                      待定：{pendingGuests.length} 組
                    </span>
                    <span className="text-[11px] text-[#8E8A83]">
                      尚待確認回覆
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FAF9F5] to-white border border-[#E8E5DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#2D3B36]/5 border border-[#2D3B36]/10 flex items-center justify-center text-[#2D3B36]">
                <HeartHandshake className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#2D3B36]">
                  想要調整喜帖文案或更換婚紗照片嗎？
                </h4>
                <p className="text-xs text-[#8E8A83] mt-0.5">
                  使用視覺化喜帖編輯器，所有修改即時在手機畫面中同步呈現。
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('editor')}
              className="shrink-0 px-4 py-2 rounded-xl bg-[#2D3B36] text-[#FAF9F5] text-xs font-medium hover:bg-[#1E2824] transition-colors flex items-center gap-1.5"
            >
              進入喜帖編輯器
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
          </div>
        </div>

        {/* Right Col: Live RSVP Stream (親友溫馨留言回饋) */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8E5DF] shadow-[0_2px_12px_rgba(45,59,54,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF]">
              <div className="flex items-center gap-2">
                <MessageSquareHeart className="w-4 h-4 text-[#C5A880]" />
                <h3 className="font-serif text-sm font-bold text-[#2D3B36]">
                  最新親友祝福留言
                </h3>
              </div>
              <span className="text-[11px] text-[#8E8A83]">
                共 {messagesWithWishes.length} 則賀詞
              </span>
            </div>

            <div className="mt-4 space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {messagesWithWishes.slice(0, 4).map((guest) => (
                <div
                  key={guest.id}
                  className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF]/70 text-xs space-y-1.5 transition-all hover:border-[#C5A880]/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#2D3B36]">
                      {guest.name}
                    </span>
                    <span className="text-[10px] text-[#8E8A83]">
                      {guest.createdAt.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed italic">
                    "{guest.message}"
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] text-[#8E8A83]">
                    <span>
                      {guest.status === 'attending' ? '出席' : '無法出席'}
                    </span>
                    {guest.isVegetarian && (
                      <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        素食
                      </span>
                    )}
                    {guest.needBabyChair && (
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        兒童椅
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSelectTab('guests')}
            className="w-full mt-4 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] hover:bg-[#F2EFE9] text-xs font-medium text-[#2D3B36] transition-colors"
          >
            檢視所有賓客祝福留言
          </button>
        </div>
      </div>
    </div>
  );
}
