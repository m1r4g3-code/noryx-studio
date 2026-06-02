import Link from 'next/link'
import { getGalleryItems } from '@/lib/data/content'
import { GalleryGrid } from '@/components/public/GalleryGrid'
import { Button } from '@/components/ui/Button'

export async function GallerySection() {
  const items = await getGalleryItems(8)

  // Don't render the section at all if there are no photos yet
  if (items.length === 0) return null

  return (
    <section id="gallery" className="section-padding bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-gold" />
              <span className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase font-body">
                Our Work
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl tracking-[0.05em] text-text-primary">
              THE GALLERY
            </h2>
          </div>
          <Link href="/gallery">
            <Button variant="outline" size="md">
              View Full Gallery
            </Button>
          </Link>
        </div>

        <GalleryGrid items={items} />
      </div>
    </section>
  )
}
