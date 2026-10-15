import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vowify | 電子喜帖 SaaS 新人管理後台 (Bride & Groom Dashboard)",
  description: "極簡奢華的電子喜帖 SaaS 平台，即時視覺化喜帖編輯器、婚禮倒數與 RSVP 賓客名冊 CRM。",
};

import { I18nProvider } from "@/shared/i18n/I18nContext";
import { AuthProvider } from "@/shared/context/AuthContext";
import { ProjectProvider } from "@/shared/context/ProjectContext";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-TW"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <I18nProvider>
          <AuthProvider>
            <ProjectProvider>
              {children}
            </ProjectProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
