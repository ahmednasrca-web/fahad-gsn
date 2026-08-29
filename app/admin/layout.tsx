// app/admin/layout.tsx — pass-through, proxy.ts handles protection
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
