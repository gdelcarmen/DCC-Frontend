import type { PreviewValue } from "sanity";
import { defineArrayMember, defineField, defineType } from "sanity";

import GeoCoordinateInput from "../components/geoCoordinateInput";

const ENGAGEMENT_TYPE_OPTIONS = [
  { value: "Bias-Free Policing", title: "Bias-Free Policing" },
  { value: "Data Analytics", title: "Data Analytics" },
  { value: "Policy Assessment", title: "Policy Assessment" },
  { value: "Implementation Assessment", title: "Implementation Assessment" },
  { value: "Innovation & Training", title: "Innovation & Training" },
  { value: "Consent Decree Compliance", title: "Consent Decree Compliance" }
];

const hasCoordinate = (value?: number): boolean => Number.isFinite(value ?? NaN);

const validateCoordinates = (coordinates: { lat?: number; lng?: number } | undefined) => {
  if (!coordinates) {
    return "Latitude and longitude are required.";
  }
  const { lat, lng } = coordinates;
  if (!hasCoordinate(lat) || !hasCoordinate(lng)) {
    return "Latitude and longitude are required.";
  }
  const latValue = lat ?? NaN;
  const lngValue = lng ?? NaN;
  if (latValue < -90 || latValue > 90) {
    return "Latitude must be between -90 and 90 degrees.";
  }
  if (lngValue < -180 || lngValue > 180) {
    return "Longitude must be between -180 and 180 degrees.";
  }
  return true;
};

export default defineType({
  name: "agency",
  type: "document",
  title: "Agency",
  fieldsets: [
    { name: "coordinates", title: "Coordinates", options: { columns: 2 } },
    { name: "permissions", title: "Permissions & Compliance" }
  ],
  fields: [
    defineField({
      name: "name",
      title: "Agency Name",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 64
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "jurisdiction",
      title: "Jurisdiction",
      type: "string",
      description: "City, county, or state served.",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "coordinates",
      title: "Map Coordinates",
      type: "object",
      fieldset: "coordinates",
      components: {
        input: GeoCoordinateInput
      },
      options: {
        columns: 2
      },
      fields: [
        defineField({
          name: "lat",
          title: "Latitude",
          type: "number",
          hidden: true
        }),
        defineField({
          name: "lng",
          title: "Longitude",
          type: "number",
          hidden: true
        })
      ],
      validation: (rule) =>
        rule.required().custom((value) => validateCoordinates(value as { lat?: number; lng?: number }))
    }),
    defineField({
      name: "logo",
      title: "Agency Logo",
      type: "image",
      options: {
        hotspot: true
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (rule) => rule.required().max(120)
        })
      ]
    }),
    defineField({
      name: "permissionReceived",
      title: "Permission to Display Assets",
      type: "boolean",
      fieldset: "permissions",
      initialValue: false,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "mapDisplay",
      title: "Display on Public Map",
      type: "boolean",
      fieldset: "permissions",
      description:
        "Disable to keep this agency in historical data while hiding it from the public map.",
      initialValue: true
    }),
    defineField({
      name: "permissionNotes",
      title: "Permission Notes",
      type: "text",
      fieldset: "permissions"
    }),
    defineField({
      name: "engagementTypes",
      title: "Engagement Types",
      type: "array",
      of: [
        defineArrayMember({
          type: "string"
        })
      ],
      options: {
        layout: "tags",
        list: ENGAGEMENT_TYPE_OPTIONS
      },
      validation: (rule) => rule.min(1)
    }),
    defineField({
      name: "yearEngaged",
      title: "Year Engaged",
      type: "number",
      validation: (rule) => rule.min(1900).max(new Date().getFullYear())
    }),
    defineField({
      name: "caseStudies",
      title: "Case Studies",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "caseStudy" }]
        })
      ]
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "testimonial" }]
        })
      ]
    }),
    defineField({
      name: "featured",
      title: "Feature on Homepage",
      type: "boolean",
      initialValue: false
    })
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "jurisdiction",
      media: "logo",
      permissionReceived: "permissionReceived",
      mapDisplay: "mapDisplay"
    },
    prepare({
      title,
      subtitle,
      media,
      permissionReceived,
      mapDisplay
    }: {
      title?: string;
      subtitle?: string;
      media?: PreviewValue["media"];
      permissionReceived?: boolean;
      mapDisplay?: boolean;
    }): PreviewValue {
      const status: string[] = [];
      if (permissionReceived === false) {
        status.push("Permission pending");
      }
      if (mapDisplay === false) {
        status.push("Hidden from map");
      }

      return {
        title,
        subtitle,
        media,
        description: status.length ? status.join(" • ") : "Display ready"
      };
    }
  }
});
