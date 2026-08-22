/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react'
import type { Language, LocalizedText } from '../content/types'

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  text: (value: LocalizedText) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function initialLanguage(): Language {
  if (typeof window === 'undefined') return 'zh'
  return window.localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'zh'
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)
  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage(next) {
      setLanguageState(next)
      window.localStorage.setItem('portfolio-language', next)
      document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en'
    },
    text: (copy) => copy[language],
  }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}
