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