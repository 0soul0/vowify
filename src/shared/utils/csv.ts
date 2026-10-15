import { Guest } from '@/features/dashboard/types';

export function exportGuestsToCsv(guests: Guest[], filenamePrefix = '婚禮賓客名單'): void {
  const headers = [
    '賓客姓名',
    '聯絡電話',
    '出席狀態',
    '席位人數',
    '是否素食',
    '素食數量',
    '是否需要兒童椅',
    '兒童椅數量',
    '親友歸屬',
    '排定桌號',
    '祝福賀詞',
    '回覆登記時間',
  ];

  const rows = guests.map((g) => {
    const statusText =
      g.status === 'attending'
        ? '確認出席'
        : g.status === 'declined'
        ? '遺憾婉拒'
        : '尚未回覆';

    const relationText =
      g.relation === 'groom'
        ? '男方親友'
        : g.relation === 'bride'
        ? '女方親友'
        : g.relation === 'family'
        ? '至親長輩'
        : '共同好友';

    const cleanMessage = (g.message || '').replace(/"/g, '""');

    return [
      `"${g.name}"`,
      `"${g.phone}"`,
      `"${statusText}"`,
      g.attendeesCount,
      g.isVegetarian ? '是' : '否',
      g.vegetarianCount || (g.isVegetarian ? 1 : 0),
      g.needBabyChair ? '是' : '否',
      g.babyChairCount || (g.needBabyChair ? 1 : 0),
      `"${relationText}"`,
      `"${g.tableNumber || '未排定'}"`,
      `"${cleanMessage}"`,
      `"${g.createdAt}"`,
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
