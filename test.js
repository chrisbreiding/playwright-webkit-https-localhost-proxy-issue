const { expect } = require('@playwright/test')
const debugProxy = require('debugging-proxy')
const playwright = require('playwright')

;(async () => {
  const proxy = new debugProxy({ keepRequests: true })

  await proxy.start(8080)

  const browser = await playwright.webkit.launch({
    proxy: {
      server: 'http://localhost:8080',
    },
  })

  const context = await browser.newContext({ ignoreHTTPSErrors: true })
  const page = await context.newPage()

  try {
    await page.goto('https://localhost:3001')
    await expect(page.locator('h1')).toHaveText('Site Title')

    expect(proxy.getRequests()).toHaveLength(1)
    expect(proxy.getRequests()[0].url).toEqual('localhost:3001')
  } catch (err) {
    throw err
  } finally {
    await browser.close()
    await proxy.stop()
  }
})()
