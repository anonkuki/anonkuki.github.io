import { expect, test } from '@playwright/test'

test('home, language, public work, contact, and resume are reachable', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('把复杂行业流程')
  await expect(page.getByTestId('public-project')).toHaveCount(5)
  await expect(page.getByRole('link', { name: /在线演示/ })).toHaveCount(1)
  await expect(page.getByRole('link', { name: /gujianleng@gmail.com/ })).toHaveAttribute('href', 'mailto:gujianleng@gmail.com')

  const zhResume = page.getByRole('link', { name: /下载简历/ })
  await expect(zhResume).toHaveAttribute('href', '/resume/lenggujian-resume.pdf')
  await page.getByRole('button', { name: 'Switch to English' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('traceable, shippable AI systems')
  await expect(page.getByRole('link', { name: /Download resume/ })).toHaveAttribute('href', '/resume/lenggujian-resume.pdf')

})

test('all flagship routes load and the tender demo completes deterministically', async ({ page }) => {
  const slugs = ['tender-agent-harness', 'regulated-report-agent', 'cross-platform-field-suite']
  for (const slug of slugs) {
    await page.goto(`/#/work/${slug}`)
    await expect(page.getByLabel(/交互式虚拟演示|Interactive synthetic demo/)).toBeVisible()
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

test('mobile menu opens and reaches the atlas section', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'))
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('navigation')).toHaveClass(/is-open/)
  await page.getByRole('button', { name: '能力图谱' }).click()
  await expect(page.locator('#atlas')).toBeInViewport()
})
