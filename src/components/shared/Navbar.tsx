'use client'

import Link from 'next/link'
import { MapPin, LayoutDashboard, FileText, User, Bell } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Reports', href: '/', icon: MapPin },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Admin', href: '/dashboard/admin', icon: User },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">RoadWatch</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors",
                      isActive 
                        ? "text-blue-600 border-b-2 border-blue-600" 
                        : "text-muted-foreground hover:text-foreground hover:border-gray-300"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-background" />
            </button>
            <Link 
              href="/auth" 
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-500/10"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
