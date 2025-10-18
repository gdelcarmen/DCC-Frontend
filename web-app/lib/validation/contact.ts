import { z } from "zod";

export const contactSchema = z
  .object({
    agencyName: z.string().trim().min(1, "Agency name is required."),
    contactName: z.string().trim().min(1, "Contact name is required."),
    contactEmail: z.string().trim().email("Enter a valid email address."),
    role: z.string().trim().default(""),
    serviceInterest: z
      .array(z.string().trim().min(1))
      .min(1, "Select at least one engagement interest."),
    message: z.string().trim().max(2000).optional().default(""),
    consent: z.boolean(),
    honeypot: z.string().optional().transform((value) => value?.trim() ?? "")
  })
  .refine((data) => data.consent === true, {
    message: "Consent is required before submission.",
    path: ["consent"]
  })
  .refine((data) => !data.honeypot, {
    message: "Spam detection triggered.",
    path: ["honeypot"]
  });

export type ContactFormPayload = z.infer<typeof contactSchema>;

export interface ContactSubmissionRecord extends Omit<ContactFormPayload, "honeypot"> {
  ipHash: string;
  createdAt: string;
}

export const parseContactForm = (input: unknown) => contactSchema.safeParse(input);
