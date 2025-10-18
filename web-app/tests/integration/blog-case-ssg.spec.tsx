import { render, screen } from "@testing-library/react";

import BlogIndexPage from "../../app/(insights)/blog/page";
import CaseStudyDetailPage from "../../app/(insights)/case-studies/[slug]/page";
import * as insightsQueries from "../../lib/queries/insights";

jest.mock("../../lib/queries/insights", () => {
  const actual = jest.requireActual<(typeof import("../../lib/queries/insights"))>(
    "../../lib/queries/insights"
  );
  return {
    ...actual,
    getInsightsIndexContent: jest.fn(actual.getInsightsIndexContent),
    getCaseStudyBySlug: jest.fn(actual.getCaseStudyBySlug)
  };
});

describe("Insights static generation", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("filters out draft content from posts and case studies", async () => {
    const data = await insightsQueries.getInsightsIndexContent();

    expect(data.posts.every((post) => ["published", "comingSoon"].includes(post.status))).toBe(true);
    expect(
      data.caseStudies.every((study) => ["published", "comingSoon"].includes(study.status))
    ).toBe(true);
  });

  it("renders placeholder messaging when no published posts exist", async () => {
    const getInsightsIndexContentMock = jest.mocked(insightsQueries.getInsightsIndexContent);
    getInsightsIndexContentMock.mockResolvedValueOnce({
      siteSettings: null,
      posts: [],
      caseStudies: [],
      categories: [],
      featuredCaseStudy: null,
      totalPosts: 0
    } as unknown as Awaited<ReturnType<typeof insightsQueries.getInsightsIndexContent>>);

    const Page = await BlogIndexPage();
    render(Page);

    expect(screen.getByText(/new insights are coming soon/i)).toBeInTheDocument();
  });

  it("shows coming soon messaging for unpublished case studies", async () => {
    const getCaseStudyBySlugMock = jest.mocked(insightsQueries.getCaseStudyBySlug);
    getCaseStudyBySlugMock.mockResolvedValueOnce({
      slug: "bias-audit",
      title: "Bias audit initiative",
      status: "comingSoon",
      summary: "Public report publishing soon.",
      heroImage: null,
      objective: [],
      approach: [],
      outcomes: [],
      metrics: [],
      testimonial: null,
      publishedAt: "2024-01-01T00:00:00.000Z"
    } as unknown as Awaited<ReturnType<typeof insightsQueries.getCaseStudyBySlug>>);

    const Page = await CaseStudyDetailPage({ params: { slug: "bias-audit" } });
    render(Page);

    expect(screen.getByText(/case study coming soon/i)).toBeInTheDocument();
  });
});
