import { AppShell } from '@/components/app-shell'

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gray-200/80 ${className ?? ''}`}
    />
  )
}

export default function HomeLoading() {
  return (
    <AppShell>
      {/* Header skeleton */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </header>

      {/* Balance card skeleton */}
      <div className="px-4 pt-4">
        <Skeleton className="h-52 w-full rounded-3xl" />
      </div>

      {/* Shortcuts skeleton */}
      <section className="px-5 pt-7">
        <Skeleton className="h-5 w-28 mb-4" />
        <div className="flex justify-around">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-14 w-14 rounded-2xl" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </section>

      {/* Promo banner skeleton */}
      <div className="px-4 pt-7">
        <Skeleton className="h-24 w-full rounded-3xl" />
      </div>

      {/* Transactions skeleton */}
      <section className="px-4 pt-7">
        <div className="flex justify-between mb-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
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
      </section>
    </AppShell>
  )
}
