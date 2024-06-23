/* eslint-disable react/prop-types */
import { useState } from "react";
import blogService from "../services/blogs";
import PropTypes from "prop-types";

const Blog = ({ blog, updateBlog, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const expandBlog = () => {
    setVisible(!visible);
  };

  const likeBlog = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    try {
      const newBlog = await blogService.update(updatedBlog);
      updateBlog(newBlog);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        removeBlog(blog.id);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button style={hideWhenVisible} onClick={expandBlog}>
          View
        </button>
        <button style={showWhenVisible} onClick={expandBlog}>
          Hide
        </button>
        <div style={showWhenVisible}>
          <p>URL: {blog.url}</p>
          <p>Likes: {blog.likes}</p>
          <p>Author: {blog.author}</p>
          <button onClick={likeBlog}>Like</button>
          <button onClick={deleteBlog}>Remove</button>
        </div>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
};
Blog.displayName = "Blog";

export default Blog;
