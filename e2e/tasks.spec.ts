import { expect, test } from "@playwright/test";

test("the task list shows the demo tasks, newest first", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible();
  const items = page.getByRole("list", { name: "Tasks" }).getByRole("listitem");
  await expect(items).toHaveCount(3);
  await expect(items.first()).toContainText("Review open pull requests");
  await expect(items.last()).toContainText("Write the project plan");
});

test("unknown pages still load the app", async ({ page }) => {
  await page.goto("/some/deep/link");
  await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible();
});
