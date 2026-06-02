export const SITE_URL = 'https://noryx-studio.vercel.app'

// Cache tags for tag-based revalidation (revalidateTag in admin mutations)
export const CACHE_TAGS = {
  settings: 'settings',
  services: 'services',
  reviews: 'reviews',
  gallery: 'gallery',
} as const

// Setting keys stored in the `settings` table (typed, single source of truth)
export const SETTING_KEYS = {
  hero: 'hero',
  about: 'about',
  contact: 'contact',
  timeSlots: 'time_slots',
  bookingEnabled: 'booking_enabled',
  barberContact: 'barber_contact',
} as const
