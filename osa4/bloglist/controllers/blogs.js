const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, url } = request.body
  const token = request.token

  if (!token) {
  return response.status(401).json({
    error: 'token missing'
  })
}

let decodedToken

try {
  decodedToken = jwt.verify(token, process.env.SECRET)
} catch (error) {
  return response.status(401).json({
    error: 'invalid token'
  })
}

if (!decodedToken.id) {
  return response.status(401).json({
    error: 'token invalid'
  })
}

  if (!title || !url) {
    return response.status(400).json({
      error: 'title or url missing'
    })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
  return response.status(401).json({
    error: 'user not found'
  })
}

  const blog = new Blog({
  ...request.body,
  user: user._id
})

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({
      error: 'blog not found'
    })
  }

  if (!request.token) {
    return response.status(401).json({
      error: 'token missing'
    })
  }

  let decodedToken

  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  if (
    !decodedToken.id ||
    !blog.user ||
    blog.user.toString() !== decodedToken.id.toString()
  ) {
    return response.status(403).json({
      error: 'only the creator can delete this blog'
    })
  }

  await Blog.findByIdAndDelete(request.params.id)
  return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { returnDocument: 'after', runValidators: true }
  )

  if (!updatedBlog) {
    return response.status(404).end()
  }

  response.json(updatedBlog)
})

module.exports = blogsRouter