'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      // Prévenir l'affichage de l'invite par défaut du navigateur
      e.preventDefault()
      // Sauvegarder l'événement pour pouvoir le déclencher plus tard
      setDeferredPrompt(e)
      // Afficher notre propre interface utilisateur
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Cacher notre interface
    setShowPrompt(false)
    // Déclencher l'invite d'installation
    deferredPrompt.prompt()
    
    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)
    
    // Nous ne pouvons utiliser l'événement qu'une seule fois
    setDeferredPrompt(null)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 w-[90%] max-w-[380px] animate-fade-in-up">
      <div 
        className="flex items-center justify-between gap-3 p-4 rounded-3xl border border-border/60 shadow-xl backdrop-blur-md"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E2F3F0]">
            <Download className="h-5 w-5 text-[#188775]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">Installer l'application</span>
            <span className="text-xs text-muted-foreground">Pour un accès plus rapide</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="rounded-full px-4 py-1.5 text-xs font-bold text-white transition-transform active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #106655, #188775)',
            }}
          >
            Installer
          </button>
          <button
            onClick={() => setShowPrompt(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
