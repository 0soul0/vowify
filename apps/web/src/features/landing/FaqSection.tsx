'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useI18n } from '@/shared/i18n/I18nContext';

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { locale, t } = useI18n();

  const faqsByLocale: Record<string, FaqItem[]> = {
    'zh-TW': [
      {
        question: '親友點開電子喜帖需要額外下載 App 或註冊帳號嗎？',
        answer: '完全不需要！親友只要透過 LINE、Facebook Messenger、Instagram 或簡訊點開專屬連結，即可直接在手機瀏覽器開啟高質感喜帖，並在 30 秒內完成 RSVP 表單填寫。',
      },
      {
        question: '婚宴長輩與不擅長科技的親友，閱讀起來會不會有困難？',
        answer: 'Vowify 採用大字體、極簡直覺的按鈕設計與高對比排版，無論是 iPhone 還是 Android 手機皆能完美呈現。長輩也能一鍵點擊「撥打新人電話」或「開啟 Google 地圖導航」，操作體驗極為親切。',
      },
      {
        question: 'RSVP 收集到的賓客名單，可以匯出成 Excel 給飯店或婚顧嗎？',
        answer: '是的！在「新人管理後台」隨時可以一鍵下載 UTF-8 編碼的標準 Excel/CSV 檔案，名單中清楚列出賓客姓名、聯絡電話、出席席次、葷素食需求、兒童椅張數與祝福留言，可直接交給飯店婚企備席。',
      },
      {
        question: '製作喜帖後，如果臨時要修改宴客時間或照片，網址會變動嗎？',
        answer: '喜帖專屬網址永遠不變！您隨時可以在後台更新婚宴時間、地點、婚紗照片或愛情故事，儲存後所有親友看到的喜帖皆會即時同步更新，再也不必擔心紙本印錯重印的窘境。',
      },
      {
        question: '婚禮結束後，電子喜帖與相簿會被刪除嗎？',
        answer: '尊榮版方案提供「永久保存珍藏」服務。婚禮過後，喜帖將轉為永恆的雲端紀念網頁，供您與另一半在每一個結婚紀念日重溫當年的誓言與親友祝福。',
      },
    ],
    'zh-CN': [
      {
        question: '亲友点开电子请帖需要额外下载 App 或注册账号吗？',
        answer: '完全不需要！亲友只要通过微信、短信等直接点击专属链接，即可在手机浏览器开启高品质请帖，并在 30 秒内完成 RSVP 回复。',
      },
      {
        question: '长辈与不熟悉智能手机的亲友，阅读起来会有困难吗？',
        answer: 'Vowify 采用大字体、直觉式按钮设计与高对比度排版，各品牌手机皆能完美呈现。长辈也能一键点击致电新人或开启地图导航，体验极度亲切。',
      },
      {
        question: '收集到的宾客名单，可以导出成 Excel 给酒店或婚庆吗？',
        answer: '是的！在后台随时可以一键下载标准 Excel/CSV 文件，名单中清晰列出宾客姓名、电话、席位、荤素食需求、儿童椅数量与祝福留言。',
      },
      {
        question: '制作请帖后，如果临时修改时间或照片，网址会变动吗？',
        answer: '专属网址永久不变！您随时可在后台修改任何细节，保存后亲友看到的请帖立刻实时同步，免去重印纸质请帖的烦恼。',
      },
      {
        question: '婚礼结束后，电子请帖与相册会被删除吗？',
        answer: '尊荣版方案提供永久保存服务。婚礼过后，请帖将转为永恒的云端纪念网页，随时重温当年的誓言与祝福。',
      },
    ],
    'en': [
      {
        question: 'Do guests need to download an app or register to view the invitation?',
        answer: 'Not at all! Guests simply tap the link sent via WhatsApp, SMS, or Messenger, and the gorgeous invitation opens instantly in their mobile browser. Filling out the RSVP takes less than 30 seconds.',
      },
      {
        question: 'Is it easy for older relatives or less tech-savvy guests to use?',
        answer: 'Yes! Vowify is built with legible typography, high contrast, and clean touch-friendly buttons. Older relatives can effortlessly navigate, view photos, tap to call, or open Google Maps directions.',
      },
      {
        question: 'Can I export the RSVP responses to Excel for my caterer and wedding planner?',
        answer: 'Absolutely. You can download a clean, structured UTF-8 Excel / CSV spreadsheet anytime from your dashboard, containing party sizes, dietary requirements, booster chair counts, and guest messages.',
      },
      {
        question: 'If we need to change our wedding date or photos later, will the link change?',
        answer: 'Your bespoke link never changes. Any edits you make in the dashboard reflect instantly on the live invitation for all guests, eliminating costly reprint emergencies.',
      },
      {
        question: 'Will our digital invitation be deleted after the wedding?',
        answer: 'Our Prestige Plan includes permanent cloud preservation. Your wedding invitation turns into a timeless digital keepsake page for you to revisit on every anniversary.',
      },
    ],
    'ja': [
      {
        question: 'ゲストが招待状を見るためにアプリのダウンロードや会員登録は必要ですか？',
        answer: '一切不要です！LINEやメール、SMSで届いた専用URLをタップするだけで、スマホのブラウザで美しい招待状が開き、30秒で出欠回答が完了します。',
      },
      {
        question: '年配の親族やスマートフォンに不慣れな方でも見やすいですか？',
        answer: '大きな文字サイズ、見やすいコントラスト、分かりやすいボタン配置を徹底しています。ワンタップでのGoogleマップ起動や電話発信にも対応し、どなたでも安心してお使いいただけます。',
      },
      {
        question: '集まった出欠名簿は式場やプランナーへ提出するExcelとして出力できますか？',
        answer: 'はい！新郎新婦専用の管理画面から、いつでもワンクリックで標準Excel / CSV形式で書き出せます。お名前、電話番号、人数、アレルギー・食事制限、お子様椅子の有無がすべてまとまっています。',
      },
      {
        question: '公開後に挙式日時や写真の変更があった場合、URLは変わりますか？',
        answer: '招待状のURLは変わりません！管理画面から修正して保存すれば、ゲストが見る画面も即座にリアルタイムで更新されます。紙の印刷ミスの心配もありません。',
      },
      {
        question: '挙式が終わった後、招待状やアルバムは削除されますか？',
        answer: 'プレミアムプランでは永久アーカイブ保存を提供しております。結婚式後も記念のWEBアルバムとして残り、毎年の結婚記念日に誓いと祝福を振り返ることができます。',
      },
    ],
  };

  const currentFaqs = faqsByLocale[locale] || faqsByLocale['zh-TW'];

  return (
    <section id="faq" className="py-24 bg-[#FAF9F5]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E5DF] text-xs font-semibold text-[#8E8A83] uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#C5A880]" />
            {t('faqBadge')}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D3B36] tracking-tight">
            {t('faqTitle')}
          </h2>
          <p className="text-sm text-[#6A665E]">
            {t('faqSubtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {currentFaqs.map((faq, index) => {
            const isOpen = openIdx === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-white border border-[#E8E5DF] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#FAF9F5]/60 transition-colors"
                >
                  <span className="font-medium text-sm sm:text-base text-[#2D3B36]">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#C5A880] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8E8A83] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#6A665E] leading-relaxed border-t border-[#E8E5DF]/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
