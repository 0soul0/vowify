'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  UserCheck, 
  UserX, 
  Clock, 
  Leaf, 
  Baby, 
  Phone, 
  Mail, 
  MessageSquare, 
  MoreHorizontal, 
  Trash2, 
  Check, 
  X,
  Filter,
  Users
} from 'lucide-react';
import { Guest, AttendanceStatus } from '../types';

interface GuestsTabProps {
  guests: Guest[];
  onAddGuest: (guest: Omit<Guest, 'id' | 'createdAt'>) => void;
  onUpdateGuestStatus: (id: string, status: AttendanceStatus) => void;
  onDeleteGuest: (id: string) => void;
  onExportCsv: () => void;
}

type FilterTab = 'all' | 'attending' | 'declined' | 'pending' | 'vegetarian' | 'babychair';

export function GuestsTab({
  guests,
  onAddGuest,
  onUpdateGuestStatus,
  onDeleteGuest,
  onExportCsv,
}: GuestsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState<FilterTab>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMessageGuest, setSelectedMessageGuest] = useState<Guest | null>(null);

  // Form State for Add Guest Modal
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestStatus, setNewGuestStatus] = useState<AttendanceStatus>('attending');
  const [newGuestAttendeesCount, setNewGuestAttendeesCount] = useState(1);
  const [newGuestIsVegetarian, setNewGuestIsVegetarian] = useState(false);
  const [newGuestNeedBabyChair, setNewGuestNeedBabyChair] = useState(false);
  const [newGuestRelation, setNewGuestRelation] = useState<'groom' | 'bride' | 'mutual' | 'family'>('groom');
  const [newGuestTable, setNewGuestTable] = useState('');
  const [newGuestMessage, setNewGuestMessage] = useState('');

  // 篩選與搜尋運算
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      // 搜尋關鍵字比對
      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.phone.includes(searchQuery) ||
        (g.message && g.message.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // 篩選標籤比對
      if (currentFilter === 'attending') return g.status === 'attending';
      if (currentFilter === 'declined') return g.status === 'declined';
      if (currentFilter === 'pending') return g.status === 'pending';
      if (currentFilter === 'vegetarian') return g.isVegetarian && g.status === 'attending';
      if (currentFilter === 'babychair') return g.needBabyChair && g.status === 'attending';

      return true;
    });
  }, [guests, searchQuery, currentFilter]);

  // 表單送出處理
  const handleSubmitNewGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    onAddGuest({
      name: newGuestName.trim(),
      phone: newGuestPhone.trim() || '未提供',
      status: newGuestStatus,
      attendeesCount: Number(newGuestAttendeesCount) || 1,
      isVegetarian: newGuestIsVegetarian,
      vegetarianCount: newGuestIsVegetarian ? 1 : 0,
      needBabyChair: newGuestNeedBabyChair,
      babyChairCount: newGuestNeedBabyChair ? 1 : 0,
      relation: newGuestRelation,
      tableNumber: newGuestTable.trim() || undefined,
      message: newGuestMessage.trim() || undefined,
    });

    // Reset Form
    setNewGuestName('');
    setNewGuestPhone('');
    setNewGuestStatus('attending');
    setNewGuestAttendeesCount(1);
    setNewGuestIsVegetarian(false);
    setNewGuestNeedBabyChair(false);
    setNewGuestTable('');
    setNewGuestMessage('');
    setIsAddModalOpen(false);
  };

  const attendingCount = guests.filter((g) => g.status === 'attending').length;
  const declinedCount = guests.filter((g) => g.status === 'declined').length;
  const pendingCount = guests.filter((g) => g.status === 'pending').length;
  const vegCount = guests.filter((g) => g.status === 'attending' && g.isVegetarian).length;
  const babyChairCount = guests.filter((g) => g.status === 'attending' && g.needBabyChair).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Toolbar & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs">
        {/* Search Input Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8A83]" />
          <input
            type="text"
            placeholder="搜尋賓客姓名、電話或祝福留言..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] placeholder-[#8E8A83] focus:outline-hidden focus:border-[#C5A880] focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Buttons: Export & Add Guest */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onExportCsv}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E8E5DF] hover:bg-[#FAF9F5] text-xs font-medium text-[#2D3B36] transition-colors flex items-center gap-1.5 shadow-2xs"
            title="將名單匯出成包含 BOM 的 UTF-8 CSV 檔案"
          >
            <Download className="w-3.5 h-3.5 text-[#8E8A83]" />
            <span>匯出 Excel / CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>新增賓客</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Pills Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: '全部賓客', count: guests.length },
          { id: 'attending', label: '確認出席', count: attendingCount },
          { id: 'declined', label: '遺憾婉拒', count: declinedCount },
          { id: 'pending', label: '待回覆', count: pendingCount },
          { id: 'vegetarian', label: '素食需求', count: vegCount },
          { id: 'babychair', label: '兒童座椅', count: babyChairCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentFilter(tab.id as FilterTab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all ${
              currentFilter === tab.id
                ? 'bg-[#2D3B36] text-[#FAF9F5] shadow-xs'
                : 'bg-white border border-[#E8E5DF] text-[#6A665E] hover:border-[#C5A880]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`ml-1.5 text-[11px] px-1.5 py-0.2 rounded-full ${
                currentFilter === tab.id
                  ? 'bg-white/20 text-[#FAF9F5]'
                  : 'bg-[#FAF9F5] text-[#8E8A83]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. Guests CRM Table */}
      <div className="rounded-2xl bg-white border border-[#E8E5DF] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E5DF] text-[#8E8A83] font-medium tracking-wide">
                <th className="py-3.5 px-4">賓客姓名 / 關係</th>
                <th className="py-3.5 px-4">聯絡電話</th>
                <th className="py-3.5 px-4">出席意願</th>
                <th className="py-3.5 px-4">席次 / 人數</th>
                <th className="py-3.5 px-4">特殊需求 (素/幼)</th>
                <th className="py-3.5 px-4">排定桌號</th>
                <th className="py-3.5 px-4">祝福賀詞</th>
                <th className="py-3.5 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5DF]/70 text-[#2D3B36]">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">沒有符合條件的賓客資料</p>
                    <p className="text-xs mt-1 text-stone-400">請嘗試更換搜尋關鍵字或篩選標籤</p>
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const statusBadges = {
                    attending: {
                      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                      icon: UserCheck,
                      text: '確認出席',
                    },
                    declined: {
                      bg: 'bg-stone-100 text-stone-600 border-stone-200',
                      icon: UserX,
                      text: '不克出席',
                    },
                    pending: {
                      bg: 'bg-amber-50 text-amber-800 border-amber-200',
                      icon: Clock,
                      text: '尚未回覆',
                    },
                  };

                  const currentStatus = statusBadges[guest.status];
                  const StatusIcon = currentStatus.icon;

                  return (
                    <tr
                      key={guest.id}
                      className="hover:bg-[#FAF9F5]/70 transition-colors group"
                    >
                      {/* Name & Relation */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#2D3B36]">
                            {guest.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF9F5] border border-[#E8E5DF] text-[#8E8A83]">
                            {guest.relation === 'groom'
                              ? '男方親友'
                              : guest.relation === 'bride'
                              ? '女方親友'
                              : guest.relation === 'family'
                              ? '至親長輩'
                              : '共同好友'}
                          </span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-stone-600 font-mono text-[11px]">
                        {guest.phone}
                      </td>

                      {/* Attendance Status Pill */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${currentStatus.bg}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {currentStatus.text}
                          </span>
                        </div>
                      </td>

                      {/* Attendees Count */}
                      <td className="py-3.5 px-4 font-medium">
                        {guest.status === 'attending' ? (
                          <span className="text-[#2D3B36]">
                            {guest.attendeesCount} 位
                          </span>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>

                      {/* Dietary / Special Needs */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {guest.isVegetarian && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium"
                              title={`素食套餐 ${guest.vegetarianCount || 1} 份`}
                            >
                              <Leaf className="w-2.5 h-2.5" />
                              素食 ({guest.vegetarianCount || 1})
                            </span>
                          )}
                          {guest.needBabyChair && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium"
                              title={`兒童座椅 ${guest.babyChairCount || 1} 張`}
                            >
                              <Baby className="w-2.5 h-2.5" />
                              幼椅 ({guest.babyChairCount || 1})
                            </span>
                          )}
                          {!guest.isVegetarian && !guest.needBabyChair && (
                            <span className="text-stone-400 text-[11px]">一般葷食</span>
                          )}
                        </div>
                      </td>

                      {/* Table Number */}
                      <td className="py-3.5 px-4">
                        {guest.tableNumber ? (
                          <span className="px-2 py-0.5 rounded-md bg-[#FAF9F5] border border-[#E8E5DF] text-[11px] font-medium text-[#2D3B36]">
                            {guest.tableNumber}
                          </span>
                        ) : (
                          <span className="text-stone-300 text-[11px]">未排定</span>
                        )}
                      </td>

                      {/* Message */}
                      <td className="py-3.5 px-4 max-w-[180px]">
                        {guest.message ? (
                          <button
                            onClick={() => setSelectedMessageGuest(guest)}
                            className="text-stone-600 truncate hover:text-[#2D3B36] hover:underline flex items-center gap-1 text-left"
                            title="點擊查看完整祝福"
                          >
                            <MessageSquare className="w-3 h-3 text-[#C5A880] shrink-0" />
                            <span className="truncate">{guest.message}</span>
                          </button>
                        ) : (
                          <span className="text-stone-300">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick switch status dropdown or action */}
                          <button
                            onClick={() =>
                              onUpdateGuestStatus(
                                guest.id,
                                guest.status === 'attending' ? 'declined' : 'attending'
                              )
                            }
                            title="切換出席狀態"
                            className="p-1 rounded-md text-stone-400 hover:text-[#2D3B36] hover:bg-[#FAF9F5] transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteGuest(guest.id)}
                            title="刪除賓客"
                            className="p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================
          MODAL: 新增賓客彈窗
      ========================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#E8E5DF] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-[#E8E5DF]">
              <div>
                <h3 className="font-serif text-base font-bold text-[#2D3B36]">
                  新增賓客名冊
                </h3>
                <p className="text-xs text-[#8E8A83]">手動登記親友 RSVP 與席位需求</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewGuest} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                    賓客姓名 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例：陳志遠 & 夫人"
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                    聯絡電話
                  </label>
                  <input
                    type="text"
                    placeholder="0912-345-678"
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                    出席意願
                  </label>
                  <select
                    value={newGuestStatus}
                    onChange={(e) => setNewGuestStatus(e.target.value as AttendanceStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                  >
                    <option value="attending">確認出席</option>
                    <option value="declined">遺憾婉拒</option>
                    <option value="pending">尚未回覆</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                    出席人數 (含攜伴)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newGuestAttendeesCount}
                    onChange={(e) => setNewGuestAttendeesCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                    歸屬親友關係
                  </label>
                  <select
                    value={newGuestRelation}
                    onChange={(e) => setNewGuestRelation(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                  >
                    <option value="groom">男方親友</option>
                    <option value="bride">女方親友</option>
                    <option value="family">至親長輩</option>
                    <option value="mutual">共同好友</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                    排定桌號 (選填)
                  </label>
                  <input
                    type="text"
                    placeholder="例：新郎好友桌 A2"
                    value={newGuestTable}
                    onChange={(e) => setNewGuestTable(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                  />
                </div>
              </div>

              {/* Toggles for Dietary & Baby Chair */}
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newGuestIsVegetarian}
                    onChange={(e) => setNewGuestIsVegetarian(e.target.checked)}
                    className="rounded text-[#2D3B36] focus:ring-[#C5A880]"
                  />
                  <span className="text-xs text-[#2D3B36] font-medium">
                    需要素食套餐 (1 份)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newGuestNeedBabyChair}
                    onChange={(e) => setNewGuestNeedBabyChair(e.target.checked)}
                    className="rounded text-[#2D3B36] focus:ring-[#C5A880]"
                  />
                  <span className="text-xs text-[#2D3B36] font-medium">
                    需要安排兒童安全座椅 (1 張)
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                  祝賀祝福語 (選填)
                </label>
                <textarea
                  rows={2}
                  placeholder="寫下親友的祝福語或備註..."
                  value={newGuestMessage}
                  onChange={(e) => setNewGuestMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8E5DF] text-stone-600 hover:bg-[#FAF9F5]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2D3B36] text-[#FAF9F5] hover:bg-[#1E2824] font-medium shadow-xs"
                >
                  確認建立賓客
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: 祝福留言詳情彈窗
      ========================================= */}
      {selectedMessageGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#E8E5DF] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#C5A880]" />
                <h4 className="font-serif text-sm font-bold text-[#2D3B36]">
                  來自 {selectedMessageGuest.name} 的祝福
                </h4>
              </div>
              <button
                onClick={() => setSelectedMessageGuest(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#2D3B36] leading-relaxed italic bg-[#FAF9F5] p-4 rounded-xl border border-[#E8E5DF]">
              "{selectedMessageGuest.message}"
            </p>

            <div className="text-[11px] text-[#8E8A83] flex items-center justify-between pt-1">
              <span>登記時間：{selectedMessageGuest.createdAt}</span>
              <span>聯絡電話：{selectedMessageGuest.phone}</span>
            </div>

            <button
              onClick={() => setSelectedMessageGuest(null)}
              className="w-full py-2 rounded-xl bg-[#2D3B36] text-[#FAF9F5] text-xs font-medium"
            >
              關閉
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
