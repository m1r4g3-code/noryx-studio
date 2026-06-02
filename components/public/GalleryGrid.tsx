'use client'

import { useState } from 'react'
import { galleryImageUrl } from '@/lib/utils'
import { GalleryLightbox } from '@/components/public/GalleryLightbox'
import type { GalleryItem } from '@/types'

interface GalleryGridProps {
  items: GalleryItem[]
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-square overflow-hidden border border-border bg-surface rounded-sm card-hover-glow"
            aria-label={item.caption ?? 'View photo'}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={galleryImageUrl(item.image_path)}
              alt={item.caption ?? 'Gallery photo'}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-xs font-body font-semibold uppercase tracking-[0.12em] text-gold">
                  {item.caption}
                </span>
              </div>
            )}
            {/* zoom icon */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <GalleryLightbox
        items={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </>
  )
}
