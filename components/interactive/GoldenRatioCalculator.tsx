'use client'

import { useState, useMemo } from 'react'
import type { Locale } from '@/lib/types'

interface Props {
  locale: Locale
}

export default function GoldenRatioCalculator({ locale }: Props) {
  const isAr = locale === 'ar'
  const [roomLength, setRoomLength] = useState<number>(6.0)
  const [roomWidth, setRoomWidth] = useState<number>(4.5)
  const [tableType, setTableType] = useState<'dining' | 'coffee'>('dining')

  // Golden Ratio Calculations (Phi = 1.618)
  const calculations = useMemo(() => {
    const phi = 1.618
    let idealLength = 0
    let idealWidth = 0
    let seats = 0

    if (tableType === 'dining') {
      // Room length minus 2 * 1.2m walkways, optimized to Phi
      idealLength = Math.max(1.8, Math.min(3.8, Math.round(((roomLength / phi) * 0.75) * 10) / 10))
      idealWidth = Math.max(0.9, Math.min(1.25, Math.round((idealLength / 2.3) * 10) / 10))
      seats = Math.floor(idealLength / 0.6) * 2 + 2
    } else {
      // Coffee table proportions
      idealLength = Math.max(1.2, Math.min(2.0, Math.round(((roomLength / phi) * 0.4) * 10) / 10))
      idealWidth = Math.max(0.6, Math.min(1.1, Math.round((idealLength / 1.618) * 10) / 10))
      seats = 4
    }

    const clearanceLength = Math.round(((roomLength - idealLength) / 2) * 100)
    const clearanceWidth = Math.round(((roomWidth - idealWidth) / 2) * 100)

    return { idealLength, idealWidth, seats, clearanceLength, clearanceWidth }
  }, [roomLength, roomWidth, tableType])

  return (
    <div className="rounded-3xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#150D08] p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <span className="rounded-full bg-[#C4854A]/15 px-3.5 py-1 text-xs font-bold text-[#C4854A]">
          {isAr ? 'الهندسة المعمارية التوافقية (Φ = 1.618)' : 'Harmonic Spatial Geometry'}
        </span>
        <h3 className="mt-2 text-xl sm:text-2xl font-bold text-[#1A1209] dark:text-[#FAF7F2] font-display">
          {isAr ? 'حاسبة النسبة الذهبية والمخطط المعماري للغرفة' : 'Golden Ratio Spatial Proportion Calculator'}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-[#6B5C4E] dark:text-[#D4B896]">
          {isAr
            ? 'حدد مقاسات صالتك لحساب أبعاد الطاولة المثالية مع رسم مخطط معماري علوي 2D يضمن راحة الحركة وتناسق الفضاء.'
            : 'Enter your room dimensions to compute ideal table proportions and generate a top-down floorplan.'}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-center">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Table Type Selector */}
          <div>
            <label className="mb-2 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
              {isAr ? 'نوع القطعة المطلوبة' : 'Piece Category'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTableType('dining')}
                className={`rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  tableType === 'dining'
                    ? 'bg-[#2C1810] text-[#FAF7F2] border border-[#C4854A] shadow-sm'
                    : 'bg-[#FAF7F2] dark:bg-[#1E130B] text-[#6B5C4E] dark:text-[#E8DDD0] border border-[#E8DDD0] dark:border-[#2C1B10]'
                }`}
              >
                {isAr ? '🍽️ طاولة طعام / استقبال' : 'Dining Table'}
              </button>
              <button
                type="button"
                onClick={() => setTableType('coffee')}
                className={`rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  tableType === 'coffee'
                    ? 'bg-[#2C1810] text-[#FAF7F2] border border-[#C4854A] shadow-sm'
                    : 'bg-[#FAF7F2] dark:bg-[#1E130B] text-[#6B5C4E] dark:text-[#E8DDD0] border border-[#E8DDD0] dark:border-[#2C1B10]'
                }`}
              >
                {isAr ? '☕ طاولة قهوة مركزية' : 'Coffee Table'}
              </button>
            </div>
          </div>

          {/* Room Dimensions Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
                {isAr ? 'طول الغرفة (متر)' : 'Room Length (m)'}
              </label>
              <input
                type="number"
                step="0.5"
                min="3"
                max="15"
                value={roomLength}
                onChange={(e) => setRoomLength(Math.max(3, parseFloat(e.target.value) || 3))}
                className="w-full rounded-xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-[#FAF7F2] dark:bg-[#1A1009] px-3.5 py-2 text-sm font-bold text-[#1A1209] dark:text-[#FAF7F2] outline-none focus:border-[#C4854A]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
                {isAr ? 'عرض الغرفة (متر)' : 'Room Width (m)'}
              </label>
              <input
                type="number"
                step="0.5"
                min="2.5"
                max="12"
                value={roomWidth}
                onChange={(e) => setRoomWidth(Math.max(2.5, parseFloat(e.target.value) || 2.5))}
                className="w-full rounded-xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-[#FAF7F2] dark:bg-[#1A1009] px-3.5 py-2 text-sm font-bold text-[#1A1209] dark:text-[#FAF7F2] outline-none focus:border-[#C4854A]"
              />
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="rounded-2xl border border-[#C4854A]/30 bg-[#FAF7F2] dark:bg-[#1A1009] p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
              <span>{isAr ? 'المقاس المثالي للقطعة:' : 'Ideal Dimensions:'}</span>
              <span className="font-mono text-sm text-[#C4854A]">
                {calculations.idealLength}m × {calculations.idealWidth}m
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#6B5C4E] dark:text-[#D4B896]">
              <span>{isAr ? 'سعة الجلسة المريحة:' : 'Seating Capacity:'}</span>
              <span className="font-bold">{calculations.seats} {isAr ? 'أشخاص' : 'Seats'}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#6B5C4E] dark:text-[#D4B896]">
              <span>{isAr ? 'ممرات الحركة المحيطة:' : 'Walkway Clearance:'}</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ {calculations.clearanceLength}cm / {calculations.clearanceWidth}cm
              </span>
            </div>
          </div>
        </div>

        {/* 2D Architectural Floorplan Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative aspect-4/3 w-full max-w-[420px] rounded-2xl border-2 border-dashed border-[#C4854A]/50 bg-[#0E0906] p-4 flex items-center justify-center shadow-inner select-none">
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#C4854A_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

            {/* Room Dimensions Badges */}
            <span className="absolute top-2 text-[10px] font-mono text-[#D4B896] bg-black/60 px-2 py-0.5 rounded">
              {roomLength}m
            </span>
            <span className="absolute end-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#D4B896] bg-black/60 px-2 py-0.5 rounded rotate-90">
              {roomWidth}m
            </span>

            {/* Table Representation in Center */}
            <div
              className="relative flex flex-col items-center justify-center rounded-xl bg-[#C4854A] shadow-[0_0_20px_rgba(196,133,74,0.6)] border border-white/40 transition-all duration-300"
              style={{
                width: `${Math.min(75, Math.max(35, (calculations.idealLength / roomLength) * 85))}%`,
                height: `${Math.min(65, Math.max(25, (calculations.idealWidth / roomWidth) * 75))}%`,
              }}
            >
              <span className="text-[11px] font-bold text-white font-mono drop-shadow">
                {calculations.idealLength}m × {calculations.idealWidth}m
              </span>
              <span className="text-[9px] text-white/80 font-serif">
                {isAr ? 'التحفة الخشبية' : 'Bespoke Slab'}
              </span>
            </div>
          </div>

          <a
            href={`https://wa.me/96598908022?text=${encodeURIComponent(
              isAr
                ? `مرحباً أستاذ فهد غصن، قمت بحساب المقاسات المثالية لصالتي (${roomLength}m × ${roomWidth}m) وأرغب بتفصيل طاولة بمقاس (${calculations.idealLength}m × ${calculations.idealWidth}m).`
                : `Hello Fahad Gsn, I calculated my ideal room proportions (${roomLength}m × ${roomWidth}m) and would like to commission a table of (${calculations.idealLength}m × ${calculations.idealWidth}m).`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-[#20b858] transition-all hover:scale-105"
          >
            <span>💬</span>
            <span>{isAr ? 'طلب تفصيل هذا المقاس عبر واتساب' : 'Request this Commission on WhatsApp'}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
