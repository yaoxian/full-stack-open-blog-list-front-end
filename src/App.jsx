import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import CreateForm from "./components/CreateForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [success, setSuccess] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);
    });
  }, []);

  const logout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };

  const addBlog = (newBlog) => {
    blogFormRef.current.toggleVisibility();
    setBlogs(blogs.concat(newBlog));
  };

  const updateBlog = (updatedBlog) => {
    setBlogs(
      blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
    );
  };

  const removeBlog = (blogToDelete) => {
    setBlogs(blogs.filter((blog) => blog.id !== blogToDelete));
  };

  return (
    <div>
      <Notification message={message} success={success} />

      {user === null ? (
        <LoginForm
          username={username}
          password={password}
          setUser={setUser}
          setUsername={setUsername}
          setPassword={setPassword}
          setMessage={setMessage}
          setSuccess={setSuccess}
        />
      ) : (
        <div>
          <h2>Blogs</h2>

          <p>{user.name} logged in</p>
          <button onClick={logout}>logout</button>

          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <h2>Create New</h2>
            <CreateForm
              setMessage={setMessage}
              addBlog={addBlog}
              setSuccess={setSuccess}
            />
          </Togglable>

          <div className="blogs">
            {blogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                removeBlog={removeBlog}
                user={user}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
