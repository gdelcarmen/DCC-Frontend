import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  type: "document",
  title: "Blog Post",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required().max(140)
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
      rows: 4,
      validation: (rule) => rule.required().max(280)
    }),
    defineField({
      name: "placeholder",
      title: "Show Placeholder Messaging",
      type: "boolean",
      description: "Display a coming-soon message when the article copy is not yet finalized.",
      initialValue: false
    }),
    defineField({
      name: "body",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "authors",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "people" }]
        })
      ],
      validation: (rule) => rule.min(1)
    }),
    defineField({
      name: "categories",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        layout: "tags"
      }
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
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "estimatedRead",
      title: "Estimated Reading Time",
      type: "string",
      validation: (rule) => rule.max(20)
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
      subtitle: "estimatedRead",
      media: "heroImage",
      status: "status"
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title,
        subtitle: `${status ?? "draft"}${subtitle ? ` · ${subtitle}` : ""}`,
        media
      };
    }
  }
});
