'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/types'
import { Card, Chip } from '@heroui/react'

interface WoodSpecies {
  id: string
  nameAr: string
  nameEn: string
  originAr: string
  originEn: string
  hardness: string // Janka rating
  colorDescAr: string
  colorDescEn: string
  characteristicsAr: string
  characteristicsEn: string
  applicationsAr: string
  applicationsEn: string
  colorHex: string
  grainTone: string
}

const WOOD_SPECIES: WoodSpecies[] = [
  {
    id: 'walnut',
    nameAr: 'خشب الجوز الأمريكي (American Walnut)',
    nameEn: 'American Black Walnut',
    originAr: 'أمريكا الشمالية',
    originEn: 'North America',
    hardness: '1,010 Janka',
    colorDescAr: 'تدرجات الشوكولاتة الداكنة مع تموجات بنية دافئة',
    colorDescEn: 'Rich deep chocolate and warm espresso undertones',
    characteristicsAr: 'خشب ارستقراطي ذو ملمس حريري وعروق انسيابية معقدة، يستقر مع الوقت ويزداد بهاءً.',
    characteristicsEn: 'Aristocratic hardwood with a silky grain texture that matures gracefully over decades.',
    applicationsAr: 'طاولات الطعام الفاخرة، المكاتب التنفيذية، والتحف الفنية المتقنة.',
    applicationsEn: 'Statement dining tables, executive desks, and heirloom sculptures.',
    colorHex: '#3D261A',
    grainTone: 'bg-gradient-to-br from-[#3D261A] via-[#2A1810] to-[#4A2E20]',
  },
  {
    id: 'olive',
    nameAr: 'خشب الزيتون العتيق (Ancient Olive)',
    nameEn: 'Mediterranean Ancient Olive',
    originAr: 'حوض البحر الأبيض المتوسط',
    originEn: 'Mediterranean Basin',
    hardness: '2,710 Janka (صلابة فائقة)',
    colorDescAr: 'عسلي ذهبي متداخل مع عروق رخامية سوداء وبنية دراماتيكية',
    colorDescEn: 'Golden amber infused with dramatic dark marbled veins',
    characteristicsAr: 'خشب كثيف جداً ومستخرج من أشجار معمرة، غني بالزيوت الطبيعية ومقاوم للرطوبة، كل لوح منه لوحة فنية فريدة.',
    characteristicsEn: 'Extremely dense, naturally oily, and highly moisture-resistant with museum-grade patterns.',
    applicationsAr: 'طاولات القهوة الفريدة (Live Edge)، أواني التقديم الملكية، ومقابض الفخامة.',
    applicationsEn: 'Live-edge coffee tables, royal charcuterie boards, and custom handles.',
    colorHex: '#8C6239',
    grainTone: 'bg-gradient-to-br from-[#A67B48] via-[#734A26] to-[#3B2211]',
  },
  {
    id: 'oak',
    nameAr: 'البلوط الأبيض الملكي (European White Oak)',
    nameEn: 'European White Oak',
    originAr: 'أوروبا وأمريكا الشمالية',
    originEn: 'Europe & North America',
    hardness: '1,360 Janka',
    colorDescAr: 'بيج رملي طبيعي مع لمسات عاجية هادئة',
    colorDescEn: 'Natural sandy beige with serene ivory undertones',
    characteristicsAr: 'عروق خطية مستقيمة واضحة تمنح شعوراً بالاتزان والهدوء العصري مع متانة استثنائية.',
    characteristicsEn: 'Clean, linear medullary rays providing modern organic calm with extreme structural durability.',
    applicationsAr: 'الأثاث العصري، خزائن العرض، وتصاميم النمط الاسكندنافي الفاخر.',
    applicationsEn: 'Contemporary architectural furniture, display vitrines, and bespoke casework.',
    colorHex: '#C4A482',
    grainTone: 'bg-gradient-to-br from-[#D9C4A8] via-[#B89B74] to-[#8C6D47]',
  },
  {
    id: 'teak',
    nameAr: 'التيك البورمي الفاخر (Burmese Teak)',
    nameEn: 'Burmese Royal Teak',
    originAr: 'جنوب شرق آسيا',
    originEn: 'Southeast Asia',
    hardness: '1,070 Janka',
    colorDescAr: 'بني ذهبي متوهج مع بريق طبيعي ناعم',
    colorDescEn: 'Luminous golden honey with natural silky luster',
    characteristicsAr: 'سيد الأخشاب في مقاومة الماء والحرارة بفضل احتوائه على سيليكا وزيوت طبيعية عازلة.',
    characteristicsEn: 'The benchmark of weather and water resistance due to dense natural oils and silica.',
    applicationsAr: 'الأثاث الخارجي الفاخر، مساحات اليخوت، وقطع الاسترخاء ذات العمر المديد.',
    applicationsEn: 'Superyacht woodwork, bespoke outdoor lounge furniture, and wet-area luxury consoles.',
    colorHex: '#996633',
    grainTone: 'bg-gradient-to-br from-[#B37736] via-[#805022] to-[#4D2E11]',
  },
  {
    id: 'wenge',
    nameAr: 'خشب الوينجي الإفريقي (African Wenge)',
    nameEn: 'African Wenge',
    originAr: 'وسط إفريقيا الاستوائية',
    originEn: 'Central Africa',
    hardness: '1,930 Janka (عالي الكثافة)',
    colorDescAr: 'أسود فحمي داكن مع خيوط رفيعة بلون الكاكاو',
    colorDescEn: 'Near-black espresso with subtle micro-stripes of rich cocoa',
    characteristicsAr: 'خشب صلب ونادر يتميز بتباين مذهل وملمس مضلع خفيف يمنح لمسة عصرية جريئة وشديدة الفخامة.',
    characteristicsEn: 'Exotic, ultra-heavy hardwood with a dramatic dark tone and textured tactile feel.',
    applicationsAr: 'قواعد الطاولات المعمارية، إطارات المرايا الفاخرة، والتفاصيل المتباينة.',
    applicationsEn: 'Architectural table bases, luxury mirror frames, and bold contrasting accents.',
    colorHex: '#1F1713',
    grainTone: 'bg-gradient-to-br from-[#291F1A] via-[#140F0D] to-[#0A0706]',
  },
]

interface Props {
  locale?: Locale
  className?: string
}

export default function WoodSpeciesGuide({ locale = 'ar', className = '' }: Props) {
  const [selectedId, setSelectedId] = useState('walnut')
  const selected = WOOD_SPECIES.find((s) => s.id === selectedId) ?? WOOD_SPECIES[0]
  const isAr = locale === 'ar'

  return (
    <div className={`rounded-3xl border border-[#E8DDD0] bg-white p-6 sm:p-10 shadow-sm ${className}`}>
      {/* Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <span className={`text-xs font-bold text-[#C4854A] ${isAr ? 'font-display' : 'uppercase tracking-[0.2em]'}`}>
          {isAr ? 'أسرار الحرفة' : 'Craftsmanship & Materials'}
        </span>
        <h2 className="mt-2 text-2xl font-bold text-[#1A1209] md:text-3xl">
          {isAr ? 'دليل أنواع الأخشاب الفاخرة' : 'Interactive Wood Species Guide'}
        </h2>
        <p className="mt-2 text-sm text-[#6B5C4E] leading-relaxed">
          {isAr
            ? 'ننتقي في فهد غصن أندر جذوع الأشجار الطبيعية المعمرة ونهيئها بمعايير تجفيف وتشكيل دقيقة لنخلد جمال عروقها في كل قطعة.'
            : 'At Fahad Gsn, we select the rarest sustainable hardwoods, aged and seasoned to preserve their organic soul forever.'}
        </p>
      </div>

      {/* Species Selector Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
        {WOOD_SPECIES.map((species) => {
          const isSelected = species.id === selectedId
          return (
            <button
              key={species.id}
              onClick={() => setSelectedId(species.id)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all ${
                isSelected
                  ? 'bg-[#2C1810] text-[#FAF7F2] shadow-md scale-105 ring-2 ring-[#C4854A]'
                  : 'bg-[#FAF7F2] text-[#6B5C4E] border border-[#E8DDD0] hover:bg-[#F0E8D8] hover:text-[#1A1209]'
              }`}
            >
              <span
                className="h-3.5 w-3.5 rounded-full shadow-inner border border-white/40"
                style={{ backgroundColor: species.colorHex }}
              />
              <span>{isAr ? species.nameAr.split('(')[0].trim() : species.nameEn}</span>
            </button>
          )
        })}
      </div>

      {/* Selected Wood Showcase Card */}
      <Card.Root className="border border-[#E8DDD0] bg-[#FAF7F2] overflow-hidden shadow-xs">
        <Card.Content className="p-0">
          <div className="grid gap-0 md:grid-cols-12 items-stretch">
            {/* Left Texture Swatch preview */}
            <div
              className={`md:col-span-4 min-h-[220px] p-8 flex flex-col justify-between text-white relative overflow-hidden ${selected.grainTone}`}
            >
              {/* Shimmer subtle grain overlay */}
              <div className="absolute inset-0 bg-black/15 backdrop-blur-[0.5px]" />
              <div className="relative z-10">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-mono backdrop-blur-sm">
                  {selected.hardness}
                </span>
                <h3 className="mt-4 text-2xl font-bold leading-tight drop-shadow-sm">
                  {isAr ? selected.nameAr : selected.nameEn}
                </h3>
              </div>
              <div className="relative z-10 mt-6">
                <p className="text-xs text-white/80 uppercase tracking-wider font-semibold">
                  {isAr ? 'المصدر الأصلي' : 'Origin'}
                </p>
                <p className="text-sm font-bold drop-shadow-sm">
                  {isAr ? selected.originAr : selected.originEn}
                </p>
              </div>
            </div>

            {/* Right Details */}
            <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between bg-white">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C4854A]">
                    {isAr ? 'الخصائص والملمس الطبيعي' : 'Natural Characteristics'}
                  </h4>
                  <p className="mt-1 text-sm text-[#3D2B1A] leading-relaxed">
                    {isAr ? selected.characteristicsAr : selected.characteristicsEn}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-[#E8DDD0]">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#8A7968]">
                      {isAr ? 'اللون والعروق' : 'Grain & Hues'}
                    </h5>
                    <p className="mt-1 text-xs text-[#3D2B1A] font-medium leading-normal">
                      {isAr ? selected.colorDescAr : selected.colorDescEn}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#8A7968]">
                      {isAr ? 'أبرز الاستخدامات' : 'Ideal Applications'}
                    </h5>
                    <p className="mt-1 text-xs text-[#3D2B1A] font-medium leading-normal">
                      {isAr ? selected.applicationsAr : selected.applicationsEn}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8DDD0] flex items-center justify-between">
                <span className="text-xs text-[#8A7968]">
                  {isAr ? '💎 قطعة مخصصة حسب اختيارك لنوع الخشب' : '💎 Custom commissions available in this wood'}
                </span>
                <Chip.Root color="accent" size="sm" variant="soft">
                  <Chip.Label>Fahad Gsn Certified</Chip.Label>
                </Chip.Root>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  )
}
