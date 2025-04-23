"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileText, Home, Settings, Tag } from "lucide-react"

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

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 p-4 md:sticky md:top-16">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-accent")}>
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </Button>
        </Link>
      ))}
    </nav>
  )
}
