import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import { Link, Routes, Route, useNavigate, useMatch } from 'react-router-dom'

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
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
        password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogList = () => (
    <>
      <h2>blogs</h2>
      {user && <p>{user.name} logged in</p>}

      {successMessage && (
        <p style={{ color: 'green' }}>{successMessage}</p>
      )}

      <ul>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map(blog => (
            <li key={blog.id}>
              <Blog blog={blog} />
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
      <div>
        <h2>{selectedBlog.author}: {selectedBlog.title}</h2>
        <div>
          <a href={selectedBlog.url}>{selectedBlog.url}</a>
        </div>
        <div>{selectedBlog.likes} likes</div>

        {user && (
          <button onClick={() => likeBlog(selectedBlog)}>like</button>
        )}

        <div>Added by {selectedBlog.user?.name}</div>

        {user && selectedBlog.user?.username === user.username && (
          <button onClick={() => deleteBlog(selectedBlog)}>remove</button>
        )}
      </div>
    )
  }

  return (
    <div>
      <nav>
        <Link to="/">blogs</Link>{' '}
        {user === null ? (
          <Link to="/login">login</Link>
        ) : (
          <>
            <Link to="/create">new blog</Link>{' '}
            <button onClick={handleLogout}>logout</button>
          </>
        )}
      </nav>

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
                <p style={{ color: 'red' }}>{errorMessage}</p>
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