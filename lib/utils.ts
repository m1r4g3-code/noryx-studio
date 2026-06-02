import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parse } from 'date-fns'
import type { AppointmentStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const random = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  return `NORYX-${random}`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMMM d, yyyy')
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM d, yyyy')
}

export function formatTime(time: string): string {
  try {
    const parsed = parse(time, 'HH:mm', new Date())
    return format(parsed, 'h:mm a')
  } catch {
    return time
  }
}

export function getStatusColor(status: AppointmentStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
    case 'confirmed':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    case 'completed':
      return 'bg-green-500/10 text-green-400 border-green-500/30'
    case 'cancelled':
      return 'bg-red-500/10 text-red-400 border-red-500/30'
    default:
      return 'bg-surface text-text-muted border-border'
  }
}

export function getWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const intl = cleaned.startsWith('0') ? `234${cleaned.slice(1)}` : cleaned
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`
}

export function galleryImageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  return `${base}/storage/v1/object/public/gallery/${path}`
}

export function toNigerianIntl(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('234')) return `+${cleaned}`
  if (cleaned.startsWith('0')) return `+234${cleaned.slice(1)}`
  return `+${cleaned}`
}
