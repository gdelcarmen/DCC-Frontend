import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "person",
  type: "document",
  title: "Team Member",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "role",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "credentials",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        layout: "tags"
      }
    }),
    defineField({
      name: "bio",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "headshot",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (rule) => rule.required()
        })
      ],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "mediaLinks",
      title: "Media Links",
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
              name: "url",
              type: "url",
              validation: (rule) => rule.required()
            })
          ]
        })
      ]
    })
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "headshot"
    }
  }
});
