import { WeddingInviteData, GuestbookEntry } from './types';

export const initialInviteData: WeddingInviteData = {
  groomName: 'Ethan Liu',
  brideName: 'Olivia Chen',
  groomNameZh: '劉逸凡',
  brideNameZh: '陳若晴',
  weddingDate: '2026-11-28',
  lunarDate: '十月二十日 (吉日宜嫁娶)',
  weddingTime: '12:00',
  venueName: '台北萬豪酒店 (Taipei Marriott Hotel)',
  hallName: '5F 萬豪廳 (Grand Ballroom)',
  address: '台北市中山區樂群二路 199 號',
  googleMapUrl: 'https://maps.google.com/?q=台北萬豪酒店',
  coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=85&w=1200',
  romanticQuote: '「在浩瀚宇宙中，我們於此相遇，並許下永恆諾言。」',
  storyTitle: '從一杯熱咖啡，到牽手一生',
  storyContent: [
    '2019 年秋天的京都街角，嵐山的楓葉樹下，命運讓我們在同一家咖啡館避雨相遇。一杯拿鐵的溫度，開啟了我們兩人的對話。',
    '歷經了 2,500 個日夜的陪伴、無數次旅行中的歡笑與生活點滴，我們一起佈置了屬於彼此的溫馨小窩。',
    '今天，我們決定牽起彼此的手，在所有最摯愛的家人與好友見證下，邁向人生的下一段美好旅程。',
  ],
  galleryImages: [
    {
      id: 'p-1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      caption: '草山陽光下的誓言',
    },
    {
      id: 'p-2',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
      caption: '彼此凝視的日常溫柔',
    },
    {
      id: 'p-3',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
      caption: '海風與輕快的笑聲',
    },
    {
      id: 'p-4',
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800',
      caption: '最深情的擁抱',
    },
  ],
  musicUrl: 'https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-piano-1264.mp3',
  musicTitle: 'Canon in D (Piano Romance)',
  rsvpDeadline: '2026 年 11 月 05 日',
};

export const initialGuestbookEntries: GuestbookEntry[] = [
  {
    id: 'gb-1',
    name: '林家豪 (大學死黨)',
    relation: '男方親友',
    message: '新婚快樂！從小看你長大，終於找到命中註定的伴侶，替你高興！當天一定準時到場大喝一場！',
    date: '10.10',
  },
  {
    id: 'gb-2',
    name: '張雅晴 Grace',
    relation: '女方閨蜜',
    message: '喜帖美哭了！超級為 Olivia 開心，恭喜你們修成正果，當天我一定準備好衛生紙哭成淚人兒～',
    date: '10.11',
  },
  {
    id: 'gb-3',
    name: '陳冠宇 & 夫人',
    relation: '共同好友',
    message: '恭喜 Ethan & Olivia！帶女兒一起去沾沾你們的幸福喜氣，祝白頭偕老、百年好合！',
    date: '10.12',
  },
];
