import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Database types (will be generated from Supabase schema)
export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    username: string;
                    display_name: string;
                    bio: string | null;
                    avatar_url: string | null;
                    level: number;
                    exp_points: number;
                    paw_points: number;
                    created_at: string;
                    updated_at: string;
                    last_active: string;
                };
                Insert: {
                    id: string;
                    username: string;
                    display_name: string;
                    bio?: string | null;
                    avatar_url?: string | null;
                    level?: number;
                    exp_points?: number;
                    paw_points?: number;
                    created_at?: string;
                    updated_at?: string;
                    last_active?: string;
                };
                Update: {
                    id?: string;
                    username?: string;
                    display_name?: string;
                    bio?: string | null;
                    avatar_url?: string | null;
                    level?: number;
                    exp_points?: number;
                    paw_points?: number;
                    created_at?: string;
                    updated_at?: string;
                    last_active?: string;
                };
            };
            pets: {
                Row: {
                    id: string;
                    owner_id: string;
                    name: string;
                    species: string;
                    breed: string | null;
                    age: number | null;
                    weight: number | null;
                    gender: string | null;
                    avatar_emoji: string;
                    bio: string | null;
                    personality_traits: string[] | null;
                    medical_notes: string | null;
                    is_public: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    owner_id: string;
                    name: string;
                    species: string;
                    breed?: string | null;
                    age?: number | null;
                    weight?: number | null;
                    gender?: string | null;
                    avatar_emoji?: string;
                    bio?: string | null;
                    personality_traits?: string[] | null;
                    medical_notes?: string | null;
                    is_public?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    owner_id?: string;
                    name?: string;
                    species?: string;
                    breed?: string | null;
                    age?: number | null;
                    weight?: number | null;
                    gender?: string | null;
                    avatar_emoji?: string;
                    bio?: string | null;
                    personality_traits?: string[] | null;
                    medical_notes?: string | null;
                    is_public?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
}; 