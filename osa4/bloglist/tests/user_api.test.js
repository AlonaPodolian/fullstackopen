const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

after(async () => {
  await mongoose.connection.close()
})

test('username must be at least 3 characters long', async () => {
  const newUser = {
    username: 'ab',
    name: 'Test User',
    password: 'test123'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.match(response.body.error, /username/)
})

test('password must be at least 3 characters long', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: '12'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.match(response.body.error, /password/)
})

test('username must be unique', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'test123'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.match(response.body.error, /unique/)

  const usersAtEnd = await User.find({ username: 'testuser' })
assert.strictEqual(usersAtEnd.length, 1)
})