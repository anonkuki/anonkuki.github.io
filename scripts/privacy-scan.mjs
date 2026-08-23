import { promises as fs } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const cwd = process.cwd()
const roots = ['src', 'scripts', 'tests', 'e2e', 'public', 'dist', '.github', 'README.md', 'PUBLICATION_MANIFEST.md', 'package.json', 'playwright.config.ts', 'vite.config.ts']
const textExtensions = new Set(['.html', '.css', '.scss', '.js', '.mjs', '.cjs', '.py', '.ts', '.tsx', '.json', '.md', '.txt', '.xml', '.yml', '.yaml', '.svg'])
const rasterExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp'])
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
const approvedPublicTitles = new Set(['duolinban-campus', 'duolinban'])
// Each hash binds an image that has been manually reviewed for visible content and metadata.
// Re-exporting, replacing, or adding public media must trigger a fresh review and hash update.
const approvedPublicMediaSha256 = new Map([
  ['avatar-line.webp', '5DFBA82B0568F60CA5F87708203234F290D96E075C4EE83CBE1113F7F81F82B1'],
  ['project-covers/ai-writing.webp', '81FD204817DF57AE825AAB2056376D61E78ACC7558D934360EBDA021564F9676'],
  ['project-covers/club-guild.webp', '9E512EA446B01070F91D811542991DDE1EA3971902081CD02E0EC4DEE38841EC'],
  ['project-covers/club-space.webp', 'FB9F0B044A716BB79546B7B829326990F10C1CFBF365A628720703633B71C2B4'],
  ['project-covers/duolinban.webp', '649DCC438ED3DC78DC7AA4A849E40778A76EC8C0B788432578E0518D07C18B65'],
  ['project-covers/manchu.webp', 'E9E2FD4A72E029E0985BFBB4A188A85DDC794D20618EB912BF4569070356DB32'],
])
const approvedResumeSha256 = 'F39BACDC4AF98CD19420EB1A25FBD0EAAAE105F036B8F4F35016F3989347CE01'
const approvedResumeRelative = path.join('resume', 'lenggujian-resume.pdf')
const approvedResumeCandidates = [
  { file: path.join(cwd, 'public', approvedResumeRelative), required: true },
  { file: path.join(cwd, 'dist', approvedResumeRelative), required: false },
]
const authenticApprovedResumes = new Set()
for (const candidate of approvedResumeCandidates) {
  try {
    const bytes = await fs.readFile(candidate.file)
    const actual = createHash('sha256').update(bytes).digest('hex').toUpperCase()
    if (actual === approvedResumeSha256) authenticApprovedResumes.add(path.resolve(candidate.file).toLowerCase())
    else findings.push({ file: candidate.file, kind: 'approved-resume-hash-mismatch' })
  } catch {
    if (candidate.required) findings.push({ file: candidate.file, kind: 'approved-resume-missing' })
  }
}
const isApprovedResume = (file) => authenticApprovedResumes.has(path.resolve(file).toLowerCase())

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
    if (['public', 'dist'].includes(root) && rasterExtensions.has(extension)) {
      const relativeMediaPath = path.relative(path.join(cwd, root), file).split(path.sep).join('/')
      const expected = approvedPublicMediaSha256.get(relativeMediaPath)
      if (!expected) findings.push({ file, kind: 'unapproved-public-media' })
      else {
        const actual = createHash('sha256').update(await fs.readFile(file)).digest('hex').toUpperCase()
        if (actual !== expected) findings.push({ file, kind: 'approved-public-media-hash-mismatch' })
      }
      continue
    }
    let content = ''
    if (extension === '.pdf') {
      const extracted = spawnSync('pdftotext', ['-enc', 'UTF-8', file, '-'], { encoding: 'utf8' })
      if (extracted.status !== 0) findings.push({ file, kind: 'pdf-unreadable' })
      content = extracted.stdout || ''
    } else if (textExtensions.has(extension) || path.basename(file).toLowerCase() === 'readme.md') {
      content = await fs.readFile(file, 'utf8')
    } else continue

    for (const { kind, regex } of patterns) {
      if (kind === 'mainland-phone' && isApprovedResume(file)) continue
      regex.lastIndex = 0
      if (regex.test(content)) findings.push({ file, kind })
    }
    const shouldScanPrivateTitles = ['src', 'public', 'dist', 'README.md', 'PUBLICATION_MANIFEST.md'].includes(root)
    const lowered = content.toLowerCase()
    if (shouldScanPrivateTitles) for (const forbidden of blocklist) {
      if (approvedPublicTitles.has(forbidden.toLowerCase())) continue
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
