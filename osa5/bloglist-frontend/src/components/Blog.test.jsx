import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders blog title and author, but hides details by default', () => {
  const blog = {
    title: 'Frontend testing blog',
    author: 'Alona',
    url: 'https://example.com/frontend-testing',
    likes: 5,
    user: { name: 'Alona' }
  }

  render(<Blog blog={blog} />)

  expect(screen.getByText('Frontend testing blog Alona')).toBeDefined()
  expect(screen.queryByText(blog.url)).toBeNull()
  expect(screen.queryByText('5 likes')).toBeNull()
})

test('shows blog details after clicking view', async () => {
  const blog = {
    title: 'Frontend testing blog',
    author: 'Alona',
    url: 'https://example.com/frontend-testing',
    likes: 5,
    user: { name: 'Alona' }
  }

  const user = userEvent.setup()
  render(<Blog blog={blog} />)

  await user.click(screen.getByText('view'))

  expect(screen.getByText(blog.url)).toBeDefined()
  expect(screen.getByText('5 likes')).toBeDefined()
  expect(screen.getByText(blog.user.name)).toBeDefined()
})