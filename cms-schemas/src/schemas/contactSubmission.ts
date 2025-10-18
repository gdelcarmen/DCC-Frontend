import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "contactSubmission",
  type: "document",
  title: "Contact Submission",
  fields: [
    defineField({
      name: "createdAt",
      type: "datetime",
      title: "Received at",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "agencyName",
      type: "string",
      title: "Agency name",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "contactName",
      type: "string",
      title: "Contact name",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "contactEmail",
      type: "string",
      title: "Contact email",
      validation: (rule) => rule.required().email()
    }),
    defineField({
      name: "role",
      type: "string",
      title: "Role / Title"
    }),
    defineField({
      name: "serviceInterest",
      title: "Service interest",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        layout: "tags"
      }
    }),
    defineField({
      name: "message",
      type: "text",
      title: "Message",
      rows: 6
    }),
    defineField({
      name: "consent",
      type: "boolean",
      title: "Consent acknowledged",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "ipHash",
      type: "string",
      title: "IP Hash",
      readOnly: true
    }),
    defineField({
      name: "metadata",
      type: "object",
      title: "Metadata",
      options: {
        collapsible: true,
        collapsed: true
      },
      fields: [
        defineField({
          name: "userAgent",
          type: "string",
          title: "User agent"
        }),
        defineField({
          name: "referrer",
          type: "url",
          title: "Referrer",
          validation: (rule) => rule.uri({ allowRelative: true })
        })
      ]
    })
  ],
  preview: {
    select: {
      title: "agencyName",
      subtitle: "contactName",
      createdAt: "createdAt"
    },
    prepare({ title, subtitle, createdAt }: { title?: string; subtitle?: string; createdAt?: string }) {
      return {
        title: title ?? "Unknown agency",
        subtitle: subtitle ? `${subtitle} • ${new Date(createdAt ?? "").toLocaleString()}` : undefined
      };
    }
  }
});
