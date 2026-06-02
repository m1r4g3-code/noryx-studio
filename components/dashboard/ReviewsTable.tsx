'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { StarRating } from '@/components/ui/StarRating'
import { formatDateShort } from '@/lib/utils'
import type { ActionResult, Review } from '@/types'

interface ReviewsTableProps {
  reviews: Review[]
  onApprove: (id: string) => Promise<ActionResult>
  onDelete: (id: string) => Promise<ActionResult>
}

type FilterType = 'all' | 'approved' | 'pending'

export function ReviewsTable({ reviews, onApprove, onDelete }: ReviewsTableProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<FilterType>('all')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const filtered = reviews.filter((r) => {
    if (filter === 'approved') return r.is_approved
    if (filter === 'pending') return !r.is_approved
    return true
  })

  const handleApprove = async (id: string) => {
    setLoadingId(id)
    const result = await onApprove(id)
    if (result.error) setError(result.error)
    else router.refresh()
    setLoadingId(null)
  }

  const handleDelete = async (id: string) => {
    setLoadingId(id)
    const result = await onDelete(id)
    if (result.error) setError(result.error)
    else {
      setConfirmDeleteId(null)
      router.refresh()
    }
    setLoadingId(null)
  }

  const FILTERS: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] font-body rounded-sm border transition-all ${
              filter === value
                ? 'bg-gold/10 border-gold/30 text-gold'
                : 'bg-surface border-border text-text-muted hover:border-gold/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-sm px-4 py-3 mb-4">
          <p className="text-red-400 text-sm font-body">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-center text-text-muted py-10 font-body text-sm">
            No reviews found.
          </p>
        ) : (
          filtered.map((review) => (
            <div
              key={review.id}
              className="bg-surface border border-border rounded-sm p-5"
            >
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <span className="font-display text-lg tracking-wider text-text-primary">
                  {review.client_name}
                </span>
                <StarRating value={review.rating} size="sm" />
                <Badge variant={review.is_approved ? 'green' : 'yellow'}>
                  {review.is_approved ? 'Approved' : 'Pending'}
                </Badge>
              </div>
              <div className="text-[11px] text-text-muted font-body">
                {formatDateShort(review.created_at)}
              </div>

              <p className="text-text-muted text-sm font-body leading-relaxed mt-3 pl-0.5">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Action row — always visible, full-width on mobile */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                {!review.is_approved && (
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={loadingId === review.id}
                    onClick={() => handleApprove(review.id)}
                    className="flex-1 sm:flex-none"
                  >
                    Approve
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirmDeleteId(review.id)}
                  className="flex-1 sm:flex-none"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete Review"
        size="sm"
      >
        <p className="text-text-muted text-sm font-body mb-5">
          Are you sure you want to delete this review? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" size="md" onClick={() => setConfirmDeleteId(null)} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            isLoading={loadingId === confirmDeleteId}
            onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
