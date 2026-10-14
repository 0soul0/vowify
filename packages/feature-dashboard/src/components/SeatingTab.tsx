'use client';

import React, { useState } from 'react';
import { 
  Grid2X2, 
  Users, 
  Plus, 
  Sparkles, 
  UtensilsCrossed, 
  Baby, 
  Crown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Guest } from '../types';

interface SeatingTabProps {
  guests: Guest[];
}

interface TableData {
  id: string;
  name: string;
  capacity: number;
  category: 'main' | 'family' | 'friends';
}

const initialTables: TableData[] = [
  { id: 't-1', name: '主桌 A1 (新人與雙方主婚人)', capacity: 10, category: 'main' },
  { id: 't-2', name: '至親貴賓桌 A2 (男方長輩親族)', capacity: 10, category: 'family' },
  { id: 't-3', name: '至親貴賓桌 B1 (女方長輩親族)', capacity: 10, category: 'family' },
  { id: 't-4', name: '新郎好友同窗桌 A3', capacity: 10, category: 'friends' },
  { id: 't-5', name: '新郎高中死黨桌 A4', capacity: 10, category: 'friends' },
  { id: 't-6', name: '新娘閨蜜死黨桌 B2', capacity: 10, category: 'friends' },
  { id: 't-7', name: '前同事摯友桌 B3', capacity: 10, category: 'friends' },
];

export function SeatingTab({ guests }: SeatingTabProps) {
  const [tables] = useState<TableData[]>(initialTables);

  // 統計已排入座位與未分配賓客
  const attendingGuests = guests.filter((g) => g.status === 'attending');
  const unassignedGuests = attendingGuests.filter((g) => !g.tableNumber);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8E5DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2D3B36]/10 text-[#2D3B36] text-[11px] font-medium mb-1">
            <Sparkles className="w-3 h-3 text-[#C5A880]" />
            智能排桌助手
          </div>
          <h2 className="font-serif text-lg font-bold text-[#2D3B36]">
            婚宴桌次與席位規劃
          </h2>
          <p className="text-xs text-[#8E8A83] mt-0.5">
            共規劃 {tables.length} 桌（預計容納 {tables.reduce((acc, t) => acc + t.capacity, 0)} 人），尚有 {unassignedGuests.length} 位確認出席親友待排定桌位
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2 rounded-xl bg-[#2D3B36] text-[#FAF9F5] text-xs font-medium hover:bg-[#1E2824] transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
          新增婚宴桌次
        </button>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {tables.map((table) => {
          // 找到分派在此桌的賓客
          const seatedGuests = attendingGuests.filter(
            (g) => g.tableNumber && g.tableNumber.includes(table.name.split(' ')[0])
          );
          const currentOccupied = seatedGuests.reduce(
            (acc, g) => acc + g.attendeesCount,
            0
          );
          const isFull = currentOccupied >= table.capacity;

          return (
            <div
              key={table.id}
              className="p-5 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs space-y-4 hover:border-[#C5A880] transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {table.category === 'main' && (
                      <Crown className="w-4 h-4 text-[#C5A880]" />
                    )}
                    <h3 className="font-serif text-sm font-bold text-[#2D3B36]">
                      {table.name}
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#8E8A83]">
                    容納上限：{table.capacity} 人席
                  </span>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isFull
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  已入座 {currentOccupied} / {table.capacity}
                </span>
              </div>

              {/* Seated Guests Tag List */}
              <div className="space-y-1.5 min-h-[90px] p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF]/70 text-xs">
                {seatedGuests.length === 0 ? (
                  <p className="text-[11px] text-stone-400 py-6 text-center italic">
                    尚無入座賓客
                  </p>
                ) : (
                  seatedGuests.map((g) => (
                    <div
                      key={g.id}
                      className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-white border border-[#E8E5DF] text-[11px]"
                    >
                      <span className="font-medium text-[#2D3B36]">{g.name}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#8E8A83]">
                        <span>{g.attendeesCount} 人</span>
                        {g.isVegetarian && (
                          <span className="text-amber-700 bg-amber-50 px-1 rounded">素</span>
                        )}
                        {g.needBabyChair && (
                          <span className="text-emerald-700 bg-emerald-50 px-1 rounded">椅</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
