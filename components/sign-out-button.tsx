'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export function SignOutButton() {
  const router = useRouter()
  return (
    <button
      type="button"
      aria-label="Se déconnecter"
      onClick={async () => {
        await authClient.signOut()
        router.push('/sign-in')
        router.refresh()
      }}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground hover:text-foreground"
    >
      <LogOut className="h-5 w-5" />
    </button>
  )
}
