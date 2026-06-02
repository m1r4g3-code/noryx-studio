'use client'

import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { settingsSchema, type SettingsFormValues } from '@/lib/validations'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { ActionResult, SiteSettings } from '@/types'

interface SettingsFormProps {
  settings: SiteSettings
  onSave: (data: SettingsFormValues) => Promise<ActionResult>
}

export function SettingsForm({ settings, onSave }: SettingsFormProps) {
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [newSlot, setNewSlot] = useState('')
  const [newSlotError, setNewSlotError] = useState('')

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      hero_headline: settings.hero_headline,
      hero_subheadline: settings.hero_subheadline,
      about_text: settings.about_text,
      contact_phone: settings.contact_phone,
      contact_email: settings.contact_email,
      contact_whatsapp: settings.contact_whatsapp,
      booking_enabled: settings.booking_enabled,
      time_slots: settings.time_slots,
      barber_notification_email: settings.barber_notification_email,
      barber_notification_phone: settings.barber_notification_phone,
    },
  })

  const watchedSlots = useWatch({ control, name: 'time_slots' }) ?? settings.time_slots

  const removeSlot = (index: number) => {
    const updated = watchedSlots.filter((_, i) => i !== index)
    setValue('time_slots', updated, { shouldValidate: true })
  }

  const appendSlotToList = (slot: string) => {
    setValue('time_slots', [...watchedSlots, slot], { shouldValidate: true })
  }

  const onSubmit = async (data: SettingsFormValues) => {
    setSaveError('')
    setSaveSuccess(false)
    const result = await onSave(data)
    if (result.error) {
      setSaveError(result.error)
      return
    }
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleAddSlot = () => {
    setNewSlotError('')
    if (!/^\d{2}:\d{2}$/.test(newSlot)) {
      setNewSlotError('Use HH:MM format (e.g. 09:00)')
      return
    }
    appendSlotToList(newSlot)
    setNewSlot('')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 max-w-2xl">

      {/* Hero Section */}
      <section>
        <h3 className="font-display text-xl tracking-widest text-text-primary mb-4 border-b border-border pb-2">
          HERO SECTION
        </h3>
        <div className="flex flex-col gap-4">
          <Input
            label="Headline"
            error={errors.hero_headline?.message}
            {...register('hero_headline')}
          />
          <Input
            label="Subheadline"
            error={errors.hero_subheadline?.message}
            {...register('hero_subheadline')}
          />
        </div>
      </section>

      {/* About Section */}
      <section>
        <h3 className="font-display text-xl tracking-widest text-text-primary mb-4 border-b border-border pb-2">
          ABOUT SECTION
        </h3>
        <Textarea
          label="About Text"
          rows={4}
          error={errors.about_text?.message}
          {...register('about_text')}
        />
      </section>

      {/* Contact Info */}
      <section>
        <h3 className="font-display text-xl tracking-widest text-text-primary mb-4 border-b border-border pb-2">
          CONTACT INFO
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Phone" placeholder="09162035059" error={errors.contact_phone?.message} {...register('contact_phone')} />
          <Input label="Email" type="email" error={errors.contact_email?.message} {...register('contact_email')} />
          <Input label="WhatsApp Number" placeholder="2349162035059 (intl format)" error={errors.contact_whatsapp?.message} {...register('contact_whatsapp')} />
        </div>
      </section>

      {/* Booking Settings */}
      <section>
        <h3 className="font-display text-xl tracking-widest text-text-primary mb-4 border-b border-border pb-2">
          BOOKING SETTINGS
        </h3>
        <div className="flex items-center gap-3 mb-6 p-4 bg-surface-elevated border border-border rounded-sm">
          <input
            type="checkbox"
            id="booking_enabled"
            className="w-4 h-4 accent-gold"
            {...register('booking_enabled')}
          />
          <div>
            <label htmlFor="booking_enabled" className="text-sm font-body text-text-primary font-medium">
              Enable Online Booking
            </label>
            <p className="text-xs text-text-muted font-body mt-0.5">
              Uncheck to show a maintenance message on /book
            </p>
          </div>
        </div>

        {/* Time slots */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted block mb-3">
            Available Time Slots
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {watchedSlots.map((slot, index) => (
              <div
                key={`${slot}-${index}`}
                className="flex items-center gap-1 bg-surface border border-border rounded-sm px-2 py-1"
              >
                <span className="text-sm font-body text-text-primary">{slot}</span>
                <button
                  type="button"
                  onClick={() => removeSlot(index)}
                  className="text-text-muted hover:text-red-400 transition-colors ml-1"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              placeholder="09:30"
              className="bg-bg border border-border text-text-primary placeholder:text-text-muted px-3 py-2 text-sm font-body rounded-sm w-28 focus:border-gold outline-none"
            />
            <Button type="button" variant="secondary" size="sm" onClick={handleAddSlot}>
              Add Slot
            </Button>
          </div>
          {newSlotError && <p className="text-xs text-red-400 font-body mt-1">{newSlotError}</p>}
          {errors.time_slots && (
            <p className="text-xs text-red-400 font-body mt-1">
              {errors.time_slots.message ?? 'Invalid time slots'}
            </p>
          )}
        </div>
      </section>

      {/* Notifications */}
      <section>
        <h3 className="font-display text-xl tracking-widest text-text-primary mb-1 border-b border-border pb-2">
          NOTIFICATIONS
        </h3>
        <p className="text-xs text-text-muted font-body mb-4">
          Configure where to send booking notifications. API keys are set in .env.local.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Barber Notification Email"
            type="email"
            placeholder="barber@example.com"
            helperText="Receives new booking alerts"
            error={errors.barber_notification_email?.message}
            {...register('barber_notification_email')}
          />
          <Input
            label="Barber Notification Phone"
            type="tel"
            placeholder="08012345678"
            helperText="Receives new booking SMS"
            error={errors.barber_notification_phone?.message}
            {...register('barber_notification_phone')}
          />
        </div>

        {/* Provider status stubs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-elevated border border-border rounded-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted font-body">
                Resend (Email)
              </span>
              <Badge variant={process.env.NEXT_PUBLIC_RESEND_CONFIGURED === 'true' ? 'green' : 'yellow'}>
                Via .env.local
              </Badge>
            </div>
            <p className="text-xs text-text-muted font-body">
              Set <code className="text-gold">RESEND_API_KEY</code> and <code className="text-gold">RESEND_FROM_EMAIL</code> in .env.local to enable email notifications.
            </p>
          </div>
          <div className="bg-surface-elevated border border-border rounded-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted font-body">
                Twilio (SMS)
              </span>
              <Badge variant="yellow">Via .env.local</Badge>
            </div>
            <p className="text-xs text-text-muted font-body">
              Set <code className="text-gold">TWILIO_ACCOUNT_SID</code>, <code className="text-gold">TWILIO_AUTH_TOKEN</code>, and <code className="text-gold">TWILIO_FROM_NUMBER</code> in .env.local to enable SMS.
            </p>
          </div>
        </div>
      </section>

      {/* Save */}
      {saveError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-sm px-4 py-3">
          <p className="text-red-400 text-sm font-body">{saveError}</p>
        </div>
      )}

      {saveSuccess && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-sm px-4 py-3">
          <p className="text-green-400 text-sm font-body">Settings saved successfully.</p>
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="self-start">
        Save Settings
      </Button>
    </form>
  )
}
