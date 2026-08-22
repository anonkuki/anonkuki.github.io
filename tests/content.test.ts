import { describe, expect, it } from 'vitest'
import { capabilityGroups, featuredCases, publicProjects } from '../src/content/projects'
import auditSummary from '../src/content/audit-summary.json'
import githubSnapshot from '../src/content/github-snapshot.json'

describe('public portfolio content contract', () => {
  it('publishes exactly three ordered flagship cases', () => {
    expect(featuredCases.map((item) => item.slug)).toEqual([
      'tender-agent-harness',
      'regulated-report-agent',
      'cross-platform-field-suite',
    ])
  })

  it('lists every current public GitHub repository once', () => {
    expect(publicProjects.map((item) => item.repo)).toEqual([
      'AI-Copilot-Writing-Platform',
      'Zuoyou-Anime-Club-2025-Annual-Summary',
      'my-anime-rank',
      'manchu-degradation-simulator',
      'OPC-TEST',
      'zuoyou_web',
    ])
    expect(new Set(githubSnapshot.repositories.map((item) => item.repo)).size).toBe(6)
  })

  it('defines six anonymized capability groups with positive audited counts', () => {
    expect(capabilityGroups).toHaveLength(6)
    expect(capabilityGroups.every((group) => group.count > 0)).toBe(true)
    expect(capabilityGroups.reduce((sum, group) => sum + group.count, 0)).toBe(auditSummary.mappedProjectCount)
    expect(auditSummary.candidateCount).toBe(auditSummary.mappedProjectCount + auditSummary.excludedCount)
    expect(Object.values(auditSummary.guarantees).every(Boolean)).toBe(true)
  })
})
