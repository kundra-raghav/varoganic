import { Rating } from '@/components/common/Rating'

import type { ReactElement } from 'react'

export type Review = {
  readonly id: string
  readonly author: string
  readonly rating: number
  readonly content: string
}

export type ReviewsProps = {
  readonly reviews: Array<Review>
}

/**
 * Customer reviews list and summary.
 */
export const Reviews = ({ reviews }: ReviewsProps): ReactElement => {
  if (!reviews.length) {
    return <p className="text-sm text-muted">Be the first to review this ritual.</p>
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article key={review.id} className="rounded-2xl border border-lines bg-paper p-4 shadow-card">
          <div className="flex items-center justify-between text-sm">
            <div className="font-semibold text-ink">{review.author}</div>
            <Rating value={review.rating} readOnly label={`Rated ${review.rating.toString()} out of 5`} />
          </div>
          <p className="mt-2 text-sm text-body">{review.content}</p>
        </article>
      ))}
    </div>
  )
}
