'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { StarRating } from '@/components/ui/StarRating'
import { reviewSchema, type ReviewFormValues } from '@/lib/validations'
import { createClient } from '@/lib/supabase'

interface ReviewFormProps {
  /** When provided, shows a Cancel button (used inside the modal) */
  onCancel?: () => void
}

export function ReviewForm({ onCancel }: ReviewFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0 },
  })

  const rating = watch('rating')

  const onSubmit = async (data: ReviewFormValues) => {
    setServerError('')
    const supabase = createClient()
    const { error } = await supabase.from('reviews').insert({
      client_name: data.client_name,
      rating: data.rating,
      comment: data.comment,
      is_approved: false,
    })

    if (error) {
      setServerError('Something went wrong. Please try again.')
      return
    }
    setSubmitted(true)
    reset()
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-xl tracking-widest text-text-primary mb-2">THANK YOU!</h3>
        <p className="text-text-muted text-sm font-body">
          Your review has been submitted. It will appear after approval.
        </p>
        {onCancel ? (
          <Button variant="outline" size="sm" className="mt-6" onClick={onCancel}>
            Close
          </Button>
        ) : (
          <Link href="/">
            <Button variant="outline" size="sm" className="mt-6">
              Back to Home
            </Button>
          </Link>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="Your Name"
        placeholder="John Doe"
        error={errors.client_name?.message}
        required
        {...register('client_name')}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
          Rating <span className="text-gold">*</span>
        </label>
        <StarRating
          value={rating}
          onChange={(val) => setValue('rating', val, { shouldValidate: true })}
          size="lg"
        />
        {errors.rating && (
          <p className="text-xs text-red-400 font-body">{errors.rating.message}</p>
        )}
      </div>

      <Textarea
        label="Your Review"
        placeholder="Tell us about your experience..."
        rows={4}
        error={errors.comment?.message}
        required
        {...register('comment')}
      />

      {serverError && <p className="text-xs text-red-400 font-body">{serverError}</p>}

      <div className="flex gap-3 pt-1">
        {onCancel && (
          <Button type="button" variant="ghost" size="md" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="flex-1">
          Submit Review
        </Button>
      </div>
    </form>
  )
}
