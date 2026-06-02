'use server'

import { revalidateTag } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { CACHE_TAGS } from '@/lib/constants'
import type { ActionResult } from '@/types'

export async function approveReview(id: string): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('reviews')
    .update({ is_approved: true })
    .eq('id', id)
  if (error) return { data: null, error: error.message }
  revalidateTag(CACHE_TAGS.reviews)
  return { data: null, error: null }
}

export async function deleteReview(id: string): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) return { data: null, error: error.message }
  revalidateTag(CACHE_TAGS.reviews)
  return { data: null, error: null }
}
