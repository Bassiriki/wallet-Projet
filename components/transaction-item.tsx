'use client'

import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { TxIcon } from '@/components/category-icon'
import { formatAmount, CURRENCY, CATEGORY_MAP } from '@/lib/constants'
import { deleteTransaction, type Transaction } from '@/app/actions/transactions'

function label(tx: Transaction) {
  if (tx.type === 'salaire') return 'Salaire'
  if (tx.type === 'apport') return 'Apport'
  return tx.category ? CATEGORY_MAP[tx.category]?.label ?? 'Dépense' : 'Dépense'
}

function iconBg(tx: Transaction) {
  if (tx.type === 'salaire') return { bg: '#D4EBE7', color: '#188775' }
  if (tx.type === 'apport') return { bg: '#DCFCE7', color: '#16A34A' }
  const map: Record<string, { bg: string; color: string }> = {
    transport: { bg: '#DBEAFE', color: '#2563EB' },
    carburant: { bg: '#FEF3C7', color: '#D97706' },
    alimentation: { bg: '#DCFCE7', color: '#16A34A' },
    logement: { bg: '#D4EBE7', color: '#188775' },
    sante: { bg: '#FEE2E2', color: '#DC2626' },
    loisirs: { bg: '#FDF4FF', color: '#A21CAF' },
    factures: { bg: '#FEF3C7', color: '#D97706' },
    education: { bg: '#DBEAFE', color: '#2563EB' },
    communication: { bg: '#CCFBF1', color: '#0D9488' },
  }
  return tx.category ? (map[tx.category] ?? { bg: '#E2F3F0', color: '#188775' }) : { bg: '#E2F3F0', color: '#188775' }
}

export function TransactionItem({
  tx,
  deletable = false,
}: {
  tx: Transaction
  deletable?: boolean
}) {
  const isExpense = tx.type === 'depense'
  const [pending, startTransition] = useTransition()
  const [confirm, setConfirm] = useState(false)
  const { bg, color } = iconBg(tx)

  const date = new Date(tx.occurredAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  })

  return (
    <div
      className="flex items-center gap-3 rounded-none px-3 py-3 transition-all hover:bg-white/70"
      style={{ background: 'rgba(255,255,255,0.6)' }}
    >
      {/* Icon */}
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none"
        style={{ background: bg }}
      >
        <TxIcon type={tx.type} category={tx.category} className="h-5 w-5" style={{ color }} />
      </div>

      {/* Label + date/desc */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-sm" style={{ color: '#1A0A3C' }}>
          {label(tx)}
        </p>
        <p className="truncate text-xs font-medium" style={{ color: '#9B8EC4' }}>
          {tx.description ? tx.description : date}
        </p>
      </div>

      {/* Amount */}
      <div className="flex items-center gap-2">
        <div className="text-right">
          <p
            className="font-bold tabular-nums text-sm"
            style={{ color: isExpense ? '#E53935' : '#22C55E' }}
          >
            {isExpense ? '-' : '+'}
            {formatAmount(tx.amount)}
          </p>
          <p className="text-[10px] font-medium" style={{ color: '#9B8EC4' }}>
            {CURRENCY}
          </p>
        </div>

        {deletable && (
          <button
            type="button"
            aria-label="Supprimer"
            disabled={pending}
            onClick={() => {
              if (!confirm) {
                setConfirm(true)
                setTimeout(() => setConfirm(false), 2500)
                return
              }
              startTransition(() => deleteTransaction(tx.id))
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            style={
              confirm
                ? { background: '#FEE2E2', color: '#DC2626' }
                : { color: '#9B8EC4' }
            }
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
