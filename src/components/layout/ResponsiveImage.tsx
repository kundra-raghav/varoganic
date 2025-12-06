import { forwardRef, type ImgHTMLAttributes, type ReactElement } from 'react'

import { cn } from '@/lib/cn'

type ResponsiveSource = {
  readonly src: string
  readonly width: number
}

export type ResponsiveImageProps = {
  readonly src: string
  readonly alt: string
  readonly width: number
  readonly height: number
  readonly sources?: Array<ResponsiveSource>
  readonly sizes?: string
  readonly srcWidths?: Array<number>
  readonly priority?: boolean
  readonly className?: string
  readonly aspectRatio?: string
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height' | 'srcSet' | 'sizes' | 'loading'>

/**
 * Utility image component that outputs responsive `srcset/sizes` attributes,
 * enforces width/height to avoid CLS, and falls back to lazy loading unless
 * explicitly marked as `priority`.
 */
export const ResponsiveImage = forwardRef<HTMLImageElement, ResponsiveImageProps>(function ResponsiveImage(
  {
    src,
    alt,
    width,
    height,
    sources,
    sizes,
    srcWidths,
    priority = false,
    className,
    aspectRatio,
    decoding = 'async',
    style,
    fetchPriority: fetchPriorityProp,
    ...rest
  },
  ref,
): ReactElement {
  const usingSrcWidths = !sources?.length && srcWidths?.length
  const computedSources = sources?.length
    ? sources
    : usingSrcWidths
      ? srcWidths.map((width) => ({ src: withWidthParam(src, width), width }))
      : undefined
  const srcSet = computedSources?.length
    ? computedSources.map((source) => `${source.src} ${String(source.width)}w`).join(', ')
    : undefined
  const loading = priority ? 'eager' : 'lazy'
  const fetchPriority = priority ? 'high' : fetchPriorityProp
  const highestWidth = computedSources?.reduce((max, source) => Math.max(max, source.width), width) ?? width
  const resolvedSrc = usingSrcWidths ? withWidthParam(src, highestWidth) : src

  return (
    <img
      ref={ref}
      src={resolvedSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      className={cn('block', className)}
      style={aspectRatio ? { aspectRatio, ...style } : style}
      {...rest}
    />
  )
})

const withWidthParam = (url: string, width: number): string => {
  const widthPattern = /([?&])w=\d+/
  if (widthPattern.test(url)) {
    return url.replace(widthPattern, `$1w=${String(width)}`)
  }
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}w=${String(width)}`
}
