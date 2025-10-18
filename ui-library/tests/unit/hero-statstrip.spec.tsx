import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { Hero } from "@dcc/ui-library/components/Hero";
import { StatStrip } from "@dcc/ui-library/components/StatStrip";
import { theme } from "@dcc/ui-library";
import { ChakraProvider } from "@chakra-ui/react";

const renderWithTheme = (ui: ReactNode) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

describe("Hero component", () => {
  it("renders mission heading with CTA link", () => {
    renderWithTheme(
      <Hero
        eyebrow="Case Study"
        title="Building accountable communities"
        description="Del Carmen Consulting partners with agencies to deliver equitable outcomes."
        ctaLabel="Explore Services"
        ctaHref="/services"
      />
    );

    expect(
      screen.getByRole("heading", { name: /building accountable communities/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore services/i })).toHaveAttribute(
      "href",
      "/services"
    );
  });

  it("disables motion when reduced motion preference is enabled", () => {
    renderWithTheme(
      <Hero
        eyebrow="Insights"
        title="Transforming data into action"
        description="We deliver WCAG-compliant storytelling with data-rich contexts."
        ctaLabel="Read insights"
        ctaHref="/insights"
        prefersReducedMotion
      />
    );

    expect(screen.getByText(/transforming data into action/i)).toBeVisible();
    expect(document.querySelector("[data-reduced-motion='true']")).toBeTruthy();
  });
});

describe("StatStrip component", () => {
  it("renders provided metrics with accessible labels", () => {
    renderWithTheme(
      <StatStrip
        items={[
          { label: "Agencies Served", value: "120+" },
          { label: "Training Hours", value: "15k" },
          { label: "Policy Updates", value: "48" }
        ]}
      />
    );

    expect(screen.getByText("120+")).toHaveAccessibleName("Agencies Served");
    expect(screen.getByText("15k")).toHaveAccessibleName("Training Hours");
    expect(screen.getByText("48")).toHaveAccessibleName("Policy Updates");
  });

  it("announces metric summary for screen readers", () => {
    renderWithTheme(
      <StatStrip
        srLabel="Del Carmen Consulting impact statistics"
        items={[{ label: "Community Engagement Sessions", value: "320" }]}
      />
    );

    expect(
      screen.getByLabelText(/del carmen consulting impact statistics/i)
    ).toBeInTheDocument();
  });
});
