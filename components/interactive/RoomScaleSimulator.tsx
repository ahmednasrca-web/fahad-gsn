'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Locale } from '@/lib/types'
import { Card, Chip, Button } from '@heroui/react'

interface RoomEnvironment {
  id: string
  nameAr: string
  nameEn: string
  bgGradient: string
  wallTone: string
  floorTone: string
  ambientLight: string
  vibeAr: string
  vibeEn: string
}

const ROOM_ENVIRONMENTS: RoomEnvironment[] = [
  {
    id: 'salon',
    nameAr: 'صالون استقبال فاخر',
    nameEn: 'Luxury Reception Salon',
    bgGradient: 'bg-gradient-to-b from-[#2A2421] via-[#1F1A18] to-[#120F0E]',
    wallTone: 'bg-[#2A2421]',
    floorTone: 'bg-[#151211] border-t border-[#3D3531]',
    ambientLight: 'from-[#C4854A]/20 via-transparent to-transparent',
    vibeAr: 'رخام داكن، إضاءة دافئة غير مباشرة، وأجواء استقبال ملكية.',
    vibeEn: 'Dark polished marble with warm recessed ambient glow.',
  },
  {
    id: 'dining',
    nameAr: 'مساحة طعام معاصرة',
    nameEn: 'Contemporary Dining Hall',
    bgGradient: 'bg-gradient-to-b from-[#EAE4DC] via-[#DCD4C8] to-[#BDB2A3]',
    wallTone: 'bg-[#EAE4DC]',
    floorTone: 'bg-[#A89C8C] border-t border-[#8E8272]',
    ambientLight: 'from-[#FAF7F2]/40 via-transparent to-transparent',
    vibeAr: 'جدران كريمية هادئة وأرضيات حجرية طبيعية تعزز دفء الخشب.',
    vibeEn: 'Warm travertine stone walls and organic natural light.',
  },
  {
    id: 'lounge',
    nameAr: 'ركن قهوة واسترخاء',
    nameEn: 'Minimalist Coffee Lounge',
    bgGradient: 'bg-gradient-to-b from-[#38281F] via-[#281C15] to-[#170E09]',
    wallTone: 'bg-[#38281F]',
    floorTone: 'bg-[#140C07] border-t border-[#4A3428]',
    ambientLight: 'from-[#D4B896]/25 via-transparent to-transparent',
    vibeAr: 'خلفية خشب الجوز المضلع، وسائد كتانية، وأجواء هادئة.',
    vibeEn: 'Fluted walnut backdrop with serene organic textures.',
  },
]

interface Props {
  locale?: Locale
  workTitle: string
  workImage: string
  price?: number
  className?: string
}

export default function RoomScaleSimulator({
  locale = 'ar',
  workTitle,
  workImage,
  price,
  className = '',
}: Props) {
  const [selectedEnvId, setSelectedEnvId] = useState('salon')
  const [showHumanScale, setShowHumanScale] = useState(true)
  const isAr = locale === 'ar'

  const currentEnv =
    ROOM_ENVIRONMENTS.find((e) => e.id === selectedEnvId) ?? ROOM_ENVIRONMENTS[0]

  return (
    <div className={`rounded-3xl border border-[#E8DDD0] bg-white p-6 sm:p-8 shadow-sm ${className}`}>
      {/* Top Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className={`text-xs font-bold text-[#C4854A] ${isAr ? 'font-display' : 'uppercase tracking-[0.2em]'}`}>
            {isAr ? 'محاكي الأبعاد والمساحات' : 'Spatial Room Simulator'}
          </span>
          <h3 className="mt-1 text-xl font-bold text-[#1A1209] md:text-2xl">
            {isAr ? 'معاينة القطعة داخل أبعاد منزلك' : 'True-to-Scale Room Preview'}
          </h3>
        </div>

        {/* Human Scale Toggle Button */}
        <button
          type="button"
          onClick={() => setShowHumanScale(!showHumanScale)}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all border ${
            showHumanScale
              ? 'bg-[#2C1810] text-[#FAF7F2] border-[#2C1810]'
              : 'bg-[#FAF7F2] text-[#6B5C4E] border-[#E8DDD0] hover:bg-[#F0E8D8]'
          }`}
        >
          <span>👤</span>
          <span>{isAr ? 'مقياس الشخص (180cm)' : 'Human Scale (180cm)'}</span>
        </button>
      </div>

      {/* Environment Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ROOM_ENVIRONMENTS.map((env) => {
          const isSelected = env.id === selectedEnvId
          return (
            <button
              key={env.id}
              onClick={() => setSelectedEnvId(env.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-[#C4854A] text-white shadow-xs scale-102'
                  : 'bg-[#FAF7F2] text-[#3D2B1A] border border-[#E8DDD0] hover:bg-[#F0E8D8]'
              }`}
            >
              <span>{env.id === 'salon' ? '🏛️' : env.id === 'dining' ? '🍽️' : '☕'}</span>
              <span>{isAr ? env.nameAr : env.nameEn}</span>
            </button>
          )
        })}
      </div>

      {/* Simulated 3D Perspective Canvas */}
      <div
        className={`relative aspect-16/10 sm:aspect-21/9 w-full overflow-hidden rounded-2xl border border-black/10 shadow-inner flex flex-col justify-between p-6 select-none ${currentEnv.bgGradient}`}
      >
        {/* Soft Ambient Spotlight Glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${currentEnv.ambientLight} pointer-events-none`}
        />

        {/* Top Dimensions Guide Overlay */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="rounded-full bg-black/75 px-3 py-1 text-[11px] font-mono text-white backdrop-blur-md border border-white/20">
            {workTitle}
          </span>
          <span className="rounded-full bg-black/75 px-3 py-1 text-[11px] font-mono text-[#D4B896] backdrop-blur-md border border-white/20">
            {isAr ? 'تناسب حقيقي 1:1 Scale' : 'True Proportion 1:1'}
          </span>
        </div>

        {/* Center Stage: The Wood Piece & Optional Human Figure */}
        <div className="relative z-10 flex items-end justify-center gap-6 sm:gap-12 my-auto">
          {/* Optional Human Silhouette for Scale */}
          {showHumanScale && (
            <div className="flex flex-col items-center opacity-90 transition-opacity duration-300">
              <div className="h-32 sm:h-44 w-10 sm:w-14 rounded-t-full bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-sm border border-white/40 flex flex-col items-center justify-between py-2 shadow-lg">
                <div className="h-4 w-4 rounded-full bg-white" />
                <span className="text-[9px] font-mono font-bold text-[#1A1209]">1.80m</span>
              </div>
              <span className="mt-1 text-[9px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                {isAr ? 'شخص بالغ' : 'Adult'}
              </span>
            </div>
          )}

          {/* Handcrafted Wood Work in Simulated Perspective */}
          <div className="group relative flex flex-col items-center">
            {/* The Floating Scaled Product Image */}
            <div className="relative h-28 w-44 sm:h-40 sm:w-64 overflow-hidden rounded-xl border-2 border-white/40 shadow-2xl transition-transform duration-300 group-hover:scale-105">
              <Image
                src={workImage}
                alt={workTitle}
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>

            {/* Simulated Wood Shadow on Ground */}
            <div className="mt-1 h-3 w-40 sm:w-60 rounded-full bg-black/60 blur-xs" />

            {/* Dimension Indicators */}
            <div className="mt-2 flex items-center gap-3 text-[10px] font-mono font-bold text-white bg-black/75 px-3 py-1 rounded-full backdrop-blur-md border border-white/15 shadow-md">
              <span>↔ L: 200-240cm</span>
              <span className="text-[#C4854A]">•</span>
              <span>↕ W: 90-100cm</span>
            </div>
          </div>
        </div>

        {/* Bottom Environment Vibe Subtitle with Contrast Pill */}
        <div className="relative z-10 text-center">
          <p className="inline-block rounded-full bg-black/65 px-4 py-1 text-xs text-white backdrop-blur-md border border-white/10 font-medium">
            {isAr ? currentEnv.vibeAr : currentEnv.vibeEn}
          </p>
        </div>
      </div>

      {/* Helper Footer Tips */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#4A3B2C] font-medium">
        <div className="flex items-center gap-1.5">
          <span>📐</span>
          <span>{isAr ? 'إمكانية تفصيل وتعديل المقاسات بالمليمتر حسب مساحة غرفتك.' : 'Custom tailoring to exact architectural dimensions available.'}</span>
        </div>
        <Chip.Root color="accent" size="sm" variant="soft">
          <Chip.Label>{isAr ? 'استشارة مساحية مجانية عبر واتساب' : 'Complimentary spatial consultation'}</Chip.Label>
        </Chip.Root>
      </div>
    </div>
  )
}
