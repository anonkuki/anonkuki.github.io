import { Route, Routes } from 'react-router-dom'
import { SiteHeader } from './components/SiteHeader'
import { IntroOverlay } from './components/IntroOverlay'
import { CasePage } from './pages/CasePage'
import { HomePage } from './pages/HomePage'

export function PortfolioApp() {
  return (
    <div className="site-shell">
      <IntroOverlay />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work/:slug" element={<CasePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  )
}
