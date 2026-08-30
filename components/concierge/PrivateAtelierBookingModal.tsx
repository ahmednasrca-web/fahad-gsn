'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/types'
import { Button } from '@heroui/react'

interface Props {
  locale: Locale
  buttonClassName?: string
}

export default function PrivateAtelierBookingModal({ locale, buttonClassName = '' }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'form' | 'ticket'>('form')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [consultationType, setConsultationType] = useState('slab_selection')
  const [notes, setNotes] = useState('')
  const isAr = locale === 'ar'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !phone || !date) return
    setStep('ticket')
  }

  const typeLabels: Record<string, { ar: string; en: string }> = {
    slab_selection: {
      ar: 'معاينة واختيار لوح خام لطاولة مخصصة',
      en: 'Custom Raw Slab Selection',
    },
    sculpture_view: {
      ar: 'معاينة تحف حصرية قيد التشكيل',
      en: 'In-Progress Masterpieces Preview',
    },
    architect_consult: {
      ar: 'استشارة مشاريع ومهندسي ديكور',
      en: 'Architectural & VIP Project Consultation',
    },
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setStep('form')
          setIsOpen(true)
        }}
        className={
          buttonClassName ||
          'inline-flex min-h-[46px] items-center gap-2 rounded-full border border-[#C4854A] bg-[#C4854A]/10 px-5 text-xs font-bold text-[#C4854A] transition-all hover:bg-[#C4854A] hover:text-white cursor-pointer'
        }
      >
        <span>🎟️</span>
        <span>{isAr ? 'حجز جلسة خاصة بالمشغل' : 'Private Atelier Visit'}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn select-none">
          <div className="relative max-w-lg w-full rounded-3xl border border-[#D4B896] dark:border-[#2C1B10] bg-[#FAF7F2] dark:bg-[#150D08] p-6 sm:p-8 shadow-2xl">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-5 end-5 flex h-9 w-9 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 text-[#1A1209] dark:text-white hover:bg-black/20 text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            {step === 'form' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center pb-2 border-b border-[#E8DDD0] dark:border-[#2C1B10]">
                  <span className="text-xs font-bold text-[#C4854A]">
                    {isAr ? 'خدمة كونسيرج كبار الشخصيات' : 'VIP Concierge Service'}
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-[#1A1209] dark:text-[#FAF7F2] font-display">
                    {isAr ? 'حجز جلسة خاصة في ورشة فهد غصن' : 'Private Atelier Experience'}
                  </h3>
                  <p className="mt-1 text-xs text-[#6B5C4E] dark:text-[#D4B896]">
                    {isAr
                      ? 'اختر موعد زيارتك لمعاينة الأخشاب النادرة ومناقشة تفصيل قطعتك الفريدة مباشرة مع الحرفي.'
                      : 'Schedule a private visit to inspect rare raw slabs and discuss bespoke commissions with the artisan.'}
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
                    {isAr ? 'الاسم الكريم' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isAr ? 'مثال: فهد الأحمد' : 'e.g. Fahad Al-Ahmad'}
                    className="w-full rounded-xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#1A1009] px-3.5 py-2 text-xs text-[#1A1209] dark:text-[#FAF7F2] outline-none focus:border-[#C4854A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
                      {isAr ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+965 ..."
                      dir="ltr"
                      className="w-full rounded-xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#1A1009] px-3.5 py-2 text-xs text-[#1A1209] dark:text-[#FAF7F2] outline-none focus:border-[#C4854A]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
                      {isAr ? 'التاريخ المفضل' : 'Preferred Date'} *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#1A1009] px-3.5 py-2 text-xs text-[#1A1209] dark:text-[#FAF7F2] outline-none focus:border-[#C4854A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
                    {isAr ? 'الغرض من الزيارة' : 'Consultation Purpose'}
                  </label>
                  <select
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value)}
                    className="w-full rounded-xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#1A1009] px-3.5 py-2 text-xs text-[#1A1209] dark:text-[#FAF7F2] outline-none focus:border-[#C4854A]"
                  >
                    <option value="slab_selection">
                      {isAr ? '🪵 معاينة واختيار لوح خام لطاولة مخصصة' : 'Custom Raw Slab Selection'}
                    </option>
                    <option value="sculpture_view">
                      {isAr ? '✨ معاينة تحف حصرية قيد التشكيل' : 'In-Progress Masterpieces Preview'}
                    </option>
                    <option value="architect_consult">
                      {isAr ? '📐 استشارة مشاريع ومهندسي ديكور' : 'Architectural & VIP Project Consultation'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
                    {isAr ? 'ملاحظات أو تفضيلات إضافية' : 'Additional Notes (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={isAr ? 'مثال: أود معاينة خشب الزيتون المعمر لطاولة طعام 8 كراسي...' : 'e.g. Interested in Ancient Olive slab for 8-seat dining...'}
                    className="w-full rounded-xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#1A1009] px-3.5 py-2 text-xs text-[#1A1209] dark:text-[#FAF7F2] outline-none focus:border-[#C4854A] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full min-h-[48px] rounded-xl font-bold text-xs"
                >
                  {isAr ? 'تأكيد الحجز وإصدار بطاقة الدعوة الإلكترونية' : 'Confirm & Generate VIP Pass'}
                </Button>
              </form>
            ) : (
              /* Digital VIP Invitation Pass */
              <div className="space-y-5 text-center">
                <div className="rounded-2xl border-2 border-[#D4B896] bg-[#0E0805] p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 end-0 bg-[#C4854A] text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                    VIP PASS
                  </div>

                  <span className="text-3xl mb-1 block">🪵</span>
                  <h4 className="text-lg font-bold text-[#D4B896] font-display">
                    فهد غصن | FAHAD GSN
                  </h4>
                  <p className="text-[11px] text-white/60 tracking-wider">
                    ATELIER PRIVATE CONSULTATION
                  </p>

                  <div className="my-4 border-t border-dashed border-white/20 pt-4 text-start space-y-1.5 text-xs font-medium">
                    <p className="text-[#FAF7F2] font-bold">
                      👤 {isAr ? 'الضيف الكريم:' : 'Guest:'} <span className="text-[#C4854A]">{name}</span>
                    </p>
                    <p className="text-white/80">
                      📅 {isAr ? 'الموعد المحدد:' : 'Date:'} <span className="font-mono text-[#D4B896]">{date}</span>
                    </p>
                    <p className="text-white/80">
                      🪵 {isAr ? 'الخدمة:' : 'Purpose:'} <span>{typeLabels[consultationType]?.[locale] ?? consultationType}</span>
                    </p>
                    <p className="text-white/60 text-[11px]">
                      📍 {isAr ? 'الكويت — المشغل الخاص للحرفي فهد غصن' : 'Kuwait — Fahad Gsn Private Atelier'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/20 pt-3 text-[10px] text-white/50">
                    <span>STATUS: CONFIRMED</span>
                    <span className="font-mono">#GSN-VIP-8821</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <a
                    href={`https://wa.me/96598908022?text=${encodeURIComponent(
                      isAr
                        ? `مرحباً أستاذ فهد غصن، قمت بطلب حجز زيارة خاصة للمشغل:\n- الاسم: ${name}\n- الهاتف: ${phone}\n- التاريخ: ${date}\n- الغرض: ${typeLabels[consultationType]?.ar}\n- ملاحظات: ${notes || 'لا يوجد'}`
                        : `Hello Fahad Gsn, I requested a private atelier visit:\n- Name: ${name}\n- Phone: ${phone}\n- Date: ${date}\n- Purpose: ${typeLabels[consultationType]?.en}\n- Notes: ${notes || 'None'}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-lg hover:bg-[#20b858] transition-all"
                  >
                    <span>💬</span>
                    <span>{isAr ? 'إرسال بطاقة الحجز لواتساب المشغل' : 'Send Ticket via WhatsApp'}</span>
                  </a>

                  <Button
                    type="button"
                    variant="outline"
                    onPress={() => setIsOpen(false)}
                    className="min-h-[42px] rounded-xl text-xs font-bold"
                  >
                    {isAr ? 'إغلاق النافذة' : 'Close'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
