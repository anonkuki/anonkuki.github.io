import { chromium } from '@playwright/test'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const output = path.resolve(process.env.PORTFOLIO_VISUAL_DIR || path.join(process.cwd(), '.private', 'visual-qa'))
const baseURL = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4173'
await fs.mkdir(output, { recursive: true })

const browser = await chromium.launch({ channel: 'msedge' })
const profiles = [
  { name: 'desktop-1440x900', viewport: { width: 1440, height: 900 } },
  { name: 'mobile-390x844', viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 },
  { name: 'tablet-768x1024', viewport: { width: 768, height: 1024 }, isMobile: true, deviceScaleFactor: 1 },
  { name: 'reduced-motion-1440x900', viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' },
]

for (const profile of profiles) {
  const context = await browser.newContext({ viewport: profile.viewport, isMobile: profile.isMobile, deviceScaleFactor: profile.deviceScaleFactor, reducedMotion: profile.reducedMotion })
  const page = await context.newPage()
  await page.goto(baseURL, { waitUntil: 'networkidle' })
  if (profile.name === 'desktop-1440x900') await page.screenshot({ path: path.join(output, 'intro-1440x900.png'), fullPage: false })
  await page.locator('.intro-overlay').waitFor({ state: 'detached', timeout: 3_000 }).catch(() => {})
  await page.screenshot({ path: path.join(output, `${profile.name}.png`), fullPage: false })
  if (profile.name === 'desktop-1440x900') {
    await page.evaluate(async () => {
      for (let top = 0; top < document.documentElement.scrollHeight; top += window.innerHeight * 0.8) {
        window.scrollTo({ top, behavior: 'instant' })
        await new Promise((resolve) => window.setTimeout(resolve, 40))
      }
      window.scrollTo({ top: 0, behavior: 'instant' })
    })
    await page.screenshot({ path: path.join(output, 'desktop-full-page.png'), fullPage: true })
  }
  await context.close()
}
await browser.close()
console.log(`Captured ${profiles.length + 2} visual QA screenshots in ${output}`)
