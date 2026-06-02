import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const bookingClientSchema = z.object({
  client_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  client_phone: z
    .string()
    .regex(
      /^(\+?234|0)[789][01]\d{8}$/,
      'Enter a valid Nigerian phone number (e.g. 08012345678)'
    ),
  client_email: z
    .string()
    .email('Enter a valid email address')
    .optional()
    .or(z.literal('')),
  notes: z.string().max(500, 'Notes too long').optional(),
})

export const bookingSchema = z.object({
  service_id: z.string().uuid('Invalid service'),
  appointment_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  appointment_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  client_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100),
  client_phone: z
    .string()
    .regex(
      /^(\+?234|0)[789][01]\d{8}$/,
      'Enter a valid Nigerian phone number'
    ),
  client_email: z
    .string()
    .email('Invalid email')
    .optional()
    .or(z.literal('')),
  notes: z.string().max(500, 'Notes too long').optional(),
})

export const reviewSchema = z.object({
  client_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100),
  rating: z
    .number()
    .int()
    .min(1, 'Select a rating')
    .max(5, 'Rating must be 1–5'),
  comment: z
    .string()
    .min(10, 'Please write at least 10 characters')
    .max(1000, 'Comment too long'),
})

export const serviceSchema = z.object({
  name: z.string().min(2, 'Name too short').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  price: z
    .number({ invalid_type_error: 'Enter a valid price' })
    .positive('Price must be positive')
    .max(1_000_000, 'Price too high'),
  duration_minutes: z
    .number({ invalid_type_error: 'Enter a valid duration' })
    .int()
    .min(5, 'Minimum 5 minutes')
    .max(480, 'Maximum 8 hours'),
  is_active: z.boolean().default(true),
  display_order: z.number().int().min(0).default(0),
})

export const settingsSchema = z.object({
  hero_headline: z.string().min(1, 'Required').max(200),
  hero_subheadline: z.string().max(300).optional().default(''),
  about_text: z.string().max(2000).optional().default(''),
  contact_phone: z.string().max(20).optional().default(''),
  contact_email: z.string().email('Invalid email').optional().or(z.literal('')),
  contact_whatsapp: z.string().max(20).optional().default(''),
  booking_enabled: z.boolean(),
  time_slots: z
    .array(z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format HH:MM'))
    .min(1, 'At least one time slot required'),
  barber_notification_email: z
    .string()
    .email('Invalid email')
    .optional()
    .or(z.literal('')),
  barber_notification_phone: z.string().max(20).optional().default(''),
})

// Inferred types
export type LoginFormValues = z.infer<typeof loginSchema>
export type BookingClientFormValues = z.infer<typeof bookingClientSchema>
export type BookingFormValues = z.infer<typeof bookingSchema>
export type ReviewFormValues = z.infer<typeof reviewSchema>
export type ServiceFormValues = z.infer<typeof serviceSchema>
export type SettingsFormValues = z.infer<typeof settingsSchema>
