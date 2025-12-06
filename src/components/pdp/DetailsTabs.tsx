import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/Tabs'

import type { ReactElement, ReactNode } from 'react'

export type DetailsTabsProps = {
  readonly tabs: Array<{ id: string; label: string; content: ReactNode }>
}

/**
 * Details, ingredients, and reviews tabs.
 */
export const DetailsTabs = ({ tabs }: DetailsTabsProps): ReactElement => {
  return (
    <Tabs defaultValue={tabs[0]?.id ?? 'details'}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
