import 'server-only'
import { unstable_cache } from 'next/cache'
import { createAnonServerClient } from '@/lib/supabase-server'
import { CACHE_TAGS } from '@/lib/constants'
import type {
  SiteSettings,
  HeroSettings,
  AboutSettings,
  ContactSettings,
} from '@/types'

const DEFAULTS = {
  hero: { headline: 'PRECISION. STYLE. IDENTITY.', subheadline: 'Premium grooming experience in Lagos.' },
  about: { text: 'Noryx Studio is a premium barbershop.' },
  contact: { phone: '09162035059', email: 'sain.tcuts3@gmail.com', whatsapp: '2349162035059' },
}

/**
 * Public-facing settings, cached and revalidated by tag. Only reads the keys
 * exposed by RLS to anon (hero/about/contact/time_slots/booking_enabled).
 * Barber notification fields are admin-only and returned empty here.
 */
function fallbackSettings(): SiteSettings {
  return {
    hero_headline: DEFAULTS.hero.headline,
    hero_subheadline: DEFAULTS.hero.subheadline,
    about_text: DEFAULTS.about.text,
    contact_phone: DEFAULTS.contact.phone,
    contact_email: DEFAULTS.contact.email,
    contact_whatsapp: DEFAULTS.contact.whatsapp,
    booking_enabled: true,
    time_slots: [],
    barber_notification_email: '',
    barber_notification_phone: '',
  }
}

export const getPublicSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    try {
      const supabase = createAnonServerClient()
      const { data } = await supabase.from('settings').select('key, value')

      const map: Record<string, unknown> = {}
      for (const row of data ?? []) map[row.key] = row.value

      const hero = (map.hero as HeroSettings) ?? DEFAULTS.hero
      const about = (map.about as AboutSettings) ?? DEFAULTS.about
      const contact = (map.contact as ContactSettings) ?? DEFAULTS.contact

      return {
        hero_headline: hero.headline,
        hero_subheadline: hero.subheadline,
        about_text: about.text,
        contact_phone: contact.phone,
        contact_email: contact.email,
        contact_whatsapp: contact.whatsapp,
        booking_enabled: (map.booking_enabled as boolean) ?? true,
        time_slots: (map.time_slots as string[]) ?? [],
        barber_notification_email: '',
        barber_notification_phone: '',
      }
    } catch {
      return fallbackSettings()
    }
  },
  ['public-settings'],
  { tags: [CACHE_TAGS.settings], revalidate: 300 }
)
