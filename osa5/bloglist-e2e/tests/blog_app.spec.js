const { test, expect, beforeEach, describe } = require('@playwright/test')

const login = async (page, password = 'salainen') => {
  await page.getByRole('link', { name: 'login' }).click()
  await page.getByLabel('username').fill('mluukkai')
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill('Alona')
  await page.getByLabel('url').fill('https://example.com/blog')
  await page.getByRole('button', { name: 'create' }).click()
}

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

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page)

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'wrong')

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page)
    })

    test('a blog can be created', async ({ page }) => {
      const title = 'Playwright E2E blog'

      await createBlog(page, title)

      await expect(
        page.getByRole('link', { name: `${title} by Alona` })
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      const title = 'Playwright like test'

      await createBlog(page, title)
      await page.getByRole('link', { name: `${title} by Alona` }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('1 likes')).toBeVisible()
    })

    test('a blog can be deleted by its creator', async ({ page }) => {
      const title = 'Playwright delete test'

      await createBlog(page, title)
      await page.getByRole('link', { name: `${title} by Alona` }).click()

      page.once('dialog', async dialog => {
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'remove' }).click()
      await page.getByRole('link', { name: 'blogs' }).click()

      await expect(
        page.getByRole('link', { name: `${title} by Alona` })
      ).toHaveCount(0)
    })
  })
})