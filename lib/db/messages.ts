import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import type { ContactMessage, ContactMessageRow } from '@/lib/types'

function mapMessageRow(row: ContactMessageRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    message: row.message,
    workSlug: row.work_slug ?? undefined,
    isRead: row.is_read,
    createdAt: row.created_at,
  }
}

// Admin: get all messages
export async function getAllMessages(): Promise<ContactMessage[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return (data as ContactMessageRow[]).map(mapMessageRow)
}

// Admin: count unread messages
export async function getUnreadCount(): Promise<number> {
  const supabase = createSupabaseAdminClient()
  const { count } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)
  return count ?? 0
}
