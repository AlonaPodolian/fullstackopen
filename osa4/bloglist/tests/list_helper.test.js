const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const blogs = []

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 0)
  })
  test('when list has only one blog equals the likes of that', () => {
  const blogs = [
    {
      title: 'My first blog',
      author: 'Alona',
      url: 'https://example.com',
      likes: 5
    }
  ]

  const result = listHelper.totalLikes(blogs)
  assert.strictEqual(result, 5)
})
test('of a bigger list is calculated right', () => {
  const blogs = [
    { title: 'First blog', likes: 5 },
    { title: 'Second blog', likes: 10 },
    { title: 'Third blog', likes: 3 }
  ]

  const result = listHelper.totalLikes(blogs)
  assert.strictEqual(result, 18)
})
})

describe('favorite blog', () => {
  test('when list has only one blog, returns that blog', () => {
    const blogs = [
      {
        title: 'My first blog',
        author: 'Alona',
        url: 'https://example.com',
        likes: 5
      }
    ]

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[0])
  })
  test('returns the blog with most likes', () => {
  const blogs = [
    { title: 'First blog', likes: 5 },
    { title: 'Second blog', likes: 12 },
    { title: 'Third blog', likes: 3 }
  ]

  const result = listHelper.favoriteBlog(blogs)
  assert.deepStrictEqual(result, blogs[1])
})
})

describe('most blogs', () => {
  test('when list has only one blog, returns its author and count 1', () => {
    const blogs = [
      {
        title: 'My first blog',
        author: 'Alona',
        likes: 5
      }
    ]

    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: 'Alona',
      blogs: 1
    })
  })
  test('returns the author with most blogs', () => {
  const blogs = [
    { title: 'Blog 1', author: 'Anna' },
    { title: 'Blog 2', author: 'Robert' },
    { title: 'Blog 3', author: 'Robert' },
    { title: 'Blog 4', author: 'Maria' },
    { title: 'Blog 5', author: 'Robert' }
  ]

  const result = listHelper.mostBlogs(blogs)

  assert.deepStrictEqual(result, {
    author: 'Robert',
    blogs: 3
  })
})
})

describe('most likes', () => {
  test('of empty list is null', () => {
    const blogs = []

    const result = listHelper.mostLikes(blogs)
    assert.strictEqual(result, null)
  })
  test('returns the author with most total likes', () => {
  const blogs = [
    { author: 'Anna', likes: 5 },
    { author: 'Robert', likes: 8 },
    { author: 'Anna', likes: 7 }
  ]

  const result = listHelper.mostLikes(blogs)

  assert.deepStrictEqual(result, {
    author: 'Anna',
    likes: 12
  })
})
})