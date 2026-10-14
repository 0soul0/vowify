'use client';

import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  User as UserIcon,
  Mail,
  Lock,
  Save,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  FolderHeart,
  Calendar,
  Shield,
  AlertCircle,
} from 'lucide-react';

/* ─────────────────────────────────────────
   型別：僅依賴 localStorage，無後端
───────────────────────────────────────── */
type Locale = 'zh-TW' | 'zh-CN' | 'en' | 'ja';

interface StoredUser {
  name: string;
  email: string;
}

interface StoredProject {
  id: string;
  title: string;
  groomName?: string;
  brideName?: string;
  weddingDate?: string;
}

/* ─────────────────────────────────────────
   內嵌翻譯（package 獨立，不依賴 app i18n）
───────────────────────────────────────── */
const T: Record<Locale, Record<string, string>> = {
  'zh-TW': {
    back: '返回',
    profileTitle: '個人帳號設定',
    profileSettingsTitle: '帳戶資訊與安全設定',
    displayNameLabel: '顯示名稱',
    emailLabel: '電子郵件信箱',
    currentPasswordLabel: '目前密碼（選填，不修改請留空）',
    newPasswordLabel: '新密碼（至少 6 個字元）',
    saveProfile: '儲存變更',
    profileSaved: '帳號資料更新成功',
    profileSavedDesc: '您的顯示名稱與帳號設定已成功儲存',
    accountInfo: '帳戶基本資訊',
    linkedProjects: '已連結婚禮專案',
    noProjects: '尚無連結專案',
    memberSince: '加入時間',
    goToProjects: '前往專案總覽',
    logoutConfirmTitle: '確認登出帳號？',
    logoutConfirmDesc: '登出後，您需要重新輸入帳號密碼才能繼續管理婚禮專案。',
    logoutConfirm: '確認登出',
    cancel: '取消',
    logout: '登出帳號',
    loading: '載入中...',
    passwordMismatch: '兩次輸入的密碼不一致',
    passwordMinLength: '密碼長度需至少 6 個字元',
    honorPlan: '尊榮婚禮方案',
    saveSuccess: '已成功儲存',
    confirmNewPasswordLabel: '確認新密碼',
  },
  'zh-CN': {
    back: '返回',
    profileTitle: '个人账号设置',
    profileSettingsTitle: '账户信息与安全设置',
    displayNameLabel: '显示名称',
    emailLabel: '电子邮箱地址',
    currentPasswordLabel: '当前密码（选填，不修改请留空）',
    newPasswordLabel: '新密码（至少 6 个字符）',
    saveProfile: '保存更改',
    profileSaved: '账号资料更新成功',
    profileSavedDesc: '您的显示名称与账号设置已成功保存',
    accountInfo: '账户基本信息',
    linkedProjects: '已关联婚礼项目',
    noProjects: '暂无关联项目',
    memberSince: '加入时间',
    goToProjects: '前往项目总览',
    logoutConfirmTitle: '确认退出登录？',
    logoutConfirmDesc: '退出后，您需要重新输入账号密码才能继续管理婚礼项目。',
    logoutConfirm: '确认退出',
    cancel: '取消',
    logout: '退出登录',
    loading: '加载中...',
    passwordMismatch: '两次输入的密码不一致',
    passwordMinLength: '密码长度至少需要 6 个字符',
    honorPlan: '尊荣婚礼方案',
    saveSuccess: '已成功保存',
    confirmNewPasswordLabel: '确认新密码',
  },
  'en': {
    back: 'Back',
    profileTitle: 'Account Settings',
    profileSettingsTitle: 'Account Info & Security',
    displayNameLabel: 'Display Name',
    emailLabel: 'Email Address',
    currentPasswordLabel: 'Current Password (leave blank to keep unchanged)',
    newPasswordLabel: 'New Password (min. 6 characters)',
    saveProfile: 'Save Changes',
    profileSaved: 'Account updated successfully',
    profileSavedDesc: 'Your display name and account settings have been saved.',
    accountInfo: 'Account Information',
    linkedProjects: 'Linked Wedding Projects',
    noProjects: 'No projects yet',
    memberSince: 'Member Since',
    goToProjects: 'Go to Projects Hub',
    logoutConfirmTitle: 'Sign Out of Your Account?',
    logoutConfirmDesc: 'You will need to sign in again to manage your wedding projects.',
    logoutConfirm: 'Confirm Sign Out',
    cancel: 'Cancel',
    logout: 'Log Out',
    loading: 'Loading...',
    passwordMismatch: 'Passwords do not match',
    passwordMinLength: 'Password must be at least 6 characters',
    honorPlan: 'Premium Wedding Plan',
    saveSuccess: 'Saved successfully',
    confirmNewPasswordLabel: 'Confirm New Password',
  },
  'ja': {
    back: '戻る',
    profileTitle: 'アカウント設定',
    profileSettingsTitle: 'アカウント情報とセキュリティ',
    displayNameLabel: '表示名',
    emailLabel: 'メールアドレス',
    currentPasswordLabel: '現在のパスワード（変更しない場合は空白）',
    newPasswordLabel: '新しいパスワード（6文字以上）',
    saveProfile: '変更を保存',
    profileSaved: 'アカウントを更新しました',
    profileSavedDesc: '表示名とアカウント設定を保存しました。',
    accountInfo: 'アカウント情報',
    linkedProjects: '連携プロジェクト',
    noProjects: 'プロジェクトなし',
    memberSince: '登録日',
    goToProjects: 'プロジェクト一覧へ',
    logoutConfirmTitle: 'ログアウトしますか？',
    logoutConfirmDesc: '再度ログインしないと、結婚式プロジェクトの管理ができなくなります。',
    logoutConfirm: 'ログアウトする',
    cancel: 'キャンセル',
    logout: 'ログアウト',
    loading: '読み込み中...',
    passwordMismatch: 'パスワードが一致しません',
    passwordMinLength: 'パスワードは6文字以上で入力してください',
    honorPlan: 'プレミアムプラン',
    saveSuccess: '保存しました',
    confirmNewPasswordLabel: '新しいパスワード（確認）',
  },
};

export function UserPageModule() {
  const [locale, setLocale] = useState<Locale>('zh-TW');
  const [user, setUser] = useState<StoredUser | null>(null);
  const [projects, setProjects] = useState<StoredProject[]>([]);
  const [memberSince] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Logout modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Read locale & user from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('vowify_locale') as Locale | null;
    if (saved && T[saved]) setLocale(saved);

    const userRaw = localStorage.getItem('vowify_auth_user');
    if (userRaw) {
      try {
        const parsed: StoredUser = JSON.parse(userRaw);
        setUser(parsed);
        setDisplayName(parsed.name || '');
      } catch { /* ignore */ }
    }

    const projectsRaw = localStorage.getItem('vowify_projects');
    if (projectsRaw) {
      try {
        const parsed: StoredProject[] = JSON.parse(projectsRaw);
        setProjects(parsed);
      } catch { /* ignore */ }
    }
  }, []);

  const t = (key: string) => T[locale]?.[key] ?? T['zh-TW']?.[key] ?? key;

  const avatarText = displayName
    ? displayName.slice(0, 2).toUpperCase()
    : user?.name?.slice(0, 2).toUpperCase() ?? '??';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSaveSuccessMsg('');

    if (newPassword && newPassword !== confirmNewPassword) {
      setErrorMsg(t('passwordMismatch'));
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setErrorMsg(t('passwordMinLength'));
      return;
    }

    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));

    // Update name in localStorage
    const updatedUser: StoredUser = { name: displayName.trim() || user?.name || '', email: user?.email || '' };
    localStorage.setItem('vowify_auth_user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Update password in registered_users store if new pw provided
    if (newPassword) {
      try {
        const stored = localStorage.getItem('vowify_registered_users');
        if (stored) {
          const users: Array<{ email: string; password: string; name: string }> = JSON.parse(stored);
          const idx = users.findIndex((u) => u.email === updatedUser.email);
          if (idx !== -1) {
            users[idx].password = newPassword;
            users[idx].name = updatedUser.name;
            localStorage.setItem('vowify_registered_users', JSON.stringify(users));
          }
        }
      } catch { /* ignore */ }
    }

    setIsSaving(false);
    setSaveSuccessMsg(t('saveSuccess'));
    setNewPassword('');
    setConfirmNewPassword('');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('vowify_auth_user');
    document.cookie = 'vowify_auth=;path=/;max-age=0;SameSite=Lax';
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2D3B36] selection:bg-[#C5A880]/30">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E8E5DF] px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <a
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#6A665E] hover:text-[#2D3B36] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>{t('back')}</span>
        </a>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2D3B36] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
          </div>
          <span className="font-serif text-sm font-bold tracking-wider text-[#2D3B36]">VOWIFY</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* ── Page Title ── */}
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D3B36] tracking-tight">{t('profileTitle')}</h1>
          <p className="text-xs text-[#8E8A83] mt-1">{t('profileSettingsTitle')}</p>
        </div>

        {/* ── Avatar + Account Info Card ── */}
        <div className="bg-white border border-[#E8E5DF] rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(45,59,54,0.04)]">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="w-14 h-14 rounded-2xl bg-[#2D3B36] flex items-center justify-center text-[#C5A880] font-serif text-xl font-bold shadow-sm select-none"
              >
                {avatarText}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" title="Active" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-serif text-base font-bold text-[#2D3B36] truncate">
                  {displayName || user?.name || '—'}
                </p>
                {/* Logout button (desktop) */}
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E5DF] text-xs font-medium text-[#6A665E] hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-all shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t('logout')}
                </button>
              </div>
              <p className="text-xs text-[#8E8A83] mt-0.5 truncate">{user?.email || '—'}</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#2D3B36]/8 text-[#2D3B36] border border-[#E8E5DF]">
                  <Shield className="w-3 h-3 text-[#C5A880]" />
                  {t('honorPlan')}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[#8E8A83] px-2.5 py-0.5 rounded-full border border-[#E8E5DF]">
                  <Calendar className="w-3 h-3" />
                  {t('memberSince')} {memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Edit Form ── */}
        <div className="bg-white border border-[#E8E5DF] rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(45,59,54,0.04)]">
          <div className="flex items-center gap-2 mb-5">
            <UserIcon className="w-4 h-4 text-[#C5A880]" />
            <h2 className="font-serif text-base font-bold text-[#2D3B36]">{t('accountInfo')}</h2>
          </div>

          {/* Success Toast */}
          {saveSuccessMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Error */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Display Name & Email in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#4A4844] uppercase tracking-wider">
                  {t('displayNameLabel')}
                </label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 text-[#8E8A83] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ethan & Olivia"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] placeholder-[#A6A29A] text-xs focus:outline-none focus:border-[#C5A880] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email (readonly) */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#4A4844] uppercase tracking-wider">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#8E8A83] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#F2EFE9] border border-[#E8E5DF] text-[#8E8A83] text-xs cursor-not-allowed select-none"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="pt-2 border-t border-[#E8E5DF]/70">
              <div className="flex items-center gap-2 mt-3 mb-3">
                <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="text-[11px] font-semibold text-[#4A4844] uppercase tracking-wider">
                  {t('currentPasswordLabel')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-[#4A4844] uppercase tracking-wider">
                    {t('newPasswordLabel')}
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[#8E8A83] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setErrorMsg(''); }}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] placeholder-[#A6A29A] text-xs focus:outline-none focus:border-[#C5A880] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-[#4A4844] uppercase tracking-wider">
                    {t('confirmNewPasswordLabel')}
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[#8E8A83] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => { setConfirmNewPassword(e.target.value); setErrorMsg(''); }}
                      placeholder="••••••••"
                      disabled={!newPassword}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] text-[#2D3B36] placeholder-[#A6A29A] text-xs focus:outline-none focus:border-[#C5A880] focus:bg-white transition-all disabled:opacity-50 disabled:bg-[#F2EFE9] disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2D3B36] hover:bg-[#1E2824] text-[#FAF9F5] text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{isSaving ? t('loading') : t('saveProfile')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* ── Linked Projects ── */}
        <div className="bg-white border border-[#E8E5DF] rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(45,59,54,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderHeart className="w-4 h-4 text-[#C5A880]" />
              <h2 className="font-serif text-base font-bold text-[#2D3B36]">{t('linkedProjects')}</h2>
            </div>
            <a
              href="/projects"
              className="text-[11px] font-medium text-[#C5A880] hover:text-[#9e835e] transition-colors"
            >
              {t('goToProjects')} →
            </a>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-6 text-xs text-[#8E8A83] space-y-1.5">
              <FolderHeart className="w-6 h-6 text-[#E8E5DF] mx-auto" />
              <p>{t('noProjects')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.slice(0, 6).map((p) => (
                <a
                  key={p.id}
                  href={`/dashboard/${p.id}`}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DF] hover:border-[#C5A880] hover:bg-white transition-all group"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-[#2D3B36] truncate">
                      {p.groomName && p.brideName
                        ? `${p.groomName} & ${p.brideName}`
                        : p.title || p.id}
                    </p>
                    {p.weddingDate && (
                      <p className="text-[10px] text-[#8E8A83] mt-0.5 flex items-center gap-1 truncate">
                        <Calendar className="w-3 h-3 shrink-0" />
                        {p.weddingDate}
                      </p>
                    )}
                  </div>
                  <ArrowLeft className="w-3.5 h-3.5 text-[#8E8A83] rotate-180 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ── Mobile Logout ── */}
        <div className="sm:hidden">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full py-3.5 rounded-2xl border border-rose-200 text-rose-600 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t('logout')}
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-[#A6A29A] pb-4">
          © {new Date().getFullYear()} Vowify. Luxury Digital Wedding Platform.
        </footer>
      </div>

      {/* ── Logout Confirm Modal ── */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLogoutModal(false)}
        >
          <div className="absolute inset-0 bg-[#2D3B36]/30 backdrop-blur-sm" />
          <div
            className="relative bg-white border border-[#E8E5DF] rounded-3xl p-8 shadow-[0_24px_60px_rgba(45,59,54,0.15)] max-w-sm w-full animate-in zoom-in-95 fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-rose-500" />
              </div>
            </div>
            <div className="text-center space-y-2 mb-7">
              <h2 className="font-serif text-lg font-bold text-[#2D3B36]">{t('logoutConfirmTitle')}</h2>
              <p className="text-xs text-[#8E8A83] leading-relaxed max-w-xs mx-auto">{t('logoutConfirmDesc')}</p>
            </div>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t('logoutConfirm')}
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-3 rounded-2xl bg-[#F2EFE9] hover:bg-[#EAE5DF] text-[#4A4844] text-xs font-medium transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}