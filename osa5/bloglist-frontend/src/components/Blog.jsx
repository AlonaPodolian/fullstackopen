import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog, currentUser }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(!detailsVisible)}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>

      {detailsVisible && (
        <div>
          <div>{blog.url}</div>
          <div>{blog.likes} likes</div>
          <button onClick={() => likeBlog(blog)}>like</button>
          <div>{blog.user?.name}</div>

          {currentUser && blog.user?.username === currentUser.username && (
            <button onClick={() => deleteBlog(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog