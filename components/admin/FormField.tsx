import React from 'react'

interface FormFieldProps {
  id?: string
  label: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export const adminInputCls =
  'w-full rounded-xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#150D08] px-4 py-3 text-[15px] text-[#1A1209] dark:text-[#FAF7F2] outline-none transition focus:border-[#C4854A] focus:ring-2 focus:ring-[#C4854A]/20 placeholder:text-[#A09080]'

export default function FormField({ id, label, required, children, className = '' }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#1A1209] dark:text-[#FAF7F2]">
        {label}
        {required && <span className="text-red-500 ms-1" aria-hidden="true">*</span>}
      </label>
      {children}
    </div>
  )
}
