import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { ProfileForm } from '@/components/profile-form'

export default async function ProfilPage() {
  const [session] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
  ])

  if (!session?.user) redirect('/sign-in')

  return (
    <AppShell>
      <header className="sticky top-0 z-50 px-5 pt-5 pb-3 backdrop-blur-lg bg-[#F7F5FF]/85 border-b border-black/[0.03]">
        <h1 className="text-2xl font-semibold text-foreground">Profil</h1>
        <p className="text-sm text-muted-foreground">Gérez vos informations et votre sécurité</p>
      </header>
      
      <div className="px-5 pt-4 pb-10">
        <ProfileForm user={session.user} />
      </div>
    </AppShell>
  )
}
