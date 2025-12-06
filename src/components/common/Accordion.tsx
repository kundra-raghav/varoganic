import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/cn'

type AccordionType = 'single' | 'multiple'

type AccordionContextValue = {
  readonly openValues: Set<string>
  readonly type: AccordionType
  readonly toggleItem: (value: string) => void
  readonly baseId: string
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

export type AccordionProps = {
  readonly type?: AccordionType
  readonly defaultValue?: string | Array<string>
  readonly onValueChange?: (value: string | Array<string>) => void
  readonly className?: string
  readonly children: ReactNode
}

/**
 * Accessible accordion component supporting single or multiple expanded items.
 *
 * @example
 * ```tsx
 * <Accordion type="single" defaultValue="shipping">
 *   <AccordionItem value="shipping" title="Shipping">
 *     Ships in 2-3 business days.
 *   </AccordionItem>
 *   <AccordionItem value="returns" title="Returns">
 *     30-day return policy.
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
export const Accordion = ({
  type = 'single',
  defaultValue,
  onValueChange,
  className,
  children,
}: AccordionProps): ReactElement => {
  const baseId = useId()
  const initialValues = useMemo(() => {
    const valuesArray: Array<string> = Array.isArray(defaultValue)
      ? defaultValue
      : defaultValue
        ? [defaultValue]
        : []

    if (type === 'multiple') {
      return new Set(valuesArray)
    }

    const firstValue = valuesArray[0]
    return new Set(firstValue ? [firstValue] : [])
  }, [defaultValue, type])

  const [openValues, setOpenValues] = useState<Set<string>>(initialValues)

  const notifyChange = useCallback(
    (values: Set<string>) => {
      const nextValues = Array.from(values)
      if (type === 'multiple') {
        onValueChange?.(nextValues)
      } else {
        onValueChange?.(nextValues[0] ?? '')
      }
    },
    [onValueChange, type],
  )

  const toggleItem = useCallback(
    (value: string) => {
      setOpenValues((previous) => {
        const next = new Set(previous)
        if (type === 'single') {
          if (next.has(value)) {
            next.clear()
          } else {
            next.clear()
            next.add(value)
          }
        } else {
          if (next.has(value)) {
            next.delete(value)
          } else {
            next.add(value)
          }
        }
        notifyChange(next)
        return next
      })
    },
    [notifyChange, type],
  )

  const contextValue = useMemo<AccordionContextValue>(
    () => ({ openValues, type, toggleItem, baseId }),
    [openValues, type, toggleItem, baseId],
  )

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn('flex w-full flex-col divide-y divide-lines overflow-hidden rounded-xl border border-lines bg-paper', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

export type AccordionItemProps = {
  readonly value: string
  readonly title: ReactNode
  readonly children: ReactNode
  readonly className?: string
}

export const AccordionItem = ({ value, title, children, className }: AccordionItemProps): ReactElement => {
  const { openValues, toggleItem, baseId } = useAccordionContext()
  const isOpen = openValues.has(value)
  const buttonId = `${baseId}-${value}-trigger`
  const panelId = `${baseId}-${value}-panel`

  return (
    <section className={cn('w-full', className)}>
      <h3>
        <button
          type="button"
          id={buttonId}
          className={cn(
            'flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-base font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
            isOpen ? 'text-primary' : 'text-ink',
          )}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => {
            toggleItem(value)
          }}
        >
          <span>{title}</span>
          <span
            aria-hidden="true"
            className={cn(
              'inline-flex size-5 items-center justify-center text-muted transition-transform motion-reduce:transition-none',
              isOpen ? 'rotate-180 text-primary' : 'rotate-0',
            )}
          >
            <svg viewBox="0 0 10 6" fill="none" className="size-full">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className="px-4 pb-6 text-sm text-body"
      >
        {children}
      </div>
    </section>
  )
}

const useAccordionContext = (): AccordionContextValue => {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within <Accordion>')
  }
  return context
}
