import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import './index.css'
import { initAnalytics } from './lib/analytics'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
initAnalytics()

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
