import { expect, test } from "@playwright/test";

test.describe("Home and Services journey", () => {
  test("allows agency leader to scan hero, services, testimonials", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /del carmen consulting/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /view all services/i })).toBeVisible();
    await expect(page.getByRole("region", { name: /testimonials/i })).toBeVisible();
  });

  test("handles missing case studies gracefully", async ({ page }) => {
    await page.goto("/services");

    await expect(page.getByText(/case studies are coming soon/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /contact us/i })).toBeVisible();
  });
});
