import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('Supabase Admin Client: Missing URL or Service Role Key. Admin features may not work as expected.')
        }
        // Fallback to anon client if service key is missing, though RLS will apply
        return createClient(
            supabaseUrl || '',
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        )
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
