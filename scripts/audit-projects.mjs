import { promises as fs } from 'node:fs'
import path from 'node:path'

const cwd = process.cwd()
const todayInChina = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date())
const projectRoot = path.resolve(process.env.PORTFOLIO_PROJECT_ROOT || path.join(cwd, '..'))
const prototypeRoot = path.join(projectRoot, 'kimi')
const privateDir = path.join(cwd, '.private')
const summaryPath = path.join(cwd, 'src', 'content', 'audit-summary.json')
const publicRepos = new Set([
  'AI-Copilot-Writing-Platform',
  'Zuoyou-Anime-Club-2025-Annual-Summary',
  'manchu-degradation-simulator',
  'zuoyou_web',
  'duolinban-campus',
])

const sourceExtensions = new Set([
  '.py', '.ts', '.tsx', '.js', '.jsx', '.vue', '.java', '.kt', '.kts', '.go', '.rs', '.cs', '.cpp', '.c', '.html', '.css', '.scss', '.sql', '.ipynb',
])
const projectMarkers = new Set([
  'package.json', 'pyproject.toml', 'requirements.txt', 'pom.xml', 'build.gradle', 'build.gradle.kts', 'cargo.toml', 'dockerfile', 'vite.config.ts',
])
const initialSkips = [
  /^\./,
  /^作品集$/u,
  /(?:^|[._-])local-artifacts(?:$|[._-])/i,
  /^(?:results|saved_models|logger)$/i,
]

const groupDefinitions = [
  { id: 'agent-docs', terms: ['agent', 'langgraph', 'rag', 'docx', 'word', 'tender', 'report', 'knowledge', '文档', '知识', '标书', '报告'] },
  { id: 'data-gis', terms: ['gis', 'map', 'echarts', 'dashboard', 'visualization', '数据', '态势', '地图', '可视化', '监测'] },
  { id: 'cross-offline', terms: ['android', 'kotlin', 'compose', 'room', 'electron', 'offline', 'iexpress', '离线', '跨端'] },
  { id: 'science-visual', terms: ['ocr', 'opencv', 'torch', 'tensorflow', 'numpy', 'degradation', 'machine learning', '深度学习', '仿真', '模拟', '实验'] },
  { id: 'qa-delivery', terms: ['playwright', 'vitest', 'pytest', 'evidence', 'acceptance', 'test', '验收', '测试', '审计'] },
  { id: 'enterprise', terms: ['cms', 'workflow', 'portal', 'management', 'platform', '系统', '平台', '管理', '门户'] },
]

async function listDirectories(directory) {
  return (await fs.readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({ name: entry.name, fullPath: path.join(directory, entry.name) }))
}

async function collectCandidates() {
  const topLevel = (await listDirectories(projectRoot)).filter(({ name }) => !initialSkips.some((pattern) => pattern.test(name)))
  const nestedContainer = topLevel.find(({ name }) => name.toLowerCase() === 'kimi')
  if (!nestedContainer) return topLevel.filter(({ fullPath }) => path.resolve(fullPath) !== cwd)
  const nested = (await listDirectories(nestedContainer.fullPath)).filter(({ name }) => !initialSkips.some((pattern) => pattern.test(name)))
  return [...topLevel.filter(({ name }) => name !== nestedContainer.name), ...nested]
    .filter(({ fullPath }) => path.resolve(fullPath) !== cwd)
}

async function inventory(directory) {
  const files = []
  const queue = [directory]
  const ignored = new Set(['.git', 'node_modules', 'dist', 'build', '.gradle', '.venv', 'venv', '__pycache__', 'coverage', 'release', 'offline-package'])
  while (queue.length && files.length < 5000) {
    const current = queue.shift()
    let entries = []
    try { entries = await fs.readdir(current, { withFileTypes: true }) } catch { continue }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!ignored.has(entry.name.toLowerCase())) queue.push(path.join(current, entry.name))
      } else {
        files.push(path.relative(directory, path.join(current, entry.name)))
      }
    }
  }
  const sourceFiles = files.filter((file) => sourceExtensions.has(path.extname(file).toLowerCase()))
  const markers = files.filter((file) => projectMarkers.has(path.basename(file).toLowerCase()))
  const evidenceFiles = files.filter((file) => /(?:readme|test|spec|验收|说明)/i.test(file))
  return { files, sourceFiles, markers, evidenceFiles }
}

function normalizeDuplicateName(name) {
  return name
    .normalize('NFKC')
    .replace(/\(\d+\)$/u, '')
    .replace(/(?:[_-]?(?:release|backup|copy)|初版|备份|副本|版本\d*)$/iu, '')
    .replace(/(?<=\p{Script=Han})\d+$/u, '')
    .trim()
    .toLowerCase()
}

function selectGroup(name, inventoryData) {
  const normalizedName = name.toLowerCase()
  const fileSample = inventoryData.files.slice(0, 1200).join(' ').toLowerCase()
  const extensions = new Set(inventoryData.sourceFiles.map((file) => path.extname(file).toLowerCase()))
  if (/(?:验收|测试|audit|acceptance|evidence)/i.test(normalizedName)) return 'qa-delivery'
  if (/(?:android|offline|离线|跨端)/i.test(normalizedName) || extensions.has('.kt') || extensions.has('.kts')) return 'cross-offline'
  if (/(?:ocr|deep learning|machine learning|degradation|仿真|模拟|实验|模型)/i.test(normalizedName)) return 'science-visual'
  if (/(?:gis|地图|数据|监测|态势|可视化|仓储)/i.test(normalizedName)) return 'data-gis'
  if (/(?:agent|知识|文档|报告|标书|投标|语料|写作)/i.test(normalizedName)) return 'agent-docs'
  if (/(?:langgraph|rag|docx|python-docx)/i.test(fileSample)) return 'agent-docs'
  const haystack = `${normalizedName} ${fileSample}`
  let winner = { id: 'enterprise', score: 0 }
  for (const definition of groupDefinitions) {
    const score = definition.terms.reduce((total, term) => total + (haystack.includes(term.toLowerCase()) ? 1 : 0), 0)
    if (score > winner.score) winner = { id: definition.id, score }
  }
  return winner.id
}

const candidates = await collectCandidates()
const inspected = []
for (const candidate of candidates) inspected.push({ ...candidate, inventory: await inventory(candidate.fullPath) })

const duplicateWinners = new Map()
for (const item of inspected) {
  const key = normalizeDuplicateName(item.name)
  const weight = item.inventory.sourceFiles.length + item.inventory.markers.length * 20 + item.inventory.evidenceFiles.length * 2
  const previous = duplicateWinners.get(key)
  if (!previous || weight > previous.weight) duplicateWinners.set(key, { fullPath: item.fullPath, weight })
}

const decisions = inspected.map((item) => {
  const key = normalizeDuplicateName(item.name)
  const isDuplicate = duplicateWinners.get(key)?.fullPath !== item.fullPath
  const likelyThirdPartyStarter = /(?:-master|-main)$/i.test(item.name) && !publicRepos.has(item.name)
  const isUtilityFolder = /^(?:scripts|tools|examples?|docs?)$/i.test(item.name)
  const hasMaintainedSource = item.inventory.sourceFiles.length >= 3 || item.inventory.markers.length >= 1
  let status = 'mapped'
  let reason = 'maintained-source-or-complete-demo'
  if (isDuplicate) { status = 'excluded'; reason = 'duplicate-or-backup-version' }
  else if (likelyThirdPartyStarter) { status = 'excluded'; reason = 'third-party-starter-snapshot' }
  else if (isUtilityFolder) { status = 'excluded'; reason = 'utility-folder-not-a-project' }
  else if (!hasMaintainedSource) { status = 'excluded'; reason = 'no-maintainable-source-or-complete-demo' }
  return {
    name: item.name,
    path: item.fullPath,
    status,
    reason,
    group: status === 'mapped' ? selectGroup(item.name, item.inventory) : null,
    evidence: {
      sourceFiles: item.inventory.sourceFiles.length,
      projectMarkers: item.inventory.markers.length,
      testOrReadmeFiles: item.inventory.evidenceFiles.length,
    },
  }
})

const groupCounts = Object.fromEntries(groupDefinitions.map(({ id }) => [id, decisions.filter((item) => item.group === id).length]))
const mappedProjectCount = decisions.filter((item) => item.status === 'mapped').length
const excludedCount = decisions.length - mappedProjectCount
const prototypeSystems = decisions.filter((item) => item.status === 'mapped' && item.path.startsWith(`${prototypeRoot}${path.sep}`))
const prototypeBuildDates = new Map()
for (const item of prototypeSystems) {
  const metadata = await fs.stat(item.path)
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(metadata.birthtime)
  prototypeBuildDates.set(date, (prototypeBuildDates.get(date) || 0) + 1)
}
const prototypeActiveBuildDays = prototypeBuildDates.size
const prototypeDelivery = {
  qualifiedSystemCount: prototypeSystems.length,
  activeBuildDays: prototypeActiveBuildDays,
  oneOrTwoSystemDays: [...prototypeBuildDates.values()].filter((count) => count >= 1 && count <= 2).length,
  averagePerActiveDay: prototypeActiveBuildDays ? Number((prototypeSystems.length / prototypeActiveBuildDays).toFixed(2)) : 0,
  basis: 'Local source audit: maintained source or complete demo; duplicates, backups, empty folders, utilities, and build-only packages excluded.',
}
const summary = {
  schemaVersion: 1,
  auditedAt: todayInChina(),
  candidateCount: decisions.length,
  mappedProjectCount,
  excludedCount,
  groupCounts,
  prototypeDelivery,
  guarantees: {
    everyCandidateHasDisposition: decisions.every((item) => item.status && item.reason),
    everyMappedProjectHasGroup: decisions.filter((item) => item.status === 'mapped').every((item) => item.group),
    countsReconcile: Object.values(groupCounts).reduce((sum, value) => sum + value, 0) === mappedProjectCount,
  },
}

await fs.mkdir(privateDir, { recursive: true })
await fs.writeFile(path.join(privateDir, 'project-audit.json'), `${JSON.stringify({ ...summary, decisions }, null, 2)}\n`, 'utf8')
const genericNames = /^(?:app|web|backend|scripts|tools|docs|release|test|tests|demo|examples?)$/i
const genericTechnicalNames = /^(?:deep learning|machine learning|ocr|opc|mda|cms|tree|webnovel-writer)$/i
const blocklist = decisions
  .filter(({ name }) => {
    const lowered = name.toLowerCase()
    const overlapsPublicRepo = [...publicRepos].some((repo) => repo.toLowerCase().includes(lowered) || lowered.includes(repo.toLowerCase()))
    return !overlapsPublicRepo && !genericNames.test(name) && !genericTechnicalNames.test(name) && name.length >= 5
  })
  .map(({ name }) => name)
  .sort((a, b) => b.length - a.length)
await fs.writeFile(path.join(privateDir, 'redaction-blocklist.txt'), `${blocklist.join('\n')}\n`, 'utf8')
await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8')

console.log(`Audited ${summary.candidateCount} candidates: ${mappedProjectCount} mapped, ${excludedCount} excluded.`)
console.log(`Anonymous group counts: ${JSON.stringify(groupCounts)}`)
if (!Object.values(summary.guarantees).every(Boolean)) process.exitCode = 1
