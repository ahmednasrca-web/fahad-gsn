export const runtime = 'edge'

import { getAllMessages } from '@/lib/db/messages'
import MessagesClient from '@/components/admin/MessagesClient'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  const messages = await getAllMessages()
  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      <h1 className="mb-6 text-2xl font-bold text-[#1A1209]">الرسائل</h1>
      <MessagesClient messages={messages} />
    </div>
  )
}
