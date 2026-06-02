-- ============================================================
-- Noryx Studio — Force public writes through validated server actions
-- Bookings & reviews now go through service-role server actions that
-- validate input and rate-limit. Remove the direct anon INSERT paths.
-- ============================================================

DROP POLICY IF EXISTS "public_insert_appointments" ON appointments;
DROP POLICY IF EXISTS "public_insert_reviews" ON reviews;
