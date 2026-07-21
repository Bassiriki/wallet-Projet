'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Bus, Fuel, ShoppingCart, Home, HeartPulse, Gamepad2, ReceiptText, GraduationCap, Smartphone, Ellipsis, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EXPENSE_CATEGORIES, CURRENCY, type TxType } from '@/lib/constants'
import { addTransaction } from '@/app/actions/transactions'
import { cn } from '@/lib/utils'

const CAT_ICONS: Record<string, LucideIcon> = {
  Bus, Fuel, ShoppingCart, Home, HeartPulse, Gamepad2, ReceiptText, GraduationCap, Smartphone, Ellipsis,
}

const TABS: { value: TxType; label: string }[] = [
  { value: 'depense', label: 'Dépense' },
  { value: 'apport', label: 'Apport' },
  { value: 'salaire', label: 'Salaire' },
]

export function AddTransactionForm() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [type, setType] = useState<TxType>('depense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string>('transport')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
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
        await addTransaction({
          type,
          amount: value,
          category: type === 'depense' ? category : null,
          description: description.trim() || null,
          occurredAt: new Date(date).toISOString(),
        })
        router.push('/')
      } catch {
        setError("Impossible d'enregistrer la transaction")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="px-5 pt-4">
      {/* Type tabs */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-card p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setType(tab.value)}
            className={cn(
              'rounded-xl py-2.5 text-sm font-semibold transition-colors',
              type === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div className="mt-6 rounded-3xl border border-border/60 bg-card p-6 text-center shadow-sm">
        <Label htmlFor="amount" className="text-sm text-muted-foreground">
          Montant
        </Label>
        <div className="mt-2 flex items-center justify-center gap-2">
          <input
            id="amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ''))}
            placeholder="0"
            autoFocus
            className="w-full bg-transparent text-center text-5xl font-bold tabular-nums text-foreground outline-none placeholder:text-muted-foreground/40"
          />
        </div>
        <p className="mt-1 text-sm font-medium text-primary">{CURRENCY}</p>
      </div>

      {/* Category grid (only for expense) */}
      {type === 'depense' && (
        <div className="mt-6">
          <Label className="text-sm text-muted-foreground">Catégorie</Label>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {EXPENSE_CATEGORIES.map((c) => {
              const Icon = CAT_ICONS[c.icon] ?? Ellipsis
              const active = category === c.value
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <span
                    className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-2xl border transition-colors shadow-xs',
                      active
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-border bg-card text-muted-foreground',
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span
                    className={cn(
                      'text-center text-[11px] leading-tight',
                      active ? 'text-foreground font-semibold' : 'text-muted-foreground',
                    )}
                  >
                    {c.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mt-6 flex flex-col gap-2">
        <Label htmlFor="description">
          {type === 'depense' ? 'Note (optionnel)' : 'Description'}
        </Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={
            type === 'salaire'
              ? 'Ex : Salaire mensuel'
              : type === 'apport'
                ? 'Ex : Remboursement, vente...'
                : 'Ex : Taxi aéroport'
          }
          className="h-12 rounded-2xl"
        />
      </div>

      {/* Date */}
      <div className="mt-4 flex flex-col gap-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-12 rounded-2xl"
        />
      </div>

      {error && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="mt-6 h-13 w-full rounded-2xl py-3.5 text-base font-semibold transition-all active:scale-95"
      >
        {pending ? 'Enregistrement...' : 'Enregistrer'}
      </Button>
    </form>
  )
}
