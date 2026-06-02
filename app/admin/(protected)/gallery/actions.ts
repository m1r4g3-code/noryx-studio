'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { ActionResult } from '@/types'

export async function createGalleryItem(
  imagePath: string,
  caption: string
): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()

  // place new photo at the end
  const { data: last } = await supabase
    .from('gallery')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextOrder = (last?.display_order ?? 0) + 1

  const { error } = await supabase.from('gallery').insert({
    image_path: imagePath,
    caption: caption.trim() || null,
    display_order: nextOrder,
  })

  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function updateGalleryCaption(
  id: string,
  caption: string
): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('gallery')
    .update({ caption: caption.trim() || null })
    .eq('id', id)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function deleteGalleryItem(
  id: string,
  imagePath: string
): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()

  // remove the file from storage (best-effort), then the row
  await supabase.storage.from('gallery').remove([imagePath])

  const { error } = await supabase.from('gallery').delete().eq('id', id)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

async function swapOrder(idA: string, idB: string): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()
  const { data: rows } = await supabase
    .from('gallery')
    .select('id, display_order')
    .in('id', [idA, idB])

  if (!rows || rows.length !== 2) return { data: null, error: 'Could not reorder' }

  const a = rows.find((r) => r.id === idA)!
  const b = rows.find((r) => r.id === idB)!

  await Promise.all([
    supabase.from('gallery').update({ display_order: b.display_order }).eq('id', a.id),
    supabase.from('gallery').update({ display_order: a.display_order }).eq('id', b.id),
  ])
  return { data: null, error: null }
}

export async function moveGalleryUp(id: string): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()
  const { data: ordered } = await supabase
    .from('gallery')
    .select('id')
    .order('display_order', { ascending: true })
  if (!ordered) return { data: null, error: 'Could not reorder' }
  const idx = ordered.findIndex((r) => r.id === id)
  if (idx <= 0) return { data: null, error: null }
  return swapOrder(id, ordered[idx - 1].id)
}

export async function moveGalleryDown(id: string): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()
  const { data: ordered } = await supabase
    .from('gallery')
    .select('id')
    .order('display_order', { ascending: true })
  if (!ordered) return { data: null, error: 'Could not reorder' }
  const idx = ordered.findIndex((r) => r.id === id)
  if (idx < 0 || idx >= ordered.length - 1) return { data: null, error: null }
  return swapOrder(id, ordered[idx + 1].id)
}
