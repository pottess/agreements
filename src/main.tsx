import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app/App'
import { AgreementsProvider } from './domain/agreements.store'
import './design-system/tokens.css'
import './design-system/global.css'
import './design-system/actions.css'
import './design-system/layout.css'
import './design-system/toolbar.css'
import './design-system/vigencia.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AgreementsProvider><App /></AgreementsProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
