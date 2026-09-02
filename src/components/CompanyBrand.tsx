import type { CaseStudy } from '../content/types'
import { useLanguage } from '../i18n/LanguageContext'

type CompanyBrandData = NonNullable<CaseStudy['brand']>

export function CompanyBrand({ brand, compact = false }: { brand: CompanyBrandData; compact?: boolean }) {
  const { text } = useLanguage()

  return (
    <span className={`company-brand company-brand-${brand.className}${compact ? ' is-compact' : ''}`}>
      <img src={brand.src} alt={text(brand.alt)} loading="lazy" decoding="async" />
    </span>
  )
}
