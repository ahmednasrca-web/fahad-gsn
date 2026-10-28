'use client'

import { useState } from 'react'
import type { ContactMessage } from '@/lib/types'
import { Button, Spinner } from '@heroui/react'

interface Props { messages: ContactMessage[] }

export default function MessagesClient({ messages: initial }: Props) {
  const [messages, setMessages] = useState(initial)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function markRead(id: string) {
    setLoadingId(id)
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, isRead: true } : m))
    } finally { setLoadingId(null) }
  }

  async function deleteMsg(id: string) {
    if (!confirm('حذف هذه الرسالة؟')) return
    setLoadingId(id)
    try {
      await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
      setMessages((prev) => prev.filter((m) => m.id !== id))
    } finally { setLoadingId(null) }
  }

  if (messages.length === 0) {
    return (
      <div className="furnish-card p-12 text-center">
        <p className="text-4xl" aria-hidden="true">💬</p>
        <p className="mt-4 text-lg font-bold text-[#11100e] dark:text-[#f6f5f4]">لا توجد رسائل بعد</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => (
        <div 
          key={msg.id}
          className={`furnish-card p-5 ${
            msg.isRead 
              ? 'border-[#ecebe9] dark:border-[#2a2723]' 
              : 'border-[#d47f31] border-l-4'
          }`}
        >
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <p className="font-bold text-[#11100e] dark:text-[#f6f5f4]">{msg.name}</p>
              {msg.email && <p className="text-sm text-[#615b51] dark:text-[#a8a196] font-mono">{msg.email}</p>}
              {msg.phone && <p className="text-sm text-[#615b51] dark:text-[#a8a196] font-mono">{msg.phone}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!msg.isRead && (
                <span className="bg-[#d47f31] text-white px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                  جديد
                </span>
              )}
              <span className="text-xs text-[#615b51] dark:text-[#a8a196]">
                {new Date(msg.createdAt).toLocaleDateString('ar-KW')}
              </span>
            </div>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-[#11100e] dark:text-[#ecebe9]">{msg.message}</p>
          {msg.workSlug && (
            <p className="mb-4 text-xs text-[#615b51] dark:text-[#a8a196]">العمل المرتبط: <span className="font-bold text-[#d47f31]">{msg.workSlug}</span></p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#ecebe9] dark:border-[#2a2723]">
            {loadingId === msg.id ? (
              <Spinner size="sm" />
            ) : (
              <>
                {!msg.isRead && (
                  <button 
                    type="button"
                    onClick={() => markRead(msg.id)}
                    disabled={loadingId === msg.id}
                    className="border border-[#ecebe9] dark:border-[#2a2723] px-3 py-1.5 text-xs font-bold text-[#11100e] dark:text-[#f6f5f4] hover:border-[#11100e] dark:hover:border-[#f6f5f4] transition"
                  >
                    تحديد كمقروء
                  </button>
                )}
                {msg.email && (
                  <a 
                    href={`mailto:${msg.email}`}
                    className="inline-flex items-center border border-[#ecebe9] dark:border-[#2a2723] px-3 py-1.5 text-xs font-bold text-[#11100e] dark:text-[#f6f5f4] hover:border-[#11100e] dark:hover:border-[#f6f5f4] transition"
                  >
                    رد بالبريد
                  </a>
                )}
                {msg.phone && (
                  <a 
                    href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-emerald-600/10 border border-emerald-600/20 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600/20 transition"
                  >
                    واتساب
                  </a>
                )}
                <button 
                  type="button"
                  onClick={() => deleteMsg(msg.id)}
                  disabled={loadingId === msg.id}
                  className="ms-auto border border-rose-500/20 text-rose-600 dark:text-rose-400 px-3 py-1.5 text-xs font-bold hover:bg-rose-500/10 transition"
                >
                  حذف
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
