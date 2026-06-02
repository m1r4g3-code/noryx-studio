import { createBrowserClient } from '@supabase/ssr'

// Browser client — use in 'use client' components.
// NOTE: The server client lives in lib/supabase-server.ts so that this file
// never pulls in next/headers (which is illegal in client components).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
