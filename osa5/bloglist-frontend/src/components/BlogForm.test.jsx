import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls createBlog with the correct details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByLabelText('title'), 'Testing blog')
  await user.type(screen.getByLabelText('author'), 'Alona')
  await user.type(
    screen.getByLabelText('url'),
    'https://example.com/testing-blog'
  )

  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing blog',
    author: 'Alona',
    url: 'https://example.com/testing-blog'
  })
})