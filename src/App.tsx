import { AppProviders } from './AppProviders'
import { AppRouter } from './AppRouter'

import type { ReactElement } from 'react'

const App = (): ReactElement => (
  <AppProviders>
    <AppRouter />
  </AppProviders>
)

export default App
