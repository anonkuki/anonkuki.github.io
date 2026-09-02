/// <reference types="node" />

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const approvedResumeSha256 = 'F39BACDC4AF98CD19420EB1A25FBD0EAAAE105F036B8F4F35016F3989347CE01'
const approvedCoverSha256 = [
  '81FD204817DF57AE825AAB2056376D61E78ACC7558D934360EBDA021564F9676',
  '9E512EA446B01070F91D811542991DDE1EA3971902081CD02E0EC4DEE38841EC',
  'FB9F0B044A716BB79546B7B829326990F10C1CFBF365A628720703633B71C2B4',
  '649DCC438ED3DC78DC7AA4A849E40778A76EC8C0B788432578E0518D07C18B65',
  'E9E2FD4A72E029E0985BFBB4A188A85DDC794D20618EB912BF4569070356DB32',
]

describe('public release contract', () => {
  it('keeps the skip link off-canvas until keyboard focus', async () => {
    const css = await readFile(path.join(root, 'src', 'styles.css'), 'utf8')
    expect(css).toMatch(/\.skip-link\s*\{[^}]*translateY\(-200%\)/s)
    expect(css).toMatch(/\.skip-link:focus\s*\{[^}]*translateY\(0\)/s)
  })

  it('keeps the capability-atlas introduction below its heading', async () => {
    const css = await readFile(path.join(root, 'src', 'styles.css'), 'utf8')
    expect(css).toMatch(/\.atlas-section \.section-intro\s*\{[^}]*margin:\s*0 0 58px 70px/s)
  })

  it('does not render the retired right-side scroll guide', async () => {
    const home = await readFile(path.join(root, 'src', 'pages', 'HomePage.tsx'), 'utf8')
    const css = await readFile(path.join(root, 'src', 'styles.css'), 'utf8')
    expect(home).not.toContain('ScrollCompanion')
    expect(css).not.toContain('.scroll-companion')
  })

  it('keeps decorative motion on compositor-friendly properties', async () => {
    const css = await readFile(path.join(root, 'src', 'styles.css'), 'utf8')
    expect(css).not.toMatch(/@keyframes\s+blueprint-dash/)
    expect(css).not.toMatch(/stroke-dashoffset/)
  })

  it('adds progressive motion with a complete reduced-motion escape hatch', async () => {
    const css = await readFile(path.join(root, 'src', 'styles.css'), 'utf8')
    expect(css).toContain('offset-path:')
    expect(css).toContain('animation-timeline: view()')
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce[\s\S]*\.blueprint-runner\s*\{[^}]*display:\s*none/)
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce[\s\S]*\.portrait-frame\s*\{[^}]*transform:\s*none/)
  })

  it('prioritizes first-screen content and defers below-fold layout work', async () => {
    const app = await readFile(path.join(root, 'src', 'App.tsx'), 'utf8')
    const css = await readFile(path.join(root, 'src', 'styles.css'), 'utf8')
    expect(app).not.toContain('IntroOverlay')
    expect(css).toMatch(/content-visibility:\s*auto/)
    expect(css).toMatch(/contain-intrinsic-size:/)
  })

  it('uses a clean build so GitHub Pages cannot accumulate stale hash assets', async () => {
    const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')) as { scripts: Record<string, string> }
    const cleanScript = await readFile(path.join(root, 'scripts', 'clean-dist.mjs'), 'utf8')
    expect(packageJson.scripts.prebuild).toBe('node scripts/clean-dist.mjs')
    expect(cleanScript).toContain("rm(dist, { recursive: true, force: true })")
  })

  it('isolates acceptance from unrelated localhost services instead of reusing a foreign server', async () => {
    const playwrightConfig = await readFile(path.join(root, 'playwright.config.ts'), 'utf8')
    expect(playwrightConfig).toContain("process.env.PORTFOLIO_E2E_PORT ?? '4317'")
    expect(playwrightConfig).toContain('reuseExistingServer: false')
  })

  it('pins the approved resume exception to the uploaded PDF hash', async () => {
    const scanner = await readFile(path.join(root, 'scripts', 'privacy-scan.mjs'), 'utf8')
    expect(scanner).toContain(approvedResumeSha256)
    expect(scanner).toContain('createHash')
  })

  it('allows only the explicitly approved public phone number', async () => {
    const scanner = await readFile(path.join(root, 'scripts', 'privacy-scan.mjs'), 'utf8')
    expect(scanner).toContain("const approvedPublicPhones = new Set(['17808200776'])")
    expect(scanner).toContain('approvedPublicPhones')
  })

  it('allows only the explicitly approved local project brand through title redaction', async () => {
    const scanner = await readFile(path.join(root, 'scripts', 'privacy-scan.mjs'), 'utf8')
    expect(scanner).toContain('approvedPublicTitles')
    expect(scanner).toContain("'duolinban-campus'")
    expect(scanner).toContain("'duolinban'")
  })

  it('pins every reviewed project cover to an approved media hash', async () => {
    const scanner = await readFile(path.join(root, 'scripts', 'privacy-scan.mjs'), 'utf8')
    expect(scanner).toContain('approvedPublicMediaSha256')
    expect(scanner).toContain('unapproved-public-media')
    for (const hash of approvedCoverSha256) expect(scanner).toContain(hash)
  })
})
