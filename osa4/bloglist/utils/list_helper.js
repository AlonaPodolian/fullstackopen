const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counts = {}

  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  const author = Object.keys(counts).reduce((a, b) =>
    counts[a] >= counts[b] ? a : b
  )

  return {
    author: author,
    blogs: counts[author]
  }
}
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const counts = {}

blogs.forEach(blog => {
  counts[blog.author] = (counts[blog.author] || 0) + blog.likes
})
const author = Object.keys(counts).reduce((a, b) =>
  counts[a] >= counts[b] ? a : b
)
return {
  author: author,
  likes: counts[author]
}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}