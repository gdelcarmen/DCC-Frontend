import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { PostLayout } from "../../app/(insights)/blog/_components/PostLayout";
import { theme } from "@dcc/ui-library";

const baseProps = {
  title: "How data transparency rebuilt community trust",
  publishedAt: "2024-06-12T00:00:00.000Z",
  estimatedRead: "6 min read",
  authors: [
    { id: "author-dcc", name: "Dr. Alex Del Carmen", role: "Principal Consultant" },
    { id: "author-harlow", name: "Jamie Harlow", role: "Senior Data Scientist" }
  ],
  categories: ["Data Analytics", "Community Engagement"],
  heroImage: {
    src: "/images/blog/data-transparency.jpg",
    alt: "Analysts reviewing accountability dashboards"
  },
  summary:
    "A deep dive into how transparent analytics programs enable agencies to demonstrate progress against reform milestones."
};

describe("PostLayout component", () => {
  const renderLayout = (children: ReactNode = <p>Post body content</p>) =>
    render(
      <ChakraProvider theme={theme}>
        <PostLayout {...baseProps}>{children}</PostLayout>
      </ChakraProvider>
    );

  it("renders semantic heading, metadata, and author attribution", () => {
    renderLayout();

    const heading = screen.getByRole("heading", {
      level: 1,
      name: /how data transparency rebuilt community trust/i
    });
    expect(heading).toBeVisible();

    const dateTimeElement = screen.getByText((content, element) => {
      return (
        element?.tagName === "TIME" &&
        element.getAttribute("dateTime") === "2024-06-12T00:00:00.000Z"
      );
    });
    expect(dateTimeElement).toHaveTextContent(/june/i);

    expect(
      screen.getByText(/dr\. alex del carmen/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/jamie harlow/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/6 min read/i)).toBeInTheDocument();
  });

  it("exposes share controls for social platforms and copying links", () => {
    renderLayout();

    expect(screen.getByRole("button", { name: /copy link/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /share on linkedin/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /share on x/i })).toBeVisible();
  });

  it("renders hero media with accessible alternative text when provided", () => {
    renderLayout();

    expect(
      screen.getByRole("img", { name: /analysts reviewing accountability dashboards/i })
    ).toBeVisible();
  });
});
