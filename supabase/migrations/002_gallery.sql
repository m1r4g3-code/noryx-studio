-- ============================================================
-- Noryx Studio — Gallery (table + storage bucket + policies)
-- ============================================================

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_path TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery(display_order);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_gallery" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "auth_all_gallery" ON gallery
  FOR ALL USING (auth.role() = 'authenticated');

-- Public storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Storage object policies for the gallery bucket
CREATE POLICY "gallery_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "gallery_auth_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "gallery_auth_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "gallery_auth_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');
