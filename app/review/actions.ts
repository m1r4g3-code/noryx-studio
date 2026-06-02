'use server'

import { headers } from 'next/headers'
import { createServiceRoleClient } from '@/lib/supabase-server'
import { reviewSchema } from '@/lib/validations'
import type { ActionResult } from '@/types'

export async function submitReview(input: {
  client_name: string
  rating: number
  comment: string
}): Promise<ActionResult> {
  const admin = createServiceRoleClient()

  const parsed = reviewSchema.safeParse(input)
  if (!parsed.success) {
    return { data: null, error: 'Please complete the review form correctly.' }
  }

  // Rate limit per IP (max 5 reviews/day)
  const ip = (headers().get('x-forwarded-for') ?? 'unknown').split(',')[0].trim()
  const { data: ok } = await admin.rpc('rate_limit', {
    p_bucket: `review:ip:${ip}`,
    p_max: 5,
    p_window_seconds: 86400,
  })
  if (ok === false) {
    return { data: null, error: 'You have submitted several reviews recently. Please try again later.' }
  }

  const { error } = await admin.from('reviews').insert({
    client_name: parsed.data.client_name,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
    is_approved: false,
  })
  if (error) return { data: null, error: 'Something went wrong. Please try again.' }
  return { data: null, error: null }
}
