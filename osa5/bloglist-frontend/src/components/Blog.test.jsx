import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'Frontend testing blog',
  author: 'Alona',
  url: 'https://example.com/frontend-testing',
  likes: 5,
  user: {
    name: 'Alona',
    username: 'alona'
  }
}

test('a logged-out user sees blog details but no buttons', () => {
  render(<Blog blog={blog} currentUser={null} />)

  expect(
    screen.getByRole('heading', { name: 'Alona: Frontend testing blog' })
  ).toBeDefined()
  expect(screen.getByText(blog.url)).toBeDefined()
  expect(screen.getByText('5 likes')).toBeDefined()
  expect(screen.getByText('Added by Alona')).toBeDefined()

  expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('a logged-in user who did not add the blog sees only the like button', () => {
  const currentUser = {
    name: 'Another User',
    username: 'another'
  }

  render(
    <Blog
      blog={blog}
      currentUser={currentUser}
      likeBlog={vi.fn()}
      deleteBlog={vi.fn()}
    />
  )

  expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('the user who added the blog sees like and remove buttons', () => {
  const currentUser = {
    name: 'Alona',
    username: 'alona'
  }

  render(
    <Blog
      blog={blog}
      currentUser={currentUser}
      likeBlog={vi.fn()}
      deleteBlog={vi.fn()}
    />
  )

  expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
  expect(screen.getByRole('button', { name: 'remove' })).toBeDefined()
})