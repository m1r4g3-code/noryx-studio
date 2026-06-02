import { describe, it, expect } from 'vitest'
import {
  generateReference,
  formatCurrency,
  formatTime,
  toNigerianIntl,
  galleryImageUrl,
} from '@/lib/utils'
import { bookingSchema, reviewSchema } from '@/lib/validations'

describe('generateReference', () => {
  it('matches NORYX-XXXXXX with 6 base36 chars', () => {
    for (let i = 0; i < 50; i++) {
      expect(generateReference()).toMatch(/^NORYX-[A-Z0-9]{6}$/)
    }
  })
  it('is reasonably unique across many calls', () => {
    const set = new Set(Array.from({ length: 1000 }, () => generateReference()))
    expect(set.size).toBeGreaterThan(995)
  })
})

describe('formatCurrency', () => {
  it('formats Naira without decimals', () => {
    expect(formatCurrency(3500)).toContain('3,500')
  })
})

describe('formatTime', () => {
  it('formats 24h to 12h am/pm', () => {
    expect(formatTime('09:00')).toMatch(/9:00\s?AM/i)
    expect(formatTime('17:00')).toMatch(/5:00\s?PM/i)
  })
})

describe('toNigerianIntl', () => {
  it('normalizes local 0-prefixed numbers', () => {
    expect(toNigerianIntl('08012345678')).toBe('+2348012345678')
  })
  it('keeps already-international numbers', () => {
    expect(toNigerianIntl('+2348012345678')).toBe('+2348012345678')
    expect(toNigerianIntl('2348012345678')).toBe('+2348012345678')
  })
})

describe('galleryImageUrl', () => {
  it('strips BOM/whitespace and trailing slash from the base', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = '﻿ https://x.supabase.co/ '
    const url = galleryImageUrl('photo.webp')
    expect(url).toBe('https://x.supabase.co/storage/v1/object/public/gallery/photo.webp')
  })
})

describe('reviewSchema', () => {
  it('rejects rating 0', () => {
    expect(reviewSchema.safeParse({ client_name: 'Jo', rating: 0, comment: 'x'.repeat(10) }).success).toBe(false)
  })
  it('accepts a valid review', () => {
    expect(reviewSchema.safeParse({ client_name: 'John', rating: 5, comment: 'Great cut, loved it!' }).success).toBe(true)
  })
})

describe('bookingSchema', () => {
  const base = {
    service_id: '00000000-0000-0000-0000-000000000000',
    appointment_date: '2026-06-10',
    appointment_time: '09:00',
    client_name: 'John Doe',
    client_phone: '08012345678',
    client_email: '',
    notes: '',
  }
  it('accepts a valid booking', () => {
    expect(bookingSchema.safeParse(base).success).toBe(true)
  })
  it('rejects an invalid Nigerian phone', () => {
    expect(bookingSchema.safeParse({ ...base, client_phone: '12345' }).success).toBe(false)
  })
  it('rejects a malformed time', () => {
    expect(bookingSchema.safeParse({ ...base, appointment_time: '9am' }).success).toBe(false)
  })
})
