import React from 'react'

interface FormFieldProps {
  id?: string
  label: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export const adminInputCls =
  'w-full rounded-none border border-[#ecebe9] dark:border-[#211f1c] bg-white dark:bg-[#181614] px-4 py-3 text-sm text-[#11100e] dark:text-[#f6f5f4] outline-none transition-colors focus:border-black dark:focus:border-[#d47f31] placeholder:text-[#a0988d]'

export default function FormField({ id, label, required, children, className = '' }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-[#11100e] dark:text-[#f6f5f4]">
        {label}
        {required && <span className="text-[#d47f31] ms-1" aria-hidden="true">*</span>}
      </label>
      {children}
    </div>
  )
}
