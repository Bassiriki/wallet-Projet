'use client'

import { useMemo, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts'
import { CATEGORY_MAP, formatAmount, CURRENCY } from '@/lib/constants'
import { isSameMonth } from '@/lib/summary'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/app/actions/transactions'

const PIE_COLORS = [
  '#188775',
  '#22C55E',
  '#E53935',
  '#2563EB',
  '#F59E0B',
  '#A21CAF',
  '#0D9488',
  '#06B6D4',
  '#9B5CF6',
  '#C084FC',
]

export function StatsView({ transactions }: { transactions: Transaction[] }) {
  const [scope, setScope] = useState<'month' | 'all'>('month')

  const txs = useMemo(
    () =>
      scope === 'month'
        ? transactions.filter((t) => isSameMonth(t.occurredAt))
        : transactions,
    [transactions, scope],
  )

  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of txs) {
      if (t.type !== 'depense') continue
      const key = t.category ?? 'autre'
      map.set(key, (map.get(key) ?? 0) + t.amount)
    }
    return Array.from(map.entries())
      .map(([key, value]) => ({
        key,
        name: CATEGORY_MAP[key]?.label ?? 'Autre',
        value,
      }))
      .sort((a, b) => b.value - a.value)
  }, [txs])

  const totalExpense = byCategory.reduce((s, c) => s + c.value, 0)

  const monthly = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>()
    for (const t of transactions) {
      const d = new Date(t.occurredAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const cur = map.get(key) ?? { income: 0, expense: 0 }
      if (t.type === 'depense') cur.expense += t.amount
      else cur.income += t.amount
      map.set(key, cur)
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([key, v]) => {
        const [y, m] = key.split('-')
        const label = new Date(Number(y), Number(m) - 1).toLocaleDateString(
          'fr-FR',
          { month: 'short' },
        )
        return { label, ...v }
      })
  }, [transactions])

  return (
    <div className="px-5 pb-4">
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-card p-1.5">
        {(['month', 'all'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setScope(s)}
            className={cn(
              'rounded-xl py-2.5 text-sm font-semibold transition-colors',
              scope === s
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground',
            )}
          >
            {s === 'month' ? 'Ce mois' : 'Tout'}
          </button>
        ))}
      </div>

      {/* Donut of expenses by category */}
      <div className="mt-6 rounded-none bg-card p-6">
        <h2 className="font-semibold text-foreground">Dépenses par catégorie</h2>
        {byCategory.length === 0 ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Aucune dépense sur cette période.
          </p>
        ) : (
          <>
            <div className="relative mx-auto mt-4 h-52 w-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={94}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any) => `${formatAmount(Number(v))} ${CURRENCY}`}
                    contentStyle={{
                      background: '#FFFFFF',
                      border: '1px solid #E8E0FF',
                      borderRadius: 12,
                      color: '#1A0A3C',
                      boxShadow: '0 4px 16px rgba(123,63,228,0.12)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="text-lg font-bold tabular-nums text-foreground">
                  {formatAmount(totalExpense)}
                </span>
                <span className="text-xs" style={{ color: '#188775' }}>{CURRENCY}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {byCategory.map((c, i) => {
                const pct = totalExpense ? (c.value / totalExpense) * 100 : 0
                return (
                  <div key={c.key} className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    <span className="flex-1 text-sm text-foreground">
                      {c.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {pct.toFixed(0)}%
                    </span>
                    <span className="w-24 text-right text-sm font-medium tabular-nums text-foreground">
                      {formatAmount(c.value)}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Monthly income vs expense */}
      <div className="mt-6 rounded-none bg-card p-6">
        <h2 className="font-semibold text-foreground">Revenus vs Dépenses</h2>
        <p className="mb-4 text-xs text-muted-foreground">6 derniers mois</p>
        {monthly.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Pas encore de données.
          </p>
        ) : (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} barGap={4}>
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#9B8EC4', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(123,63,228,0.08)' }}
                  formatter={(v: any) => `${formatAmount(Number(v))} ${CURRENCY}`}
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E8E0FF',
                    borderRadius: 12,
                    color: '#1A0A3C',
                    boxShadow: '0 4px 16px rgba(123,63,228,0.12)',
                  }}
                />
                <Bar
                  dataKey="income"
                  name="Revenus"
                  radius={[6, 6, 0, 0]}
                  fill="#22C55E"
                />
                <Bar
                  dataKey="expense"
                  name="Dépenses"
                  radius={[6, 6, 0, 0]}
                  fill="#188775"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
