import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="font-display text-7xl tracking-widest text-gold mb-3">404</div>
        <h1 className="font-display text-2xl tracking-wider text-text-primary mb-3">
          PAGE NOT FOUND
        </h1>
        <p className="text-text-muted font-body mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="primary" size="md" className="w-full">
              Back to Home
            </Button>
          </Link>
          <Link href="/book">
            <Button variant="outline" size="md" className="w-full">
              Book Appointment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
