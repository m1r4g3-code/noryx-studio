'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { galleryImageUrl } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  createGalleryItem,
  updateGalleryCaption,
  deleteGalleryItem,
  moveGalleryUp,
  moveGalleryDown,
} from '@/app/admin/(protected)/gallery/actions'
import type { GalleryItem } from '@/types'

const MAX_BYTES = 25 * 1024 * 1024 // 25MB raw input cap (compressed before upload)
const MAX_DIM = 1600 // longest side after compression
const WEBP_QUALITY = 0.82

// Compress + resize in the browser to a WebP blob before upload.
// Respects EXIF orientation; throws if the browser can't do it (caller falls back).
async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  let { width, height } = bitmap
  if (width > MAX_DIM || height > MAX_DIM) {
    const scale = MAX_DIM / Math.max(width, height)
    width = Math.round(width * scale)
    height = Math.round(height * scale)
  }
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close?.()
    throw new Error('no canvas context')
  }
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/webp',
      WEBP_QUALITY
    )
  })
}

export function GalleryManager({ items }: { items: GalleryItem[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<GalleryItem | null>(null)
  const [captions, setCaptions] = useState<Record<string, string>>(
    Object.fromEntries(items.map((i) => [i.id, i.caption ?? '']))
  )

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError('')
    setUploading(true)
    const supabase = createClient()

    let done = 0
    const total = files.length
    for (const file of Array.from(files)) {
      done++
      setProgress(`Processing ${done} of ${total}...`)

      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" is not an image — skipped.`)
        continue
      }
      if (file.size > MAX_BYTES) {
        setError(`"${file.name}" is larger than 25MB — skipped.`)
        continue
      }

      // Compress + resize to WebP in the browser before upload.
      // Animated GIFs are uploaded as-is (canvas would flatten them).
      let payload: Blob = file
      let ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      let contentType = file.type
      if (file.type !== 'image/gif') {
        try {
          payload = await compressImage(file)
          ext = 'webp'
          contentType = 'image/webp'
        } catch {
          // Compression unsupported/failed — fall back to original
          payload = file
        }
      }

      setProgress(`Uploading ${done} of ${total}...`)
      const path = `${crypto.randomUUID()}.${ext}`

      const { error: upErr } = await supabase.storage
        .from('gallery')
        .upload(path, payload, { cacheControl: '3600', upsert: false, contentType })

      if (upErr) {
        setError(`Upload failed for "${file.name}": ${upErr.message}`)
        continue
      }

      const res = await createGalleryItem(path, '')
      if (res.error) {
        setError(res.error)
        // roll back the orphaned storage object
        await supabase.storage.from('gallery').remove([path])
      }
    }

    setUploading(false)
    setProgress('')
    if (fileRef.current) fileRef.current.value = ''
    router.refresh()
  }

  const saveCaption = async (item: GalleryItem) => {
    const value = captions[item.id] ?? ''
    if (value === (item.caption ?? '')) return
    await updateGalleryCaption(item.id, value)
    router.refresh()
  }

  const handleDelete = async (item: GalleryItem) => {
    await deleteGalleryItem(item.id, item.image_path)
    setConfirmDelete(null)
    router.refresh()
  }

  return (
    <div>
      {/* Upload */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl tracking-widest text-text-primary">GALLERY</h2>
          <p className="text-text-muted text-sm font-body mt-0.5">
            {items.length} photo{items.length !== 1 ? 's' : ''} · shown on the homepage & /gallery
          </p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button
            variant="primary"
            size="md"
            isLoading={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? progress || 'Uploading...' : '+ Upload Photos'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-sm px-4 py-3 mb-4">
          <p className="text-red-400 text-sm font-body">{error}</p>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-sm">
          <p className="text-text-muted font-body mb-4">No photos yet.</p>
          <Button variant="outline" size="md" onClick={() => fileRef.current?.click()}>
            Upload your first photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <div key={item.id} className="bg-surface border border-border rounded-sm overflow-hidden">
              <div className="relative aspect-video bg-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={galleryImageUrl(item.image_path)}
                  alt={item.caption ?? 'Gallery photo'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 flex flex-col gap-3">
                <input
                  type="text"
                  value={captions[item.id] ?? ''}
                  placeholder="Add a caption (optional)"
                  onChange={(e) => setCaptions((c) => ({ ...c, [item.id]: e.target.value }))}
                  onBlur={() => saveCaption(item)}
                  className="w-full bg-bg border border-border text-text-primary placeholder:text-text-muted px-3 py-2 text-sm font-body rounded-sm focus:border-gold outline-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      disabled={index === 0}
                      onClick={async () => { await moveGalleryUp(item.id); router.refresh() }}
                      className="text-text-muted hover:text-gold disabled:opacity-20 transition-colors p-1.5 border border-border rounded-sm"
                      aria-label="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      disabled={index === items.length - 1}
                      onClick={async () => { await moveGalleryDown(item.id); router.refresh() }}
                      className="text-text-muted hover:text-gold disabled:opacity-20 transition-colors p-1.5 border border-border rounded-sm"
                      aria-label="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={() => setConfirmDelete(item)}
                    className="text-xs font-semibold uppercase tracking-wider text-red-400 border border-red-500/30 rounded-sm px-3 py-1.5 hover:bg-red-900/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Photo" size="sm">
        <p className="text-text-muted text-sm font-body mb-5">
          Remove this photo from the gallery? This deletes the image permanently.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" size="md" onClick={() => setConfirmDelete(null)} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => confirmDelete && handleDelete(confirmDelete)}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
