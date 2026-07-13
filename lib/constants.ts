export type TxType = 'depense' | 'apport' | 'salaire'

export const EXPENSE_CATEGORIES = [
  { value: 'transport', label: 'Transport', icon: 'Bus' },
  { value: 'carburant', label: 'Carburant', icon: 'Fuel' },
  { value: 'alimentation', label: 'Alimentation', icon: 'ShoppingCart' },
  { value: 'logement', label: 'Logement', icon: 'Home' },
  { value: 'sante', label: 'Santé', icon: 'HeartPulse' },
  { value: 'loisirs', label: 'Loisirs', icon: 'Gamepad2' },
  { value: 'factures', label: 'Factures', icon: 'ReceiptText' },
  { value: 'education', label: 'Éducation', icon: 'GraduationCap' },
  { value: 'communication', label: 'Communication', icon: 'Smartphone' },
  { value: 'autre', label: 'Autre', icon: 'Ellipsis' },
] as const

export const CATEGORY_MAP = Object.fromEntries(
  EXPENSE_CATEGORIES.map((c) => [c.value, c]),
) as Record<string, (typeof EXPENSE_CATEGORIES)[number]>

export const CURRENCY = 'FCFA'

export function formatAmount(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatMoney(value: number): string {
  return `${formatAmount(value)} ${CURRENCY}`
}
