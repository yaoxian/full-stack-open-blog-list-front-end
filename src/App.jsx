import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import CreateForm from "./components/CreateForm";
import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const logout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };

  const addBlog = (newBlog) => {
    setBlogs(blogs.concat(newBlog));
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

          <h2>Create New</h2>
          <CreateForm
            setMessage={setMessage}
            addBlog={addBlog}
            setSuccess={setSuccess}
          />

          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
