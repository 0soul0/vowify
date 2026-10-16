/**
 * Vowify 全站路由定義常數
 */
export const ROUTES = {
  // ── 首頁與展示 ──
  HOME: '/',
  INVITE_DEMO: '/invite',
  INVITATION: (slug: string) => `/i/${encodeURIComponent(slug)}`,

  // ── 帳號認證 ──
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_COMPLETE: '/register/complete',
  FORGOT_PASSWORD: '/forgot-password',
  AUTH_CALLBACK: '/auth/callback',

  // ── 專案與控制台 ──
  PROJECTS: '/projects',
  DASHBOARD: '/dashboard',
  DASHBOARD_DETAIL: (id: string) => `/dashboard/${encodeURIComponent(id)}`,

  // ── 個人中心 ──
  USER: '/user',

  // ── 帶參數輔助建構方法 ──
  buildLoginUrl: (redirectPath?: string) =>
    redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : '/login',
  buildRegisterUrl: (redirectPath?: string) =>
    redirectPath ? `/register?redirect=${encodeURIComponent(redirectPath)}` : '/register',
  buildAuthCallbackUrl: (nextPath?: string) =>
    nextPath ? `/auth/callback?next=${encodeURIComponent(nextPath)}` : '/auth/callback',
} as const;

export type AppRoutes = typeof ROUTES;