const Blog = ({ blog, likeBlog, deleteBlog, currentUser }) => (
  <div>
    <h2>{blog.author}: {blog.title}</h2>
    <div>
      <a href={blog.url}>{blog.url}</a>
    </div>
    <div>{blog.likes} likes</div>

    {currentUser && (
      <button onClick={() => likeBlog(blog)}>like</button>
    )}

    <div>Added by {blog.user?.name}</div>

    {currentUser && blog.user?.username === currentUser.username && (
      <button onClick={() => deleteBlog(blog)}>remove</button>
    )}
  </div>
)

export default Blog