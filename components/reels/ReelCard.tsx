'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Reel, Locale } from '@/lib/types'
import { PROVIDER_META, getSafeEmbedUrl, getSafeWatchUrl } from '@/lib/reels/providers'
import { getReelTitle, getReelDescription, t } from '@/lib/i18n'
import { Card, Chip, Button } from '@heroui/react'

interface Props {
  reel: Reel
  locale: Locale
}

export default function ReelCard({ reel, locale }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const meta = PROVIDER_META[reel.provider]
  const title = getReelTitle(reel, locale)
  const description = getReelDescription(reel, locale)
  const embedUrl = getSafeEmbedUrl(reel.provider, reel.contentId, reel.originalUrl)
  const watchUrl = getSafeWatchUrl(reel.provider, reel.contentId, reel.originalUrl)

  return (
    <Card.Root
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#E8DDD0] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#C4854A]/60"
    >
      <Card.Content className="p-0">
        {/* Video Container (9:16 Vertical Ratio) */}
        <div className="relative aspect-[9/16] w-full overflow-hidden bg-gradient-to-b from-[#2C1810] via-[#3D2B1A] to-[#1A1209]">
          {isPlaying ? (
            <div className="relative h-full w-full bg-black">
              <iframe
                src={embedUrl}
                title={title}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
              {/* Close / Reload Control */}
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-3 end-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black"
                title={locale === 'ar' ? 'إغلاق الفيديو' : 'Close Video'}
                aria-label={locale === 'ar' ? 'إغلاق الفيديو' : 'Close Video'}
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="relative flex h-full w-full flex-col justify-between p-4">
              {/* Thumbnail if available */}
              {reel.thumbnailUrl ? (
                <Image
                  src={reel.thumbnailUrl}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                /* Woodcraft Artistic Placeholder */
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <span className="font-serif text-8xl text-[#C4854A]" aria-hidden="true">
                    🪵
                  </span>
                </div>
              )}

              {/* Dark gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/30" />

              {/* Top Bar: Provider Badge & Featured Tag */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-xs"
                >
                  <span aria-hidden="true">{meta?.icon ?? '🎬'}</span>
                  <span>{locale === 'ar' ? meta?.nameAr : meta?.name}</span>
                </span>

                {reel.isFeatured && (
                  <Chip.Root color="warning" size="sm" variant="primary" className="shadow-xs font-bold text-xs">
                    <Chip.Label>⭐ {locale === 'ar' ? 'مميز' : 'Featured'}</Chip.Label>
                  </Chip.Root>
                )}
              </div>

              {/* Center Play Button */}
              <div className="relative z-10 flex flex-1 items-center justify-center">
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="group/btn flex h-16 w-16 items-center justify-center rounded-full bg-[#C4854A] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#D6965C] hover:shadow-[#C4854A]/50 focus:outline-none focus:ring-4 focus:ring-[#C4854A]/40"
                  aria-label={`${t(locale, 'playVideo')}: ${title}`}
                >
                  <svg
                    className="h-7 w-7 translate-x-0.5 text-white transition-transform group-hover/btn:scale-110"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>

              {/* Bottom Content Preview */}
              <div className="relative z-10 text-white">
                <h3 className="line-clamp-2 text-base font-bold leading-snug drop-shadow-sm">
                  {title}
                </h3>
                {description && (
                  <p className="mt-1 line-clamp-2 text-xs text-[#E8DDD0] opacity-90">
                    {description}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Fallback Watch on Platform Link */}
        <div className="flex items-center justify-between border-t border-[#E8DDD0] bg-[#FAF7F2] px-4 py-3 text-xs">
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

          {!isPlaying && (
            <Button
              size="sm"
              variant="outline"
              onPress={() => setIsPlaying(true)}
              className="text-xs h-7 px-3 font-semibold"
            >
              {t(locale, 'playVideo')}
            </Button>
          )}
        </div>
      </Card.Content>
    </Card.Root>
  )
}
