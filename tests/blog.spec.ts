import { test, expect } from "@playwright/test";

test("should navigate to blog post and verify pagination", async ({ page }) => {
  await page.goto("http://localhost:5173/blog/16");

  const title = page.getByRole("heading", { name: "Yap Today" });
  await expect(title).toBeVisible();

  const nextButton = page.locator("text=Next Up");
  if (await nextButton.isVisible()) {
    await nextButton.click();

    // 4. Check if the URL changed to match a new post id pathing structure
    await expect(page).not.toHaveURL("http://localhost:5173/blog/16");
  }
});
