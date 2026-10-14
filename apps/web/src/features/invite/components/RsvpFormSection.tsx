'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  HeartHandshake, 
  UserCheck, 
  UserX, 
  Utensils, 
  Baby, 
  Send, 
  CheckCircle2, 
  Heart
} from 'lucide-react';
import { RsvpSubmission } from '../types';
import { useI18n } from '@/shared/i18n/I18nContext';

interface RsvpFormSectionProps {
  deadline: string;
  onSubmitSuccess: (data: RsvpSubmission) => void;
}

export function RsvpFormSection({ deadline, onSubmitSuccess }: RsvpFormSectionProps) {
  const { t } = useI18n();
  const [attending, setAttending] = useState<boolean>(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attendeesCount, setAttendeesCount] = useState<number>(1);
  const [isVegetarian, setIsVegetarian] = useState<boolean>(false);
  const [vegetarianCount, setVegetarianCount] = useState<number>(1);
  const [needBabyChair, setNeedBabyChair] = useState<boolean>(false);
  const [babyChairCount, setBabyChairCount] = useState<number>(1);
  const [relation, setRelation] = useState<'groom' | 'bride' | 'mutual' | 'family'>('groom');
  const [message, setMessage] = useState('');
  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: RsvpSubmission = {
      name: name.trim(),
      phone: phone.trim() || '未提供',
      attending,
      attendeesCount: attending ? Number(attendeesCount) : 0,
      isVegetarian: attending && isVegetarian,
      vegetarianCount: attending && isVegetarian ? Number(vegetarianCount) : 0,
      needBabyChair: attending && needBabyChair,
      babyChairCount: attending && needBabyChair ? Number(babyChairCount) : 0,
      relation,
      message: message.trim(),
    };

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C5A880', '#2D3B36', '#EAE5DD', '#D4A373'],
      });
    }

    setSubmitted(true);
    onSubmitSuccess(payload);
  };

  return (
    <section id="rsvp" className="py-20 px-6 bg-white border-b border-[#E8E5DF]">
      <div className="max-w-md mx-auto space-y-6">
        {/* Section Heading */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E8E5DF] text-[10px] uppercase tracking-widest text-[#8E8A83] font-medium">
            <HeartHandshake className="w-3 h-3 text-[#C5A880]" />
            <span>RSVP Attendance</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D3B36] tracking-tight">
            {t('rsvpTitle')}
          </h2>
          <p className="text-xs text-[#8E8A83]">
            {t('rsvpNote')}
          </p>
        </div>

        {/* Success State */}
        {submitted ? (
          <div className="p-8 rounded-3xl bg-[#FAF9F5] border border-[#C5A880]/40 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full bg-[#2D3B36] text-[#C5A880] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8 text-[#C5A880]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#2D3B36]">
                {t('thankYouRsvp')}
              </h3>
              <p className="text-xs text-[#6A665E] leading-relaxed max-w-xs mx-auto">
                {attending
                  ? t('thankYouAttending')
                  : t('thankYouDeclined')}
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#8E8A83] hover:text-[#2D3B36] underline"
              >
                修改或再次填寫
              </button>
            </div>
          </div>
        ) : (
          /* RSVP Form */
          <form
            onSubmit={handleSubmit}
            className="p-6 rounded-3xl bg-[#FAF9F5] border border-[#E8E5DF] space-y-5 text-left text-xs"
          >
            {/* Attendance Toggle Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`py-3 px-3 rounded-2xl border flex items-center justify-center gap-2 font-medium transition-all ${
                  attending
                    ? 'bg-[#2D3B36] text-[#FAF9F5] border-[#2D3B36] shadow-xs'
                    : 'bg-white text-[#6A665E] border-[#E8E5DF] hover:border-[#C5A880]'
                }`}
              >
                <UserCheck className="w-4 h-4 text-[#C5A880]" />
                <span>{t('rsvpAttendingBtn')}</span>
              </button>

              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`py-3 px-3 rounded-2xl border flex items-center justify-center gap-2 font-medium transition-all ${
                  !attending
                    ? 'bg-stone-700 text-[#FAF9F5] border-stone-700 shadow-xs'
                    : 'bg-white text-[#6A665E] border-[#E8E5DF] hover:border-[#C5A880]'
                }`}
              >
                <UserX className="w-4 h-4 text-stone-400" />
                <span>{t('rsvpDeclinedBtn')}</span>
              </button>
            </div>

            {/* Name & Phone */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                  {t('guestName')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="例：王小明 & 夫人"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E5DF] text-[#2D3B36] placeholder-[#8E8A83] focus:outline-hidden focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                  {t('contactPhone')}
                </label>
                <input
                  type="tel"
                  placeholder="0912-345-678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E5DF] text-[#2D3B36] placeholder-[#8E8A83] focus:outline-hidden focus:border-[#C5A880]"
                />
              </div>
            </div>

            {/* Attendees & Relation */}
            {attending && (
              <div className="space-y-3 pt-1 border-t border-[#E8E5DF]/70">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                      {t('totalAttendees')}
                    </label>
                    <select
                      value={attendeesCount}
                      onChange={(e) => setAttendeesCount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880]"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {t('unitSeats')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#6A665E] mb-1">
                      {t('guestRelation')}
                    </label>
                    <select
                      value={relation}
                      onChange={(e) => setRelation(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E8E5DF] text-[#2D3B36] focus:outline-hidden focus:border-[#C5A880]"
                    >
                      <option value="groom">{t('relationGroom')}</option>
                      <option value="bride">{t('relationBride')}</option>
                      <option value="family">{t('relationFamily')}</option>
                      <option value="mutual">{t('relationFriend')}</option>
                    </select>
                  </div>
                </div>

                {/* Special Needs: Vegetarian & Baby Chair */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8E5DF] space-y-3">
                  {/* Vegetarian */}
                  <div className="space-y-2">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="flex items-center gap-2 font-medium text-[#2D3B36]">
                        <Utensils className="w-3.5 h-3.5 text-[#C5A880]" />
                        {t('needVeg')}
                      </span>
                      <input
                        type="checkbox"
                        checked={isVegetarian}
                        onChange={(e) => setIsVegetarian(e.target.checked)}
                        className="rounded text-[#2D3B36] focus:ring-[#C5A880]"
                      />
                    </label>
                    {isVegetarian && (
                      <div className="pl-6 flex items-center gap-2">
                        <span className="text-[11px] text-[#8E8A83]">{t('vegetarianSeats')}：</span>
                        <input
                          type="number"
                          min="1"
                          max={attendeesCount}
                          value={vegetarianCount}
                          onChange={(e) => setVegetarianCount(Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs rounded-lg border border-[#E8E5DF]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Baby Chair */}
                  <div className="space-y-2 pt-2 border-t border-[#E8E5DF]/70">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="flex items-center gap-2 font-medium text-[#2D3B36]">
                        <Baby className="w-3.5 h-3.5 text-[#C5A880]" />
                        {t('needBabyChair')}
                      </span>
                      <input
                        type="checkbox"
                        checked={needBabyChair}
                        onChange={(e) => setNeedBabyChair(e.target.checked)}
                        className="rounded text-[#2D3B36] focus:ring-[#C5A880]"
                      />
                    </label>
                    {needBabyChair && (
                      <div className="pl-6 flex items-center gap-2">
                        <span className="text-[11px] text-[#8E8A83]">{t('babyChairs')}：</span>
                        <input
                          type="number"
                          min="1"
                          max={attendeesCount}
                          value={babyChairCount}
                          onChange={(e) => setBabyChairCount(Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs rounded-lg border border-[#E8E5DF]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Couple Wishes & Message */}
            <div className="space-y-1 pt-1">
              <label className="block text-[11px] font-medium text-[#6A665E]">
                {t('coupleWishes')}
              </label>
              <textarea
                rows={3}
                placeholder="寫下您對新人的暖心祝福..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E5DF] text-[#2D3B36] placeholder-[#8E8A83] focus:outline-hidden focus:border-[#C5A880]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] font-semibold text-xs tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
            >
              <span>{t('submitRsvp')}</span>
              <Send className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
