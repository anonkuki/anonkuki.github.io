import { expect, test } from '@playwright/test'

test('home, language, public work, contact, and resume are reachable', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('让 AI 不止会回答')
  await expect(page.getByText('北京交通大学 · 人工智能专业 · 2027届')).toBeVisible()
  await expect(page.getByText('200亿+', { exact: true })).toBeVisible()
  await expect(page.locator('.featured-list').getByText('北京清研灵智', { exact: true })).toBeVisible()
  await expect(page.locator('.featured-list').getByText('北京科兴', { exact: true })).toBeVisible()
  await expect(page.getByTestId('public-project')).toHaveCount(4)
  await expect(page.locator('.scrapbook-stage')).toHaveCount(1)
  await expect(page.locator('.project-polaroid')).toHaveCount(4)
  await expect(page.getByText('多邻班 · AI 校园题库共创平台')).toBeVisible()
  await expect(page.getByText('佐佑动漫社 · 双站作品集')).toBeVisible()
  for (const card of await page.getByTestId('public-project').all()) await card.scrollIntoViewIfNeeded()
  const covers = page.locator('.project-visual img')
  await expect(covers).toHaveCount(5)
  for (const cover of await covers.all()) await expect.poll(() => cover.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  const companyMarks = page.locator('.company-brand img')
  await expect(companyMarks).toHaveCount(4)
  for (const mark of await companyMarks.all()) {
    await mark.scrollIntoViewIfNeeded()
    await expect.poll(() => mark.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  }
  await expect(page.locator('.case-blueprint-mini .blueprint-runner')).toHaveCount(2)
  await expect(page.getByText(/★/)).toHaveCount(0)
  await expect(page.getByRole('link', { name: /在线演示/ })).toHaveCount(1)
  const emailCopy = page.getByRole('button', { name: /邮箱.*gujianleng@gmail\.com.*点击复制/ })
  await expect(emailCopy).toBeVisible()
  await emailCopy.click()
  await expect(page.getByText('邮箱已复制')).toBeVisible()
  await expect(page.getByRole('button', { name: /电话.*17808200776.*点击复制/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /微信.*ace123456787.*点击复制/ })).toBeVisible()
  await expect(page.locator('.scroll-companion')).toHaveCount(0)

  const zhResume = page.getByRole('link', { name: /下载简历/ })
  await expect(zhResume).toHaveAttribute('href', '/resume/lenggujian-resume.pdf')
  await page.getByRole('button', { name: 'Switch to English' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('AI should do more than answer')
  await expect(page.getByText('20B+', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: /Download resume/ })).toHaveAttribute('href', '/resume/lenggujian-resume.pdf')

})

test('both internship flagship routes load and the tender demo completes deterministically', async ({ page }) => {
  const slugs = ['tender-agent-harness', 'regulated-report-agent']
  for (const slug of slugs) {
    await page.goto(`/#/work/${slug}`)
    await expect(page.getByLabel(/交互式虚拟演示|Interactive synthetic demo/)).toBeVisible()
    await expect(page.locator('.case-reference-board')).toBeVisible()
    await expect(page.locator('.case-polaroid')).toHaveCount(2)
    const companyMark = page.locator('.case-engagement-detail .company-brand img')
    await expect(companyMark).toHaveCount(1)
    await expect.poll(() => companyMark.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  }

  await page.goto('/#/work/tender-agent-harness')
  await page.getByRole('button', { name: '运行虚拟流程' }).click()
  for (let step = 0; step < 7; step += 1) {
    const advance = page.getByRole('button', { name: '推进一步' })
    if (await advance.isVisible()) await advance.click()
  }
  await expect(page.getByText('可交付', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '重置' }).click()
  await expect(page.getByText('等待运行', { exact: true })).toBeVisible()
})

test('both collage case entries remain clickable above overlapping sheets', async ({ page }) => {
  const entries = [
    ['投标文档 Agent Harness - 查看案例', '#/work/tender-agent-harness'],
    ['注册材料报告 Agent - 查看案例', '#/work/regulated-report-agent'],
  ]
  for (const [name, route] of entries) {
    await page.goto('/')
    const entry = page.getByRole('link', { name, exact: true })
    await entry.scrollIntoViewIfNeeded()
    await entry.click()
    await expect(page).toHaveURL(new RegExp(`${route}$`))
  }
})

test('mobile menu opens and reaches the atlas section', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'))
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('navigation')).toHaveClass(/is-open/)
  await page.getByRole('button', { name: '能力图谱' }).click()
  await expect(page.locator('#atlas')).toBeInViewport()
})

test('mobile first screen exposes the primary portfolio action', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'))
  await page.goto('/')
  await expect(page.getByRole('button', { name: '查看精选作品' })).toBeInViewport()
})
