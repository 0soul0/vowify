import { InvitePage } from "@/features/invite";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ethan & Olivia 婚禮邀請函 | 誠摯邀請您蒞臨我們的幸福時刻",
  description: "2026.11.28 台北萬豪酒店，期待與您一同見證美好誓言，點擊填寫 RSVP 出席意願。",
};

export default function InviteDefaultPage() {
  return <InvitePage />;
}
