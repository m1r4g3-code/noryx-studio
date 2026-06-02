'use server'

import { revalidateTag } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { CACHE_TAGS } from '@/lib/constants'
import { settingsSchema, type SettingsFormValues } from '@/lib/validations'
import type { ActionResult } from '@/types'

export async function saveSettings(data: SettingsFormValues): Promise<ActionResult> {
  // Re-validate on the server — never trust the client form
  const parsed = settingsSchema.safeParse(data)
  if (!parsed.success) {
    return { data: null, error: 'Some settings are invalid. Please check the form.' }
  }
  data = parsed.data

  const supabase = createServerSupabaseClient()

  const upserts = [
    {
      key: 'hero',
      value: { headline: data.hero_headline, subheadline: data.hero_subheadline ?? '' },
    },
    {
      key: 'about',
      value: { text: data.about_text ?? '' },
    },
    {
      key: 'contact',
      value: {
        phone: data.contact_phone ?? '',
        email: data.contact_email ?? '',
        whatsapp: data.contact_whatsapp ?? '',
      },
    },
    {
      key: 'booking_enabled',
      value: data.booking_enabled,
    },
    {
      key: 'time_slots',
      value: data.time_slots,
    },
    {
      key: 'barber_contact',
      value: {
        notification_email: data.barber_notification_email ?? '',
        notification_phone: data.barber_notification_phone ?? '',
      },
    },
  ]

  for (const upsert of upserts) {
    const { error } = await supabase
      .from('settings')
      .upsert({ key: upsert.key, value: upsert.value, updated_at: new Date().toISOString() })

    if (error) return { data: null, error: error.message }
  }

  revalidateTag(CACHE_TAGS.settings)
  return { data: null, error: null }
}
