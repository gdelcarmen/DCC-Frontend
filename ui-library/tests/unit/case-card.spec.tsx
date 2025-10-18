import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { theme } from "@dcc/ui-library";
import { CaseCard } from "@dcc/ui-library/components/CaseCard";
import type { CaseCardProps, CaseCardTestimonial } from "@dcc/ui-library/components/CaseCard";

const renderWithTheme = (ui: ReactNode) => render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);

const testimonial: CaseCardTestimonial = {
  quote: "Del Carmen Consulting helped us embed accountability across the department.",
  person: "Chief Jordan Williams",
  role: "Cedar Grove Police Department",
  canDisplay: true
};

const baseProps: Omit<CaseCardProps, "status"> = {
  title: "Reducing Use-of-Force Incidents",
  summary:
    "Comprehensive policy rewrites, officer coaching, and data dashboards that reduced use-of-force by 35%.",
  href: "/case-studies/reducing-use-of-force",
  heroImage: {
    src: "/images/case-study.jpg",
    alt: "Officers completing a de-escalation workshop"
  },
  metrics: [
    { label: "Use-of-force reduction", value: "35%" },
    { label: "Policy updates completed", value: "48" }
  ],
  testimonial
};

describe("CaseCard component", () => {
  it("renders published case study content with accessible media and metrics", () => {
    renderWithTheme(<CaseCard {...baseProps} status="published" />);

    expect(screen.getByRole("heading", { name: /reducing use-of-force incidents/i })).toBeVisible();
    expect(screen.getByRole("img", { name: /officers completing a de-escalation workshop/i })).toBeVisible();
    expect(screen.getByText("35%")).toHaveAccessibleName("Use-of-force reduction");
    expect(screen.getByRole("link", { name: /read case study/i })).toHaveAttribute(
      "href",
      "/case-studies/reducing-use-of-force"
    );
  });

  it("hides testimonial content when permission is not granted", () => {
    renderWithTheme(
      <CaseCard
        {...baseProps}
        status="published"
        testimonial={{ ...(baseProps.testimonial as CaseCardTestimonial), canDisplay: false }}
      />
    );

    expect(
      screen.queryByText(/helped us embed accountability across the department/i)
    ).not.toBeInTheDocument();
    expect(screen.getByText(/testimonial awaiting permission/i)).toBeInTheDocument();
  });

  it("displays placeholder messaging for unpublished case studies", () => {
    renderWithTheme(<CaseCard {...baseProps} status="comingSoon" />);

    expect(
      screen.getByText(/case study coming soon/i)
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /read case study/i })).not.toBeInTheDocument();
  });
});
