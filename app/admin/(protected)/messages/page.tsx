import { getAllMessages } from '@/lib/db/messages'
import MessagesClient from '@/components/admin/MessagesClient'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  const messages = await getAllMessages()
  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      <div className="mb-6 border-b border-[#ecebe9] dark:border-[#2a2723] pb-5">
        <span className="furnish-subheading">طلبات واستفسارات العملاء</span>
        <h1 className="text-2xl font-bold tracking-tight text-[#11100e] dark:text-[#f6f5f4]">صندوق الرسائل</h1>
        <p className="mt-1 text-sm text-[#615b51] dark:text-[#a8a196]">الرسائل الواردة من نموذج الاتصال وطلبات القطع المخصصة</p>
      </div>
      <MessagesClient messages={messages} />
    </div>
  )
}
