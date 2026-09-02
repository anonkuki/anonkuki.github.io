import { Languages, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

const nav = [
  { id: 'work', zh: '作品', en: 'Work' },
  { id: 'atlas', zh: '能力图谱', en: 'Atlas' },
  { id: 'experience', zh: '经历', en: 'Experience' },
  { id: 'contact', zh: '联系', en: 'Contact' },
]

export function SiteHeader() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  function scrollToSection(id: string) {
    const target = document.getElementById(id)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth' })
    window.setTimeout(() => {
      if (Math.abs(target.getBoundingClientRect().top) > 90) target.scrollIntoView({ behavior: 'smooth' })
    }, 450)
  }

  function goTo(id: string) {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      window.setTimeout(() => scrollToSection(id), 0)
      return
    }
    scrollToSection(id)
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="lenggujian home">
          <span className="brand-dot" />lenggujian
        </Link>
        <nav className={open ? 'main-nav is-open' : 'main-nav'} aria-label={language === 'zh' ? '主导航' : 'Main navigation'}>
          {nav.map((item) => <button key={item.id} type="button" onClick={() => goTo(item.id)}>{item[language]}</button>)}
        </nav>
        <div className="header-actions">
          <button
            className="language-switch"
            type="button"
            aria-label={language === 'zh' ? 'Switch to English' : '切换到中文'}
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
          >
            <Languages size={16} />
            <span>{language === 'zh' ? 'EN' : '中文'}</span>
          </button>
          <button className="menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((value) => !value)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  )
}
