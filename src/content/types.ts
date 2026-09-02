export type Language = 'zh' | 'en'

export type LocalizedText = Record<Language, string>

export type EvidenceState = 'verified-current' | 'source-backed' | 'public-repo' | 'user-provided'

export interface EvidenceMetric {
  value: string
  label: LocalizedText
  evidence: LocalizedText
  state: EvidenceState
}
export interface CaseStudy {
  slug: string
  index: string
  title: LocalizedText
  eyebrow: LocalizedText
  organization?: LocalizedText
  period?: LocalizedText
  role?: LocalizedText
  brand?: {
    src: string
    alt: LocalizedText
    className: 'qingyan' | 'sinovac'
  }
  summary: LocalizedText
  delivered: LocalizedText
  impact: LocalizedText
  problem: LocalizedText
  architecture: LocalizedText
  patterns: LocalizedText
  maintainability: LocalizedText
  reliability: LocalizedText
  performance: LocalizedText
  stack: string[]
  metrics: EvidenceMetric[]
  demo: 'tender' | 'regulated' | 'writing'
  accent: 'blue' | 'cyan' | 'ink'
}

export interface PublicProject {
  repo: string
  repositories: string[]
  visibility: 'public' | 'local'
  title: LocalizedText
  description: LocalizedText
  language: string
  tags: string[]
  covers: Array<{
    src: string
    label: LocalizedText
  }>
  links: Array<{
    repo: string
    label: LocalizedText
    url: string
    demoUrl?: string
  }>
}

export interface CapabilityGroup {
  id: string
  title: LocalizedText
  summary: LocalizedText
  count: number
  tags: string[]
  color: string
}
