'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean }>;
  logout: () => void;
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
  logout: () => { },
  demoAccount: DEMO_ACCOUNT,
});

const STORAGE_AUTH_USER = 'vowify_auth_user';
const COOKIE_AUTH_KEY = 'vowify_auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_AUTH_USER);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.email) {
            setUser(parsed);
            document.cookie = `${COOKIE_AUTH_KEY}=true;path=/;max-age=2592000;SameSite=Lax`;
          }
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // 支援示範帳號或任意已註冊格式
    if (!email || !password) {
      return { success: false, error: '請填寫完整資訊' };
    }

    // 檢查示範帳號或儲存的自訂帳號
    let registeredUsers: Array<{ email: string; password: string; name: string }> = [];
    try {
      const storedUsers = localStorage.getItem('vowify_registered_users');
      if (storedUsers) {
        registeredUsers = JSON.parse(storedUsers);
      }
    } catch {
      registeredUsers = [];
    }

    const matchedUser =
      (email.toLowerCase() === DEMO_ACCOUNT.email.toLowerCase() && password === DEMO_ACCOUNT.password)
        ? { email: DEMO_ACCOUNT.email, name: DEMO_ACCOUNT.name }
        : registeredUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

    if (!matchedUser) {
      // 為兼顧開發測試便利性，若非 demo 帳號但長度大於 3，亦允許體驗登入
      if (email.includes('@') && password.length >= 6) {
        const fallbackUser: User = {
          name: email.split('@')[0],
          email: email.trim(),
        };
        setUser(fallbackUser);
        localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(fallbackUser));
        document.cookie = `${COOKIE_AUTH_KEY}=true;path=/;max-age=2592000;SameSite=Lax`;
        return { success: true };
      }
      return { success: false, error: '帳號或密碼錯誤' };
    }

    const loggedUser: User = {
      name: matchedUser.name,
      email: matchedUser.email,
    };
    setUser(loggedUser);
    localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(loggedUser));
    document.cookie = `${COOKIE_AUTH_KEY}=true;path=/;max-age=2592000;SameSite=Lax`;

    return { success: true };
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!name.trim() || !email.trim() || !password) {
      return { success: false, error: '請填寫完整資訊' };
    }

    try {
      let registeredUsers: Array<{ email: string; password: string; name: string }> = [];
      const storedUsers = localStorage.getItem('vowify_registered_users');
      if (storedUsers) {
        registeredUsers = JSON.parse(storedUsers);
      }

      if (registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: '此電子郵件已經註冊過，請直接登入' };
      }

      const newUserEntry = {
        name: name.trim(),
        email: email.trim(),
        password,
      };
      registeredUsers.push(newUserEntry);
      localStorage.setItem('vowify_registered_users', JSON.stringify(registeredUsers));

      const loggedUser: User = { name: newUserEntry.name, email: newUserEntry.email };
      setUser(loggedUser);
      localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(loggedUser));
      document.cookie = `${COOKIE_AUTH_KEY}=true;path=/;max-age=2592000;SameSite=Lax`;

      return { success: true };
    } catch {
      return { success: false, error: '註冊失敗，請重試' };
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean }> => {
    // 模擬寄信延遲
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_AUTH_USER);
        document.cookie = `${COOKIE_AUTH_KEY}=;path=/;max-age=0;SameSite=Lax`;
      }
    } catch {
      // ignore
    }
    router.push('/login');
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
