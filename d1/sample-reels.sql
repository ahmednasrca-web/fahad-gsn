-- Sample test reels for local dev testing
INSERT OR IGNORE INTO reels (
  id, provider, original_url, content_id, title_ar, title_en,
  description_ar, description_en, thumbnail_url, is_published, is_featured, sort_order
) VALUES
(
  'test-reel-1',
  'instagram',
  'https://www.instagram.com/reel/C9xTest123/',
  'C9xTest123',
  'كواليس نحت مبخرة خشب الساج البورمي',
  'Behind the scenes of Burmese Teak Incense Burner',
  'مراحل التشكيل والتنعيم اليدوي لأدق التفاصيل',
  'Hand carving and sanding intricate details',
  NULL,
  1,
  1,
  1
),
(
  'test-reel-2',
  'youtube',
  'https://www.youtube.com/shorts/dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'تشطيب وتلميع صندوق مقتنيات فاخر',
  'Finishing & Polishing Luxury Keepsake Box',
  'استخدام الزيوت الطبيعية لإبراز عروق خشب الجوز الأمريكي',
  'Using natural oils to highlight American Walnut grain',
  'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  1,
  1,
  2
);
