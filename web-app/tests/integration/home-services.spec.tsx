import { render, screen } from "@testing-library/react";

import { getMarketingContent } from "../../lib/queries/marketing";
import HomePage from "../../app/(marketing)/page";

describe("Home & Services marketing flow", () => {
  it("fetches marketing content with hero, services, testimonials, and stats", async () => {
    const result = await getMarketingContent();

    expect(result.hero).toBeDefined();
    expect(Array.isArray(result.services)).toBe(true);
    expect(result.services.length).toBeGreaterThan(0);
    expect(
      result.testimonials.every((item: unknown) => typeof item === "object")
    ).toBe(true);
  });

  it("renders ISR-ready home page with fallback messaging for missing case studies", async () => {
    const data = await getMarketingContent();
    const Page = await HomePage();
    render(Page);

    expect(
      screen.getByRole("heading", { name: new RegExp(data.hero.title, "i") })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view services/i })).toBeVisible();
    expect(
      screen.getByText(/case studies are coming soon/i)
    ).toBeInTheDocument();
  });
});
