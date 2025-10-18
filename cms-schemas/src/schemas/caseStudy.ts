import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "caseStudy",
  type: "document",
  title: "Case Study",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required().max(120)
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(280)
    }),
    defineField({
      name: "placeholder",
      title: "Show Placeholder Messaging",
      type: "boolean",
      description: "Displays a coming-soon message on the site when the narrative is not yet published.",
      initialValue: false
    }),
    defineField({
      name: "objective",
      title: "Objective",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "approach",
      title: "Approach",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "outcomes",
      title: "Outcomes",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "metrics",
      title: "Key Metrics",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required().max(120)
            }),
            defineField({
              name: "value",
              type: "string",
              validation: (rule) => rule.required().max(60)
            })
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "value"
            }
          }
        })
      ],
      validation: (rule) => rule.max(6)
    }),
    defineField({
      name: "lessonsLearned",
      title: "Lessons Learned",
      type: "array",
      of: [defineArrayMember({ type: "block" })]
    }),
    defineField({
      name: "agency",
      type: "reference",
      to: [{ type: "agency" }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "date",
      title: "Publication Date",
      type: "datetime",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "status",
      type: "string",
      options: {
        list: [
          { title: "Published", value: "published" },
          { title: "Coming Soon", value: "comingSoon" },
          { title: "Draft", value: "draft" }
        ],
        layout: "radio"
      },
      initialValue: "draft",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "spotlightTestimonial",
      title: "Spotlight Testimonial",
      type: "object",
      fields: [
        defineField({
          name: "quote",
          type: "text",
          rows: 3,
          validation: (rule) => rule.max(320)
        }),
        defineField({
          name: "person",
          type: "string",
          validation: (rule) => rule.max(120)
        }),
        defineField({
          name: "role",
          type: "string",
          validation: (rule) => rule.max(160)
        }),
        defineField({
          name: "permissionReceived",
          type: "boolean",
          title: "Permission received",
          initialValue: false
        })
      ]
    }),
    defineField({
      name: "engagementType",
      title: "Engagement Type",
      type: "reference",
      to: [{ type: "service" }]
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (rule) => rule.required()
        })
      ]
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "title",
          type: "string",
          validation: (rule) => rule.max(60)
        }),
        defineField({
          name: "description",
          type: "text",
          rows: 3,
          validation: (rule) => rule.max(160)
        }),
        defineField({
          name: "ogImage",
          type: "image",
          options: { hotspot: true }
        })
      ]
    })
  ],
  preview: {
    select: {
      title: "title",
      agencyName: "agency.name",
      media: "heroImage",
      status: "status"
    },
    prepare({ title, agencyName, media, status }) {
      return {
        title,
        subtitle: `${status ?? "draft"} · ${agencyName ?? "Unassigned agency"}`,
        media
      };
    }
  }
});
