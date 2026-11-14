const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
  })

  describe('Login', () => {
  test('succeeds with correct credentials', async ({ page }) => {
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('fails with wrong credentials', async ({ page }) => {
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('wrong username or password')).toBeVisible()
  })
})
 describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
  })

  test('a new blog can be created', async ({ page }) => {
    await page.getByRole('button', { name: 'create new blog' }).click()

    await page.getByLabel('title').fill('Playwright E2E blog')
    await page.getByLabel('author').fill('Alona')
    await page.getByLabel('url').fill('https://example.com/playwright-e2e-blog')

    await page.getByRole('button', { name: 'create' }).click()

    await expect(page.getByText('Playwright E2E blog Alona')).toBeVisible()
  })

  test('a blog can be liked', async ({ page }) => {
  await page.getByRole('button', { name: 'create new blog' }).click()

  await page.getByLabel('title').fill('Playwright like test')
  await page.getByLabel('author').fill('Alona')
  await page.getByLabel('url').fill('https://example.com/playwright-like-test')

  await page.getByRole('button', { name: 'create' }).click()
  await page.getByRole('button', { name: 'view' }).click()
  await page.getByRole('button', { name: 'like' }).click()

  await expect(page.getByText('1 likes')).toBeVisible()
  })

  test('a blog can be deleted by its creator', async ({ page }) => {
  await page.getByRole('button', { name: 'create new blog' }).click()

  await page.getByLabel('title').fill('Playwright delete test')
  await page.getByLabel('author').fill('Alona')
  await page.getByLabel('url').fill('https://example.com/playwright-delete-test')

  await page.getByRole('button', { name: 'create' }).click()
  await page.getByRole('button', { name: 'view' }).click()

  await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

  page.once('dialog', async dialog => {
    await dialog.accept()
  })

  await page.getByRole('button', { name: 'remove' }).click()

  await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
})

  test('only the creator can see the remove button', async ({ page, request }) => {
  await page.getByRole('button', { name: 'create new blog' }).click()

  await page.getByLabel('title').fill('Playwright ownership test')
  await page.getByLabel('author').fill('Alona')
  await page.getByLabel('url').fill('https://example.com/playwright-ownership-test')

  await page.getByRole('button', { name: 'create' }).click()
  await page.getByRole('button', { name: 'logout' }).click()

  await request.post('http://localhost:3003/api/users', {
    data: {
      name: 'Another User',
      username: 'anotheruser',
      password: 'password'
    }
  })

  await page.getByLabel('username').fill('anotheruser')
  await page.getByLabel('password').fill('password')
  await page.getByRole('button', { name: 'login' }).click()

  await page.getByRole('button', { name: 'view' }).click()
  await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
})
})
})