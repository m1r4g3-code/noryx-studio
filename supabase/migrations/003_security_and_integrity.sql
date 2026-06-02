-- ============================================================
-- Noryx Studio — Security & data-integrity hardening
-- Addresses: PII exposure, double-booking race, audit columns, rate limiting
-- ============================================================

-- ─── 1. Lock down appointments: remove public read of PII ─────────────────────
DROP POLICY IF EXISTS "public_select_appointments" ON appointments;

-- Availability is now exposed through a narrow SECURITY DEFINER function that
-- returns ONLY booked times for a date (no names/phones/emails).
CREATE OR REPLACE FUNCTION public.booked_times(d date)
RETURNS SETOF time
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT appointment_time
  FROM appointments
  WHERE appointment_date = d
    AND status IN ('pending', 'confirmed');
$$;

REVOKE ALL ON FUNCTION public.booked_times(date) FROM public;
GRANT EXECUTE ON FUNCTION public.booked_times(date) TO anon, authenticated;

-- ─── 2. Prevent double-booking at the database level ──────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_slot
  ON appointments (appointment_date, appointment_time)
  WHERE status IN ('pending', 'confirmed');

-- ─── 3. Audit columns (updated_at) + auto-update triggers ─────────────────────
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE services     ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_appointments_updated ON appointments;
CREATE TRIGGER trg_appointments_updated BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_services_updated ON services;
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── 4. Infra-free rate limiting (sliding window in Postgres) ─────────────────
CREATE TABLE IF NOT EXISTS rate_limit_hits (
  bucket  TEXT NOT NULL,
  hit_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rate_limit ON rate_limit_hits (bucket, hit_at);

ALTER TABLE rate_limit_hits ENABLE ROW LEVEL SECURITY;
-- no policies: only service_role / SECURITY DEFINER may touch it

-- Returns true if the action is allowed (and records the hit), false if over limit.
CREATE OR REPLACE FUNCTION public.rate_limit(p_bucket text, p_max int, p_window_seconds int)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c int;
BEGIN
  -- opportunistic cleanup of old rows
  DELETE FROM rate_limit_hits WHERE hit_at < NOW() - INTERVAL '1 day';

  SELECT count(*) INTO c
  FROM rate_limit_hits
  WHERE bucket = p_bucket
    AND hit_at > NOW() - make_interval(secs => p_window_seconds);

  IF c >= p_max THEN
    RETURN false;
  END IF;

  INSERT INTO rate_limit_hits (bucket) VALUES (p_bucket);
  RETURN true;
END; $$;

REVOKE ALL ON FUNCTION public.rate_limit(text, int, int) FROM public;
GRANT EXECUTE ON FUNCTION public.rate_limit(text, int, int) TO service_role;
