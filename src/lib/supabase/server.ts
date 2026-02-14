import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        "https://japftclyvbtpgpwgytam.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphcGZ0Y2x5dmJ0cGdwd2d5dGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNjk1MTEsImV4cCI6MjA4NTk0NTUxMX0.3mRDuw_WKQJq3PB2k6-mhkkbI7SgvO_uqBrDrpcb0HI",
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
