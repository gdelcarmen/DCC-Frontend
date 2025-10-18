import { expect, test } from "@playwright/test";

test.describe("Insights navigation", () => {
  test("allows users to browse blog index, open an article, and inspect share metadata", async ({ page }) => {
    await page.goto("/blog");

    await expect(page.getByRole("heading", { name: /insights & research/i })).toBeVisible();
    const firstArticleLink = page.getByRole("link", { name: /read article/i }).first();
    await expect(firstArticleLink).toBeVisible();

    await firstArticleLink.click();

    await expect(page.getByRole("article")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const ogTitle = await page.locator("meta[property='og:title']").getAttribute("content");
    expect(ogTitle).toBeTruthy();
    expect(ogTitle).toMatch(/del carmen consulting/i);
  });

  test("surfaces case study listings and detail placeholders", async ({ page }) => {
    await page.goto("/case-studies");

    await expect(page.getByRole("heading", { name: /case studies/i })).toBeVisible();

    const firstCard = page.getByRole("link", { name: /read case study/i }).first();

    await firstCard.click();

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const placeholder = page.getByText(/case study coming soon/i);
    if (await placeholder.count()) {
      await expect(placeholder).toBeVisible();
    } else {
      await expect(page.getByRole("heading", { name: /outcomes/i })).toBeVisible();
    }
  });
});
