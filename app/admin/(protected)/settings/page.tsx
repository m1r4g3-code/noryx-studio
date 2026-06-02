import { createServerSupabaseClient } from '@/lib/supabase-server'
import { SettingsForm } from '@/components/dashboard/SettingsForm'
import type { SiteSettings, HeroSettings, AboutSettings, ContactSettings, BarberContactSettings } from '@/types'
import { saveSettings } from './actions'

async function getSettings(): Promise<SiteSettings> {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('settings').select('key, value')

  const map: Record<string, unknown> = {}
  for (const row of data ?? []) {
    map[row.key] = row.value
  }

  const hero = (map.hero as HeroSettings) ?? { headline: '', subheadline: '' }
  const about = (map.about as AboutSettings) ?? { text: '' }
  const contact = (map.contact as ContactSettings) ?? { phone: '', email: '', whatsapp: '' }
  const barberContact = (map.barber_contact as BarberContactSettings) ?? {
    notification_email: '',
    notification_phone: '',
  }
  const timeSlots = (map.time_slots as string[]) ?? []
  const bookingEnabled = (map.booking_enabled as boolean) ?? true

  return {
    hero_headline: hero.headline,
    hero_subheadline: hero.subheadline,
    about_text: about.text,
    contact_phone: contact.phone,
    contact_email: contact.email,
    contact_whatsapp: contact.whatsapp,
    booking_enabled: bookingEnabled,
    time_slots: timeSlots,
    barber_notification_email: barberContact.notification_email,
    barber_notification_phone: barberContact.notification_phone,
  }
}

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-px w-6 bg-gold" />
          <span className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase font-body">
            Configure
          </span>
        </div>
        <h1 className="font-display text-4xl tracking-widests text-text-primary">SETTINGS</h1>
      </div>

      <div className="bg-surface border border-border rounded-sm p-5 md:p-8">
        <SettingsForm settings={settings} onSave={saveSettings} />
      </div>
    </div>
  )
}
