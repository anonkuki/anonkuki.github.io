/// <reference types="node" />

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const approvedResumeSha256 = 'F39BACDC4AF98CD19420EB1A25FBD0EAAAE105F036B8F4F35016F3989347CE01'

describe('public release contract', () => {
  it('keeps the skip link off-canvas until keyboard focus', async () => {
    const css = await readFile(path.join(root, 'src', 'styles.css'), 'utf8')
    expect(css).toMatch(/\.skip-link\s*\{[^}]*translateY\(-200%\)/s)
    expect(css).toMatch(/\.skip-link:focus\s*\{[^}]*translateY\(0\)/s)
  })

  it('pins the approved resume exception to the uploaded PDF hash', async () => {
    const scanner = await readFile(path.join(root, 'scripts', 'privacy-scan.mjs'), 'utf8')
    expect(scanner).toContain(approvedResumeSha256)
    expect(scanner).toContain('createHash')
  })
})
