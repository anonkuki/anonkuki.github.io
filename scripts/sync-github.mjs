import { promises as fs } from 'node:fs'
import path from 'node:path'

const repositories = [
  { owner: 'anonkuki', repo: 'AI-Copilot-Writing-Platform' },
  { owner: 'anonkuki', repo: 'Zuoyou-Anime-Club-2025-Annual-Summary' },
  { owner: 'anonkuki', repo: 'zuoyou_web' },
  { owner: 'anonkuki', repo: 'manchu-degradation-simulator' },
]
const todayInChina = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date())

const results = []
for (const { owner, repo } of repositories) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'lenggujian-portfolio-sync' },
  })
  if (!response.ok) throw new Error(`GitHub metadata request failed for ${repo}: ${response.status}`)
  const data = await response.json()
  results.push({
    owner,
    repo,
    description: data.description || '',
    language: data.language || 'Mixed',
    url: data.html_url,
    demoUrl: data.homepage || undefined,
    verifiedAt: todayInChina(),
  })
}

const output = path.join(process.cwd(), 'src', 'content', 'github-snapshot.json')
await fs.writeFile(output, `${JSON.stringify({ schemaVersion: 2, repositories: results }, null, 2)}\n`, 'utf8')
console.log(`Synced ${results.length} public repositories to a build-time snapshot.`)
