import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [newBlog, setNewBlog] = useState({
  title: '',
  author: '',
  url: ''
})
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
    setUsername('')
    setPassword('')
  } catch {
    setErrorMessage('wrong username or password')
    setTimeout(() => setErrorMessage(null), 5000)
  }
}

const handleLogout = () => {
  window.localStorage.removeItem('loggedBloglistUser')
  setUser(null)
}

const handleBlogChange = (event) => {
  setNewBlog({
    ...newBlog,
    [event.target.name]: event.target.value
  })
}

const addBlog = async (event) => {
  event.preventDefault()

  const returnedBlog = await blogService.create(newBlog)
  setBlogs(blogs.concat(returnedBlog))

  setSuccessMessage(
   `A new blog "${returnedBlog.title}" by ${returnedBlog.author} was added`
  )
  setTimeout(() => setSuccessMessage(null), 5000)

  setNewBlog({
    title: '',
    author: '',
    url: ''
  })

  setBlogFormVisible(false)
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

const blogForm = () => (
  <form onSubmit={addBlog}>
    <div>
      <label>
        title
        <input
          name="title"
          value={newBlog.title}
          onChange={handleBlogChange}
        />
      </label>
    </div>
    <div>
      <label>
        author
        <input
          name="author"
          value={newBlog.author}
          onChange={handleBlogChange}
        />
      </label>
    </div>
    <div>
      <label>
        url
        <input
          name="url"
          value={newBlog.url}
          onChange={handleBlogChange}
        />
      </label>
    </div>
    <button type="submit">create</button>
  </form>
)

  return (
  <div>
    {user === null ? (
      <>
        <h2>log in to application</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {loginForm()}
      </>
    ) : (
      <>
        <h2>blogs</h2>
        {successMessage && (
         <p style={{ color: 'green' }}>{successMessage}</p>
        )}
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>logout</button>
                {blogFormVisible ? (
          <>
            <h3>Add a blog</h3>
            {blogForm()}
            <button onClick={() => setBlogFormVisible(false)}>cancel</button>
          </>
        ) : (
          <button onClick={() => setBlogFormVisible(true)}>create new blog</button>
        )}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </>
    )}
  </div>
)

}

export default App