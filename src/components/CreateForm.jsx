/* eslint-disable react/prop-types */
import blogService from "../services/blogs";
import { useState } from "react";

const CreateForm = ({ setMessage, addBlog, setSuccess }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      const newBlog = {
        title,
        author,
        url,
      };

      const blog = await blogService.create(newBlog);
      addBlog(blog);

      // reset form
      setTitle("");
      setAuthor("");
      setUrl("");

      // notify user
      setSuccess(true);
      setMessage(`A new blog ${blog.title} by ${blog.author} is created`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (err) {
      setSuccess(false);
      setMessage("Error while creating new blog");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleCreate}>
      <div>
        title:
        <input
          type="text"
          value={title}
          placeholder="Write Something..."
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default CreateForm;
