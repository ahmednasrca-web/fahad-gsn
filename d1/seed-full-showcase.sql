-- ─── 1. Enhanced Site Content ──────────────────────────────────────────────
INSERT OR REPLACE INTO site_content (key, value_ar, value_en) VALUES
  ('hero_title', 'فهد غصن — الخشب الحي', 'Fahad Gsn — Living Wood'),
  ('hero_subtitle', 'أعمال خشبية يدوية فاخرة تجمع بين الفن الكويتي الأصيل والدقة الحرفية المستدامة', 'Luxury handcrafted woodwork blending authentic Kuwaiti artistry with sustainable precision craftsmanship'),
  ('about_intro', 'في محترف فهد غصن بالكويت، نحوّل جذوع الأشجار الطبيعية المعمرة النادرة إلى تحف فنية حية تدوم لأجيال.', 'At Fahad Gsn Atelier in Kuwait, we transform rare ancient sustainable hardwoods into living heirloom masterpieces built to outlast generations.'),
  ('about_philosophy', 'فلسفتنا تقوم على احترام هوية الخشب الطبيعية؛ لا نخفي الشقوق أو العروق بل نبرزها كبصمة فريدة لا تتكرر أبداً في الطبيعة.', 'Our philosophy centers on honoring the natural soul of wood; never concealing raw burls or organic fissures, but celebrating them as nature''s singular fingerprint.'),
  ('about_materials', 'نستورد أندر أنواع خشب الجوز الأسود، السنديان الأوروبي، الساج البورمي، والزيتون المعمر مع تجفيف دقيق يدوم لسنوات.', 'We sustainably source the world''s rarest American Black Walnut, European White Oak, Burmese Teak, and Mediterranean Olive, seasoned over years.'),
  ('contact_phone', '+965 98908022', '+965 98908022'),
  ('contact_instagram', '@fahad_gsn', '@fahad_gsn'),
  ('contact_email', 'fahad@fahadgsn.com', 'fahad@fahadgsn.com'),
  ('footer_tagline', 'صنع بإتقان وفخر بيد الحرفي الكويتي فهد غصن', 'Masterfully handcrafted with pride by Kuwaiti artisan Fahad Gsn');

-- ─── 2. Rich Social Video Reels (YouTube Shorts & Instagram) ────────────────
INSERT OR REPLACE INTO reels (
  id, provider, original_url, content_id, title_ar, title_en,
  description_ar, description_en, thumbnail_url, is_published, is_featured, sort_order
) VALUES
(
  'reel-1',
  'youtube',
  'https://www.youtube.com/shorts/dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'كواليس صب الراتنج العنبري الشفاف على طاولة المجلس',
  'Pouring Amber Crystal Resin on Majlis Table',
  'مرحلة ضبط درجة حرارة الراتنج وتفريغ فقاعات الهواء على حواف خشب السنديان الطبيعي.',
  'Precision temperature control and bubble degassing on live-edge oak slabs.',
  '/works/work-10.jpg',
  1, 1, 1
),
(
  'reel-2',
  'youtube',
  'https://www.youtube.com/shorts/dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'لحظة دهان الزيت الإيطالي على جذع الجوز الأسود المعمر',
  'Applying Italian Penetrating Oil to Ancient Black Walnut',
  'مشهد سينمائي يبرز تحول لون الخشب وانبثاق العروق الذهبية المتموجة فور ملامسة الزيت العضوي.',
  'Cinematic transformation revealing golden grain curls upon first touch of organic wood oil.',
  '/works/work-1.jpg',
  1, 1, 2
),
(
  'reel-3',
  'youtube',
  'https://www.youtube.com/shorts/dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'النحت اليدوي الدقيق بحواف المسحاج الياباني',
  'Hand-Planing with Japanese Kanna Blades',
  'تجهيز السطح النهائي بنعومة الحرير بدون استخدام أي مواد كيميائية أو صنفرة ميكانيكية.',
  'Masterful surface preparation achieving silk-smooth tactile finish purely by hand.',
  '/works/work-4.jpg',
  1, 1, 3
),
(
  'reel-4',
  'youtube',
  'https://www.youtube.com/shorts/dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'تجهيز وتسليم كونسول المدخل لفيلا في ضاحية عبدالله السالم',
  'Delivering Custom Console to Abdullah Al-Salem Villa',
  'تركيب القطعة في مكانها المخصص ومطابقة الإضاءة المعمارية مع أبعاد الخشب الطبيعي.',
  'Final on-site installation perfectly matched with bespoke architectural spotlighting.',
  '/works/work-6.jpg',
  1, 0, 4
),
(
  'reel-5',
  'youtube',
  'https://www.youtube.com/shorts/dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'انتقاء جذوع الأشجار النادرة من الغابات المستدامة',
  'Selecting Rare Sustainable Timber Slabs',
  'معايير فحص نسبة الرطوبة وكثافة الألياف قبل بدء مرحلة التشكيل في الورشة.',
  'Inspecting fiber density and moisture ratios prior to seasoning at our Kuwait atelier.',
  '/works/work-12.jpg',
  1, 0, 5
);

-- ─── 3. Sample Client Inquiries in Admin Messages ───────────────────────────
INSERT OR REPLACE INTO contact_messages (
  id, name, email, phone, message, work_slug, is_read, created_at
) VALUES
(
  'msg-1',
  'الشيخ جراح الصباح',
  'j.alsabah@gmail.com',
  '+965 99887766',
  'مساء الخير يا فهد، ماشاء الله تبارك الرحمن شغلك يشرّف. حابين نفصّل طاولة طعام بطول 3.5 أمتار تتسع لـ 12 شخص لشاليه بالخيران، نحتاج نحدد موعد لزيارة الورشة واختيار الجذع المناسب.',
  'royal-walnut-live-edge-dining',
  0,
  datetime('now', '-2 hours')
),
(
  'msg-2',
  'م. سارة المرزوق',
  'arch.sara.almarzouq@gmail.com',
  '+965 97711223',
  'يعطيك العافية أستاذ فهد، أنا مهندسة ديكور وأعمل على تأثيث فيلا خاصة بالبدع، محتاجة كونسول مدخل مخصص وطاولة قهوة من خشب الساج مع تطعيم خفيف. هل يمكن تزويدنا بالمخططات والأسعار؟',
  'burmese-teak-monolithic-console',
  0,
  datetime('now', '-5 hours')
),
(
  'msg-3',
  'عبدالرحمن الكندري',
  'a.alkandari@outlook.com',
  '+965 90055443',
  'السلام عليكم، أود الاستفسار عن إمكانية طلب طقم صواني الضيافة بعدد 4 حبات بتصميم مخصص وشعار العائلة محفور بالليزر على الخشب.',
  'artisan-raw-bark-serving-set',
  1,
  datetime('now', '-1 days')
);

-- ─── 4. Full Catalog of Showcase Works ──────────────────────────────────────
INSERT OR REPLACE INTO works (
  id, slug, category_id, title_ar, title_en, description_ar, description_en,
  story_ar, story_en, price, primary_image_url, image_urls,
  is_published, is_featured, is_unique_piece, sort_order, created_at, updated_at
) VALUES
  (
    'work-7',
    'executive-walnut-desk-slab',
    'cat-consoles',
    'مكتب تنفيذي ملكي من خشب الجوز الأمريكي الصلب',
    'Executive Black Walnut Slab Desk',
    'مكتب تنفيذي فخم مصمم للقصور والمكاتب القيادية، بسطح مستمر من قطعة واحدة مع فتحات إخفاء كابلات ذكية وملمس حريري دافئ.',
    'A commanding executive desk fashioned from a continuous walnut slab, designed with concealed cable routing and a tactile velvet finish.',
    'يجمع هذا المكتب بين هيبة الأثاث الكلاسيكي والوظائفية الحديثة، وصُقل بعناية ليعكس مكانة وثقة صاحبه.',
    'Engineered for distinguished leaders, merging the authoritative poise of raw hardwood with modern connectivity.',
    1450.00,
    '/works/work-3.jpg',
    '["/works/work-3.jpg", "/works/work-1.jpg"]',
    1, 0, 1, 7, datetime('now', '-1 days'), datetime('now')
  ),
  (
    'work-8',
    'sculpted-monolith-side-tables',
    'cat-coffee',
    'زوج طاولات جانبية منحوتة من جذع شجرة التين البري',
    'Pair of Sculpted Wild Fig Tree Side Tables',
    'زوج طاولات جانبية فريدة كتحف نحتية مستقلة بجوار أرائك الجلوس، تبرز الثقوب الطبيعية المعالجة بالذهب المسال.',
    'A harmonious duo of organic side tables carved from wild fig heartwood, featuring gold-leaf stabilized fissures.',
    'تم الحفاظ على كل انحناء طبيعي شكّلته الرياح والأمطار على مدار نصف قرن في هذه القطع.',
    'Preserving every organic curvature carved by half a century of desert wind and sun.',
    520.00,
    '/works/work-5.jpg',
    '["/works/work-5.jpg", "/works/work-7.jpg"]',
    1, 0, 1, 8, datetime('now', '-12 hours'), datetime('now')
  );
