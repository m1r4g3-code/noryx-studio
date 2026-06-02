import 'server-only'
import { unstable_cache } from 'next/cache'
import { createAnonServerClient } from '@/lib/supabase-server'
import { CACHE_TAGS } from '@/lib/constants'
import type { Service, Review, GalleryItem } from '@/types'

export const getActiveServices = unstable_cache(
  async (): Promise<Service[]> => {
    try {
      const supabase = createAnonServerClient()
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      return (data ?? []) as Service[]
    } catch {
      return []
    }
  },
  ['active-services'],
  { tags: [CACHE_TAGS.services], revalidate: 300 }
)

export const getApprovedReviews = unstable_cache(
  async (limit = 9): Promise<Review[]> => {
    try {
      const supabase = createAnonServerClient()
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(limit)
      return (data ?? []) as Review[]
    } catch {
      return []
    }
  },
  ['approved-reviews'],
  { tags: [CACHE_TAGS.reviews], revalidate: 300 }
)

export const getGalleryItems = unstable_cache(
  async (limit?: number): Promise<GalleryItem[]> => {
    try {
      const supabase = createAnonServerClient()
      let query = supabase
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true })
      if (limit) query = query.limit(limit)
      const { data } = await query
      return (data ?? []) as GalleryItem[]
    } catch {
      return []
    }
  },
  ['gallery-items'],
  { tags: [CACHE_TAGS.gallery], revalidate: 300 }
)
