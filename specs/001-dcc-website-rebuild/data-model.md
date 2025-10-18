# Data Model: Del Carmen Consulting Website

## 1. Overview

Content and operational data resides in Sanity CMS, with derived TypeScript types generated for the Next.js application and UI library. Contact submissions may optionally persist in Sanity or export to encrypted CSV; plan assumes Sanity dataset storage with restricted service token.

## 2. Sanity Schemas

### 2.1 Agency

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Required, unique per jurisdiction |
| `slug` | slug | For internal references and map filters |
| `jurisdiction` | string | City / county / state |
| `latitude` / `longitude` | number | Custom geo input with validation |
| `logo` | image | Hotlink disabled; includes alt text |
| `permissionReceived` | boolean | Governs logo/testimonial display |
| `permissionNotes` | text | Audit trail for consent |
| `engagementTypes` | array (reference Service or enum) | For map filtering |
| `yearEngaged` | number | For timeline displays |
| `caseStudies` | array (reference CaseStudy) | Linked stories |
| `testimonials` | array (reference Testimonial) | Optional |
| `featured` | boolean | Flag for homepage logo cloud |

### 2.2 CaseStudy

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Required |
| `slug` | slug | Generated from title |
| `summary` | text | Display on cards |
| `objective` | rich text | Section on detail page |
| `approach` | rich text | Methodology |
| `outcomes` | rich text | Include metrics with disclaimer |
| `lessonsLearned` | rich text | Optional |
| `agency` | reference (Agency) | One-to-one |
| `date` | datetime | Publication date |
| `status` | string (enum: published, comingSoon, draft) | Allows placeholders |
| `engagementType` | reference (Service) | For filtering |
| `heroImage` | image | With hotspot/crop |
| `seo` | object (title, description, ogImage) | SSG metadata |

### 2.3 Service

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | |
| `slug` | slug | |
| `excerpt` | text | For listing cards |
| `body` | rich text | Methodology and differentiators |
| `focusAreas` | array (string) | Highlights (e.g., recruiting, use of force) |
| `faqs` | array (object: question, answer) | Accordion content |
| `relatedCaseStudies` | array (reference CaseStudy) | Optional |
| `relatedPosts` | array (reference Post) | Optional |
| `ctaLabel` / `ctaUrl` | string | Button copy overrides |
| `seo` | object | Same structure as CaseStudy |

### 2.4 Post

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | |
| `slug` | slug | |
| `excerpt` | text | |
| `body` | rich text | Blocks with code/pre support |
| `authors` | array (reference People) | Attribution |
| `category` | string | Controlled vocabulary |
| `heroImage` | image | Optional |
| `publishedAt` | datetime | ISR scheduling |
| `seo` | object | Metadata |

### 2.5 Testimonial

| Field | Type | Notes |
|-------|------|-------|
| `quote` | text | Plain text, limit length |
| `person` | string | Name |
| `role` | string | Title, agency role |
| `agency` | reference (Agency) | Must align with permission flag |
| `date` | datetime | Optional |
| `permissionDocument` | file | Upload signed release |
| `permissionReceived` | boolean | Mirror agency-level consent |
| `display` | boolean | Quick toggle |

### 2.6 People

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | |
| `role` | string | |
| `credentials` | array (string) | Degrees, certifications |
| `bio` | rich text | Supports headings, lists |
| `headshot` | image | Required alt text |
| `mediaLinks` | array (object: label, url) | Optional |

### 2.7 SiteSettings

| Field | Type | Notes |
|-------|------|-------|
| `brand` | object (colors, typography, logo) | Sync with Chakra theme |
| `navigation` | array (object: label, href) | Primary nav |
| `socialLinks` | array (object: platform, url) | Footer |
| `defaultSeo` | object | Title template, description, OG image |
| `contact` | object (email, phone, address) | Global contact details |
| `accessibilityStatement` | rich text | Dedicated page content |

### 2.8 ContactSubmission *(mutations only)*

| Field | Type | Notes |
|-------|------|-------|
| `agencyName` | string | Step 1 |
| `contactName` | string | |
| `contactEmail` | string | Validated |
| `role` | string | |
| `serviceInterest` | array (reference Service or enum) | |
| `message` | text | |
| `consent` | boolean | GDPR/CCPA acknowledgement |
| `honeypot` | string | Must remain empty |
| `ipHash` | string | Hashed for privacy |
| `createdAt` | datetime | Server stamped |

## 3. Derived TypeScript Interfaces

Generate TypeScript types via `sanity-codegen` or custom script in `cms-schemas`. Example (abbreviated):

```ts
export interface AgencyDocument {
  _id: string;
  name: string;
  slug: string;
  jurisdiction: string;
  coordinates: { lat: number; lng: number };
  permissionReceived: boolean;
  engagementTypes: string[];
  caseStudies: CaseStudySummary[];
}
```

Shared types should live in `ui-library/src/types/` to prevent duplication. `web-app` imports types for GROQ query results.

## 4. Relationships

- Agency → CaseStudy (one-to-many)  
- Agency → Testimonial (one-to-many)  
- Service ↔ CaseStudy (many-to-many through references)  
- Service ↔ Post (optional cross-link)  
- People ↔ Post (many-to-many authorship)

Map filters rely on `engagementTypes` enumerations; keep list consistent across Agency and Service schemas. Consider centralising in schema helper.

## 5. Validation & Guardrails

- Custom geo input enforces lat ∈ [-90, 90], lng ∈ [-180, 180].  
- Permission toggles block publishing of assets without consent (sanity validation).  
- CaseStudy `status !== "published"` excludes entry from SSG generation (handled in GROQ queries).  
- ContactSubmission mutation rejects missing consent, detects repeated submissions via `ipHash` + timestamp window, and confirms honeypot empty.

## 6. Data Lifecycle

- ISR revalidates pages when Sanity webhook sends `service`, `caseStudy`, `post`, `siteSettings` updates.  
- Contact submissions retained for 18 months (pending confirmation) then purged via scheduled script.  
- Optional CSV export accessible only through secure CLI command for leadership reporting.
