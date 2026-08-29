'use client'

import { useState } from 'react'
import type { ContactMessage } from '@/lib/types'

interface Props { messages: ContactMessage[] }

export default function MessagesClient({ messages: initial }: Props) {
  const [messages, setMessages] = useState(initial)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function markRead(id: string) {
    setLoadingId(id)
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, isRead: true } : m))
    } finally {
      setLoadingId(null)
    }
  }

  async function deleteMsg(id: string) {
    if (!confirm('حذف هذه الرسالة؟')) return
    setLoadingId(id)
    try {
      await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
      setMessages((prev) => prev.filter((m) => m.id !== id))
    } finally {
      setLoadingId(null)
    }
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E8DDD0] bg-white p-12 text-center">
        <p className="text-4xl" aria-hidden="true">💬</p>
        <p className="mt-4 text-lg font-medium text-[#3D2B1A]">لا توجد رسائل بعد</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`rounded-2xl border bg-white p-5 ${msg.isRead ? 'border-[#E8DDD0]' : 'border-[#C4854A]'}`}
        >
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-[#1A1209]">{msg.name}</p>
              {msg.email && <p className="text-sm text-[#6B5C4E]">{msg.email}</p>}
              {msg.phone && <p className="text-sm text-[#6B5C4E]">{msg.phone}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!msg.isRead && (
                <span className="rounded-full bg-[#C4854A] px-2.5 py-0.5 text-xs font-semibold text-white">جديد</span>
              )}
              <span className="text-xs text-[#A09080]">
                {new Date(msg.createdAt).toLocaleDateString('ar-KW')}
              </span>
            </div>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-[#3D2B1A]">{msg.message}</p>
          {msg.workSlug && (
            <p className="mb-4 text-xs text-[#6B5C4E]">العمل المرتبط: <span className="font-medium">{msg.workSlug}</span></p>
          )}

          <div className="flex flex-wrap gap-2">
            {!msg.isRead && (
              <button
                onClick={() => markRead(msg.id)}
                disabled={loadingId === msg.id}
                className="flex min-h-[36px] items-center rounded-lg border border-[#E8DDD0] px-3 text-xs font-medium text-[#3D2B1A] transition-colors hover:border-[#C4854A] disabled:opacity-50"
              >
                تحديد كمقروء
              </button>
            )}
            {msg.email && (
              <a
                href={`mailto:${msg.email}`}
                className="flex min-h-[36px] items-center rounded-lg border border-[#E8DDD0] px-3 text-xs font-medium text-[#3D2B1A] transition-colors hover:border-[#C4854A]"
              >
                رد بالبريد
              </a>
            )}
            {msg.phone && (
              <a
                href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[36px] items-center rounded-lg bg-[#25D366]/10 px-3 text-xs font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/20"
              >
                واتساب
              </a>
            )}
            <button
              onClick={() => deleteMsg(msg.id)}
              disabled={loadingId === msg.id}
              className="ms-auto flex min-h-[36px] items-center rounded-lg bg-red-50 px-3 text-xs font-medium text-red-500 transition-colors hover:bg-red-100 disabled:opacity-50"
            >
              حذف
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
