'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Work } from '@/lib/types'
import { Card, Chip, Button, Spinner } from '@heroui/react'

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
          className="w-full max-w-xs rounded-xl border border-[#E8DDD0] bg-white px-3.5 py-2 text-sm text-[#1A1209] outline-none focus:border-[#C4854A]"
        />
        {savingOrder && (
          <span className="flex items-center gap-2 text-xs font-semibold text-[#C4854A]">
            <Spinner size="sm" />
            جارٍ حفظ الترتيب الجديد…
          </span>
        )}
      </div>

      <Card.Root className="border border-[#E8DDD0] bg-white overflow-hidden shadow-xs">
        <Card.Content className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8DDD0] bg-[#FAF7F2] text-xs font-semibold text-[#8A7968]">
                  <th className="px-4 py-3.5 text-center w-16">الترتيب</th>
                  <th className="px-4 py-3.5 text-start">القطعة</th>
                  <th className="px-4 py-3.5 text-start">العنوان</th>
                  <th className="px-4 py-3.5 text-start">الميزات والحالة</th>
                  <th className="hidden px-4 py-3.5 text-start sm:table-cell">السعر</th>
                  <th className="px-4 py-3.5 text-end">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD0]">
                {filtered.map((work, index) => (
                  <tr key={work.id} className="transition-colors hover:bg-[#FAF7F2]/60">
                    {/* Sort controls */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0 || savingOrder}
                          aria-label="تحريك للأعلى"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E8DDD0] text-xs text-[#8A7968] hover:bg-[#FAF7F2] disabled:opacity-30 disabled:pointer-events-none transition"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === works.length - 1 || savingOrder}
                          aria-label="تحريك للأسفل"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E8DDD0] text-xs text-[#8A7968] hover:bg-[#FAF7F2] disabled:opacity-30 disabled:pointer-events-none transition"
                        >
                          ▼
                        </button>
                      </div>
                    </td>

                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-[#F0E8D8] border border-[#E8DDD0] shadow-2xs">
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
                        className="font-bold text-[#1A1209] hover:text-[#C4854A] transition-colors"
                      >
                        {work.titleAr}
                      </Link>
                      <p className="text-xs text-[#8A7968] font-mono">{work.titleEn}</p>
                    </td>

                    {/* Status & Luxury Badges */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Chip.Root
                          color={work.isPublished ? 'success' : 'default'}
                          size="sm"
                          variant="soft"
                        >
                          <Chip.Label>{work.isPublished ? 'منشور' : 'مسودة'}</Chip.Label>
                        </Chip.Root>
                        {work.isFeatured && (
                          <Chip.Root color="warning" size="sm" variant="soft">
                            <Chip.Label>مميز</Chip.Label>
                          </Chip.Root>
                        )}
                        {work.isUniquePiece && (
                          <Chip.Root color="accent" size="sm" variant="soft">
                            <Chip.Label>قطعة فريدة حصرية</Chip.Label>
                          </Chip.Root>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="hidden px-4 py-3 sm:table-cell">
                      {work.price != null ? (
                        <span className="font-semibold text-[#2C1810]">
                          {work.price.toLocaleString('ar-KW')} <span className="text-xs text-[#8A7968]">د.ك</span>
                        </span>
                      ) : (
                        <span className="text-xs text-[#A09080]">حسب الطلب</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-end">
                      <Link href={`/admin/works/${work.id}`}>
                        <Button size="sm" variant="outline">
                          تعديل
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  )
}
