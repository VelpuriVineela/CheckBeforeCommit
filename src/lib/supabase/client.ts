import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        "https://japftclyvbtpgpwgytam.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphcGZ0Y2x5dmJ0cGdwd2d5dGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNjk1MTEsImV4cCI6MjA4NTk0NTUxMX0.3mRDuw_WKQJq3PB2k6-mhkkbI7SgvO_uqBrDrpcb0HI"
    )
}
