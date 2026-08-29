import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center bg-[#FAF7F2] px-5 text-center"
      dir="rtl"
    >
      <p className="mb-4 text-7xl font-bold text-[#E8DDD0]" aria-hidden="true">404</p>
      <h1 className="mb-2 text-2xl font-bold text-[#1A1209]">الصفحة غير موجودة</h1>
      <p className="mb-8 text-[#6B5C4E]">Page Not Found</p>
      <Link
        href="/"
        className="flex min-h-[48px] items-center rounded-full bg-[#2C1810] px-8 font-semibold text-white transition-opacity hover:opacity-90"
      >
        العودة للرئيسية
      </Link>
    </div>
  )
}
