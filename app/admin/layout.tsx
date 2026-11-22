import type { Metadata } from 'next'

// app/admin/layout.tsx — pass-through, proxy.ts handles auth protection.
// HeroUI v3 is CSS-first and needs no Provider wrapper.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
