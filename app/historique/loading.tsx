import { AppShell } from '@/components/app-shell'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200/80 ${className ?? ''}`} />
}

export default function HistoriqueLoading() {
  return (
    <AppShell>
      <header className="sticky top-0 z-50 px-5 pt-5 pb-3">
        <Skeleton className="h-7 w-32 mb-1" />
        <Skeleton className="h-4 w-48" />
      </header>
      <div className="px-5 pt-4">
        {/* Filter tabs skeleton */}
        <div className="flex gap-2 pb-1">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full shrink-0" />
          ))}
        </div>
        {/* Transaction list skeleton */}
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl px-3.5 py-3 bg-white/75">
              <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
