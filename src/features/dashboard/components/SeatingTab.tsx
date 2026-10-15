'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Crown,
  Users
} from 'lucide-react';
import { Guest } from '../types';
import { useI18n } from '@/shared/i18n/I18nContext';

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
  { id: 't-1', name: 'Table A1 (Main Table)', capacity: 10, category: 'main' },
  { id: 't-2', name: 'Table A2 (Groom Family)', capacity: 10, category: 'family' },
  { id: 't-3', name: 'Table B1 (Bride Family)', capacity: 10, category: 'family' },
  { id: 't-4', name: 'Table A3 (Groom Friends)', capacity: 10, category: 'friends' },
  { id: 't-5', name: 'Table A4 (College Friends)', capacity: 10, category: 'friends' },
  { id: 't-6', name: 'Table B2 (Bride Friends)', capacity: 10, category: 'friends' },
  { id: 't-7', name: 'Table B3 (Colleagues)', capacity: 10, category: 'friends' },
];

export function SeatingTab({ guests }: SeatingTabProps) {
  const { t } = useI18n();
  const [tables] = useState<TableData[]>(initialTables);

  const attendingGuests = guests.filter((g) => g.status === 'attending');
  const unassignedGuests = attendingGuests.filter((g) => !g.tableNumber);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8E5DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2D3B36]/10 text-[#2D3B36] text-[11px] font-medium mb-1">
            <Sparkles className="w-3 h-3 text-[#C5A880]" />
            <span>{t('seating')}</span>
          </div>
          <h2 className="font-serif text-lg font-bold text-[#2D3B36]">
            {t('seatingTitle')}
          </h2>
          <p className="text-xs text-[#8E8A83] mt-0.5">
            {tables.length} Tables • {unassignedGuests.length} {t('unitSeats')}
          </p>
        </div>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {tables.map((table) => {
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
                    {t('tableCapacity')}：{table.capacity} {t('unitSeats')}
                  </span>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isFull
                      ? 'bg-red-50 text-red-700'
                      : currentOccupied > 0
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {currentOccupied} / {table.capacity}
                </span>
              </div>

              {/* Seated Guests List */}
              <div className="space-y-1.5 pt-2 border-t border-[#E8E5DF]/70">
                <span className="text-[11px] font-medium text-[#8E8A83]">
                  {t('assignedGuests')}
                </span>
                {seatedGuests.length === 0 ? (
                  <p className="text-xs text-stone-400 py-3 text-center italic">
                    -
                  </p>
                ) : (
                  seatedGuests.map((guest) => (
                    <div
                      key={guest.id}
                      className="p-2 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF]/50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-[#8E8A83]" />
                        <span className="font-medium text-[#2D3B36]">
                          {guest.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#8E8A83]">
                        {guest.attendeesCount} {t('unitSeats')}
                      </span>
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
