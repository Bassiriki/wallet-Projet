'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { transactions } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { TxType } from '@/lib/constants'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export type Transaction = {
  id: number
  userId: string
  type: TxType
  amount: number
  category: string | null
  description: string | null
  occurredAt: string
  createdAt: string
}

export async function getTransactions(): Promise<Transaction[]> {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.occurredAt))

  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    type: r.type as TxType,
    amount: Number(r.amount),
    category: r.category,
    description: r.description,
    occurredAt: (r.occurredAt as Date).toISOString(),
    createdAt: (r.createdAt as Date).toISOString(),
  }))
}

export async function addTransaction(input: {
  type: TxType
  amount: number
  category?: string | null
  description?: string | null
  occurredAt?: string
}) {
  const userId = await getUserId()

  if (!input.amount || input.amount <= 0) {
    throw new Error('Le montant doit être supérieur à zéro')
  }

  await db.insert(transactions).values({
    userId,
    type: input.type,
    amount: input.amount.toFixed(2),
    category: input.type === 'depense' ? (input.category ?? 'autre') : null,
    description: input.description ?? null,
    occurredAt: input.occurredAt ? new Date(input.occurredAt) : new Date(),
  })

  revalidatePath('/')
  revalidatePath('/historique')
  revalidatePath('/statistiques')
}

export async function deleteTransaction(id: number) {
  const userId = await getUserId()
  await db
    .delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))

  revalidatePath('/')
  revalidatePath('/historique')
  revalidatePath('/statistiques')
}

export async function updateTransaction(
  id: number,
  input: {
    type?: TxType
    amount?: number
    category?: string | null
    description?: string | null
    occurredAt?: string
  }
) {
  const userId = await getUserId()

  const updates: any = {}
  if (input.type) updates.type = input.type
  if (input.amount !== undefined) updates.amount = input.amount.toFixed(2)
  if (input.category !== undefined) updates.category = input.category
  if (input.description !== undefined) updates.description = input.description
  if (input.occurredAt) updates.occurredAt = new Date(input.occurredAt)

  await db
    .update(transactions)
    .set(updates)
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))

  revalidatePath('/')
  revalidatePath('/historique')
  revalidatePath('/statistiques')
}
