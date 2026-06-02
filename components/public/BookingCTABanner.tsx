import Link from 'next/link'
import { getPublicSettings } from '@/lib/data/settings'
import { Button } from '@/components/ui/Button'

export async function BookingCTABanner() {
  const settings = await getPublicSettings()
  const contact = {
    phone: settings.contact_phone,
    email: settings.contact_email,
    whatsapp: settings.contact_whatsapp,
  }

  const waLink = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("Hi! I'd like to book an appointment at Noryx Studio.")}`

  return (
    <section className="bg-surface-elevated border-y border-border py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-gold" />
          <div className="w-1.5 h-1.5 bg-gold rotate-45" />
          <div className="h-px w-12 bg-gold" />
        </div>

        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.06em] text-gold text-gold-glow mb-3">
          READY FOR YOUR NEXT CUT?
        </h2>
        <p className="text-text-muted font-body text-base tracking-wider mb-10">
          Book your appointment online or reach out directly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link href="/book">
            <Button variant="primary" size="lg">
              Book Appointment
            </Button>
          </Link>
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg">
              WhatsApp Us
            </Button>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center gap-2 text-text-muted hover:text-gold transition-colors font-body"
          >
            <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {contact.phone}
          </a>
          <div className="h-px w-6 bg-border sm:h-4 sm:w-px" />
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-2 text-text-muted hover:text-gold transition-colors font-body"
          >
            <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {contact.email}
          </a>
        </div>
      </div>
    </section>
  )
}
