export interface ContactFormValues {
  agencyName: string;
  contactName: string;
  contactEmail: string;
  role: string;
  serviceInterest: string[];
  message: string;
  consent: boolean;
  honeypot: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export interface ContactFormStepRenderProps {
  value: ContactFormValues;
  errors: ContactFormErrors;
  onUpdate: <Key extends keyof ContactFormValues>(
    field: Key,
    nextValue: ContactFormValues[Key]
  ) => void;
  serviceOptions?: string[];
}
