import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { AddTransactionForm } from '@/components/add-transaction-form'

export default async function AjouterPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  return (
    <div className="mx-auto min-h-svh w-full max-w-md bg-background pb-10">
      <header className="sticky top-0 z-50 flex items-center gap-3 px-5 pt-5 pb-3 backdrop-blur-lg bg-[#F7F5FF]/85 border-b border-black/[0.03]">
        <Link
          href="/"
          aria-label="Retour"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-semibold text-foreground">
          Nouvelle transaction
        </h1>
      </header>

      <AddTransactionForm />
    </div>
  )
}
