import { getApprovedReviews } from '@/lib/data/content'
import { ReviewsSectionClient } from '@/components/public/ReviewsSectionClient'

export async function ReviewsSection() {
  const reviews = await getApprovedReviews(9)

  return (
    <section id="reviews" className="section-padding bg-bg">
      <div className="max-w-7xl mx-auto">
        <ReviewsSectionClient reviews={reviews} />
      </div>
    </section>
  )
}
