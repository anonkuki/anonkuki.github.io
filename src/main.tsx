import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/space-grotesk'
import { PortfolioApp } from './App'
import { LanguageProvider } from './i18n/LanguageContext'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <LanguageProvider>
        <PortfolioApp />
      </LanguageProvider>
    </HashRouter>
  </React.StrictMode>,
)
