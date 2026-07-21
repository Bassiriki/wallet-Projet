'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, History, Plus, BarChart2, User } from 'lucide-react'

const items = [
  { href: '/',             icon: Home,     label: 'Accueil',    isCenter: false },
  { href: '/historique',   icon: History,  label: 'Historique', isCenter: false },
  { href: '/ajouter',     icon: Plus,     label: 'Ajouter',    isCenter: true  },
  { href: '/statistiques', icon: BarChart2,label: 'Stats',      isCenter: false },
  { href: '/profil',       icon: User,     label: 'Profil',     isCenter: false },
]

const ACTIVE_COLOR   = '#188775'
const INACTIVE_COLOR = '#BDBDBD'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
      <nav
        className="flex items-center justify-between gap-1 px-5 py-3 transition-all duration-200"
        style={{
          background: '#FFFFFF',
          borderRadius: 28,
          boxShadow: '0 6px 30px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        {items.map((item) => {
          const active = pathname === item.href
          const Icon   = item.icon

          /* ── Bouton central + ── */
          if (item.isCenter) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="mx-3 flex items-center justify-center rounded-full transition-transform duration-150 active:scale-90"
                style={{
                  width: 52,
                  height: 52,
                  background: 'linear-gradient(135deg, #106655, #1CA38D)',
                  boxShadow: '0 6px 18px rgba(24,135,117,0.45)',
                  flexShrink: 0,
                }}
              >
                <Icon className="h-6 w-6 text-white" strokeWidth={2.8} />
              </Link>
            )
          }

          /* ── Onglet normal ── */
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1.5 px-3 py-1 transition-transform duration-150 active:scale-90"
              style={{ minWidth: 44 }}
            >
              <Icon
                className="h-[22px] w-[22px] transition-all duration-200"
                strokeWidth={active ? 2.2 : 1.8}
                style={{ color: active ? ACTIVE_COLOR : INACTIVE_COLOR }}
              />
              {/* Indicateur actif : petit trait vert sous l'icône */}
              <span
                className="h-[3px] w-4 rounded-full transition-all duration-200"
                style={{
                  background: active ? ACTIVE_COLOR : 'transparent',
                  opacity: active ? 1 : 0,
                  transform: active ? 'scaleX(1)' : 'scaleX(0)',
                }}
              />
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
