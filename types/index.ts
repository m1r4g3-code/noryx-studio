// Database row types

export type Service = {
  id: string
  name: string
  description: string | null
  price: number
  duration_minutes: number
  is_active: boolean
  display_order: number
  created_at: string
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export type Appointment = {
  id: string
  reference: string
  service_id: string
  client_name: string
  client_phone: string
  client_email: string | null
  appointment_date: string
  appointment_time: string
  notes: string | null
  status: AppointmentStatus
  created_at: string
  services?: Pick<Service, 'name' | 'price' | 'duration_minutes'>
}

export type GalleryItem = {
  id: string
  image_path: string
  caption: string | null
  display_order: number
  created_at: string
}

export type Review = {
  id: string
  client_name: string
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
  is_approved: boolean
  created_at: string
}

export type Setting = {
  key: string
  value: SettingValue
  updated_at: string
}

export type SettingValue =
  | string
  | number
  | boolean
  | string[]
  | Record<string, unknown>

// Strongly typed settings payloads
export type HeroSettings = {
  headline: string
  subheadline: string
}

export type AboutSettings = {
  text: string
}

export type ContactSettings = {
  phone: string
  email: string
  whatsapp: string
}

export type BarberContactSettings = {
  notification_email: string
  notification_phone: string
}

export type SiteSettings = {
  hero_headline: string
  hero_subheadline: string
  about_text: string
  contact_phone: string
  contact_email: string
  contact_whatsapp: string
  booking_enabled: boolean
  time_slots: string[]
  barber_notification_email: string
  barber_notification_phone: string
}

// Booking flow types
export type BookingStep = 1 | 2 | 3 | 4

export type BookingFormData = {
  service_id: string
  service_name: string
  service_price: number
  service_duration: number
  appointment_date: Date
  appointment_time: string
  client_name: string
  client_phone: string
  client_email?: string
  notes?: string
}

// Admin types
export type AdminStats = {
  today_total: number
  pending_count: number
  confirmed_count: number
  completed_count: number
  total_revenue: number
}

export type AppointmentWithService = Appointment & {
  services: Pick<Service, 'name' | 'price' | 'duration_minutes'>
}

// API helpers
export type ActionResult<T = null> = {
  data: T | null
  error: string | null
}
