'use client'

import { Modal } from '@/components/ui/Modal'
import { ReviewForm } from '@/components/public/ReviewForm'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave a Review" size="md">
      <ReviewForm onCancel={onClose} />
    </Modal>
  )
}
