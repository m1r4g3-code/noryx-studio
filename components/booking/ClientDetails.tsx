'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookingClientSchema, type BookingClientFormValues } from '@/lib/validations'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import type { BookingFormData } from '@/types'

interface ClientDetailsProps {
  defaultValues?: Partial<BookingFormData>
  onSubmit: (
    data: Pick<
      BookingFormData,
      'client_name' | 'client_phone' | 'client_email' | 'notes'
    >
  ) => void
  onBack: () => void
}

export function ClientDetails({
  defaultValues,
  onSubmit,
  onBack,
}: ClientDetailsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingClientFormValues>({
    resolver: zodResolver(bookingClientSchema),
    defaultValues: {
      client_name: defaultValues?.client_name ?? '',
      client_phone: defaultValues?.client_phone ?? '',
      client_email: defaultValues?.client_email ?? '',
      notes: defaultValues?.notes ?? '',
    },
  })

  return (
    <div className="w-full">
      <h2 className="font-display text-3xl tracking-[0.08em] text-text-primary mb-2">
        YOUR DETAILS
      </h2>
      <p className="text-text-muted text-sm font-body mb-8">
        Tell us who you are so we can confirm your booking.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-lg">
        <Input
          label="Full Name"
          placeholder="John Doe"
          required
          error={errors.client_name?.message}
          {...register('client_name')}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="08012345678"
          required
          error={errors.client_phone?.message}
          helperText="Nigerian number (e.g. 08012345678 or +2348012345678)"
          {...register('client_phone')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com (optional)"
          error={errors.client_email?.message}
          helperText="Used to send booking confirmation"
          {...register('client_email')}
        />

        <Textarea
          label="Notes (Optional)"
          placeholder="Any specific requests or instructions for your barber..."
          rows={3}
          error={errors.notes?.message}
          {...register('notes')}
        />

        <div className="flex gap-4 pt-2">
          <Button type="button" variant="secondary" size="lg" onClick={onBack}>
            Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  )
}
