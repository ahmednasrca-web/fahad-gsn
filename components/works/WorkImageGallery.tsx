'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  title: string
}

export default function WorkImageGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex aspect-work-hero w-full items-center justify-center rounded-2xl bg-[#F5F0E8]">
        <span className="text-6xl" aria-hidden="true">🪵</span>
      </div>
    )
  }

  const current = images[activeIndex]

  return (
    <div>
      {/* Primary image */}
      <div className="relative mb-3 aspect-work-hero w-full overflow-hidden rounded-2xl bg-[#F5F0E8]">
        <Image
          key={current}
          src={current}
          alt={`${title} — ${activeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority={activeIndex === 0}
        />
        {/* Arrow buttons (desktop) */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              disabled={activeIndex === 0}
              className="absolute start-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition hover:bg-white disabled:opacity-30"
              aria-label="Previous image"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIndex((i) => Math.min(images.length - 1, i + 1))}
              disabled={activeIndex === images.length - 1}
              className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition hover:bg-white disabled:opacity-30"
              aria-label="Next image"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
        {/* Image count */}
        {images.length > 1 && (
          <span className="absolute bottom-3 end-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg transition ${
                i === activeIndex
                  ? 'ring-2 ring-[#2C1810] ring-offset-1'
                  : 'opacity-60 hover:opacity-100'
              }`}
              aria-label={`Image ${i + 1}`}
              aria-pressed={i === activeIndex}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
