'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, History, PlusCircle, BarChart2 } from 'lucide-react'

const items = [
  { href: '/',              icon: Home,        label: 'Accueil'   },
  { href: '/historique',    icon: History,     label: 'Historique'},
  { href: '/ajouter',      icon: PlusCircle,  label: 'Ajouter'   },
  { href: '/statistiques',  icon: BarChart2,   label: 'Stats'     },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 w-[92%] max-w-[380px]">
      <nav
        className="flex items-center justify-around rounded-[28px] px-2 py-2"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(24,135,117,0.14), 0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid rgba(24,135,117,0.12)',
          willChange: 'transform',
        }}
      >
        {items.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          const isAdd = item.href === '/ajouter'

          if (isAdd) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 -mt-6"
                style={{ willChange: 'transform' }}
              >
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
                  style={{
                    background: active
                      ? 'linear-gradient(135deg, #106655, #188775)'
                      : 'linear-gradient(135deg, #188775, #1da88f)',
                    boxShadow: '0 6px 20px rgba(24,135,117,0.45)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    transform: active ? 'scale(1.08)' : 'scale(1)',
                  }}
                >
                  <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                </span>
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: active ? '#188775' : '#9B8EC4' }}
                >
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2"
              style={{
                minWidth: 56,
                transition: 'background 0.15s ease',
                background: active ? 'rgba(24,135,117,0.09)' : 'transparent',
                willChange: 'transform',
              }}
            >
              <Icon
                className="h-5 w-5"
                strokeWidth={active ? 2.2 : 1.7}
                style={{
                  color: active ? '#188775' : '#9B8EC4',
                  transition: 'color 0.15s ease, stroke-width 0.15s ease',
                }}
              />
              <span
                className="text-[10px] font-semibold"
                style={{
                  color: active ? '#188775' : '#9B8EC4',
                  transition: 'color 0.15s ease',
                }}
              >
                {item.label}
              </span>
              {active && (
                <span
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-[3px] w-5 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #106655, #188775)',
                  }}
                />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
