import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTransactions } from '@/app/actions/transactions'
import { computeSummary, isSameMonth } from '@/lib/summary'
import { AppShell } from '@/components/app-shell'
import { BalanceCard } from '@/components/balance-card'
import { TransactionItem } from '@/components/transaction-item'
import { SignOutButton } from '@/components/sign-out-button'
import {
  BarChart2,
  ClockIcon,
  PlusCircle,
  TrendingUp,
  Bell,
  Gift,
  ChevronRight,
} from 'lucide-react'

export default async function HomePage() {
  // ⚡ Fetch session and transactions in parallel
  const [session, txs] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getTransactions().catch(() => [] as Awaited<ReturnType<typeof getTransactions>>),
  ])

  if (!session?.user) redirect('/sign-in')

  const monthTxs = txs.filter((t) => isSameMonth(t.occurredAt))
  const summary = computeSummary(monthTxs)
  const recent = txs.slice(0, 6)
  const firstName = session.user.name?.split(' ')[0] ?? 'là'
  const initials = session.user.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <AppShell>
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 pt-5 pb-3 backdrop-blur-lg bg-[#F7F5FF]/85 border-b border-black/[0.03] transition-all">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-white text-sm font-bold"
            style={{
              background: 'linear-gradient(135deg, #106655, #188775)',
              boxShadow: '0 2px 8px rgba(24,135,117,0.35)',
            }}
          >
            {initials}
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: '#9B8EC4' }}>
              Bonjour 👋
            </p>
            <h1 className="text-base font-bold" style={{ color: '#1A0A3C' }}>
              {firstName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Rewards badge */}
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{
              background: 'rgba(255,255,255,0.9)',
              boxShadow: '0 2px 8px rgba(24,135,117,0.12)',
              color: '#188775',
              border: '1px solid rgba(24,135,117,0.15)',
            }}
          >
            <Gift className="h-3.5 w-3.5" />
            Récompenses
          </div>
          {/* Bell */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
            style={{
              background: 'rgba(255,255,255,0.9)',
              boxShadow: '0 2px 8px rgba(24,135,117,0.12)',
              border: '1px solid rgba(24,135,117,0.15)',
            }}
          >
            <Bell className="h-4 w-4" style={{ color: '#188775' }} />
          </button>
          <SignOutButton />
        </div>
      </header>

      {/* ─── Balance Card ─── */}
      <div className="px-4 pt-4 animate-fade-in-up">
        <BalanceCard summary={summary} name={firstName} />
      </div>

      {/* ─── Raccourcis ─── */}
      <section className="px-5 pt-7">
        <h2 className="mb-4 font-bold text-base" style={{ color: '#1A0A3C' }}>
          Raccourcis
        </h2>
        <div className="flex items-start justify-around">
          {/* Historique */}
          <Link href="/historique" className="flex flex-col items-center gap-2 group">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-none transition-transform group-hover:scale-105"
              style={{ background: '#D4EBE7' }}
            >
              <ClockIcon className="h-6 w-6" style={{ color: '#188775' }} />
            </div>
            <span className="text-xs font-medium text-center" style={{ color: '#1A0A3C' }}>
              Historique
            </span>
          </Link>

          {/* Ajouter — badge NEW */}
          <Link href="/ajouter" className="flex flex-col items-center gap-2 group relative">
            <div className="relative">
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[9px] font-bold text-white z-10"
                style={{ background: '#188775', letterSpacing: '0.05em' }}
              >
                NEW
              </div>
              <div
                className="flex h-14 w-14 items-center justify-center rounded-none transition-transform group-hover:scale-105 mt-1"
                style={{ background: '#FEF3C7' }}
              >
                <PlusCircle className="h-6 w-6" style={{ color: '#D97706' }} />
              </div>
            </div>
            <span className="text-xs font-medium text-center" style={{ color: '#1A0A3C' }}>
              Ajouter
            </span>
          </Link>

          {/* Statistiques */}
          <Link href="/statistiques" className="flex flex-col items-center gap-2 group">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-none transition-transform group-hover:scale-105"
              style={{ background: '#EFF6FF' }}
            >
              <BarChart2 className="h-6 w-6" style={{ color: '#2563EB' }} />
            </div>
            <span className="text-xs font-medium text-center" style={{ color: '#1A0A3C' }}>
              Statistiques
            </span>
          </Link>
        </div>
      </section>

      {/* ─── Bannière promo ─── */}
      <div className="px-4 pt-7">
        <div
          className="relative overflow-hidden rounded-none p-5"
          style={{
            background: 'linear-gradient(135deg, #0D4D3F 0%, #106655 50%, #188775 100%)',
            boxShadow: '0 4px 20px rgba(24,135,117,0.35)',
          }}
        >
          {/* Decorative background */}
          <svg
            className="absolute right-0 bottom-0 opacity-10 pointer-events-none"
            width="140"
            height="100"
            viewBox="0 0 140 100"
          >
            <path
              d="M0 80 Q20 40 50 60 T90 40 T140 30"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0 90 Q30 55 60 70 T100 50 T140 45"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M20 95 Q50 65 80 80 T120 60"
              stroke="white"
              strokeWidth="1"
              fill="none"
            />
          </svg>

          <div className="relative flex items-end justify-between">
            <div className="max-w-[65%]">
              <div
                className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                style={{ background: 'rgba(255,255,255,0.25)' }}
              >
                portefeuille  
              </div>
              <p className="text-white font-bold text-base leading-snug">
                Suivez vos finances plus facilement
              </p>
              <p className="mt-1 text-white/70 text-xs">
                Disponible partout, tout le temps
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-white/30" />
          </div>
        </div>
      </div>

      {/* ─── Transactions récentes ─── */}
      <section className="px-4 pt-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base" style={{ color: '#1A0A3C' }}>
            Transactions récentes
          </h2>
          <Link
            href="/historique"
            className="flex items-center gap-0.5 text-xs font-semibold"
            style={{ color: '#188775' }}
          >
            Tout voir <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div
            className="mt-2 rounded-none border-2 border-dashed p-8 text-center"
            style={{ borderColor: '#BCE3DB' }}
          >
            <p className="text-sm font-medium" style={{ color: '#6B968F' }}>
              Aucune transaction pour le moment.{' '}
              <span style={{ color: '#188775' }}>Appuyez sur +</span> pour en ajouter une.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recent.map((tx) => (
              <TransactionItem key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  )
}
