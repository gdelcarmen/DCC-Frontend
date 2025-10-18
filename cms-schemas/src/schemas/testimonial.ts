import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  type: "document",
  title: "Testimonial",
  fields: [
    defineField({
      name: "quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(500)
    }),
    defineField({
      name: "person",
      title: "Person",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "role",
      type: "string"
    }),
    defineField({
      name: "agency",
      type: "reference",
      to: [{ type: "agency" }]
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime"
    }),
    defineField({
      name: "permissionDocument",
      title: "Permission Document",
      type: "file"
    }),
    defineField({
      name: "permissionReceived",
      title: "Permission Received",
      type: "boolean",
      initialValue: false,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "display",
      title: "Display on Site",
      type: "boolean",
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: "person",
      agencyName: "agency.name"
    },
    prepare({ title, agencyName }) {
      return {
        title,
        subtitle: agencyName ?? "Standalone testimonial"
      };
    }
  }
});
