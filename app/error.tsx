'use client'

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center bg-[#FAF7F2] px-5 text-center"
      dir="rtl"
    >
      <p className="mb-4 text-6xl font-bold text-[#E8DDD0]" aria-hidden="true">!</p>
      <h1 className="mb-2 text-2xl font-bold text-[#1A1209]">حدث خطأ غير متوقع</h1>
      <p className="mb-8 text-[#6B5C4E]">Something went wrong</p>
      <button
        onClick={reset}
        className="flex min-h-[48px] items-center rounded-full bg-[#2C1810] px-8 font-semibold text-white transition-opacity hover:opacity-90"
      >
        حاول مرة أخرى
      </button>
    </div>
  )
}
