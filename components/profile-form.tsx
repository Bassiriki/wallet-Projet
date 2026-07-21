'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogOut, User, Lock, KeyRound } from 'lucide-react'

export function ProfileForm({ user }: { user: any }) {
  const router = useRouter()
  const [name, setName] = useState(user.name || '')
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  
  // UI states
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setProfileLoading(true)

    const { error } = await authClient.updateUser({
      name,
    })

    setProfileLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message ?? 'Impossible de mettre à jour le profil' })
      return
    }

    setMessage({ type: 'success', text: 'Profil mis à jour avec succès' })
    router.refresh()
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setPasswordLoading(true)

    const { error } = await authClient.changePassword({
      newPassword,
      currentPassword,
      revokeOtherSessions: true,
    })

    setPasswordLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message ?? 'Le mot de passe actuel est incorrect' })
      return
    }

    setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' })
    setCurrentPassword('')
    setNewPassword('')
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Messages */}
      {message && (
        <div 
          className={`p-4 rounded-2xl text-sm font-medium ${
            message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Informations personnelles */}
      <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E2F3F0] text-[#188775]">
            <User className="h-5 w-5" />
          </div>
          <h2 className="font-semibold text-lg text-foreground">Informations personnelles</h2>
        </div>
        
        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-muted-foreground">Adresse e-mail</Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="h-12 rounded-2xl bg-gray-50 text-muted-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-muted-foreground">Nom complet</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-2xl"
            />
          </div>
          <Button 
            type="submit" 
            disabled={profileLoading || name === user.name}
            className="w-full h-12 rounded-2xl text-base font-semibold mt-2 transition-all active:scale-95"
          >
            {profileLoading ? 'Mise à jour...' : 'Mettre à jour le profil'}
          </Button>
        </form>
      </div>

      {/* Sécurité */}
      <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF3C7] text-[#D97706]">
            <KeyRound className="h-5 w-5" />
          </div>
          <h2 className="font-semibold text-lg text-foreground">Sécurité</h2>
        </div>

        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="current-password" className="text-muted-foreground">Mot de passe actuel</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="h-12 rounded-2xl"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-password" className="text-muted-foreground">Nouveau mot de passe</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="h-12 rounded-2xl"
            />
          </div>
          <Button 
            type="submit" 
            disabled={passwordLoading || !currentPassword || !newPassword}
            className="w-full h-12 rounded-2xl text-base font-semibold mt-2 transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #0D4D3F 0%, #106655 100%)',
            }}
          >
            {passwordLoading ? 'Modification...' : 'Changer le mot de passe'}
          </Button>
        </form>
      </div>

      {/* Déconnexion */}
      <Button 
        variant="destructive"
        onClick={handleSignOut}
        className="w-full h-13 rounded-2xl text-base font-semibold transition-all active:scale-95 py-3.5 flex items-center justify-center gap-2 mb-8 bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
      >
        <LogOut className="h-5 w-5" />
        Se déconnecter
      </Button>
    </div>
  )
}
