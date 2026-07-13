'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Heart, Plus, ShoppingBag, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/', icon: Home },
  { href: '/historique', icon: Heart },
  { href: '/ajouter', icon: Plus },
  { href: '/statistiques', icon: ShoppingBag },
  { href: '#', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 w-[90%] max-w-[360px]">
      <nav
        className="flex items-center justify-between rounded-full px-6 py-4 backdrop-blur-lg border border-white/20"
        style={{
          background: 'rgba(248, 249, 250, 0.8)', // Translucent light pill color
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
        }}
      >
        {items.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center p-2"
            >
              <Icon 
                className="h-6 w-6 transition-all" 
                strokeWidth={1.5} 
                style={{ color: '#1A1A1A' }} 
              />
              {/* Underline indicator for active state */}
              {active && (
                <div 
                  className="absolute -bottom-1 h-[2px] w-5 rounded-full bg-[#1A1A1A] transition-all" 
                />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
