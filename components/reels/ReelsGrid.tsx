'use client'

import { useState } from 'react'
import type { Reel, Locale } from '@/lib/types'
import { t } from '@/lib/i18n'
import ReelCard from './ReelCard'
import ReelLightboxModal from './ReelLightboxModal'

interface Props {
  reels: Reel[]
  locale: Locale
}

export default function ReelsGrid({ reels, locale }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (reels.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F0E8D8] text-4xl shadow-inner" aria-hidden="true">
          🎬
        </div>
        <h2 className="mt-6 text-xl font-bold text-[#1A1209]">
          {t(locale, 'noReels')}
        </h2>
        <p className="mt-2 text-sm text-[#8A7968]">
          {locale === 'ar'
            ? 'سيتم إضافة مقاطع فيديو جديدة قريباً تعرض كواليس الحرفة والتشكيل اليدوي.'
            : 'New behind-the-scenes videos of wood craftsmanship will be added soon.'}
        </p>
      </div>
    )
  }

  const activeReel = activeIndex !== null ? reels[activeIndex] : null

  function handlePrev() {
    if (activeIndex !== null && activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    }
  }

  function handleNext() {
    if (activeIndex !== null && activeIndex < reels.length - 1) {
      setActiveIndex(activeIndex + 1)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {reels.map((reel, idx) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            locale={locale}
            onPlay={() => setActiveIndex(idx)}
          />
        ))}
      </div>

      {/* Shared Lightbox Modal with Story Navigation */}
      <ReelLightboxModal
        isOpen={activeIndex !== null}
        onClose={() => setActiveIndex(null)}
        reel={activeReel}
        locale={locale}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={activeIndex !== null && activeIndex > 0}
        hasNext={activeIndex !== null && activeIndex < reels.length - 1}
      />
    </>
  )
}
