import { readFile } from 'node:fs/promises'
import path from 'node:path'

const snapshot = JSON.parse(await readFile(path.join(process.cwd(), 'src', 'content', 'github-snapshot.json'), 'utf8'))
const localBase = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4173'
const urls = new Set([
  localBase,
  `${localBase}/resume/lenggujian-resume.pdf`,
  `${localBase}/robots.txt`,
  'https://anonkuki.github.io/Zuoyou-Anime-Club-2025-Annual-Summary/',
  'http://62.234.83.174:8080/',
])

const failures = []
for (const item of snapshot.repositories) {
  const expected = `https://github.com/${item.owner}/${item.repo}`
  if (item.url !== expected || !item.verifiedAt) failures.push(`${expected} -> invalid build-time API snapshot`)
  else console.log(`SNAPSHOT ${item.verifiedAt} ${item.url}`)
}
if (snapshot.repositories.length !== 4 || snapshot.repositories.some((item) => item.repo === 'OPC-TEST')) failures.push('https://github.com -> incomplete approved repository snapshot')
else console.log('SNAPSHOT confirmed through four approved public repository API responses')
for (const url of urls) {
  try {
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15_000), headers: { 'User-Agent': 'lenggujian-portfolio-link-check' } })
    if (!response.ok) failures.push(`${url} -> ${response.status}`)
    else console.log(`OK ${response.status} ${url}`)
  } catch (error) {
    failures.push(`${url} -> ${error instanceof Error ? error.message : 'request failed'}`)
  }
}

if (failures.length) {
  console.error(`Broken links (${failures.length}):\n${failures.join('\n')}`)
  process.exit(1)
}
console.log(`Checked ${urls.size} live links and ${snapshot.repositories.length} GitHub API-snapshot links.`)
