import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import { Link, Routes, Route, useNavigate, useMatch } from 'react-router-dom'
import styled from 'styled-components'

const FormInput = styled.input`
  display: block;
  width: 250px;
  margin: 0.5rem 0 1rem;
  padding: 0.7rem;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 1rem;
`

const FormButton = styled.button`
  padding: 0.65rem 1.2rem;
  color: white;
  background-color: #1976d2;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    background-color: #1565c0;
  }
`
const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #1976d2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  strong {
    margin-right: auto;
    color: white;
    font-size: 1.2rem;
  }

  a {
    color: white;
    font-size: 0.9rem;
    text-decoration: none;
    text-transform: uppercase;
  }

  button {
    padding: 0.5rem 0.75rem;
    color: white;
    background: transparent;
    border: 1px solid white;
    border-radius: 4px;
    cursor: pointer;
    text-transform: uppercase;
  }

  a:hover,
  button:hover {
    text-decoration: underline;
  }
`

const Notification = styled.p`
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  color: ${props => props.$type === 'error' ? '#b71c1c' : '#1b5e20'};
  background-color: ${props => props.$type === 'error' ? '#ffebee' : '#e8f5e9'};
`

const App = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const blogMatch = useMatch('/blogs/:id')
  const selectedBlog = blogMatch
    ? blogs.find(blog => blog.id === blogMatch.params.id)
    : null
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBloglistUser',
        JSON.stringify(loggedUser)
      )
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      setErrorMessage('wrong username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject)
    const blogWithUser = { ...returnedBlog, user }
    setBlogs(blogs.concat(blogWithUser))

    setSuccessMessage(
      `A new blog "${returnedBlog.title}" by ${returnedBlog.author} was added`
    )
    setTimeout(() => setSuccessMessage(null), 5000)

    navigate('/')
  }

  const likeBlog = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    const blogToUpdate = {
      ...updatedBlog,
      user: blog.user?.id
    }

    await blogService.update(blog.id, blogToUpdate)

    setBlogs(blogs.map(currentBlog =>
      currentBlog.id === blog.id ? updatedBlog : currentBlog
    ))
  }

  const deleteBlog = async (blog) => {
    const confirmed = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`
    )

    if (!confirmed) return

    await blogService.remove(blog.id)

    setBlogs(blogs.filter(currentBlog => currentBlog.id !== blog.id))

    navigate('/')
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <FormInput
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <FormInput
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <FormButton type="submit">login</FormButton>
    </form>
  )

  const blogList = () => (
    <>
      <h2>blogs</h2>
      {user && <p>{user.name} logged in</p>}

      <ul>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map(blog => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title} by {blog.author}
              </Link>
            </li>
          ))}
      </ul>
    </>
  )

  const blogView = () => {
    if (!selectedBlog) {
      return null
    }

    return (
      <Blog
        blog={selectedBlog}
        likeBlog={likeBlog}
        deleteBlog={deleteBlog}
        currentUser={user}
      />
    )
  }

  return (
    <div>
      <Navigation>
        <strong>Blog App</strong>
        <Link to="/">blogs</Link>
        {user === null ? (
          <Link to="/login">login</Link>
        ) : (
          <>
            <Link to="/create">new blog</Link>
            <button onClick={handleLogout}>logout</button>
          </>
        )}
      </Navigation>

      {successMessage && (
        <Notification $type="success">{successMessage}</Notification>
      )}

      <Routes>
        <Route path="/" element={blogList()} />
        <Route path="/blogs/:id" element={blogView()} />
        <Route
          path="/create"
          element={<BlogForm createBlog={addBlog} />}
        />
        <Route
          path="/login"
          element={
            <>
              <h2>log in to application</h2>
              {errorMessage && (
                <Notification $type="error">{errorMessage}</Notification>
              )}
              {loginForm()}
            </>
          }
        />
      </Routes>
    </div>
  )

}

export default App