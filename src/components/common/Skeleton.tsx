import { cn } from '@/lib/cn'

import type { ReactElement } from 'react'

export type SkeletonProps = {
  readonly className?: string
}

/**
 * Base skeleton shimmer for loading states.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-6 w-32" />
 * ```
 */
export const Skeleton = ({ className }: SkeletonProps): ReactElement => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-lines/70 motion-reduce:animate-none',
        className,
      )}
    />
  )
}

/**
 * Card skeleton with image and text blocks.
 *
 * @example
 * ```tsx
 * <SkeletonCard />
 * ```
 */
export const SkeletonCard = (): ReactElement => (
  <div className="flex flex-col gap-4 rounded-xl border border-lines bg-paper p-4">
    <Skeleton className="h-40 w-full rounded-lg" />
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-1/3" />
    </div>
  </div>
)

/**
 * Section-level skeleton placeholder.
 *
 * @example
 * ```tsx
 * <SkeletonSection />
 * ```
 */
export const SkeletonSection = (): ReactElement => (
  <div className="flex flex-col gap-6 rounded-2xl border border-lines bg-paper p-6">
    <Skeleton className="h-6 w-1/3" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
    </div>
  </div>
)
