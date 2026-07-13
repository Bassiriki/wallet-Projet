import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getTransactions } from '@/app/actions/transactions'
import { AppShell } from '@/components/app-shell'
import { StatsView } from '@/components/stats-view'

export default async function StatistiquesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const txs = await getTransactions()

  return (
    <AppShell>
      <header className="sticky top-0 z-50 px-5 pt-5 pb-3 backdrop-blur-lg bg-[#F7F5FF]/85 border-b border-black/[0.03]">
        <h1 className="text-2xl font-semibold text-foreground">Statistiques</h1>
        <p className="text-sm text-muted-foreground">Analyse de vos finances</p>
      </header>
      <StatsView transactions={txs} />
    </AppShell>
  )
}
