'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { ActionResult } from '@/types'
import type { ServiceFormValues } from '@/lib/validations'

export async function createService(data: ServiceFormValues): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from('services').insert({
    name: data.name,
    description: data.description || null,
    price: data.price,
    duration_minutes: data.duration_minutes,
    is_active: data.is_active,
    display_order: data.display_order,
  })
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function updateService(
  id: string,
  data: ServiceFormValues
): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('services')
    .update({
      name: data.name,
      description: data.description || null,
      price: data.price,
      duration_minutes: data.duration_minutes,
      is_active: data.is_active,
      display_order: data.display_order,
    })
    .eq('id', id)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function deleteService(id: string): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function toggleServiceActive(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('services')
    .update({ is_active: isActive })
    .eq('id', id)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function moveServiceUp(id: string): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()

  const { data: services } = await supabase
    .from('services')
    .select('id, display_order')
    .order('display_order', { ascending: true })

  if (!services) return { data: null, error: 'Could not fetch services' }

  const idx = services.findIndex((s) => s.id === id)
  if (idx <= 0) return { data: null, error: null }

  const current = services[idx]
  const above = services[idx - 1]

  await Promise.all([
    supabase.from('services').update({ display_order: above.display_order }).eq('id', current.id),
    supabase.from('services').update({ display_order: current.display_order }).eq('id', above.id),
  ])

  return { data: null, error: null }
}

export async function moveServiceDown(id: string): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()

  const { data: services } = await supabase
    .from('services')
    .select('id, display_order')
    .order('display_order', { ascending: true })

  if (!services) return { data: null, error: 'Could not fetch services' }

  const idx = services.findIndex((s) => s.id === id)
  if (idx < 0 || idx >= services.length - 1) return { data: null, error: null }

  const current = services[idx]
  const below = services[idx + 1]

  await Promise.all([
    supabase.from('services').update({ display_order: below.display_order }).eq('id', current.id),
    supabase.from('services').update({ display_order: current.display_order }).eq('id', below.id),
  ])

  return { data: null, error: null }
}
