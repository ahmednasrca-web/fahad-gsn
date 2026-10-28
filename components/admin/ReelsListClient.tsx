'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Reel } from '@/lib/types'
import { PROVIDER_META } from '@/lib/reels/providers'
import { Spinner } from '@heroui/react'

interface Props {
  initialReels: Reel[]
}

export default function ReelsListClient({ initialReels }: Props) {
  const [reels, setReels] = useState<Reel[]>(initialReels)
  const [savingOrder, setSavingOrder] = useState(false)

  async function handleMove(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= reels.length) return

    const newReels = [...reels]
    const [moved] = newReels.splice(index, 1)
    newReels.splice(targetIndex, 0, moved)
    setReels(newReels)

    setSavingOrder(true)
    try {
      await fetch('/api/admin/reels/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: newReels.map((r) => r.id) }),
      })
    } catch (err) {
      console.error('Failed to save order:', err)
    } finally {
      setSavingOrder(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {savingOrder && (
        <div className="flex items-center gap-2 text-xs font-semibold text-[#d47f31]">
          <Spinner size="sm" />
          جارٍ حفظ الترتيب الجديد…
        </div>
      )}

      <div className="furnish-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#ecebe9] dark:border-[#2a2723] bg-[#f6f5f4] dark:bg-[#161513] text-xs font-bold uppercase tracking-wider text-[#615b51] dark:text-[#a8a196]">
                <th className="px-4 py-3.5 text-center w-16">الترتيب</th>
                <th className="px-4 py-3.5 text-start">المنصة</th>
                <th className="px-4 py-3.5 text-start">العنوان / المعرف</th>
                <th className="px-4 py-3.5 text-start">الحالة</th>
                <th className="hidden px-4 py-3.5 text-start md:table-cell">الرابط الأصلي</th>
                <th className="px-4 py-3.5 text-end">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ecebe9] dark:divide-[#2a2723]">
              {reels.map((reel, index) => {
                const meta = PROVIDER_META[reel.provider]
                return (
                  <tr key={reel.id} className="transition-colors hover:bg-[#f6f5f4]/50 dark:hover:bg-[#211f1c]/50">
                    {/* Sort Controls */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0 || savingOrder}
                          aria-label="تحريك للأعلى"
                          className="flex h-7 w-7 items-center justify-center border border-[#ecebe9] dark:border-[#2a2723] text-xs text-[#615b51] dark:text-[#a8a196] hover:border-[#11100e] dark:hover:border-[#f6f5f4] disabled:opacity-30 disabled:pointer-events-none transition"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === reels.length - 1 || savingOrder}
                          aria-label="تحريك للأسفل"
                          className="flex h-7 w-7 items-center justify-center border border-[#ecebe9] dark:border-[#2a2723] text-xs text-[#615b51] dark:text-[#a8a196] hover:border-[#11100e] dark:hover:border-[#f6f5f4] disabled:opacity-30 disabled:pointer-events-none transition"
                        >
                          ▼
                        </button>
                      </div>
                    </td>

                    {/* Platform */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-semibold ${
                          meta ? meta.badgeBg + ' ' + meta.badgeText : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        <span aria-hidden="true">{meta?.icon ?? '🎬'}</span>
                        {meta?.nameAr ?? reel.provider}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3">
                      <p className="font-bold text-[#11100e] dark:text-[#f6f5f4]">
                        {reel.titleAr || reel.titleEn || (
                          <span className="font-mono text-xs text-[#615b51] dark:text-[#a8a196]">ID: {reel.contentId}</span>
                        )}
                      </p>
                      {reel.titleEn && reel.titleAr && (
                        <p className="text-xs text-[#615b51] dark:text-[#a8a196] font-mono">{reel.titleEn}</p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-0.5 text-xs font-semibold ${
                          reel.isPublished
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border border-neutral-500/20'
                        }`}>
                          {reel.isPublished ? 'منشور' : 'مسودة'}
                        </span>
                        {reel.isFeatured && (
                          <span className="px-2 py-0.5 text-xs font-semibold bg-[#d47f31]/10 text-[#d47f31] border border-[#d47f31]/30">
                            ⭐ مميز
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Original URL */}
                    <td className="hidden px-4 py-3 md:table-cell max-w-[200px] truncate">
                      <a
                        href={reel.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#d47f31] hover:underline font-mono truncate block"
                        dir="ltr"
                      >
                        {reel.originalUrl}
                      </a>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-end">
                      <Link 
                        href={`/admin/reels/${reel.id}`}
                        className="inline-flex items-center border border-[#ecebe9] dark:border-[#2a2723] bg-white dark:bg-[#1a1815] px-3 py-1.5 text-xs font-bold text-[#11100e] dark:text-[#f6f5f4] hover:border-[#11100e] dark:hover:border-[#f6f5f4] transition"
                      >
                        تعديل
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
