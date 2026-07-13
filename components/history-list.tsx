'use client'

import { useMemo, useState } from 'react'
import { TransactionItem } from '@/components/transaction-item'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/app/actions/transactions'
import type { TxType } from '@/lib/constants'

const FILTERS: { value: 'all' | TxType; label: string }[] = [
  { value: 'all', label: 'Tout' },
  { value: 'depense', label: 'Dépenses' },
  { value: 'apport', label: 'Apports' },
  { value: 'salaire', label: 'Salaires' },
]

function monthLabel(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })
}

export function HistoryList({ transactions }: { transactions: Transaction[] }) {
  const [filter, setFilter] = useState<'all' | TxType>('all')

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? transactions
        : transactions.filter((t) => t.type === filter),
    [transactions, filter],
  )

  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>()
    for (const t of filtered) {
      const key = monthLabel(t.occurredAt)
      const arr = map.get(key) ?? []
      arr.push(t)
      map.set(key, arr)
    }
    return Array.from(map.entries())
  }, [filtered])

  return (
    <div className="px-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              filter === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">Aucune transaction.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {groups.map(([month, items]) => (
            <div key={month}>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {month}
              </p>
              <div className="mt-1 divide-y divide-border">
                {items.map((tx) => (
                  <TransactionItem key={tx.id} tx={tx} deletable />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
