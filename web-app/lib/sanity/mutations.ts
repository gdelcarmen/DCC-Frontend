import type { SanityDocument } from "@sanity/client";

import { getSanityPreviewClient } from "./client";

export interface ContactSubmissionInput {
  agencyName: string;
  contactName: string;
  contactEmail: string;
  role: string;
  serviceInterest: string[];
  message: string;
  consent: boolean;
  ipHash: string;
  createdAt?: string;
  metadata?: {
    userAgent?: string;
    referrer?: string;
  };
}

const redact = (value: string): string =>
  value.replace(/[a-z0-9._%+-]+@[a-z0-9.-]+/gi, "[redacted-email]");

export const createContactSubmission = async (
  input: ContactSubmissionInput
): Promise<SanityDocument<Record<string, unknown>>> => {
  const client = getSanityPreviewClient();
  const timestamp = input.createdAt ?? new Date().toISOString();

  try {
    return await client.create({
      _type: "contactSubmission",
      agencyName: input.agencyName,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      role: input.role,
      serviceInterest: input.serviceInterest,
      message: input.message,
      consent: input.consent,
      ipHash: input.ipHash,
      createdAt: timestamp,
      metadata: input.metadata ?? {}
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to persist contact submission", {
        error,
        agencyName: redact(input.agencyName),
        contactEmail: redact(input.contactEmail)
      });
    }
    throw error;
  }
};
