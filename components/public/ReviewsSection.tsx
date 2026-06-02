import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ReviewsSectionClient } from '@/components/public/ReviewsSectionClient'
import type { Review } from '@/types'

export async function ReviewsSection() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(9)

  const reviews = (data ?? []) as Review[]

  return (
    <section id="reviews" className="section-padding bg-bg">
      <div className="max-w-7xl mx-auto">
        <ReviewsSectionClient reviews={reviews} />
      </div>
    </section>
  )
}
