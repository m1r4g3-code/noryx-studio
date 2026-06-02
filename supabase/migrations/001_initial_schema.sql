-- ============================================================
-- Noryx Studio — Initial Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── TABLES ──────────────────────────────────────────────────

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT NOT NULL UNIQUE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── INDEXES ─────────────────────────────────────────────────

CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_reference ON appointments(reference);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);
CREATE INDEX idx_services_active_order ON services(is_active, display_order);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Services
CREATE POLICY "public_select_active_services" ON services
  FOR SELECT USING (is_active = true);

CREATE POLICY "auth_all_services" ON services
  FOR ALL USING (auth.role() = 'authenticated');

-- Appointments
CREATE POLICY "public_insert_appointments" ON appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_select_appointments" ON appointments
  FOR SELECT USING (true);

CREATE POLICY "auth_all_appointments" ON appointments
  FOR ALL USING (auth.role() = 'authenticated');

-- Reviews
CREATE POLICY "public_insert_reviews" ON reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_select_approved_reviews" ON reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "auth_all_reviews" ON reviews
  FOR ALL USING (auth.role() = 'authenticated');

-- Settings
CREATE POLICY "public_select_public_settings" ON settings
  FOR SELECT USING (key IN ('time_slots', 'booking_enabled', 'hero', 'about', 'contact'));

CREATE POLICY "auth_all_settings" ON settings
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── SEED: SETTINGS ──────────────────────────────────────────

INSERT INTO settings (key, value) VALUES
  ('time_slots', '["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"]'),
  ('booking_enabled', 'true'),
  ('hero', '{"headline": "PRECISION. STYLE. IDENTITY.", "subheadline": "Premium grooming experience in Lagos."}'),
  ('about', '{"text": "Noryx Studio is where precision meets style. Our master barbers bring years of experience and an unwavering passion for the perfect cut. Whether you want a classic fade, a signature design, or a full grooming experience — you leave looking and feeling your best."}'),
  ('contact', '{"phone": "09162035059", "email": "sain.tcuts3@gmail.com", "whatsapp": "2349162035059"}'),
  ('barber_contact', '{"notification_email": "", "notification_phone": ""}');

-- ─── SEED: SERVICES ──────────────────────────────────────────

INSERT INTO services (name, description, price, duration_minutes, display_order) VALUES
  ('Haircut',
   'Classic haircut with clippers and scissors, finished with a hot towel and lineup.',
   3500, 30, 1),
  ('Shave',
   'Clean shave with precision razor, hot towel treatment and skin conditioning.',
   2500, 20, 2),
  ('Haircut + Shave',
   'The complete experience — a sharp haircut paired with a smooth clean shave.',
   5500, 45, 3),
  ('Hair Design',
   'Custom hair design with precision cutting and signature styling to match your vision.',
   4000, 40, 4),
  ('Kids Cut',
   'Gentle and precise haircut for young clients. Scissors or clippers finish.',
   2500, 25, 5);
