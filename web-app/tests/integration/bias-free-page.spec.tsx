import { render, screen } from "@testing-library/react";

import { getBiasFreePolicingContent } from "../../lib/queries/compliance";
import BiasFreePolicingPage from "../../app/(marketing)/services/bias-free-policing/page";

describe("Bias-Free Policing service page", () => {
  it("fetches compliance content with agencies, highlights, and FAQs", async () => {
    const content = await getBiasFreePolicingContent();

    expect(content.hero.title).toMatch(/bias-free/i);
    expect(Array.isArray(content.map.agencies)).toBe(true);
    expect(content.map.agencies.every((agency: unknown) => typeof agency === "object")).toBe(true);
    expect(Array.isArray(content.highlights)).toBe(true);
    expect(Array.isArray(content.faqs)).toBe(true);
  });

  it("renders fallback messaging when no permissioned agencies are available", async () => {
    const Page = await BiasFreePolicingPage();
    render(Page);

    expect(
      screen.getByRole("heading", { name: /bias-free policing/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/agencies are being onboarded to the interactive map/i)
    ).toBeInTheDocument();
  });
});
