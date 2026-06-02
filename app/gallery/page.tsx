import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { GalleryGrid } from '@/components/public/GalleryGrid'
import { Button } from '@/components/ui/Button'
import type { GalleryItem } from '@/types'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'See our work — fades, designs, beard sculpts and more at Noryx Studio.',
}

export default async function GalleryPage() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('gallery')
    .select('*')
    .order('display_order', { ascending: true })

  const items = (data ?? []) as GalleryItem[]

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-20">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase font-body">
              Our Work
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl tracking-[0.05em] text-text-primary">
            THE GALLERY
          </h1>
          <p className="text-text-muted font-body mt-3 max-w-xl">
            A look at the cuts, fades and designs from the chair at Noryx Studio.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 border border-border rounded-sm bg-surface">
            <p className="text-text-muted font-body mb-6">No photos yet — check back soon.</p>
            <Link href="/book">
              <Button variant="outline" size="md">Book Appointment</Button>
            </Link>
          </div>
        ) : (
          <GalleryGrid items={items} />
        )}

        <div className="mt-16 text-center">
          <Link href="/book">
            <Button variant="primary" size="lg">Book Your Cut</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
