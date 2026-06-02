import 'server-only'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Strip any stray BOM / whitespace that can sneak into env var values
const clean = (v: string | undefined) => (v ?? '').replace(/^﻿/, '').trim()

// Service-role client — bypasses RLS. Use ONLY in trusted server code
// (e.g. reading private settings during an anonymous booking). Never expose
// the service-role key to the browser.
export function createServiceRoleClient() {
  return createClient(
    clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    clean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

// Server client — use in Server Components, Server Actions, Route Handlers.
// This file is server-only and must never be imported by a client component.
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    clean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Server Components cannot set cookies — silenced intentionally
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Server Components cannot set cookies — silenced intentionally
          }
        },
      },
    }
  )
}
