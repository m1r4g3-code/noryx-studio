'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatTime } from '@/lib/utils'
import { createAppointment } from '@/app/book/actions'
import type { BookingFormData } from '@/types'

interface ConfirmBookingProps {
  bookingData: BookingFormData
  onBack: () => void
  onSuccess: (reference: string) => void
}

export function ConfirmBooking({
  bookingData,
  onBack,
  onSuccess,
}: ConfirmBookingProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    setLoading(true)
    setError('')

    const result = await createAppointment(bookingData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result.data) {
      onSuccess(result.data)
    }
  }

  const rows = [
    { label: 'Service', value: bookingData.service_name },
    { label: 'Price', value: formatCurrency(bookingData.service_price) },
    { label: 'Duration', value: `${bookingData.service_duration} min` },
    {
      label: 'Date',
      value: format(bookingData.appointment_date, 'EEEE, MMMM d, yyyy'),
    },
    { label: 'Time', value: formatTime(bookingData.appointment_time) },
    { label: 'Name', value: bookingData.client_name },
    { label: 'Phone', value: bookingData.client_phone },
    ...(bookingData.client_email
      ? [{ label: 'Email', value: bookingData.client_email }]
      : []),
    ...(bookingData.notes
      ? [{ label: 'Notes', value: bookingData.notes }]
      : []),
  ]

  return (
    <div className="w-full max-w-lg">
      <h2 className="font-display text-3xl tracking-[0.08em] text-text-primary mb-2">
        CONFIRM BOOKING
      </h2>
      <p className="text-text-muted text-sm font-body mb-8">
        Review your details before confirming.
      </p>

      <div className="bg-surface border border-border rounded-sm overflow-hidden mb-6">
        <div className="bg-gold/5 border-b border-border px-5 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold font-body">
            Booking Summary
          </span>
        </div>
        <div className="divide-y divide-border">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex items-start gap-4 px-5 py-3">
              <span className="text-[11px] uppercase tracking-[0.1em] text-text-muted font-body font-semibold w-20 shrink-0 pt-0.5">
                {label}
              </span>
              <span className="text-sm text-text-primary font-body">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-sm px-4 py-3 mb-5">
          <p className="text-red-400 text-sm font-body">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onBack}
          disabled={loading}
        >
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          isLoading={loading}
          onClick={handleConfirm}
          className="flex-1"
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  )
}
