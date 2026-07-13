import type { Transaction } from '@/app/actions/transactions'

export type Summary = {
  balance: number
  income: number
  expense: number
}

export function computeSummary(txs: Transaction[]): Summary {
  let income = 0
  let expense = 0
  for (const t of txs) {
    if (t.type === 'depense') expense += t.amount
    else income += t.amount
  }
  return { balance: income - expense, income, expense }
}

export function isSameMonth(iso: string, ref = new Date()): boolean {
  const d = new Date(iso)
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
}
