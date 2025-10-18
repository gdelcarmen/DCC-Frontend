import { expect, test } from "@playwright/test";

test.describe("Contact form journey", () => {
  test("allows a prospect to complete the multi-step wizard", async ({ page }) => {
    await page.goto("/contact");

    await page.getByRole("button", { name: /next/i }).click();
    await expect(page.getByText(/agency name is required/i)).toBeVisible();

    await page.getByLabel(/agency name/i).fill("Austin Police Department");
    await page.getByLabel(/contact name/i).fill("Jordan Williams");
    await page.getByLabel(/contact email/i).fill("chief@austinpd.gov");
    await page.getByLabel(/role/i).fill("Chief of Police");
    await page.getByRole("button", { name: /next/i }).click();

    await page.getByLabel(/bias-free policing/i).check();
    await page.getByLabel(/data analytics/i).check();
    await page.getByRole("button", { name: /next/i }).click();

    await page
      .getByLabel(/how can we support your agency/i)
      .fill("Need support with consent decree reporting and analytics.");
    await page
      .getByRole("checkbox", { name: /i consent to del carmen consulting storing this submission/i })
      .check();

    await page.getByRole("button", { name: /submit request/i }).click();

    await expect(page.getByRole("status")).toHaveText(/thank you for reaching out/i);
  });

  test("blocks submissions flagged as spam", async ({ page }) => {
    await page.goto("/contact");

    await page.getByLabel(/agency name/i).fill("Spam Agency");
    await page.getByLabel(/contact name/i).fill("Automation Bot");
    await page.getByLabel(/contact email/i).fill("bot@example.com");
    await page.getByRole("button", { name: /next/i }).click();

    await page.getByLabel(/bias-free policing/i).check();
    await page.getByRole("button", { name: /next/i }).click();

    await page.getByLabel(/how can we support your agency/i).fill("Just testing.");
    await page
      .getByRole("checkbox", { name: /i consent to del carmen consulting storing this submission/i })
      .check();

    await page.locator('input[name="honeypot"]').fill("http://spam.test");
    await page.getByRole("button", { name: /submit request/i }).click();

    await expect(page.getByText(/spam detection/i)).toBeVisible();
  });
});
