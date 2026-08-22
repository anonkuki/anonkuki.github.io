export type Language = 'zh' | 'en'

export type LocalizedText = Record<Language, string>

export type EvidenceState = 'verified-current' | 'source-backed' | 'public-repo'

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
  summary: LocalizedText
  problem: LocalizedText
  architecture: LocalizedText
  reliability: LocalizedText
  performance: LocalizedText
  stack: string[]
  metrics: EvidenceMetric[]
  demo: 'tender' | 'regulated' | 'field'
  accent: 'blue' | 'cyan' | 'ink'
}

export interface PublicProject {
  repo: string
  title: LocalizedText
  description: LocalizedText
  url: string
  demoUrl?: string
  language: string
  stars: number
  tags: string[]
  visual: 'writer' | 'space' | 'rank' | 'manchu' | 'audit' | 'guild'
}

export interface CapabilityGroup {
  id: string
  title: LocalizedText
  summary: LocalizedText
  count: number
  tags: string[]
  color: string
}
