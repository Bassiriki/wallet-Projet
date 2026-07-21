import type { ReactNode } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { InstallPrompt } from '@/components/install-prompt'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-svh w-full max-w-md pb-28" style={{ background: '#F7F5FF' }}>
      {children}
      <InstallPrompt />
      <BottomNav />
    </div>
  )
}
