import { AppShell } from '@/components/app-shell'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200/80 ${className ?? ''}`} />
}

export default function StatistiquesLoading() {
  return (
    <AppShell>
      <header className="sticky top-0 z-50 px-5 pt-5 pb-3">
        <Skeleton className="h-7 w-40 mb-1" />
        <Skeleton className="h-4 w-48" />
      </header>
      <div className="px-5 pt-4 flex flex-col gap-6">
        {/* Toggle skeleton */}
        <Skeleton className="h-12 w-full rounded-2xl" />
        {/* Donut chart skeleton */}
        <div className="rounded-3xl bg-white p-6 flex flex-col items-center gap-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-52 w-52 rounded-full" />
          <div className="w-full flex flex-col gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 flex-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
        {/* Bar chart skeleton */}
        <div className="rounded-3xl bg-white p-6">
          <Skeleton className="h-4 w-40 mb-1" />
          <Skeleton className="h-3 w-28 mb-4" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
      </div>
    </AppShell>
  )
}
