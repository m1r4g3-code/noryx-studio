import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ReviewsTable } from '@/components/dashboard/ReviewsTable'
import type { Review } from '@/types'
import { approveReview, deleteReview } from './actions'

export default async function ReviewsPage() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })

  const reviews = (data ?? []) as Review[]
  const pending = reviews.filter((r) => !r.is_approved).length

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-px w-6 bg-gold" />
          <span className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase font-body">
            Manage
          </span>
        </div>
        <h1 className="font-display text-4xl tracking-widests text-text-primary">REVIEWS</h1>
        {pending > 0 && (
          <p className="text-yellow-400 text-sm font-body mt-1">
            {pending} review{pending !== 1 ? 's' : ''} awaiting approval
          </p>
        )}
      </div>

      <div className="bg-surface border border-border rounded-sm p-5">
        <ReviewsTable
          reviews={reviews}
          onApprove={approveReview}
          onDelete={deleteReview}
        />
      </div>
    </div>
  )
}
