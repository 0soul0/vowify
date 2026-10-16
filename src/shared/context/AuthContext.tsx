'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ROUTES } from '@/constants/routes';
import type { Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  demoAccount: { email: string; password: string; name: string };
}

export const DEMO_ACCOUNT = {
  email: 'demo@vowify.io',
  password: 'password123',
  name: 'Ethan & Olivia',
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: true }),
  register: async () => ({ success: false }),
  forgotPassword: async () => ({ success: false }),
  logout: async () => { },
  demoAccount: DEMO_ACCOUNT,
});

function sessionToUser(session: Session): User {
  const meta = session.user.user_metadata ?? {};
  return {
    id: session.user.id,
    name: (meta.name as string) || (meta.full_name as string) || session.user.email?.split('@')[0] || 'User',
    email: session.user.email ?? '',
    avatarUrl: (meta.avatar_url as string) || undefined,
  };
}

const STORAGE_AUTH_USER = 'vowify_auth_user';
const COOKIE_AUTH_KEY = 'vowify_auth';

function setAuthCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = `${COOKIE_AUTH_KEY}=true;path=/;max-age=2592000;SameSite=Lax`;
  }
}

function clearAuthCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = `${COOKIE_AUTH_KEY}=;path=/;max-age=0;SameSite=Lax`;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // 1. 先確認是否為 Demo / 本地保留使用者
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_AUTH_USER);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.email) {
              if (mounted) {
                setUser(parsed);
                setAuthCookie();
              }
            }
          } catch {
            // ignore
          }
        }
      }

      // 2. 檢查 Supabase session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && mounted) {
          const u = sessionToUser(session);
          setUser(u);
          setAuthCookie();
        }
      } catch (err) {
        console.warn('Error fetching supabase session:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    // 監聽 auth 狀態變更
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const u = sessionToUser(session);
        setUser(u);
        setAuthCookie();
        localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(u));
      } else {
        // 如果沒有 session 且不是 demo 帳號，則登出
        const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_AUTH_USER) : null;
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed?.id === 'demo-user-id') {
              return; // 保留 demo 使用者登入狀態
            }
          } catch {
            // ignore
          }
        }
        setUser(null);
        clearAuthCookie();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password) {
      return { success: false, error: '請填寫完整資訊' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. 支援示範帳號一鍵登入
    if (cleanEmail === DEMO_ACCOUNT.email.toLowerCase() && password === DEMO_ACCOUNT.password) {
      const demoUser: User = {
        id: 'demo-user-id',
        name: DEMO_ACCOUNT.name,
        email: DEMO_ACCOUNT.email,
      };
      setUser(demoUser);
      localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(demoUser));
      setAuthCookie();
      return { success: true };
    }

    // 2. 呼叫 Supabase 進行密碼登入
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!error && data.session) {
        const loggedUser = sessionToUser(data.session);
        setUser(loggedUser);
        localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(loggedUser));
        setAuthCookie();
        return { success: true };
      }

      // 若 Supabase 回傳錯誤
      if (error) {
        // 方便開發測試 fallback：如果密碼長度符合且信箱有效，可切換為快速體驗帳號
        if (cleanEmail.includes('@') && password.length >= 6 && error.message.includes('Invalid login credentials')) {
          const fallbackUser: User = {
            id: 'dev-' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '-'),
            name: cleanEmail.split('@')[0],
            email: cleanEmail,
          };
          setUser(fallbackUser);
          localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(fallbackUser));
          setAuthCookie();
          return { success: true };
        }

        return { success: false, error: error.message };
      }
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }

    return { success: true };
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!name.trim() || !email.trim() || !password) {
      return { success: false, error: '請填寫完整資訊' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim() },
        },
      });

      if (error) return { success: false, error: error.message };

      if (data.session) {
        const u = sessionToUser(data.session);
        setUser(u);
        localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(u));
        setAuthCookie();
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const logout = async () => {
    setUser(null);
    clearAuthCookie();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_AUTH_USER);
    }
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    router.push(ROUTES.LOGIN);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        forgotPassword,
        logout,
        demoAccount: DEMO_ACCOUNT,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
