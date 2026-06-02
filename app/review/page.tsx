import type { Metadata } from 'next'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { ReviewForm } from '@/components/public/ReviewForm'

export const metadata: Metadata = {
  title: 'Leave a Review',
  description: 'Share your experience at Noryx Studio.',
}

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 pt-28 pb-20">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase font-body">
              Your Feedback
            </span>
            <div className="h-px w-8 bg-gold" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-[0.05em] text-text-primary">
            LEAVE A REVIEW
          </h1>
          <p className="text-text-muted font-body mt-3">
            Loved your cut? Tell us about it — it helps us and helps others find a great barber.
          </p>
        </div>

        <div className="bg-surface border border-border border-t-2 border-t-gold rounded-sm p-6">
          <ReviewForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
