'use client'

import { useState, useTransition } from 'react'
import { Trash2, Pencil } from 'lucide-react'
import { TxIcon } from '@/components/category-icon'
import { formatAmount, CURRENCY, CATEGORY_MAP } from '@/lib/constants'
import { deleteTransaction, type Transaction } from '@/app/actions/transactions'
import { Modal } from '@/components/ui/modal'
import { EditTransactionForm } from '@/components/edit-transaction-form'
import { Button } from '@/components/ui/button'

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
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const { bg, color } = iconBg(tx)

  const date = new Date(tx.occurredAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  })

  return (
    <>
      <div
        className="flex items-center gap-3 rounded-2xl px-3.5 py-3 transition-all hover:bg-white/90 shadow-sm border border-border/30 mb-2 group"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)' }}
      >
        {/* Icon */}
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-xs"
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
            <div className="flex flex-col gap-1 ml-1">
              <button
                type="button"
                aria-label="Modifier"
                onClick={(e) => {
                  e.preventDefault()
                  setShowEdit(true)
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full transition-colors active:scale-90 bg-blue-50 text-blue-600 hover:bg-blue-100"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Supprimer"
                onClick={(e) => {
                  e.preventDefault()
                  setShowDelete(true)
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full transition-colors active:scale-90 bg-red-50 text-red-600 hover:bg-red-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Modifier la transaction"
      >
        <EditTransactionForm 
          transaction={tx} 
          onSuccess={() => setShowEdit(false)} 
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDelete}
        onClose={() => !pending && setShowDelete(false)}
        title="Confirmer la suppression"
        description="Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible."
      >
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => setShowDelete(false)}
            className="w-full sm:w-1/2 h-12 rounded-2xl"
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                await deleteTransaction(tx.id)
                setShowDelete(false)
              })
            }}
            className="w-full sm:w-1/2 h-12 rounded-2xl font-bold bg-red-600 hover:bg-red-700"
          >
            {pending ? 'Suppression...' : 'Oui, supprimer'}
          </Button>
        </div>
      </Modal>
    </>
  )
}
