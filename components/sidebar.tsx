"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MessageSquare, BarChart3, BookOpen, Settings, Menu, X, Home } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    name: "Mood Tracker",
    href: "/mood-tracker",
    icon: BarChart3,
  },
  {
    name: "Journal",
    href: "/journal",
    icon: BookOpen,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {isMobile && (
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50" onClick={toggleSidebar}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      )}

      <aside
        className={cn(
          "bg-primary/5 border-r border-border h-screen flex flex-col w-64 p-4 transition-all duration-300",
          isMobile && (isOpen ? "fixed inset-y-0 left-0 z-40" : "fixed -left-64"),
        )}
      >
        <div className="flex items-center mb-8 mt-2">
          <h1 className="text-xl font-bold">Mental Health AI</h1>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => isMobile && setIsOpen(false)}>
              <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-muted")}>
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="border-t border-border pt-4 mt-auto">
          <p className="text-sm text-muted-foreground">Need immediate help?</p>
          <Link href="/crisis-resources">
            <Button variant="link" className="p-0 h-auto text-sm">
              Crisis Resources
            </Button>
          </Link>
        </div>
      </aside>
    </>
  )
}
