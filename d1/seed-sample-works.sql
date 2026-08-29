-- Seed Rich Categories
INSERT OR REPLACE INTO categories (id, slug, name_ar, name_en, description_ar, description_en, sort_order, is_active)
VALUES 
  ('cat-dining', 'dining-tables', 'طاولات طعام ملكية', 'Royal Dining Tables', 'طاولات طعام مصنوعة من جذوع الأخشاب الطبيعية المعمرة بحواف حية وتشطيب يدوي فاخر', 'Handcrafted dining tables sculpted from live-edge ancient logs', 1, 1),
  ('cat-coffee', 'coffee-tables', 'طاولات قهوة وجلسات', 'Coffee & Lounge Tables', 'طاولات جلسات استثنائية تبرز عروق الخشب الطبيعي والتدرجات اللونية العضوية', 'Exquisite coffee tables showcasing organic wood grain and unique burls', 2, 1),
  ('cat-consoles', 'consoles', 'كونسول ومداخل فخمة', 'Luxury Consoles & Entryways', 'قطع كونسول منحوتة بتناغم بين صلابة الخشب والجمال المعماري للمداخل', 'Monolithic entryway consoles blending architectural presence with natural grain', 3, 1),
  ('cat-art', 'artistic-creations', 'تحف فنية وديكور', 'Sculptural & Masterpieces', 'مجسمات وتحف خشبية نادرة وصواني تقديم حصرية تشهد على دقة الحرفة', 'Limited artisan sculptural creations and raw-edge serving slabs', 4, 1);

-- Seed Works using User Uploaded Assets
INSERT OR REPLACE INTO works (
  id, slug, category_id, title_ar, title_en, description_ar, description_en,
  story_ar, story_en, price, primary_image_url, image_urls,
  is_published, is_featured, is_unique_piece, sort_order, created_at, updated_at
) VALUES
  (
    'work-1',
    'royal-walnut-live-edge-dining',
    'cat-dining',
    'طاولة طعام ملكية من جذع الجوز الأسود المعمر',
    'Royal Black Walnut Live Edge Dining Table',
    'طاولة طعام استثنائية من شريحة واحدة لجذع جوز أسود أمريكي معمر بأطراف حية (Live Edge). مصقولة بطبقات الزيوت العضوية الإيطالية التي تبرز تباين العروق والشرايين الخشبية الذهبية، مع قاعدة متينة من الفولاذ الأسود المطفي.',
    'A magnificent single-slab American black walnut dining table with authentic live edges. Finished with organic penetrating oils to highlight golden heartwood curls, paired with a custom matte black structural base.',
    'تم اختيار هذا الجذع الاستثنائي من شجرة جوز معمرة تجاوزت الـ 120 عاماً. خضع الخشب لعملية تجفيف هوائي بطيء استمرت عامين كاملين، تلاها تشكيل يدوي دقيق استغرق أكثر من 80 ساعة من النحت والتنعيم لإبراز التاريخ العريق للشجرة في كل سنتيمتر.',
    'Harvested from a 120-year-old historic walnut tree, aged and kiln-seasoned over two full years. Handcrafted across 80+ hours of artisan sculpting to celebrate the tree legacy.',
    1850.00,
    '/works/work-1.jpg',
    '["/works/work-1.jpg", "/works/work-2.jpg", "/works/work-3.jpg"]',
    1, 1, 1, 1, datetime('now', '-5 days'), datetime('now')
  ),
  (
    'work-2',
    'organic-burl-coffee-table',
    'cat-coffee',
    'طاولة قهوة عضوية من عقدة جذر السنديان',
    'Organic Live Edge Burl Coffee Table',
    'طاولة قهوة فاخرة منحوتة من عقدة جذر سنديان معمر (Oak Burl) بتعاريج طبيعية نادرة وتدرجات لونية تأسر الأنظار في مجالس وصالونات الاستقبال.',
    'An organic coffee table crafted from an ancient oak root burl, boasting mesmerizing grain swirls and natural hollows for an unforgettable centerpiece.',
    'عقدة الجذر النادرة هذه تشكلت تحت الأرض على مدار عقود، مما منحها عروقاً متداخلة لا تتكرر في أي قطعة أخرى في العالم.',
    'Decades of natural underground growth formed this rare burl, resulting in a grain topology that is impossible to replicate.',
    680.00,
    '/works/work-4.jpg',
    '["/works/work-4.jpg", "/works/work-5.jpg"]',
    1, 1, 1, 2, datetime('now', '-4 days'), datetime('now')
  ),
  (
    'work-3',
    'burmese-teak-monolithic-console',
    'cat-consoles',
    'كونسول مدخل منحوت من خشب الساج البورمي',
    'Burmese Teak Monolithic Console Table',
    'قطعة كونسول مدخل ذات حضور معماري مهيب، مصنوعة من كتلة متصلة من خشب الساج البورمي الطبيعي المقاوم للعوامل الجوية والمتميز بزيوت الحماية الذاتية.',
    'A commanding architectural entryway console fashioned from genuine Burmese teak, celebrated for its rich honey luster and eternal durability.',
    'صُممت هذه القطعة خصيصاً لمداخل الفلل والقصور الكويتية لتعطي انطباعاً أولياً بالفخامة والأصالة الحرفية.',
    'Tailored for grand entrances, providing a timeless welcoming statement of genuine artisanal luxury.',
    950.00,
    '/works/work-6.jpg',
    '["/works/work-6.jpg", "/works/work-7.jpg"]',
    1, 1, 1, 3, datetime('now', '-3 days'), datetime('now')
  ),
  (
    'work-4',
    'ebony-olive-sculptural-wall-art',
    'cat-art',
    'مجسم فني جداري ثلاثي الأبعاد من خشب الزيتون المعمر',
    'Ebony & Ancient Olive Sculptural Wall Art',
    'عمل فني جداري تشكيلي يجمع بين دكانة خشب الأبنوس وإشراقة خشب الزيتون المتوسطي المعمر، صُمم ليكون بؤرة بصرية ساحرة على جدران الصالونات الرئيسية.',
    'A three-dimensional wood art piece juxtaposing deep ebony tones with ancient olive wood golden grains.',
    'كل شريحة خشبية في هذا العمل الجداري قُطعت بزاوية هندسية خاصة لتعكس الإضاءة الساقطة عليها بأشكال متغيرة على مدار اليوم.',
    'Each wooden element is faceted at precise geometric angles to interact dynamically with ambient natural and warm chandelier lighting throughout the day.',
    420.00,
    '/works/work-8.jpg',
    '["/works/work-8.jpg", "/works/work-9.jpg"]',
    1, 1, 0, 4, datetime('now', '-2 days'), datetime('now')
  ),
  (
    'work-5',
    'majlis-amber-resin-centerpiece',
    'cat-coffee',
    'طاولة مجلس فاخرة بتطعيم الراتنج الدخاني الشفاف',
    'Majlis Centerpiece with Smoked Amber Resin',
    'دمج فريد بين حواف خشب السنديان الطبيعية والراتنج الكريستالي الشفاف بلون العنبر الدخاني، تمنح المجلس عمقاً بصرياً وفخامة استثنائية.',
    'A harmonious fusion of live edge oak slabs with smoked amber casting resin, creating an alluring translucent river effect.',
    'تم صب الراتنج النقي على 4 مراحل بدرجات حرارة مضبوطة لمنع أي فقاعات هوائية وضمان نقاء بصري يضاهي الكريستال.',
    'Poured in 4 temperature-controlled layers to achieve flawless, crystal-clear resin clarity through the organic wood heart.',
    1200.00,
    '/works/work-10.jpg',
    '["/works/work-10.jpg", "/works/work-11.jpg"]',
    1, 0, 1, 5, datetime('now', '-1 days'), datetime('now')
  ),
  (
    'work-6',
    'artisan-raw-bark-serving-set',
    'cat-art',
    'طقم صواني ضيافة حصرية بحواف لحاء الشجر الطبيعي',
    'Artisan Raw Bark Live Edge Serving Set',
    'طقم صواني ضيافة واستقبال مكون من 3 قطع بمقاسات متدرجة مع الحفاظ على لحاء الشجر الطبيعي وتثبيته بزيوت شمعية غذائية آمنة 100%.',
    'A luxury 3-piece hospitality serving set preserving natural bark contours, treated with food-grade certified natural beeswax.',
    'قطعة تقديم تليق بأصول الضيافة الكويتية الرفيعة والمناسبات الخاصة.',
    'An heirloom serving set honoring timeless Kuwaiti hospitality traditions.',
    180.00,
    '/works/work-12.jpg',
    '["/works/work-12.jpg", "/works/work-13.jpg"]',
    1, 0, 0, 6, datetime('now'), datetime('now')
  );
