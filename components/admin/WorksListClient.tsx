'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Work } from '@/lib/types'
import { Spinner } from '@heroui/react'

interface Props {
  initialWorks: Work[]
}

export default function WorksListClient({ initialWorks }: Props) {
  const [works, setWorks] = useState<Work[]>(initialWorks)
  const [savingOrder, setSavingOrder] = useState(false)
  const [search, setSearch] = useState('')

  async function handleMove(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= works.length) return

    const newWorks = [...works]
    const [moved] = newWorks.splice(index, 1)
    newWorks.splice(targetIndex, 0, moved)
    setWorks(newWorks)

    setSavingOrder(true)
    try {
      await fetch('/api/admin/works/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: newWorks.map((w) => w.id) }),
      })
    } catch (err) {
      console.error('Failed to save order:', err)
    } finally {
      setSavingOrder(false)
    }
  }

  const filtered = works.filter(
    (w) =>
      w.titleAr.toLowerCase().includes(search.toLowerCase()) ||
      w.titleEn.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Controls / Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث في الأعمال..."
          className="admin-input max-w-xs"
        />
        {savingOrder && (
          <span className="flex items-center gap-2 text-xs font-semibold text-[#d47f31]">
            <Spinner size="sm" />
            جارٍ حفظ الترتيب الجديد…
          </span>
        )}
      </div>

      <div className="furnish-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#ecebe9] dark:border-[#2a2723] bg-[#f6f5f4] dark:bg-[#161513] text-xs font-bold uppercase tracking-wider text-[#615b51] dark:text-[#a8a196]">
                <th className="px-4 py-3.5 text-center w-16">الترتيب</th>
                <th className="px-4 py-3.5 text-start">القطعة</th>
                <th className="px-4 py-3.5 text-start">العنوان</th>
                <th className="px-4 py-3.5 text-start">الميزات والحالة</th>
                <th className="hidden px-4 py-3.5 text-start sm:table-cell">السعر</th>
                <th className="px-4 py-3.5 text-end">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ecebe9] dark:divide-[#2a2723]">
              {filtered.map((work, index) => (
                <tr key={work.id} className="transition-colors hover:bg-[#f6f5f4]/50 dark:hover:bg-[#211f1c]/50">
                  {/* Sort controls */}
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
                        disabled={index === works.length - 1 || savingOrder}
                        aria-label="تحريك للأسفل"
                        className="flex h-7 w-7 items-center justify-center border border-[#ecebe9] dark:border-[#2a2723] text-xs text-[#615b51] dark:text-[#a8a196] hover:border-[#11100e] dark:hover:border-[#f6f5f4] disabled:opacity-30 disabled:pointer-events-none transition"
                      >
                        ▼
                      </button>
                    </div>
                  </td>

                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    <div className="relative h-14 w-14 overflow-hidden border border-[#ecebe9] dark:border-[#2a2723] bg-[#f6f5f4] dark:bg-[#211f1c]">
                      {work.primaryImage ? (
                        <Image
                          src={work.primaryImage}
                          alt={work.titleAr}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl" aria-hidden="true">
                          🪵
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Titles */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/works/${work.id}`}
                      className="font-bold text-[#11100e] dark:text-[#f6f5f4] hover:text-[#d47f31] transition-colors"
                    >
                      {work.titleAr}
                    </Link>
                    <p className="text-xs text-[#615b51] dark:text-[#a8a196] font-mono">{work.titleEn}</p>
                  </td>

                  {/* Status & Badges */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-2 py-0.5 text-xs font-semibold ${
                        work.isPublished 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                          : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border border-neutral-500/20'
                      }`}>
                        {work.isPublished ? 'منشور' : 'مسودة'}
                      </span>
                      {work.isFeatured && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-[#d47f31]/10 text-[#d47f31] border border-[#d47f31]/30">
                          مميز
                        </span>
                      )}
                      {work.isUniquePiece && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-black">
                          قطعة فريدة
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {work.price != null ? (
                      <span className="font-bold text-[#11100e] dark:text-[#f6f5f4]">
                        {work.price.toLocaleString('ar-KW')} <span className="text-xs text-[#615b51] dark:text-[#a8a196]">د.ك</span>
                      </span>
                    ) : (
                      <span className="text-xs text-[#615b51] dark:text-[#a8a196]">حسب الطلب</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-end">
                    <Link 
                      href={`/admin/works/${work.id}`}
                      className="inline-flex items-center border border-[#ecebe9] dark:border-[#2a2723] bg-white dark:bg-[#1a1815] px-3 py-1.5 text-xs font-bold text-[#11100e] dark:text-[#f6f5f4] hover:border-[#11100e] dark:hover:border-[#f6f5f4] transition"
                    >
                      تعديل
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
