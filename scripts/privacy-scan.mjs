import { promises as fs } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const cwd = process.cwd()
const roots = ['src', 'scripts', 'tests', 'e2e', 'public', 'dist', '.github', 'README.md', 'PUBLICATION_MANIFEST.md', 'package.json', 'playwright.config.ts', 'vite.config.ts']
const textExtensions = new Set(['.html', '.css', '.scss', '.js', '.mjs', '.cjs', '.py', '.ts', '.tsx', '.json', '.md', '.txt', '.xml', '.yml', '.yaml', '.svg'])
const findings = []
const blocklistPath = path.join(cwd, '.private', 'redaction-blocklist.txt')
let blocklist = []
try {
  blocklist = (await fs.readFile(blocklistPath, 'utf8')).split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
} catch { /* audit is optional during early local development */ }

const patterns = [
  { kind: 'mainland-phone', regex: /(?<!\d)1[3-9]\d{9}(?!\d)/g },
  { kind: 'private-ip', regex: /\b(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})\b/g },
  { kind: 'local-windows-path', regex: /\b[A-Za-z]:[\\/][^\s"'<>)]*/gi },
]

async function walk(target) {
  let stat
  try { stat = await fs.stat(target) } catch { return [] }
  if (stat.isFile()) return [target]
  const files = []
  for (const entry of await fs.readdir(target, { withFileTypes: true })) {
    if (['node_modules', '.git', '.private'].includes(entry.name)) continue
    files.push(...await walk(path.join(target, entry.name)))
  }
  return files
}

for (const root of roots) {
  for (const file of await walk(path.join(cwd, root))) {
    const extension = path.extname(file).toLowerCase()
    let content = ''
    if (extension === '.pdf') {
      const extracted = spawnSync('pdftotext', ['-enc', 'UTF-8', file, '-'], { encoding: 'utf8' })
      if (extracted.status !== 0) findings.push({ file, kind: 'pdf-unreadable' })
      content = extracted.stdout || ''
    } else if (textExtensions.has(extension) || path.basename(file).toLowerCase() === 'readme.md') {
      content = await fs.readFile(file, 'utf8')
    } else continue

    for (const { kind, regex } of patterns) {
      regex.lastIndex = 0
      if (regex.test(content)) findings.push({ file, kind })
    }
    const shouldScanPrivateTitles = ['src', 'public', 'dist', 'README.md', 'PUBLICATION_MANIFEST.md'].includes(root)
    const lowered = content.toLowerCase()
    if (shouldScanPrivateTitles) for (const forbidden of blocklist) {
      if (lowered.includes(forbidden.toLowerCase())) findings.push({ file, kind: 'local-project-title' })
    }
  }
}

if (findings.length) {
  console.error('Privacy scan failed:')
  for (const finding of findings) console.error(`- ${path.relative(cwd, finding.file)}: ${finding.kind}`)
  process.exit(1)
}
console.log(`Privacy scan passed across ${roots.join(', ')} with ${blocklist.length} local-title guards.`)
