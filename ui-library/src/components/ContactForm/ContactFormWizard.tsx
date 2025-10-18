'use client';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  VisuallyHidden
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { FormStepper, type FormStep } from "./FormStepper";
import {
  ContactFormStepRenderProps,
  type ContactFormErrors,
  type ContactFormValues
} from "./types";
import { AgencyDetailsStep, ReviewSubmitStep, ServiceInterestStep } from "./steps";

export interface ContactFormWizardProps {
  onSubmit: (values: ContactFormValues) => Promise<void> | void;
  serviceOptions?: string[];
}

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

const DEFAULT_VALUES: ContactFormValues = {
  agencyName: "",
  contactName: "",
  contactEmail: "",
  role: "",
  serviceInterest: [],
  message: "",
  consent: false,
  honeypot: ""
};

const STEP_METADATA: Array<Omit<FormStep, "isComplete">> = [
  {
    id: "agency",
    title: "Agency Details",
    description: "Who should we coordinate with?"
  },
  {
    id: "interests",
    title: "Service Interest",
    description: "Pick the support areas you need"
  },
  {
    id: "review",
    title: "Review & Submit",
    description: "Confirm details and send"
  }
];

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const StepComponents = [
  AgencyDetailsStep,
  ServiceInterestStep,
  ReviewSubmitStep
] as const;

const removeStepErrors = (
  previous: ContactFormErrors,
  fields: Array<keyof ContactFormErrors>
): ContactFormErrors => {
  if (!fields.length) {
    return previous;
  }
  const next = { ...previous };
  fields.forEach((field) => {
    delete next[field];
  });
  return next;
};

const stepFieldMap: Array<Array<keyof ContactFormValues>> = [
  ["agencyName", "contactName", "contactEmail", "role"],
  ["serviceInterest"],
  ["message", "consent"]
];

export function ContactFormWizard({
  onSubmit,
  serviceOptions
}: ContactFormWizardProps): JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<ContactFormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const currentStepFields = stepFieldMap[currentStep];
  const steps = useMemo<Array<FormStep>>(
    () =>
      STEP_METADATA.map((meta, index) => ({
        ...meta,
        isComplete: index < currentStep
      })),
    [currentStep]
  );

  const updateField: ContactFormStepRenderProps["onUpdate"] = (field, nextValue) => {
    setValues((prev) => ({
      ...prev,
      [field]:
        typeof nextValue === "string" ? nextValue : nextValue
    }));
    if (errors[field]) {
      setErrors((prev) => removeStepErrors(prev, [field]));
    }
  };

  const validateStep = (stepIndex: number, data: ContactFormValues): ContactFormErrors => {
    const stepErrors: ContactFormErrors = {};
    if (stepIndex === 0) {
      if (!data.agencyName) {
        stepErrors.agencyName = "Agency name is required.";
      }
      if (!data.contactName) {
        stepErrors.contactName = "Contact name is required.";
      }
      if (!data.contactEmail) {
        stepErrors.contactEmail = "Enter a valid email address.";
      } else if (!emailRegex.test(data.contactEmail)) {
        stepErrors.contactEmail = "Enter a valid email address.";
      }
    } else if (stepIndex === 1) {
      if (!data.serviceInterest.length) {
        stepErrors.serviceInterest = "Select at least one engagement interest.";
      }
    } else if (stepIndex === 2) {
      if (!data.consent) {
        stepErrors.consent = "Consent is required before submission.";
      }
      if (data.honeypot) {
        stepErrors.honeypot = "Spam detection triggered.";
      }
    }
    return stepErrors;
  };

  const navigateToStep = (nextIndex: number) => {
    if (nextIndex === currentStep) {
      return;
    }
    if (nextIndex > currentStep) {
      const stepErrors = validateStep(currentStep, values);
      if (Object.keys(stepErrors).length) {
        setErrors((prev) => ({ ...prev, ...stepErrors }));
        setStatus("error");
        setStatusMessage("Please correct the highlighted fields to continue.");
        return;
      }
    }
    setErrors((prev) => removeStepErrors(prev, currentStepFields));
    setStatus("idle");
    setStatusMessage("");
    setCurrentStep(nextIndex);
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, values);
    if (Object.keys(stepErrors).length) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      setStatus("error");
      setStatusMessage("Please correct the highlighted fields to continue.");
      return;
    }
    setErrors((prev) => removeStepErrors(prev, currentStepFields));
    setStatus("idle");
    setCurrentStep((prev) => Math.min(prev + 1, StepComponents.length - 1));
  };

  const handleBack = () => {
    setErrors((prev) => removeStepErrors(prev, currentStepFields));
    setStatus("idle");
    setStatusMessage("");
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const stepErrors = validateStep(currentStep, values);
    if (Object.keys(stepErrors).length) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      const topLevelMessage =
        stepErrors.honeypot ?? "Please correct the highlighted fields before submitting.";
      setStatus("error");
      setStatusMessage(topLevelMessage);
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      const submission: ContactFormValues = {
        ...values,
        agencyName: values.agencyName.trim(),
        contactName: values.contactName.trim(),
        contactEmail: values.contactEmail.trim(),
        role: values.role.trim(),
        message: values.message.trim()
      };

      await onSubmit(submission);
      setStatus("success");
      setStatusMessage(
        "Thank you for reaching out. Our team will follow up within two business days."
      );
      setValues(DEFAULT_VALUES);
      setCurrentStep(0);
      setErrors({});
    } catch (error) {
      setStatus("error");
      const message =
        error instanceof Error
          ? error.message || "Something went wrong while submitting your message."
          : "Something went wrong while submitting your message.";
      setStatusMessage(message);
    }
  };

  const StepComponent = StepComponents[currentStep];

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      noValidate
      bg="bg.surface"
      borderRadius="2xl"
      px={{ base: 4, md: 8 }}
      py={{ base: 6, md: 10 }}
    >
      <Stack spacing={{ base: 6, md: 8 }}>
        <FormStepper
          steps={steps}
          currentStep={currentStep}
          onNavigate={navigateToStep}
        />

        {status !== "idle" ? (
          <Alert
            status={status === "success" ? "success" : status === "error" ? "error" : "info"}
            role={status === "success" ? "status" : "alert"}
            borderRadius="lg"
            variant="subtle"
          >
            <AlertIcon />
            <AlertDescription>{statusMessage}</AlertDescription>
          </Alert>
        ) : null}

        <StepComponent
          value={values}
          errors={errors}
          onUpdate={updateField}
          serviceOptions={serviceOptions}
        />

        <FormControl display="none">
          <FormLabel htmlFor="contact-honeypot">
            Leave this field blank (spam prevention)
          </FormLabel>
          <Input
            id="contact-honeypot"
            name="honeypot"
            value={values.honeypot}
            onChange={(event) => updateField("honeypot", event.currentTarget.value)}
            tabIndex={-1}
            autoComplete="off"
          />
          <VisuallyHidden>{errors.honeypot}</VisuallyHidden>
        </FormControl>

        <Stack direction={{ base: "column", md: "row" }} spacing={3} justify="flex-end">
          {currentStep > 0 ? (
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
          ) : null}
          {currentStep < StepComponents.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              colorScheme="teal"
              isDisabled={status === "submitting"}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              colorScheme="teal"
              isLoading={status === "submitting"}
            >
              Submit request
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
