'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/types'
import { Card, Chip } from '@heroui/react'
import { useAtelierAudio } from '@/components/interactive/AtelierHapticAudio'

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
    originAr: 'غابات أوروبا المستدامة',
    originEn: 'Sustainable European Forests',
    hardness: '1,360 Janka',
    colorDescAr: 'بيج عاجي طبيعي مع لمسات ترابية رصينة',
    colorDescEn: 'Natural pale ivory with subtle earthy neutral tones',
    characteristicsAr: 'متانة استثنائية، مقاوم للتشقق والانحناء، يتماشى بامتياز مع التصاميم المعمارية الهادئة والمودرن.',
    characteristicsEn: 'Exceptional structural stability and straight grain, complementing modern architectural spaces.',
    applicationsAr: 'طاولات الاجتماعات، خزائن العرض، وأسطح الجلسات الراقية.',
    applicationsEn: 'Boardroom tables, bespoke consoles, and architectural elements.',
    colorHex: '#C4A47C',
    grainTone: 'bg-gradient-to-br from-[#C4A47C] via-[#9E7D56] to-[#6E5034]',
  },
  {
    id: 'teak',
    nameAr: 'الساج البورمي النادر (Burmese Teak)',
    nameEn: 'Burmese Golden Teak',
    originAr: 'جنوب شرق آسيا',
    originEn: 'Southeast Asia',
    hardness: '1,155 Janka',
    colorDescAr: 'ذهبي عنبري متلألئ يتحول إلى عسلي مخملي',
    colorDescEn: 'Radiant golden amber deepening to a warm honey bronze',
    characteristicsAr: 'ملك الأخشاب لمقاومة العوامل الجوية والرطوبة بفضل زيوته الطبيعية الصمغية، عمر افتراضي يتجاوز 100 عام.',
    characteristicsEn: 'King of weather-resistant hardwoods, rich in natural preserving resins and silica.',
    applicationsAr: 'أثاث اليخوت الملكية، طاولات الشاليهات والجلسات المفتوحة الفاخرة.',
    applicationsEn: 'Superyacht decks, luxury chalet outdoor pavilions, and humid-zone furnishings.',
    colorHex: '#8F5A28',
    grainTone: 'bg-gradient-to-br from-[#9E6B38] via-[#6B4018] to-[#402008]',
  },
]

interface Props {
  locale?: Locale
  className?: string
}

export default function WoodSpeciesGuide({ locale = 'ar', className = '' }: Props) {
  const { playSound } = useAtelierAudio()
  const [selectedId, setSelectedId] = useState('walnut')
  const selected = WOOD_SPECIES.find((s) => s.id === selectedId) ?? WOOD_SPECIES[0]
  const isAr = locale === 'ar'

  return (
    <div className={`rounded-3xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#150D08] p-6 sm:p-10 shadow-sm transition-colors duration-400 ${className}`}>
      {/* Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <span className={`text-xs font-bold text-[#C4854A] ${isAr ? 'font-display' : 'uppercase tracking-[0.2em]'}`}>
          {isAr ? 'أسرار الحرفة' : 'Craftsmanship & Materials'}
        </span>
        <h2 className="mt-2 text-2xl font-bold text-[#1A1209] dark:text-[#FAF7F2] md:text-3xl font-display">
          {isAr ? 'دليل أنواع الأخشاب الفاخرة' : 'Interactive Wood Species Guide'}
        </h2>
        <p className="mt-2 text-sm text-[#6B5C4E] dark:text-[#D4B896] leading-relaxed">
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
              onClick={() => {
                playSound('tap')
                setSelectedId(species.id)
              }}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#2C1810] dark:bg-[#C4854A] text-[#FAF7F2] shadow-md scale-105 ring-2 ring-[#C4854A]'
                  : 'bg-[#FAF7F2] dark:bg-[#1C120B] text-[#3D2B1A] dark:text-[#E8DDD0] border border-[#E8DDD0] dark:border-[#2C1B10] hover:bg-[#F0E8D8] dark:hover:bg-[#2A1B10] hover:text-[#1A1209] dark:hover:text-[#FAF7F2]'
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
      <Card.Root className="border border-[#E8DDD0] dark:border-[#2C1B10] bg-[#FAF7F2] dark:bg-[#150D08] overflow-hidden shadow-xs">
        <Card.Content className="p-0">
          <div className="grid gap-0 md:grid-cols-12 items-stretch">
            {/* Left Texture Swatch preview */}
            <div
              className={`md:col-span-4 min-h-[220px] p-8 flex flex-col justify-between text-white relative overflow-hidden ${selected.grainTone}`}
            >
              {/* Shimmer subtle grain overlay */}
              <div className="absolute inset-0 bg-black/15 backdrop-blur-[0.5px]" />
              <div className="relative z-10">
                <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-mono text-white backdrop-blur-sm border border-white/20 font-bold">
                  {selected.hardness}
                </span>
                <h3 className="mt-4 text-2xl font-bold leading-tight drop-shadow-md text-white font-display">
                  {isAr ? selected.nameAr : selected.nameEn}
                </h3>
              </div>
              <div className="relative z-10 mt-6">
                <p className="text-xs text-white/90 uppercase tracking-wider font-bold">
                  {isAr ? 'المصدر الأصلي' : 'Origin'}
                </p>
                <p className="text-sm font-bold drop-shadow-md text-white">
                  {isAr ? selected.originAr : selected.originEn}
                </p>
              </div>
            </div>

            {/* Right Details */}
            <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#1A1009] transition-colors duration-400">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C4854A]">
                    {isAr ? 'الخصائص والملمس الطبيعي' : 'Natural Characteristics'}
                  </h4>
                  <p className="mt-1 text-sm text-[#1A1209] dark:text-[#E8DDD0] leading-relaxed font-medium">
                    {isAr ? selected.characteristicsAr : selected.characteristicsEn}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-[#E8DDD0] dark:border-[#2C1B10]">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#6B3F1F] dark:text-[#D4B896]">
                      {isAr ? 'اللون والعروق' : 'Grain & Hues'}
                    </h5>
                    <p className="mt-1 text-xs text-[#2C1810] dark:text-[#FAF7F2] font-medium leading-normal">
                      {isAr ? selected.colorDescAr : selected.colorDescEn}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#6B3F1F] dark:text-[#D4B896]">
                      {isAr ? 'أبرز الاستخدامات' : 'Ideal Applications'}
                    </h5>
                    <p className="mt-1 text-xs text-[#2C1810] dark:text-[#FAF7F2] font-medium leading-normal">
                      {isAr ? selected.applicationsAr : selected.applicationsEn}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8DDD0] dark:border-[#2C1B10] flex items-center justify-between">
                <span className="text-xs font-bold text-[#4A3B2C] dark:text-[#D4B896]">
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
