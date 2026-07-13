import {
  Bus,
  Fuel,
  ShoppingCart,
  Home,
  HeartPulse,
  Gamepad2,
  ReceiptText,
  GraduationCap,
  Smartphone,
  Ellipsis,
  Wallet,
  Briefcase,
  type LucideIcon,
} from 'lucide-react'
import type { TxType } from '@/lib/constants'

const ICONS: Record<string, LucideIcon> = {
  Bus,
  Fuel,
  ShoppingCart,
  Home,
  HeartPulse,
  Gamepad2,
  ReceiptText,
  GraduationCap,
  Smartphone,
  Ellipsis,
}

import { CATEGORY_MAP } from '@/lib/constants'

export function TxIcon({
  type,
  category,
  className,
  style,
}: {
  type: TxType
  category: string | null
  className?: string
  style?: React.CSSProperties
}) {
  if (type === 'salaire') return <Briefcase className={className} style={style} />
  if (type === 'apport') return <Wallet className={className} style={style} />
  const meta = category ? CATEGORY_MAP[category] : undefined
  const Icon = meta ? ICONS[meta.icon] ?? Ellipsis : Ellipsis
  return <Icon className={className} style={style} />
}
