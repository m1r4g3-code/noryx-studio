'use client'

import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { galleryImageUrl } from '@/lib/utils'
import type { GalleryItem } from '@/types'

interface GalleryLightboxProps {
  items: GalleryItem[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export function GalleryLightbox({ items, index, onClose, onNavigate }: GalleryLightboxProps) {
  const prev = useCallback(() => {
    if (index === null) return
    onNavigate((index - 1 + items.length) % items.length)
  }, [index, items.length, onNavigate])

  const next = useCallback(() => {
    if (index === null) return
    onNavigate((index + 1) % items.length)
  }, [index, items.length, onNavigate])

  useEffect(() => {
    if (index === null) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [index, onClose, prev, next])

  if (index === null) return null
  const item = items[index]
  if (!item) return null

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/95 backdrop-blur-sm" role="dialog" aria-modal="true">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-text-muted hover:text-gold transition-colors p-2 z-10"
        aria-label="Close"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev */}
      {items.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-2 md:left-6 text-text-muted hover:text-gold transition-colors p-2 z-10"
          aria-label="Previous"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image + caption */}
      <div className="max-w-5xl max-h-[85vh] px-12 flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={galleryImageUrl(item.image_path)}
          alt={item.caption ?? 'Gallery photo'}
          className="max-w-full max-h-[78vh] object-contain border border-border"
        />
        {item.caption && (
          <p className="mt-4 text-center text-sm font-body tracking-wider text-text-primary">
            {item.caption}
          </p>
        )}
        <p className="mt-1 text-[11px] text-text-muted font-body tracking-[0.15em]">
          {index + 1} / {items.length}
        </p>
      </div>

      {/* Next */}
      {items.length > 1 && (
        <button
          onClick={next}
          className="absolute right-2 md:right-6 text-text-muted hover:text-gold transition-colors p-2 z-10"
          aria-label="Next"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>,
    document.body
  )
}
