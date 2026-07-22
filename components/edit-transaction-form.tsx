'use client'

import { useState, useTransition } from 'react'
import { Bus, Fuel, ShoppingCart, Home, HeartPulse, Gamepad2, ReceiptText, GraduationCap, Smartphone, Ellipsis, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EXPENSE_CATEGORIES, CURRENCY, type TxType } from '@/lib/constants'
import { updateTransaction, type Transaction } from '@/app/actions/transactions'
import { cn } from '@/lib/utils'

const CAT_ICONS: Record<string, LucideIcon> = {
  Bus, Fuel, ShoppingCart, Home, HeartPulse, Gamepad2, ReceiptText, GraduationCap, Smartphone, Ellipsis,
}

const TABS: { value: TxType; label: string }[] = [
  { value: 'depense', label: 'Dépense' },
  { value: 'apport', label: 'Apport' },
  { value: 'salaire', label: 'Salaire' },
]

export function EditTransactionForm({
  transaction,
  onSuccess,
}: {
  transaction: Transaction
  onSuccess: () => void
}) {
  const [pending, startTransition] = useTransition()
  const [type, setType] = useState<TxType>(transaction.type)
  const [amount, setAmount] = useState(transaction.amount.toString())
  const [category, setCategory] = useState<string>(transaction.category ?? 'transport')
  const [description, setDescription] = useState(transaction.description ?? '')
  const [date, setDate] = useState(() => transaction.occurredAt.split('T')[0])
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const value = Number(amount.replace(',', '.'))
    if (!value || value <= 0) {
      setError('Veuillez saisir un montant valide')
      return
    }
    startTransition(async () => {
      try {
        await updateTransaction(transaction.id, {
          type,
          amount: value,
          category: type === 'depense' ? category : null,
          description: description || null,
          occurredAt: new Date(date).toISOString(),
        })
        onSuccess()
      } catch (err) {
        setError('Une erreur est survenue.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-2xl bg-destructive/10 p-3 text-center text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex rounded-2xl bg-muted/50 p-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setType(t.value)}
            className={cn(
              'flex-1 rounded-xl py-2 text-sm font-medium transition-all duration-200',
              type === t.value
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Montant</Label>
        <div className="relative">
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-14 rounded-2xl pl-12 text-lg font-bold"
            required
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
            {CURRENCY}
          </span>
        </div>
      </div>

      {type === 'depense' && (
        <div className="flex flex-col gap-2">
          <Label>Catégorie</Label>
          <div className="grid grid-cols-4 gap-2">
            {EXPENSE_CATEGORIES.map((cat) => {
              const Icon = CAT_ICONS[cat.icon] || Ellipsis
              const isSelected = category === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 rounded-2xl border p-2 transition-all duration-200 active:scale-95',
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-transparent bg-muted/30 text-muted-foreground hover:bg-muted/60',
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium leading-tight text-center">
                    {cat.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label>Description (optionnelle)</Label>
        <Input
          placeholder="Ex: Courses chez Carrefour..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-12 rounded-2xl"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Date</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-12 rounded-2xl"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="mt-2 h-14 w-full rounded-2xl text-base font-bold transition-transform active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, #106655, #188775)',
        }}
      >
        {pending ? 'Enregistrement...' : 'Enregistrer les modifications'}
      </Button>
    </form>
  )
}
