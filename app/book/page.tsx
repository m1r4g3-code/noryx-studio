'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { Navbar } from '@/components/public/Navbar'
import { StepIndicator } from '@/components/booking/StepIndicator'
import { ServiceSelect } from '@/components/booking/ServiceSelect'
import { DateTimeSelect } from '@/components/booking/DateTimeSelect'
import { ClientDetails } from '@/components/booking/ClientDetails'
import { ConfirmBooking } from '@/components/booking/ConfirmBooking'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase'
import { formatCurrency, formatTime, getWhatsAppLink } from '@/lib/utils'
import type { Service, BookingFormData, BookingStep } from '@/types'

const STEPS = [
  { number: 1 as BookingStep, label: 'Service' },
  { number: 2 as BookingStep, label: 'Date & Time' },
  { number: 3 as BookingStep, label: 'Details' },
  { number: 4 as BookingStep, label: 'Confirm' },
]

function BookingSuccessScreen({
  reference,
  bookingData,
}: {
  reference: string
  bookingData: Partial<BookingFormData>
}) {
  const waMessage = `Hi! My appointment at Noryx Studio is confirmed. Ref: ${reference}`
  const waLink = getWhatsAppLink('2349162035059', waMessage)

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-sm bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-text-muted font-body mb-2">
          Booking Confirmed
        </div>
        <div className="font-display text-4xl md:text-5xl text-gold tracking-[0.1em] mb-8 text-gold-glow">
          {reference}
        </div>

        <div className="bg-surface border border-border rounded-sm text-left divide-y divide-border mb-8">
          {[
            { label: 'Service', value: bookingData.service_name },
            { label: 'Price', value: bookingData.service_price ? formatCurrency(bookingData.service_price) : '' },
            {
              label: 'Date',
              value: bookingData.appointment_date
                ? format(new Date(bookingData.appointment_date), 'EEEE, MMMM d, yyyy')
                : '',
            },
            {
              label: 'Time',
              value: bookingData.appointment_time
                ? formatTime(bookingData.appointment_time)
                : '',
            },
            { label: 'Name', value: bookingData.client_name },
            { label: 'Phone', value: bookingData.client_phone },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start gap-4 px-5 py-3">
              <span className="text-[11px] uppercase tracking-[0.1em] text-text-muted font-body font-semibold w-16 shrink-0 pt-0.5">
                {label}
              </span>
              <span className="text-sm text-text-primary font-body">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="lg" className="w-full">
              Add to WhatsApp
            </Button>
          </a>
          <Link href="/">
            <Button variant="ghost" size="lg" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>

        <p className="text-text-muted text-xs font-body mt-6 leading-relaxed">
          We&apos;ll notify you closer to your appointment.
          <br />
          Questions? WhatsApp: 09162035059
        </p>
      </div>
    </div>
  )
}

function BookPageContent() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<BookingStep>(1)
  const [bookingData, setBookingData] = useState<Partial<BookingFormData>>({})
  const [confirmedReference, setConfirmedReference] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [bookingEnabled, setBookingEnabled] = useState(true)
  const [loadingServices, setLoadingServices] = useState(true)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()

      const [{ data: servicesData }, { data: bookingEnabledSetting }] = await Promise.all([
        supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('display_order'),
        supabase
          .from('settings')
          .select('value')
          .eq('key', 'booking_enabled')
          .single(),
      ])

      setServices(servicesData ?? [])
      setBookingEnabled(bookingEnabledSetting?.value !== false)
      setLoadingServices(false)
    }
    init()
  }, [])

  // Pre-select service from query param
  useEffect(() => {
    if (!services.length) return
    const serviceId = searchParams.get('service')
    if (!serviceId) return
    const service = services.find((s) => s.id === serviceId)
    if (service) {
      setBookingData((prev) => ({
        ...prev,
        service_id: service.id,
        service_name: service.name,
        service_price: service.price,
        service_duration: service.duration_minutes,
      }))
      setStep(2)
    }
  }, [services, searchParams])

  if (confirmedReference) {
    return (
      <BookingSuccessScreen
        reference={confirmedReference}
        bookingData={bookingData}
      />
    )
  }

  if (!bookingEnabled) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="text-center">
          <div className="font-display text-3xl tracking-widest text-gold mb-4">
            BOOKINGS PAUSED
          </div>
          <p className="text-text-muted font-body mb-6">
            Online booking is temporarily unavailable. Please contact us directly.
          </p>
          <a href="https://wa.me/2349162035059" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg">
              WhatsApp Us
            </Button>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-6 bg-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase font-body">
              Noryx Studio
            </span>
          </div>
          <h1 className="font-display text-4xl tracking-[0.06em] text-text-primary">
            BOOK APPOINTMENT
          </h1>
        </div>

        {/* Step indicator */}
        <div className="mb-10">
          <StepIndicator currentStep={step} steps={STEPS} />
        </div>

        {/* Steps */}
        {loadingServices && step === 1 ? (
          <div className="text-center py-16 text-text-muted font-body">Loading services...</div>
        ) : (
          <>
            {step === 1 && (
              <ServiceSelect
                services={services}
                selectedServiceId={bookingData.service_id ?? null}
                onSelect={(service) => {
                  setBookingData((prev) => ({
                    ...prev,
                    service_id: service.id,
                    service_name: service.name,
                    service_price: service.price,
                    service_duration: service.duration_minutes,
                  }))
                  setStep(2)
                }}
              />
            )}

            {step === 2 && (
              <DateTimeSelect
                selectedDate={
                  bookingData.appointment_date
                    ? new Date(bookingData.appointment_date)
                    : null
                }
                selectedTime={bookingData.appointment_time ?? null}
                onDateSelect={(date) =>
                  setBookingData((prev) => ({ ...prev, appointment_date: date }))
                }
                onTimeSelect={(time) =>
                  setBookingData((prev) => ({ ...prev, appointment_time: time }))
                }
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <ClientDetails
                defaultValues={bookingData}
                onSubmit={(data) => {
                  setBookingData((prev) => ({ ...prev, ...data }))
                  setStep(4)
                }}
                onBack={() => setStep(2)}
              />
            )}

            {step === 4 && bookingData.service_id && bookingData.appointment_date && bookingData.appointment_time && bookingData.client_name && bookingData.client_phone && (
              <ConfirmBooking
                bookingData={bookingData as BookingFormData}
                onBack={() => setStep(3)}
                onSuccess={(reference) => setConfirmedReference(reference)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <div className="text-text-muted font-body">Loading...</div>
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  )
}
