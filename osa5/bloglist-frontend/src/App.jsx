import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'

const App = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)

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
      navigate('/')
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
  }

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject)
    const blogWithUser = { ...returnedBlog, user }
    setBlogs(blogs.concat(blogWithUser))

    setSuccessMessage(
      `A new blog "${returnedBlog.title}" by ${returnedBlog.author} was added`
    )
    setTimeout(() => setSuccessMessage(null), 5000)

    setBlogFormVisible(false)
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

      {user && (
        blogFormVisible ? (
          <>
            <BlogForm createBlog={addBlog} />
            <button onClick={() => setBlogFormVisible(false)}>cancel</button>
          </>
        ) : (
          <button onClick={() => setBlogFormVisible(true)}>
            create new blog
          </button>
        )
      )}

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={likeBlog}
            deleteBlog={deleteBlog}
            currentUser={user}
          />
        ))}
    </>
  )

  return (
    <div>
      <nav>
        <Link to="/">blogs</Link>{' '}
        {user === null ? (
          <Link to="/login">login</Link>
        ) : (
          <button onClick={handleLogout}>logout</button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={blogList()} />
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