import { expect, test } from "@playwright/test";

test.describe("Interactive agency map filters", () => {
  test("filters agencies by engagement type and permission toggle", async ({ page }) => {
    await page.goto("/services/bias-free-policing");

    await expect(page.getByRole("heading", { name: /bias-free policing/i })).toBeVisible();

    const visibleSummary = page.getByRole("status", { name: /visible agencies/i });
    await expect(visibleSummary).toContainText("2 agencies displayed");

    await page.getByRole("checkbox", { name: /bias-free policing/i }).check();
    await expect(visibleSummary).toContainText("1 agency displayed");

    await page.getByRole("switch", { name: /include agencies awaiting permission/i }).check();
    await expect(visibleSummary).toContainText("2 agencies displayed");
  });

  test("allows switching to simplified list view when map fallback is needed", async ({ page }) => {
    await page.goto("/services/bias-free-policing?view=list");

    await expect(
      page.getByText(/showing simplified list while clustering is unavailable/i)
    ).toBeVisible();
    await expect(page.getByRole("listbox", { name: /agency map/i })).toBeVisible();
  });
});
