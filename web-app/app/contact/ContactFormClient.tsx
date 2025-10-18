'use client';

import { useCallback } from "react";

import {
  ContactFormWizard,
  type ContactFormValues
} from "@dcc/ui-library/components/ContactForm";

const SERVICE_OPTIONS = [
  "Bias-Free Policing",
  "Data Analytics",
  "Implementation Assessment",
  "Innovation & Training",
  "Policy Assessment",
  "Community Engagement"
];

export function ContactFormClient(): JSX.Element {
  const handleSubmit = useCallback(async (values: ContactFormValues) => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      const message =
        payload?.issues?.[0]?.message ?? payload?.message ?? "Unable to submit your request.";
      throw new Error(message);
    }
  }, []);

  return <ContactFormWizard onSubmit={handleSubmit} serviceOptions={SERVICE_OPTIONS} />;
}
