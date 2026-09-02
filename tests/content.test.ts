import { describe, expect, it } from 'vitest'
import { capabilityGroups, featuredCases, prototypeDeliveryAudit, publicProjects } from '../src/content/projects'
import auditSummary from '../src/content/audit-summary.json'
import githubSnapshot from '../src/content/github-snapshot.json'

describe('public portfolio content contract', () => {
  it('publishes only the two real internship agent deliveries as flagship cases', () => {
    expect(featuredCases.map((item) => item.slug)).toEqual([
      'tender-agent-harness',
      'regulated-report-agent',
    ])
    expect(featuredCases[0]).toMatchObject({
      organization: { zh: '北京清研灵智' },
      period: { zh: '2026.03 — 2026.06' },
    })
    expect(featuredCases[1]).toMatchObject({
      organization: { zh: '北京科兴' },
      period: { zh: '2026.07 — 至今' },
      title: { zh: '注册材料报告 Agent' },
    })
    expect(featuredCases.every((item) => item.organization && item.period && item.role)).toBe(true)
    expect(featuredCases.map((item) => item.brand)).toEqual([
      {
        src: '/brands/qingyan-group.png',
        alt: { zh: '清研集团官方标识', en: 'Official Tsingyan Group mark' },
        className: 'qingyan',
      },
      {
        src: '/brands/sinovac.svg',
        alt: { zh: 'SINOVAC 科兴官方标识', en: 'Official SINOVAC mark' },
        className: 'sinovac',
      },
    ])
    expect(featuredCases.every((item) => item.delivered.zh && item.impact.zh && item.patterns.zh && item.maintainability.zh)).toBe(true)
    expect(featuredCases.some((item) => item.slug === 'ai-copilot-writing-platform')).toBe(false)
  })

  it('publishes source-audited prototype delivery throughput without exposing project names', () => {
    expect(prototypeDeliveryAudit).toEqual({
      auditedAt: '2026-08-24',
      qualifiedSystemCount: 37,
      activeBuildDays: 27,
      oneOrTwoSystemDays: 25,
      averagePerActiveDay: 1.37,
    })
    expect(auditSummary.prototypeDelivery.basis).toContain('maintained source or complete demo')
  })

  it('presents the two long-running club sites as independent project cards', () => {
    expect(publicProjects.map((item) => item.repo)).toEqual([
      'AI-Copilot-Writing-Platform',
      'Zuoyou-Anime-Club-2025-Annual-Summary',
      'zuoyou_web',
      'manchu-degradation-simulator',
      'duolinban-campus',
    ])
    expect(publicProjects.flatMap((item) => item.repositories ?? [item.repo])).toEqual([
      'AI-Copilot-Writing-Platform',
      'Zuoyou-Anime-Club-2025-Annual-Summary',
      'zuoyou_web',
      'manchu-degradation-simulator',
      'duolinban-campus',
    ])
    expect(publicProjects.every((item) => item.covers?.length)).toBe(true)
    const annualReport = publicProjects.find((item) => item.repo === 'Zuoyou-Anime-Club-2025-Annual-Summary')
    const guild = publicProjects.find((item) => item.repo === 'zuoyou_web')
    expect(annualReport).toMatchObject({
      repositories: ['Zuoyou-Anime-Club-2025-Annual-Summary'],
      title: { zh: '佐佑动漫社 · 星际年度报告' },
      links: [{ demoUrl: 'https://anonkuki.github.io/Zuoyou-Anime-Club-2025-Annual-Summary/' }],
    })
    expect(guild).toMatchObject({
      repositories: ['zuoyou_web'],
      title: { zh: '佐佑动漫社 · 冒险者公会' },
      links: [{ demoUrl: 'http://62.234.83.174:8080/' }],
    })
    expect(new Set(githubSnapshot.repositories.map((item) => item.repo)).size).toBe(4)
    expect(githubSnapshot.repositories.some((item) => item.repo === 'OPC-TEST')).toBe(false)
    expect(githubSnapshot.repositories.some((item) => item.repo === 'duolinban-campus')).toBe(false)
    expect(publicProjects.find((item) => item.repo === 'duolinban-campus')).toMatchObject({ visibility: 'local', links: [] })
    expect(publicProjects.some((item) => item.repo === 'my-anime-rank')).toBe(false)
  })

  it('presents the Manchu project as an awarded model-training practice', () => {
    const manchu = publicProjects.find((item) => item.repo === 'manchu-degradation-simulator')
    expect(manchu?.highlight?.zh).toContain('北京市大学生创新创业大赛市级奖项')
    expect(manchu?.description.zh).toContain('模型训练')
    expect(manchu?.tags).toEqual(expect.arrayContaining(['Model Training', 'Data Augmentation']))
  })

  it('defines six anonymized capability groups with positive audited counts', () => {
    expect(capabilityGroups).toHaveLength(6)
    expect(capabilityGroups.every((group) => group.count > 0)).toBe(true)
    expect(capabilityGroups.reduce((sum, group) => sum + group.count, 0)).toBe(auditSummary.mappedProjectCount)
    expect(auditSummary.candidateCount).toBe(auditSummary.mappedProjectCount + auditSummary.excludedCount)
    expect(Object.values(auditSummary.guarantees).every(Boolean)).toBe(true)
  })
})
