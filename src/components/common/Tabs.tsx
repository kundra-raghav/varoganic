import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react'

import { cn } from '@/lib/cn'

type TabItem = {
  readonly value: string
  readonly ref: RefObject<HTMLButtonElement>
}

type TabsContextValue = {
  readonly value: string
  readonly orientation: 'horizontal' | 'vertical'
  readonly tabs: Array<TabItem>
  readonly setValue: (value: string) => void
  readonly registerTab: (tab: TabItem) => () => void
  readonly listId: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

export type TabsProps = {
  readonly value?: string
  readonly defaultValue?: string
  readonly onValueChange?: (value: string) => void
  readonly orientation?: 'horizontal' | 'vertical'
  readonly className?: string
  readonly children: ReactNode
}

/**
 * Headless tabs primitive following the WAI-ARIA pattern. Compose with `TabsList`, `TabsTrigger`, and `TabsContent`.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="details">
 *   <TabsList>
 *     <TabsTrigger value="details">Details</TabsTrigger>
 *     <TabsTrigger value="reviews">Reviews</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="details">Product information</TabsContent>
 *   <TabsContent value="reviews">Reviews</TabsContent>
 * </Tabs>
 * ```
 */
export const Tabs = ({
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
}: TabsProps): ReactElement => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const [tabs, setTabs] = useState<Array<TabItem>>([])
  const listId = useId()
  const isControlled = typeof value === 'string'
  const currentValue = isControlled && typeof value === 'string' ? value : internalValue

  const setValue = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue)
      }
      onValueChange?.(nextValue)
    },
    [isControlled, onValueChange],
  )

  const registerTab = useCallback((tab: TabItem) => {
    setTabs((previous) => {
      const exists = previous.find((item) => item.value === tab.value)
      if (exists) {
        return previous.map((item) => (item.value === tab.value ? tab : item))
      }
      return [...previous, tab]
    })

    return () => {
      setTabs((previous) => previous.filter((item) => item.value !== tab.value))
    }
  }, [])

  const contextValue = useMemo<TabsContextValue>(
    () => ({ value: currentValue, orientation, tabs, setValue, registerTab, listId }),
    [currentValue, orientation, tabs, setValue, registerTab, listId],
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn('flex w-full flex-col gap-4', className)} data-orientation={orientation}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export type TabsListProps = {
  readonly className?: string
  readonly children: ReactNode
}

export const TabsList = ({ className, children }: TabsListProps): ReactElement => {
  const context = useTabsContext()

  return (
    <div
      role="tablist"
      aria-orientation={context.orientation}
      id={context.listId}
      className={cn(
        'flex gap-2 rounded-lg border border-lines bg-paper p-1',
        context.orientation === 'vertical' ? 'flex-col' : 'flex-row',
        className,
      )}
    >
      {children}
    </div>
  )
}

export type TabsTriggerProps = {
  readonly value: string
  readonly className?: string
  readonly children: ReactNode
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { value, className, children },
  ref,
): ReactElement {
  const context = useTabsContext()
  const triggerId = `${context.listId}-${value}`
  const internalRef = useRef<HTMLButtonElement>(null)

  useImperativeHandle(
    ref,
    () => internalRef.current ?? document.createElement('button'),
    [],
  )

  useEffect(() => {
    return context.registerTab({ value, ref: internalRef })
  }, [context, value])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    const isHorizontal = context.orientation === 'horizontal'
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'
    const previousKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'

    if (![nextKey, previousKey, 'Home', 'End'].includes(event.key)) {
      return
    }

    event.preventDefault()
    const tabValues = context.tabs.map((item) => item.value)
    if (tabValues.length === 0) {
      return
    }
    const currentIndex = tabValues.indexOf(value)

    if (event.key === 'Home') {
      focusTab(tabValues[0], context)
      return
    }

    if (event.key === 'End') {
      focusTab(tabValues[tabValues.length - 1], context)
      return
    }

    const delta = event.key === nextKey ? 1 : -1
    const nextIndex = (currentIndex + delta + tabValues.length) % tabValues.length
    focusTab(tabValues[nextIndex], context)
  }

  const isActive = context.value === value

  return (
    <button
      ref={internalRef}
      id={triggerId}
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={`${triggerId}-panel`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => {
        context.setValue(value)
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted hover:bg-primary/5 hover:text-primary',
        className,
      )}
    >
      {children}
    </button>
  )
})

export type TabsContentProps = {
  readonly value: string
  readonly className?: string
  readonly children: ReactNode
}

export const TabsContent = ({ value, className, children }: TabsContentProps): ReactElement => {
  const context = useTabsContext()
  const triggerId = `${context.listId}-${value}`
  const hidden = context.value !== value

  return (
    <div
      role="tabpanel"
      id={`${triggerId}-panel`}
      aria-labelledby={triggerId}
      hidden={hidden}
      className={cn('rounded-lg border border-lines bg-paper p-6 text-body shadow-card', className)}
    >
      {children}
    </div>
  )
}

const useTabsContext = (): TabsContextValue => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within <Tabs>')
  }
  return context
}

const focusTab = (value: string, context: TabsContextValue): void => {
  const target = context.tabs.find((item) => item.value === value)
  if (target?.ref.current) {
    target.ref.current.focus()
    context.setValue(value)
  }
}
