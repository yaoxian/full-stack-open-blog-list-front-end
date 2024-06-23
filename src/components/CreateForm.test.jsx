import { render, screen } from "@testing-library/react";
import CreateForm from "./CreateForm";
import userEvent from "@testing-library/user-event";
import blogService from "../services/blogs";
import { expect } from "vitest";
vi.mock("../services/blogs");

test("addBlog is called when a new create form is submitted", async () => {
  const setMessage = vi.fn();
  const addBlog = vi.fn();
  const setSuccess = vi.fn();
  const user = userEvent.setup();

  blogService.create.mockResolvedValue({
    title: "Testing a form...",
  });

  render(
    <CreateForm
      setMessage={setMessage}
      addBlog={addBlog}
      setSuccess={setSuccess}
    />
  );

  const input = screen.getByPlaceholderText("Write Something...");
  const createButton = screen.getByText("create");

  await user.type(input, "Testing a form...");
  await user.click(createButton);

  expect(addBlog.mock.calls).toHaveLength(1);
  expect(addBlog.mock.calls[0][0]).toStrictEqual({
    title: "Testing a form...",
  });
});
