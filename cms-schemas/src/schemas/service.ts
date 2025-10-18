import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  type: "document",
  title: "Service Offering",
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
      name: "excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(240)
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "focusAreas",
      title: "Focus Areas",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        layout: "tags"
      }
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "question",
              type: "string",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "answer",
              type: "array",
              of: [defineArrayMember({ type: "block" })],
              validation: (rule) => rule.required()
            })
          ]
        })
      ]
    }),
    defineField({
      name: "relatedCaseStudies",
      title: "Related Case Studies",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "caseStudy" }]
        })
      ]
    }),
    defineField({
      name: "relatedPosts",
      title: "Related Posts",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "post" }]
        })
      ]
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Label",
      type: "string"
    }),
    defineField({
      name: "ctaUrl",
      title: "CTA URL",
      type: "url"
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
      subtitle: "excerpt"
    }
  }
});
