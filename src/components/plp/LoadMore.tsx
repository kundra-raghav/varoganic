import { useEffect, useRef, type ReactElement } from 'react'

import { Button } from '@/components/common/Button'

export type LoadMoreProps = {
  readonly onLoadMore: () => void
  readonly hasMore: boolean
  readonly isLoading: boolean
}

/**
 * Infinite scroll trigger with accessible button fallback.
 */
export const LoadMore = ({ onLoadMore, hasMore, isLoading }: LoadMoreProps): ReactElement => {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasMore || isLoading) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMore()
        }
      },
      { rootMargin: '200px' },
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isLoading, onLoadMore])

  if (!hasMore) {
    return <p className="text-center text-sm text-muted">You have reached the end of the ritual shelf.</p>
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <div ref={sentinelRef} aria-hidden="true" className="h-1 w-full" />
      <Button
        onClick={() => {
          onLoadMore()
        }}
        loading={isLoading}
        variant="secondary"
      >
        Load more
      </Button>
    </div>
  )
}
