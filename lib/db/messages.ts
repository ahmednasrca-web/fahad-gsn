import { getDB } from './client'
import type { ContactMessage } from '@/lib/types'

interface D1MessageRow {
  id: string
  name: string
  email: string | null
  phone: string | null
  message: string
  work_slug: string | null
  is_read: number
  created_at: string
}

function mapMessageRow(row: D1MessageRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    workSlug: row.work_slug,
    isRead: Boolean(row.is_read),
    createdAt: row.created_at,
  }
}

export async function getAllMessages(): Promise<ContactMessage[]> {
  const db = getDB()
  const { results } = await db
    .prepare('SELECT * FROM contact_messages ORDER BY is_read ASC, created_at DESC')
    .all<D1MessageRow>()
  return results.map(mapMessageRow)
}

export async function getUnreadCount(): Promise<number> {
  const db = getDB()
  const row = await db
    .prepare('SELECT COUNT(*) as cnt FROM contact_messages WHERE is_read = 0')
    .first<{ cnt: number }>()
  return row?.cnt ?? 0
}
