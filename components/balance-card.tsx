'use client'

import Link from 'next/link'
import { ArrowUpRight, TrendingUp, ChevronRight } from 'lucide-react'
import { formatAmount, CURRENCY } from '@/lib/constants'
import type { Summary } from '@/lib/summary'

export function BalanceCard({
  summary,
  name,
}: {
  summary: Summary
  name: string
}) {
  const balanceStr = formatAmount(summary.balance)

  return (
    <div
      className="relative overflow-hidden rounded-none p-5 text-white"
      style={{
        background: 'linear-gradient(135deg, #106655 0%, #188775 40%, #1CA38D 75%, #0F5C4F 100%)',
        boxShadow: '0 8px 32px rgba(24, 135, 117, 0.4)',
      }}
    >
      {/* Wavy background SVG */}
      <svg
        className="absolute inset-0 h-full w-full opacity-10 pointer-events-none"
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 80 Q50 50 100 80 T200 80 T300 80 T400 80 L400 200 L0 200 Z"
          fill="white"
        />
        <path
          d="M0 110 Q60 85 120 110 T240 110 T360 110 T400 110 L400 200 L0 200 Z"
          fill="white"
          opacity="0.5"
        />
        <circle cx="320" cy="30" r="60" fill="white" opacity="0.07" />
        <circle cx="350" cy="70" r="40" fill="white" opacity="0.05" />
        <circle cx="60" cy="160" r="50" fill="white" opacity="0.05" />
      </svg>

      {/* Top row: label + balance badge */}
      <div className="relative flex items-center justify-between">
        <span
          className="rounded-none px-3 py-1 text-xs font-medium"
          style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)' }}
        >
          Solde Disponible
        </span>
        <span
          className="rounded-none px-3 py-1 text-xs font-semibold"
          style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)' }}
        >
          {CURRENCY}
        </span>
      </div>

      {/* Balance + % badge */}
      <div className="relative mt-3 flex items-end justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">Solde de portefeuille</p>
          <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums">
            {balanceStr}
            <span className="text-2xl font-semibold">,00</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div
            className="flex items-center gap-1 rounded-none px-2.5 py-1 text-xs font-bold"
            style={{ background: 'rgba(34,197,94,0.25)', color: '#6DFFA5' }}
          >
            <TrendingUp className="h-3 w-3" />
            {summary.income > 0
              ? `+${((summary.income / (summary.balance + summary.expense || 1)) * 100).toFixed(1)}%`
              : '0%'}
          </div>
          <ChevronRight className="h-5 w-5 opacity-60" />
        </div>
      </div>

      {/* Stats row */}
      <div className="relative mt-4 grid grid-cols-2 gap-3">
        <div
          className="rounded-none p-3"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
        >
          <div className="flex items-center gap-1.5">
            <ArrowUpRight className="h-3.5 w-3.5 text-green-300" />
            <span className="text-xs opacity-75">Revenus (mois)</span>
          </div>
          <p className="mt-1 font-semibold tabular-nums text-sm">
            {formatAmount(summary.income)} {CURRENCY}
          </p>
        </div>
        <div
          className="rounded-none p-3"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
        >
          <div className="flex items-center gap-1.5">
            <ArrowUpRight className="h-3.5 w-3.5 rotate-180 text-red-300" />
            <span className="text-xs opacity-75">Dépenses (mois)</span>
          </div>
          <p className="mt-1 font-semibold tabular-nums text-sm">
            {formatAmount(summary.expense)} {CURRENCY}
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <Link
        href="/ajouter"
        className="relative mt-4 flex items-center gap-2 rounded-none px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-95"
        style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', width: 'fit-content' }}
      >
        Ajouter une transaction
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
