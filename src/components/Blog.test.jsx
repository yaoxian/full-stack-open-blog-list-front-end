import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";
import blogService from "../services/blogs";
vi.mock("../services/blogs");

test("Render initial blog content", async () => {
  const updateBlog = vi.fn();
  const removeBlog = vi.fn();
  const blog = {
    title: "test-title",
    author: "test-author",
    url: "test-url",
    likes: 0,
  };

  render(<Blog blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} />);

  // title and author should be visible
  const titleAndAuthor = screen.getByText("test-title test-author");
  expect(titleAndAuthor).toBeDefined();

  // url and likes not visible
  const url = screen.queryByText("test-url");
  expect(url).toBeNull();
});

test("Render url and likes after clicking view button", async () => {
  const updateBlog = vi.fn();
  const removeBlog = vi.fn();
  const user = userEvent.setup();

  const blog = {
    title: "test-title",
    author: "test-author",
    url: "test-url",
    likes: 0,
  };

  render(<Blog blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} />);

  const viewButton = screen.getByText("View");
  await user.click(viewButton);

  // url and likes should be visible
  const url = screen.getByText("URL: test-url");
  const likes = screen.getByText("Likes: 0");
  expect(url).toBeDefined();
  expect(likes).toBeDefined();
});

test("Update Blog event handler is called twice when like button is clicked twice", async () => {
  const updateBlog = vi.fn();
  const removeBlog = vi.fn();
  const user = userEvent.setup();

  const blog = {
    id: "123",
    title: "test-title",
    author: "test-author",
    url: "test-url",
    likes: 0,
  };

  blogService.update.mockResolvedValue({
    ...blog,
    likes: blog.likes + 1,
  });

  render(<Blog blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} />);

  const likeButton = screen.getByText("Like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(updateBlog).toHaveBeenCalledTimes(2);
});
