const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await request.post("/api/users", {
      data: {
        name: "YaoXian",
        username: "yaoxian",
        password: "phang",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByTestId("username").fill("mluukkai");
      await page.getByTestId("password").fill("salainen");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill("wrong");
      await page.getByTestId("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Wrong credentials")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByTestId("title").fill("test-title");
      await page.getByTestId("author").fill("test-author");
      await page.getByTestId("url").fill("test-url");
      await page.getByRole("button", { name: "create" }).click();
      await expect(page.getByText("test-title test-author")).toBeVisible();
    });
  });

  describe("When there is a blog", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
      await createBlog(page, "test-title", "Matti Luukkainen", "test-url");
    });

    test("a blog can be liked", async ({ page }) => {
      await page.getByRole("button", { name: "View" }).click();
      await page.getByRole("button", { name: "Like" }).click();
      await expect(page.getByText("Likes: 1")).toBeVisible();
    });

    test("a blog can be deleted", async ({ page }) => {
      page.on("dialog", async (dialog) => {
        if (dialog.type() === "confirm") {
          await dialog.accept();
        }
      });

      await expect(page.getByText("test-title Matti Luukkainen")).toBeVisible();
      await page.getByRole("button", { name: "View" }).click();
      await page.getByRole("button", { name: "Remove" }).click();

      await expect(
        page.getByText("test-title Matti Luukkainen")
      ).not.toBeVisible();
    });
  });

  describe("When there are multiple blogs", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
      await createBlog(page, "test-title", "mluukkai", "test-url");
      await page.getByRole("button", { name: "logout" }).click();

      await loginWith(page, "yaoxian", "phang");
      await createBlog(page, "test-title", "YaoXian", "test-url");
    });

    test("only the author sees the delete button", async ({ page }) => {
      // Can see own blog's delete button
      const myNote = await page.getByText("test-title yaoxian");
      const myNoteParent = await myNote.locator("..");
      await myNoteParent.getByRole("button", { name: "View" }).click();
      await expect(myNoteParent.getByText("Author: YaoXian")).toBeVisible();
      await expect(
        myNoteParent.getByRole("button", { name: "Remove" })
      ).toBeVisible();

      // Cannot see other's blog delete button
      const otherNote = await page.getByText("test-title mluukkai");
      const otherNoteParent = await otherNote.locator("..");
      await otherNoteParent.getByRole("button", { name: "View" }).click();
      await expect(
        otherNoteParent.getByRole("button", { name: "Remove" })
      ).not.toBeVisible();
    });

    test("blogs are ordered by the number of likes", async ({ page }) => {
      // Like the second post
      const myNote = await page.getByText("test-title yaoxian");
      const myNoteParent = await myNote.locator("..");
      await myNoteParent.getByRole("button", { name: "View" }).click();
      await myNoteParent.getByRole("button", { name: "Like" }).click();

      // Wait for the like count to update
      await page.waitForTimeout(1000);

      // Extract blogs information and their likes
      const blogs = await page
        .locator(".blogs .blog")
        .evaluateAll((blogElements) => {
          return blogElements.map((blog) => {
            const title = blog.querySelector(".blog-title").innerText;
            const likes = parseInt(blog.querySelector(".blog-likes").innerText);
            return { title, likes };
          });
        });

      // Check that the blogs are ordered by likes in descending order
      for (let i = 0; i < blogs.length - 1; i++) {
        expect(blogs[i].likes).toBeGreaterThanOrEqual(blogs[i + 1].likes);
      }
    });
  });
});
