import type { MapAgency } from "../map";
import { buildAgencyGeoJSON } from "../map/buildAgencyGeoJSON";
import { getSanityClient, groq } from "../sanity/client";

type BiasFreePolicingQueryResult = {
  agencies: Array<{
    _id: string;
    name: string;
    jurisdiction: string;
    location?: { lat: number; lng: number };
    engagementTypes: string[];
    permissionReceived: boolean;
    mapDisplay?: boolean;
  }>;
  highlights: Array<{
    title: string;
    description: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export interface BiasFreeContent {
  hero: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  map: {
    agencies: MapAgency[];
    geojson: ReturnType<typeof buildAgencyGeoJSON>;
  };
  highlights: Array<{ title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
}

const FALLBACK_CONTENT: BiasFreeContent = {
  hero: {
    title: "Bias-Free Policing Compliance",
    description:
      "Del Carmen Consulting guides agencies through sustainable bias-free policing programs with measurable oversight and data-backed reporting.",
    ctaLabel: "Schedule a consultation",
    ctaHref: "/contact"
  },
  map: {
    agencies: [],
    geojson: { type: "FeatureCollection", features: [] }
  },
  highlights: [
    {
      title: "SB 1074 Alignment",
      description:
        "Audit frameworks that align agency policy, training, and reporting with SB 1074 statutory requirements."
    },
    {
      title: "Community Trust Metrics",
      description:
        "Data dashboards quantifying stop outcomes, force usage, and consent decree benchmarks."
    }
  ],
  faqs: [
    {
      question: "How long does an equity compliance assessment take?",
      answer:
        "Most engagements complete within 12–16 weeks, culminating in an actionable roadmap and staff training plan."
    },
    {
      question: "What deliverables are included?",
      answer:
        "You receive a compliance audit, equity-focused training modules, and implementation coaching for command staff."
    }
  ]
};

type DataAnalyticsQueryResult = {
  service?: {
    heroTitle?: string;
    heroDescription?: string;
    focusAreas?: string[];
    metrics?: Array<{ label: string; value: string; description?: string }>;
    methodology?: Array<{ title: string; description: string }>;
  };
};

export interface DataAnalyticsContent {
  hero: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  metrics: Array<{ label: string; value: string; description?: string }>;
  methodology: Array<{ title: string; description: string }>;
  complianceCta: {
    heading: string;
    description: string;
    href: string;
    label: string;
  };
}

const DATA_ANALYTICS_FALLBACK: DataAnalyticsContent = {
  hero: {
    title: "Data Analytics for Accountability",
    description:
      "We build analytics programs that turn raw policing data into actionable insights for equity oversight, consent decree reporting, and command staff decision-making.",
    ctaLabel: "Talk with our analysts",
    ctaHref: "/contact"
  },
  metrics: [
    {
      label: "Dashboards deployed",
      value: "85+",
      description: "Custom KPI dashboards tracking use-of-force, stops, and community feedback."
    },
    {
      label: "Response time",
      value: "<72 hrs",
      description: "Rapid compliance reporting SLAs for federal monitors and city councils."
    },
    {
      label: "Data quality uplift",
      value: "96%",
      description: "Validated records after data governance remediation and schema auditing."
    }
  ],
  methodology: [
    {
      title: "Baseline data audit",
      description:
        "We evaluate data coverage, integrity, and governance controls to identify blind spots in current reporting."
    },
    {
      title: "Equity-focused modeling",
      description:
        "Jointly design statistical models and thresholds that surface disparate impact signals early."
    },
    {
      title: "Operational dashboards",
      description:
        "Deliver real-time dashboards and workflows tailored for command staff, compliance teams, and community partners."
    }
  ],
  complianceCta: {
    heading: "Need accountability metrics with map context?",
    description:
      "Pair your analytics program with our bias-free policing engagements to visualize outcomes across agencies.",
    href: "/services/bias-free-policing",
    label: "Explore bias-free policing"
  }
};

const biasFreeQuery = groq`{
  "agencies": *[_type == "agency" && references(*[_type == "service" && slug.current == "bias-free-policing"]._id)]{
    _id,
    name,
    jurisdiction,
    "location": coordinates,
    engagementTypes,
    permissionReceived,
    mapDisplay
  },
  "highlights": *[_type == "biasFreeHighlight"]{
    title,
    description
  },
  "faqs": *[_type == "biasFreeFaq"]{
    question,
    answer
  }
}`;

const dataAnalyticsQuery = groq`{
  "service": *[_type == "service" && slug.current == "data-analytics"][0]{
    "heroTitle": title,
    "heroDescription": excerpt,
    focusAreas,
    "metrics": metrics[]{
      label,
      value,
      description
    },
    "methodology": methodology[]{
      title,
      description
    }
  }
}`;

const hasSanityCredentials = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET);

const transformAgencies = (rawAgencies: BiasFreePolicingQueryResult["agencies"]): MapAgency[] => {
  if (!rawAgencies?.length) {
    return [];
  }

  return rawAgencies
    .filter((agency) => {
      if (agency.mapDisplay === false) {
        return false;
      }
      const lat = agency.location?.lat;
      const lng = agency.location?.lng;
      return typeof lat === "number" && typeof lng === "number";
    })
    .map<MapAgency>((agency) => ({
      id: agency._id,
      name: agency.name,
      jurisdiction: agency.jurisdiction,
      coordinates: {
        lat: agency.location!.lat,
        lng: agency.location!.lng
      },
      engagementTypes: agency.engagementTypes ?? [],
      permissionReceived: Boolean(agency.permissionReceived)
    }));
};

export const getBiasFreePolicingContent = async (): Promise<BiasFreeContent> => {
  if (!hasSanityCredentials()) {
    return FALLBACK_CONTENT;
  }

  try {
    const client = getSanityClient();
    const result = await client.fetch<BiasFreePolicingQueryResult>(biasFreeQuery);
    const agencies = transformAgencies(result.agencies);
    return {
      hero: FALLBACK_CONTENT.hero,
      map: {
        agencies,
        geojson: buildAgencyGeoJSON(agencies)
      },
      highlights: result.highlights?.length ? result.highlights : FALLBACK_CONTENT.highlights,
      faqs: result.faqs?.length ? result.faqs : FALLBACK_CONTENT.faqs
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to load bias-free policing content:", error);
    }
    return FALLBACK_CONTENT;
  }
};

export const getDataAnalyticsContent = async (): Promise<DataAnalyticsContent> => {
  if (!hasSanityCredentials()) {
    return DATA_ANALYTICS_FALLBACK;
  }

  try {
    const client = getSanityClient();
    const result = await client.fetch<DataAnalyticsQueryResult>(dataAnalyticsQuery);
    const service = result.service;

    if (!service) {
      return DATA_ANALYTICS_FALLBACK;
    }

    return {
      hero: {
        title: service.heroTitle ?? DATA_ANALYTICS_FALLBACK.hero.title,
        description: service.heroDescription ?? DATA_ANALYTICS_FALLBACK.hero.description,
        ctaLabel: DATA_ANALYTICS_FALLBACK.hero.ctaLabel,
        ctaHref: DATA_ANALYTICS_FALLBACK.hero.ctaHref
      },
      metrics: service.metrics?.length ? service.metrics : DATA_ANALYTICS_FALLBACK.metrics,
      methodology: service.methodology?.length
        ? service.methodology
        : DATA_ANALYTICS_FALLBACK.methodology,
      complianceCta: DATA_ANALYTICS_FALLBACK.complianceCta
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to load data analytics content:", error);
    }
    return DATA_ANALYTICS_FALLBACK;
  }
};
