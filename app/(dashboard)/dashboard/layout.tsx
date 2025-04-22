import type React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <MobileNav />
        <div className="hidden md:flex md:flex-row md:items-center md:gap-2">
          <span className="text-xl font-bold">NoteIT-AI</span>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4 md:gap-2 lg:gap-4">
          <UserNav />
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r md:block">
          <DashboardNav />
        </aside>
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
