-- Delete old reels
DELETE FROM reels;

-- Insert 12 Real Instagram Reels with Authentic Extracted Thumbnails
INSERT INTO reels (
  id, provider, original_url, content_id, title_ar, title_en,
  description_ar, description_en, thumbnail_url, is_published, is_featured, sort_order
) VALUES
(
  'reel-ig-1',
  'instagram',
  'https://www.instagram.com/reel/DcdzsL4IYbC/',
  'DcdzsL4IYbC',
  'كواليس تشكيل طاولة طعام ملكية من جذع الجوز الأسود',
  'Crafting Royal Black Walnut Live Edge Dining Table',
  'مراحل تسوية السطح ومعالجة التعرجات الطبيعية وإبراز عروق الجوز المعمر',
  'Surface leveling and revealing natural organic walnut grain textures',
  '/reels/reel-1.jpg',
  1, 1, 1
),
(
  'reel-ig-2',
  'instagram',
  'https://www.instagram.com/reel/DcLchhOIVMg/',
  'DcLchhOIVMg',
  'لحظة سكب الزيوت العضوية الإيطالية وانبثاق اللمعان الطبيعي',
  'Applying Organic Penetrating Oil & Wood Luster',
  'التشطيب الملكي بالزيوت الطبيعية الآمنة لحماية الخشب وإبراز دفئه العضوي',
  'Royal hand-finishing bringing out deep organic warmth and natural luster',
  '/reels/reel-2.jpg',
  1, 1, 2
),
(
  'reel-ig-3',
  'instagram',
  'https://www.instagram.com/reel/Db-Z528xVBR/',
  'Db-Z528xVBR',
  'نحت وتشكيل طاولة قهوة من عقدة جذر السنديان',
  'Sculpting Live Edge Burl Coffee Table',
  'إبراز العقد والتجاويف النادرة المكونة عبر عقود تحت الأرض',
  'Preserving rare burl topology formed over decades underground',
  '/reels/reel-3.jpg',
  1, 1, 3
),
(
  'reel-ig-4',
  'instagram',
  'https://www.instagram.com/reel/DbnAvUVIndT/',
  'DbnAvUVIndT',
  'دقة الصنفرة والتنعيم اليدوي بالمسحاج الياباني الحريري',
  'Japanese Hand Planing for Silk-Smooth Texture',
  'صنفرة يدوية متدرجة للوصول لملمس ناعم كالحرير بدون أي شوائب',
  'Precision hand-finishing achieving flawless tactile silk smoothness',
  '/reels/reel-4.jpg',
  1, 0, 4
),
(
  'reel-ig-5',
  'instagram',
  'https://www.instagram.com/reel/DblTtmSIiMA/',
  'DblTtmSIiMA',
  'صب الراتنج الكريستالي الدخاني على أطراف السنديان',
  'Smoked Crystal Amber Resin Pouring',
  'دمج فني بين صلابة الخشب وشفافية الراتنج النقي بألوان العنبر الدخاني',
  'Artistic convergence of raw hardwood with translucent amber casting resin',
  '/reels/reel-5.jpg',
  1, 1, 5
),
(
  'reel-ig-6',
  'instagram',
  'https://www.instagram.com/reel/DbDxzcgowkW/',
  'DbDxzcgowkW',
  'تفصيل كونسول مدخل معماري من خشب الساج البورمي',
  'Bespoke Burmese Teak Monolithic Entryway Console',
  'حضور معماري مهيب صُمم خصيصاً لمداخل الفلل والقصور الفاخرة',
  'Commanding monolithic aesthetic tailored for grand private entrances',
  '/reels/reel-6.jpg',
  1, 0, 6
),
(
  'reel-ig-7',
  'instagram',
  'https://www.instagram.com/reel/DbFXrjhomhx/',
  'DbFXrjhomhx',
  'انتقاء وفحص جذوع الأخشاب النادرة قبل التشكيل',
  'Selecting & Grading Rare Seasoned Hardwood Slabs',
  'معايير دقيقة لفحص كثافة الألياف ونسبة الرطوبة لضمان استدامة التحفة',
  'Rigorous moisture testing and grain grading ensuring lifelong endurance',
  '/reels/reel-7.jpg',
  1, 0, 7
),
(
  'reel-ig-8',
  'instagram',
  'https://www.instagram.com/reel/DabGFUexMct/',
  'DabGFUexMct',
  'تشكيل صواني الضيافة اليدوية مع لحاء الشجر الطبيعي',
  'Crafting Raw Bark Live Edge Serving Trays',
  'تحف ضيافة حصرية تجمع بين أصالة الطبيعة وأناقة التقديم الكويتي',
  'Artisanal hospitality serving boards celebrating raw bark contours',
  '/reels/reel-8.jpg',
  1, 0, 8
),
(
  'reel-ig-9',
  'instagram',
  'https://www.instagram.com/reel/DaaDKwFxv0u/',
  'DaaDKwFxv0u',
  'تركيب وتسليم طاولة طعام خاصة لشاليه في الخيران',
  'Delivery & Installation of Custom Dining Table in Khiran',
  'تثبيت القطعة ومطابقتها هندسياً مع إضاءة وديكور الصالون الرئيسي',
  'Final on-site staging and architectural lighting alignment',
  '/reels/reel-9.jpg',
  1, 0, 9
),
(
  'reel-ig-10',
  'instagram',
  'https://www.instagram.com/reel/DZcZznjojzc/',
  'DZcZznjojzc',
  'أسرار نحت المجسمات الجدارية ثلاثية الأبعاد',
  '3D Sculptural Wall Art Carving Process',
  'تناغم هندسي بين زوايا القطع وانعكاسات الضوء الطبيعي على مدار اليوم',
  'Faceted geometric woodwork interacting dynamically with daylight',
  '/reels/reel-10.jpg',
  1, 0, 10
),
(
  'reel-ig-11',
  'instagram',
  'https://www.instagram.com/reel/DZA07-ERxaW/',
  'DZA07-ERxaW',
  'معالجة الشقوق الطبيعية بالذهب المسال وتثبيت الفراشات',
  'Butterfly Joinery & Kintsugi-Inspired Wood Inlays',
  'تثبيت الفواصل بوصلات فراشة خشبية كلاسيكية مع لمسات ذهبية راقية',
  'Traditional Dutchmen butterfly keys with subtle luxury gold stabilization',
  '/reels/reel-11.jpg',
  1, 0, 11
),
(
  'reel-ig-12',
  'instagram',
  'https://www.instagram.com/reel/DXwshvOo5sB/',
  'DXwshvOo5sB',
  'جولة داخل محترف وورشة فهد غصن في الكويت',
  'Inside Fahad Gsn Atelier & Craft Workshop in Kuwait',
  'نظرة على أدوات الحرفة، أخشاب الجوز المعمرة، وروح العمل اليدوي الصادق',
  'A glimpse into the artisan tools, aged timber slabs, and handmade passion',
  '/reels/reel-12.jpg',
  1, 1, 12
);
