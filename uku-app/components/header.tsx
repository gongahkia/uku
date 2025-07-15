"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Settings, Home } from "lucide-react"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Uku Logo"
              className="h-8 w-8 rounded-lg"
              onError={(e) => {
                // Fallback if logo.png doesn't exist yet
                e.currentTarget.style.display = "none"
              }}
            />
            <span className="font-bold text-xl">Uku</span>
          </Link>
        </div>

        <nav className="flex items-center space-x-2">
          {pathname !== "/" && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          )}
          {pathname !== "/settings" && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}