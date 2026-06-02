'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface to the console; replace with a real logger/Sentry in production
    console.error('[App error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="font-display text-6xl tracking-widest text-gold mb-3">OOPS</div>
        <h1 className="font-display text-2xl tracking-wider text-text-primary mb-3">
          SOMETHING WENT WRONG
        </h1>
        <p className="text-text-muted font-body mb-8">
          An unexpected error occurred. Please try again — if it keeps happening, reach us on WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" size="md" onClick={reset}>
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" size="md" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
