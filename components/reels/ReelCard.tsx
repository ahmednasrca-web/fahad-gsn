'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Reel, Locale } from '@/lib/types'
import { PROVIDER_META, getSafeWatchUrl } from '@/lib/reels/providers'
import { getReelTitle, getReelDescription, t } from '@/lib/i18n'
import { Card, Chip, Button } from '@heroui/react'
import ReelLightboxModal from './ReelLightboxModal'

interface Props {
  reel: Reel
  locale: Locale
  onPlay?: () => void
}

export default function ReelCard({ reel, locale, onPlay }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const meta = PROVIDER_META[reel.provider]
  const title = getReelTitle(reel, locale)
  const description = getReelDescription(reel, locale)
  const watchUrl = getSafeWatchUrl(reel.provider, reel.contentId, reel.originalUrl)

  function handleCardClick() {
    if (onPlay) {
      onPlay()
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <Card.Root
        className="group relative flex flex-col overflow-hidden rounded-none border border-[#ecebe9] dark:border-[#211f1c] bg-white dark:bg-[#181614] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#d47f31] cursor-pointer select-none"
        onClick={handleCardClick}
      >
        <Card.Content className="p-0">
          {/* Video Container (9:16 Vertical Ratio) */}
          <div className="relative aspect-[9/16] w-full overflow-hidden bg-gradient-to-b from-[#2C1810] via-[#3D2B1A] to-[#1A1209]">
            <div className="relative flex h-full w-full flex-col justify-between p-5">
              {/* Thumbnail Image */}
              {reel.thumbnailUrl ? (
                <Image
                  src={reel.thumbnailUrl}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#2C1810]">
                  <span className="font-serif text-8xl text-[#C4854A]/30" aria-hidden="true">
                    🪵
                  </span>
                </div>
              )}

              {/* Multi-layered Dark Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 transition-opacity duration-300 group-hover:opacity-85" />

              {/* Top Bar: Provider Badge & Featured Tag */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-md">
                  <span aria-hidden="true">{meta?.icon ?? '📸'}</span>
                  <span>{locale === 'ar' ? meta?.nameAr : meta?.name}</span>
                </span>

                {reel.isFeatured && (
                  <Chip.Root color="warning" size="sm" variant="primary" className="shadow-md font-bold text-xs">
                    <Chip.Label>⭐ {locale === 'ar' ? 'مميز' : 'Featured'}</Chip.Label>
                  </Chip.Root>
                )}
              </div>

              {/* Center Glowing Play Button */}
              <div className="relative z-10 flex flex-1 items-center justify-center">
                <div
                  className="group/btn relative flex h-16 w-16 items-center justify-center rounded-full bg-[#C4854A] text-white shadow-2xl transition-all duration-300 group-hover:scale-115 group-hover:bg-[#D6965C] group-hover:shadow-[#C4854A]/60"
                  aria-label={`${t(locale, 'playVideo')}: ${title}`}
                >
                  {/* Subtle Pulse Rings */}
                  <div className="absolute -inset-1.5 rounded-full bg-[#C4854A]/40 animate-ping pointer-events-none opacity-0 group-hover:opacity-100 duration-1000" />
                  <svg
                    className="h-7 w-7 translate-x-0.5 text-white transition-transform group-hover/btn:scale-110"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Bottom Content Preview */}
              <div className="relative z-10 text-white">
                <h3 className="line-clamp-2 text-base font-bold leading-snug drop-shadow-md font-display text-[#FAF7F2]">
                  {title}
                </h3>
                {description && (
                  <p className="mt-1 line-clamp-2 text-xs text-[#E8DDD0] opacity-90 font-medium">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div
            className="flex items-center justify-between border-t border-[#E8DDD0] bg-[#FAF7F2] px-4 py-3 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-[#3D2B1A] transition-colors hover:text-[#C4854A]"
              title={`${t(locale, 'watchOn')} ${locale === 'ar' ? meta?.nameAr : meta?.name}`}
            >
              <span>{t(locale, 'watchOn')} {locale === 'ar' ? meta?.nameAr : meta?.name}</span>
              <span className="text-[11px] opacity-70" aria-hidden="true">↗</span>
            </a>

            <Button
              size="sm"
              variant="outline"
              onPress={handleCardClick}
              className="text-xs h-7 px-3 font-bold text-[#1A1209] bg-white border-[#C8B8A0] hover:bg-[#F0E8D8]"
            >
              {t(locale, 'playVideo')}
            </Button>
          </div>
        </Card.Content>
      </Card.Root>

      {/* Standalone Lightbox Modal if not controlled by parent */}
      {!onPlay && (
        <ReelLightboxModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          reel={reel}
          locale={locale}
        />
      )}
    </>
  )
}
