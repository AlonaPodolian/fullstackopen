import styled from 'styled-components'

const BlogCard = styled.div`
  box-sizing: border-box;
  max-width: 700px;
  margin: 1rem 0;
  padding: 1.25rem;
  color: #222;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  font-family: Arial, sans-serif;
`

const BlogTitle = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.5rem;
`

const BlogUrl = styled.a`
  display: inline-block;
  margin-bottom: 0.5rem;
  color: #1976d2;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const BlogInfo = styled.div`
  margin: 0.5rem 0;
  color: #555;
  font-size: 0.95rem;
`

const BlogActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`

const Likes = styled.span`
  margin-right: 0.25rem;
`

const ActionButton = styled.button`
  padding: 0.45rem 1rem;
  color: ${props => props.$danger ? '#d32f2f' : '#1976d2'};
  background-color: white;
  border: 1px solid ${props => props.$danger ? '#d32f2f' : '#1976d2'};
  border-radius: 4px;
  cursor: pointer;
  text-transform: uppercase;

  &:hover {
    background-color: ${props => props.$danger ? '#fff5f5' : '#f2f8ff'};
  }
`

const Blog = ({ blog, likeBlog, deleteBlog, currentUser }) => (
  <BlogCard>
    <BlogTitle>{blog.author}: {blog.title}</BlogTitle>

    <BlogUrl href={blog.url}>{blog.url}</BlogUrl>

    <BlogInfo>Added by {blog.user?.name}</BlogInfo>

    <BlogActions>
      <Likes>{blog.likes} likes</Likes>

      {currentUser && (
        <ActionButton onClick={() => likeBlog(blog)}>
          like
        </ActionButton>
      )}

      {currentUser && blog.user?.username === currentUser.username && (
        <ActionButton
          $danger
          onClick={() => deleteBlog(blog)}
        >
          remove
        </ActionButton>
      )}
    </BlogActions>
  </BlogCard>
)

export default Blog