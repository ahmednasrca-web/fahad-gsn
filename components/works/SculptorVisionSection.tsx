'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { SculptorVision, Locale } from '@/lib/types'

interface Props {
  vision: SculptorVision
  finishedImage: string
  title: string
  locale: Locale
}

export default function SculptorVisionSection({ vision, finishedImage, title, locale }: Props) {
  const [sliderPos, setSliderPos] = useState(50)
  const isAr = locale === 'ar'

  if (!vision || !vision.rawImage) return null

  return (
    <section className="section-padding bg-[#F5F0E8] dark:bg-[#120B07] border-t border-[#E8DDD0] dark:border-[#2C1B10] transition-colors duration-400">
      <div className="container-site">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className={`text-xs font-bold text-[#C4854A] ${isAr ? 'font-display' : 'uppercase tracking-[0.2em]'}`}>
            {isAr ? 'من قلب الطبيعة إلى التحفة' : 'The Sculptor Vision'}
          </span>
          <h2 className="mt-2 text-2xl font-bold text-[#1A1209] dark:text-[#FAF7F2] md:text-3xl font-display">
            {isAr ? 'كيف وُلدت الفكرة من الجذع الخام؟' : 'From Raw Trunk to Masterpiece'}
          </h2>
          <p className="mt-2 text-sm text-[#6B5C4E] dark:text-[#D4B896]">
            {isAr
              ? 'شاهد كيف رأى الحرفي فهد غصن خطوط المنحوتة النائمة داخل الجذع المعمر وحرر جمالها.'
              : 'Witness how artisan Fahad Gsn perceived the hidden flow within the raw aged timber.'}
          </p>
        </div>

        {/* Interactive Comparison & Blueprint Slider */}
        <div className="grid gap-10 lg:grid-cols-12 items-center">
          {/* Split Slider */}
          <div className="lg:col-span-7">
            <div className="relative aspect-16/11 w-full overflow-hidden rounded-3xl border-2 border-[#D4B896] dark:border-[#2C1B10] shadow-2xl bg-black select-none">
              {/* Finished Piece (Bottom Layer) */}
              <Image
                src={vision.finishedImage || finishedImage}
                alt={`${title} - Finished`}
                fill
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover"
              />

              {/* Raw Trunk (Top Clipped Layer) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
              >
                <Image
                  src={vision.rawImage}
                  alt={`${title} - Raw Trunk`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover"
                />

                {/* Subtle blueprint grid overlay on raw */}
                <div className="absolute inset-0 bg-[#001428]/30 pointer-events-none" />
                <div className="absolute top-4 start-4 rounded-full bg-black/75 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/20">
                  {isAr ? '🪵 الجذع الخام قبل النحت' : '🪵 Raw Timber Trunk'}
                </div>
              </div>

              {/* Finished Badge */}
              <div className="absolute top-4 end-4 rounded-full bg-[#C4854A]/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-md">
                {isAr ? '✨ التحفة المصقولة' : '✨ Liberated Masterpiece'}
              </div>

              {/* Divider Line */}
              <div
                className="pointer-events-none absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)]"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[#C4854A] text-white shadow-xl text-xs font-bold border-2 border-white">
                  ⟷
                </div>
              </div>

              {/* Invisible Range Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0 z-30"
                aria-label={isAr ? 'تحريك شريط المقارنة' : 'Comparison slider'}
              />
            </div>
          </div>

          {/* Philosophy & Narrative Story */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quote */}
            <div className="rounded-3xl border border-[#C4854A]/40 bg-white dark:bg-[#1A1009] p-6 sm:p-7 shadow-lg relative">
              <span className="text-4xl text-[#C4854A] font-serif leading-none block mb-2">“</span>
              <p className="text-base font-bold text-[#1A1209] dark:text-[#FAF7F2] font-display italic leading-relaxed">
                {isAr ? (vision.quoteAr || 'التصميم لا يُفرض على الخشب.. بل يُستخرج من روحه وانحناءاته الطبيعية.') : (vision.quoteEn || 'True design is never imposed upon timber; it is liberated from the organic spirit of the tree.')}
              </p>
              <p className="mt-3 text-xs font-bold text-[#C4854A] text-end">
                {isAr ? '— فهد غصن' : '— Fahad Gsn'}
              </p>
            </div>

            {/* Story details */}
            <div className="rounded-3xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-white/70 dark:bg-[#150D08]/70 p-6 backdrop-blur-md">
              <h4 className="text-sm font-bold text-[#1A1209] dark:text-[#FAF7F2] mb-2 flex items-center gap-2">
                <span>🔍</span>
                <span>{isAr ? 'حكاية الاستخراج الحرفي' : 'The Extraction Journey'}</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#4A3B2C] dark:text-[#D4B896] leading-relaxed font-medium">
                {isAr ? vision.storyAr : vision.storyEn}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
