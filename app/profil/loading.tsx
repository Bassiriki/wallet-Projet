import { AppShell } from '@/components/app-shell'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200/80 ${className ?? ''}`} />
}

export default function ProfilLoading() {
  return (
    <AppShell>
      <header className="sticky top-0 z-50 px-5 pt-5 pb-3">
        <Skeleton className="h-7 w-32 mb-1" />
        <Skeleton className="h-4 w-48" />
      </header>
      <div className="px-5 pt-4 flex flex-col gap-6">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-12 w-full rounded-2xl mt-4" />
      </div>
    </AppShell>
  )
}
