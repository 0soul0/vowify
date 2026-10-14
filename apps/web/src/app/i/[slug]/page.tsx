import { InvitePage } from "@/features/invite";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `我們的婚禮邀請函 | Vowify Digital Invitation`,
    description: `誠摯邀請您蒞臨見證我們的婚禮幸福時刻，點擊查看時間地點與填寫出席意願。`,
  };
}

export default async function DynamicInvitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  return <InvitePage />;
}
