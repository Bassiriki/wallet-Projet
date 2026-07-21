'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wallet } from 'lucide-react'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? 'Une erreur est survenue')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <main className="min-h-svh bg-background flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl  "
          style={{
        background: 'linear-gradient(135deg, #106655 0%, #188775 40%, #1CA38D 75%, #0F5C4F 100%)',
        boxShadow: '0 8px 32px rgba(24, 135, 117, 0.4)',
      }}>
            <Wallet className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance text-center">
            {isSignUp ? 'Créer un compte' : 'Bon retour'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            {isSignUp
              ? 'Gérez vos dépenses et revenus en toute simplicité'
              : 'Connectez-vous pour accéder à votre portefeuille'}
          </p>
        </div>

        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xl backdrop-blur-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="h-12 rounded-2xl"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-12 rounded-2xl"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="h-12 rounded-2xl"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl text-base font-semibold transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #106655 0%, #188775 40%, #1CA38D 75%, #0F5C4F 100%)',
                boxShadow: '0 8px 32px rgba(24, 135, 117, 0.4)',
              }}
            >
              {loading
                ? 'Veuillez patienter...'
                : isSignUp
                  ? 'Créer mon compte'
                  : 'Se connecter'}
            </Button>
          </form>
        </div>

        <p className="text-sm text-muted-foreground text-center mt-6">
          {isSignUp ? 'Vous avez déjà un compte ? ' : "Pas encore de compte ? "}
          <Link
            href={isSignUp ? '/sign-in' : '/sign-up'}
            className="text-primary font-semibold underline-offset-4 hover:underline"

          >
            {isSignUp ? 'Se connecter' : "S'inscrire"}
          </Link>
        </p>
      </div>
    </main>
  )
}
