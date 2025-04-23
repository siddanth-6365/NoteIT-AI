"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FileText, Home, Menu, Settings, Tag } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "All Notes",
    href: "/dashboard/notes/all",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Tags",
    href: "/dashboard/tags",
    icon: <Tag className="h-4 w-4" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-4 w-4" />,
  },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <nav className="grid gap-4 py-4">
          <Link href="/" className="flex items-center gap-2 px-2">
            <span className="text-lg font-bold">NoteGenius</span>
          </Link>
          <div className="grid gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-accent")}>
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </Button>
              </Link>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
