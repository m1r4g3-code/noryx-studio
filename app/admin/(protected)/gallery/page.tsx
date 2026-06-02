import { createServerSupabaseClient } from '@/lib/supabase-server'
import { GalleryManager } from '@/components/dashboard/GalleryManager'
import type { GalleryItem } from '@/types'

export default async function AdminGalleryPage() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('gallery')
    .select('*')
    .order('display_order', { ascending: true })

  const items = (data ?? []) as GalleryItem[]

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-px w-6 bg-gold" />
          <span className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase font-body">
            Manage
          </span>
        </div>
        <h1 className="font-display text-4xl tracking-widest text-text-primary">GALLERY</h1>
      </div>

      <div className="bg-surface border border-border rounded-sm p-5">
        <GalleryManager items={items} />
      </div>
    </div>
  )
}
