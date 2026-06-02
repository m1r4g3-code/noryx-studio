'use client'

import { useState } from 'react'
import { StarRating } from '@/components/ui/StarRating'
import { Button } from '@/components/ui/Button'
import { ReviewModal } from '@/components/public/ReviewModal'
import { formatDateShort } from '@/lib/utils'
import type { Review } from '@/types'

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-surface border border-border rounded-sm p-6 flex flex-col gap-3 card-hover-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-display text-lg tracking-wider text-text-primary">
            {review.client_name}
          </div>
          <div className="text-[11px] text-text-muted font-body tracking-[0.1em] mt-0.5">
            {formatDateShort(review.created_at)}
          </div>
        </div>
        <StarRating value={review.rating} size="sm" />
      </div>
      <p className="text-text-muted text-sm font-body leading-relaxed">
        &ldquo;{review.comment}&rdquo;
      </p>
    </div>
  )
}

export function ReviewsSectionClient({ reviews }: { reviews: Review[] }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase font-body">
              Client Feedback
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl tracking-[0.05em] text-text-primary">
            WHAT THEY SAY
          </h2>
        </div>
        <Button variant="outline" size="md" onClick={() => setModalOpen(true)}>
          Leave a Review
        </Button>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted font-body">
            No reviews yet. Be the first to leave one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      <ReviewModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
