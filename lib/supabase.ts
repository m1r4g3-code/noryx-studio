import { createBrowserClient } from '@supabase/ssr'

// Strip any stray BOM / whitespace that can sneak into env var values
const clean = (v: string | undefined) => (v ?? '').replace(/^﻿/, '').trim()

// Browser client — use in 'use client' components.
// NOTE: The server client lives in lib/supabase-server.ts so that this file
// never pulls in next/headers (which is illegal in client components).
export function createClient() {
  return createBrowserClient(
    clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  )
}
