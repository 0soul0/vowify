import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const DB_TABLES = {
    GUESTS: '02_vowify_guests',
    MESSAGES: '02_vowify_messages',
    PROJECTS: '02_vowify_projects',
    USERS: '02_vowify_users',
} as const;