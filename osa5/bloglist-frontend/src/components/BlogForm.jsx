import { useState } from 'react'
import styled from 'styled-components'

const FormInput = styled.input`
  display: block;
  width: 300px;
  box-sizing: border-box;
  margin: 0.5rem 0 1rem;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`

const FormButton = styled.button`
  padding: 0.65rem 1.2rem;
  color: white;
  background-color: #1976d2;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    background-color: #1565c0;
  }
`

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const handleBlogChange = (event) => {
    setNewBlog({
      ...newBlog,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog(newBlog)
  }

  return (
    <>
      <h3>Add a blog</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            title
            <FormInput
              name="title"
              value={newBlog.title}
              onChange={handleBlogChange}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <FormInput
              name="author"
              value={newBlog.author}
              onChange={handleBlogChange}
            />
          </label>
        </div>
        <div>
          <label>
            url
            <FormInput
              name="url"
              value={newBlog.url}
              onChange={handleBlogChange}
            />
          </label>
        </div>
        <FormButton type="submit">create</FormButton>
      </form>
    </>
  )
}

export default BlogForm