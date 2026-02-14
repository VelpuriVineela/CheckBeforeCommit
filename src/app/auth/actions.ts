'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function signInWithGoogle(next?: string) {
    const supabase = await createClient();
    const origin = (await headers()).get('origin') || 'http://localhost:3000';

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    });

    if (data.url) {
        return { url: data.url };
    }

    return { error: 'Failed to generate OAuth URL' };
}

export async function signInWithEmail(formData: FormData, next?: string) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

export async function signUpWithEmail(formData: FormData, next?: string) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: next || '/dashboard',
        }
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true, message: 'Check your email for the confirmation link.' };
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return { success: true };
}
