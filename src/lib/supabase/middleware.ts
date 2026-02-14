import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error("Supabase Env Vars Missing in Middleware:", {
            url: url ? "Set" : "Missing",
        });
    }

    const supabase = createServerClient(
        "https://japftclyvbtpgpwgytam.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphcGZ0Y2x5dmJ0cGdwd2d5dGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNjk1MTEsImV4cCI6MjA4NTk0NTUxMX0.3mRDuw_WKQJq3PB2k6-mhkkbI7SgvO_uqBrDrpcb0HI",
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // NEW: Redirect logged-in users away from marketing home to dashboard
    if (user && request.nextUrl.pathname === '/') {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        request.nextUrl.pathname !== '/' &&
        request.nextUrl.pathname !== '/pricing'
    ) {
        // no user, potentially redirect
        const url = request.nextUrl.clone()
        url.pathname = '/'
        // return NextResponse.redirect(url) 
    }

    return supabaseResponse
}
