import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@dcc/ui-library";
import type { ReactNode } from "react";

import { ServiceCard } from "@dcc/ui-library/components/ServiceCard";
import { TestimonialCarousel } from "@dcc/ui-library/components/Testimonial/TestimonialCarousel";

const renderWithProviders = (ui: ReactNode) =>
  render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);

describe("ServiceCard component", () => {
  it("displays title, excerpt, and CTA button", async () => {
    renderWithProviders(
      <ServiceCard
        title="Compliance Audits"
        excerpt="End-to-end SB 1074 and consent decree alignment for agencies."
        href="/services/compliance-audits"
        icon="shield"
      />
    );

    expect(screen.getByRole("heading", { name: /compliance audits/i })).toBeVisible();
    const ctaButton = screen.getByRole("link", { name: /learn more/i });
    expect(ctaButton).toHaveAttribute("href", "/services/compliance-audits");
  });

  it("supports keyboard focus states on CTA", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ServiceCard
        title="Data Analytics"
        excerpt="Advanced analytics with racial equity oversight."
        href="/services/data-analytics"
        icon="chart"
      />
    );

    await user.tab();
    expect(screen.getByRole("link", { name: /learn more/i })).toHaveFocus();
  });
});

describe("TestimonialCarousel component", () => {
  const testimonials = [
    {
      id: "t1",
      quote: "Del Carmen Consulting guided us through transformational change.",
      person: "Chief Williams",
      role: "City of Cedar Grove",
      canDisplay: true
    },
    {
      id: "t2",
      quote: "Their compliance roadmap accelerated our consent decree compliance timeline.",
      person: "Commissioner Lee",
      role: "State Oversight Board",
      canDisplay: false
    }
  ];

  it("renders only permissioned testimonials", () => {
    renderWithProviders(<TestimonialCarousel testimonials={testimonials} />);

    expect(
      screen.getByText(/del carmen consulting guided us through transformational change/i)
    ).toBeVisible();
    expect(
      screen.queryByText(
        /their compliance roadmap accelerated our consent decree compliance timeline/i
      )
    ).not.toBeInTheDocument();
  });

  it("supports keyboard navigation between slides", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TestimonialCarousel testimonials={testimonials} />);

    await user.keyboard("{Tab}{Enter}");
    expect(screen.getByRole("region", { name: /testimonial carousel/i })).toHaveAttribute(
      "data-active-index",
      "0"
    );
  });
});
