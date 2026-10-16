"use server";

import { redis } from "@/lib/redis";
import { resend } from "@/lib/resend";
import { supabase } from "@/lib/supabase";
import bcrypt from 'bcryptjs'
import { DB_TABLES } from "@/lib/supabase";

export async function sendVerificationCode(email: string) {
    // 1. 嚴格驗證 Email 格式與內容
    if (!email || typeof email !== "string" || !email.includes("@")) {
        return { success: false, error: "請提供有效的電子郵件地址" };
    }

    // 2. 檢查伺服器端連線實例是否正常
    if (!redis) {
        return { success: false, error: "伺服器 Redis 設定錯誤" };
    }

    if (!resend) {
        return { success: false, error: "伺服器 Resend 設定錯誤" };
    }

    try {
        // 3. 生成 6 位數隨機驗證碼
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 4. 將驗證碼寫入 Redis，設定 300 秒（5分鐘）後自動過期
        await redis.set(`verify:${email}`, otp, "EX", 300);

        // 5. 透過 Resend 發送驗證信
        // 尚未在 Resend 綁定自訂網域前，必須使用 onboarding@resend.dev 作為寄件者
        const fromEmail = process.env.RESEND_FROM_EMAIL || "Vowify <onboarding@resend.dev>";

        const { error } = await resend.emails.send({
            from: fromEmail,
            to: [email],
            subject: "【驗證碼】您的系統驗證信",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">電子郵件驗證</h2>
          <p>您好，您正在進行身分驗證，請輸入以下 6 位數驗證碼：</p>
          <div style="background-color: #f4f4f5; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4F46E5;">${otp}</span>
          </div>
          <p style="color: #666; font-size: 14px; text-align: center;">此驗證碼有效時間為 5 分鐘。如果您並未請求此信件，請忽略它。</p>
        </div>
      `,
        });

        if (error) {
            console.error("Resend 寄信失敗:", error);
            return { success: false, error: error.message || "驗證信發送失敗，請稍後再試" };
        }

        return { success: true, message: "驗證信已成功發送" };
    } catch (err: any) {
        console.error("發送驗證碼發生未預期錯誤:", err);
        return { success: false, error: err.message || "伺服器發生未預期錯誤" };
    }
}

export async function verifyOtp(email: string, otp: string) {

    if (!otp || typeof otp !== "string" || otp.length !== 6) {
        return { success: false, error: "請提供有效的驗證碼" };
    }

    if (!redis) {
        return { success: false, error: "伺服器 Redis 設定錯誤" };
    }

    try {
        const storedOtp = await redis.get(`verify:${email}`);
        if (!storedOtp) {
            return { success: false, error: "驗證碼已過期" };
        }

        if (storedOtp !== otp) {
            return { success: false, error: "驗證碼錯誤" };
        }

        await redis.del(`verify:${email}`);
        return { success: true, message: "驗證成功" };
    } catch (err: any) {
        console.error("驗證失敗發生未預期錯誤:", err);
        return { success: false, error: err.message || "伺服器發生未預期錯誤" };
    }
}

export async function checkEmailExists(email: string) {
    if (!email || !email.includes('@')) {
        return { exists: false, error: "請提供有效的電子郵件地址" };
    }

    try {
        const cleanEmail = email.trim().toLowerCase();
        const { data, error } = await supabase
            .from(DB_TABLES.USERS)
            .select('id')
            .eq('email', cleanEmail)
            .maybeSingle();

        if (error) {
            console.error("檢查 Email 失敗：", error.message);
            return { exists: false, error: error.message };
        }

        return { exists: !!data };
    } catch (err: any) {
        console.error("檢查 Email 未預期錯誤：", err);
        return { exists: false, error: err.message || "伺服器發生未預期錯誤" };
    }
}

export async function registerUserWithHashedPassword(email: string, password: string, name: string) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
        return { success: false, error: "請提供有效的電子郵件地址" };
    }

    if (!password || password.length < 6) {
        return { success: false, error: "密碼長度至少需要 6 個字元" };
    }

    if (!cleanName) {
        return { success: false, error: "請輸入姓名" };
    }

    try {
        // 先檢查 Email 是否已存在
        const { data: existingUser } = await supabase
            .from(DB_TABLES.USERS)
            .select('id')
            .eq('email', cleanEmail)
            .maybeSingle();

        if (existingUser) {
            return { success: false, error: "此電子郵件已被註冊，請直接登入" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from(DB_TABLES.USERS)
            .insert([
                {
                    email: cleanEmail,
                    password: hashedPassword,
                    name: cleanName
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('註冊失敗：', error.message);
            return { success: false, error: error.message };
        }

        console.log('註冊成功！', data);
        return {
            success: true,
            user: {
                id: data.id,
                email: data.email,
                name: data.name
            }
        };
    } catch (err: any) {
        console.error('註冊發生未預期錯誤：', err);
        return { success: false, error: err.message || "伺服器發生未預期錯誤" };
    }
}

export async function loginUserWithCustomTable(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();

    try {
        const { data: user, error } = await supabase
            .from(DB_TABLES.USERS)
            .select('*')
            .eq('email', cleanEmail)
            .maybeSingle();

        if (error || !user) {
            return { success: false, error: "帳號或密碼錯誤" };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, error: "帳號或密碼錯誤" };
        }

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        };
    } catch (err: any) {
        console.error("登入發生未預期錯誤：", err);
        return { success: false, error: err.message || "登入失敗" };
    }
}