import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getTransactions } from '@/app/actions/transactions'
import { AppShell } from '@/components/app-shell'
import { HistoryList } from '@/components/history-list'

export default async function HistoriquePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const txs = await getTransactions()

  return (
    <AppShell>
      <header className="sticky top-0 z-50 px-5 pt-5 pb-3 backdrop-blur-lg bg-[#F7F5FF]/85 border-b border-black/[0.03]">
        <h1 className="text-2xl font-semibold text-foreground">Historique</h1>
        <p className="text-sm text-muted-foreground">
          Toutes vos transactions
        </p>
      </header>
      <HistoryList transactions={txs} />
    </AppShell>
  )
}
