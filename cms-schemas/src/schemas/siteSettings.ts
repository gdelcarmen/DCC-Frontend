import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  type: "document",
  title: "Site Settings",
  fields: [
    defineField({
      name: "brand",
      title: "Brand System",
      type: "object",
      fields: [
        defineField({
          name: "colors",
          title: "Colors",
          type: "object",
          fields: [
            defineField({ name: "primary", type: "string", title: "Primary" }),
            defineField({ name: "secondary", type: "string", title: "Secondary" }),
            defineField({ name: "accent", type: "string", title: "Accent" }),
            defineField({ name: "neutral", type: "string", title: "Neutral" })
          ]
        }),
        defineField({
          name: "typography",
          title: "Typography",
          type: "object",
          fields: [
            defineField({ name: "heading", type: "string", title: "Heading Font" }),
            defineField({ name: "body", type: "string", title: "Body Font" })
          ]
        }),
        defineField({
          name: "logo",
          title: "Logo",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) => rule.required()
            })
          ]
        })
      ]
    }),
    defineField({
      name: "navigation",
      title: "Navigation Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "href",
              type: "string",
              validation: (rule) => rule.required()
            })
          ]
        })
      ],
      validation: (rule) => rule.min(1)
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (rule) => rule.required()
            })
          ]
        })
      ]
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "object",
      fields: [
        defineField({
          name: "title",
          type: "string"
        }),
        defineField({
          name: "description",
          type: "text",
          rows: 3
        }),
        defineField({
          name: "ogImage",
          type: "image",
          options: { hotspot: true }
        })
      ]
    }),
    defineField({
      name: "contact",
      title: "Contact Information",
      type: "object",
      fields: [
        defineField({ name: "email", type: "string" }),
        defineField({ name: "phone", type: "string" }),
        defineField({ name: "address", type: "text" })
      ]
    }),
    defineField({
      name: "accessibilityStatement",
      title: "Accessibility Statement",
      type: "array",
      of: [defineArrayMember({ type: "block" })]
    })
  ]
});
