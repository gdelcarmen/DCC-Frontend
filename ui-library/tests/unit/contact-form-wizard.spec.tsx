import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

import { theme } from "@dcc/ui-library";
import { ContactFormWizard } from "@dcc/ui-library/components/ContactForm";

const renderWithProviders = (ui: ReactNode) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);
};

const fillAgencyDetailsStep = () => {
  fireEvent.change(screen.getByLabelText(/agency name/i), {
    target: { value: "Austin Police Department" }
  });
  fireEvent.change(screen.getByLabelText(/contact name/i), {
    target: { value: "Jordan Williams" }
  });
  fireEvent.change(screen.getByLabelText(/contact email/i), {
    target: { value: "chief@austinpd.gov" }
  });
  fireEvent.change(screen.getByLabelText(/role/i), {
    target: { value: "Chief of Police" }
  });
};

describe("ContactFormWizard", () => {
  it("progresses through steps and submits collected data", async () => {
    const handleSubmit = jest.fn().mockResolvedValue(undefined);

    renderWithProviders(<ContactFormWizard onSubmit={handleSubmit} />);

    expect(
      screen.getByRole("heading", { level: 2, name: /agency details/i })
    ).toBeInTheDocument();

    fillAgencyDetailsStep();
    await waitFor(() =>
      expect(screen.getByLabelText(/agency name/i)).toHaveValue("Austin Police Department")
    );
    await waitFor(() =>
      expect(screen.getByLabelText(/contact email/i)).toHaveValue("chief@austinpd.gov")
    );
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(
      screen.getByRole("heading", { level: 2, name: /service interest/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/bias-free policing/i));
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(
      screen.getByRole("heading", { level: 2, name: /review & submit/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/austin police department/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/how can we support your agency/i), {
      target: { value: "Need assistance with consent decree reporting." }
    });
    fireEvent.click(
      screen.getByRole("checkbox", { name: /i consent to del carmen consulting storing this submission/i })
    );

    fireEvent.click(screen.getByRole("button", { name: /submit request/i }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        agencyName: "Austin Police Department",
        contactName: "Jordan Williams",
        contactEmail: "chief@austinpd.gov",
        role: "Chief of Police",
        serviceInterest: expect.arrayContaining(["Bias-Free Policing"]),
        message: "Need assistance with consent decree reporting.",
        consent: true
      })
    );
  });

  it("prevents advancing when validation fails", async () => {
    renderWithProviders(<ContactFormWizard onSubmit={jest.fn()} />);

    expect(
      screen.getByRole("heading", { level: 2, name: /agency details/i })
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/contact email/i), {
      target: { value: "invalid-email" }
    });
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(
      screen.getByRole("heading", { level: 2, name: /agency details/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/agency name is required/i)).toBeVisible();
    expect(screen.getByText(/enter a valid email address/i)).toBeVisible();
  });

  it("supports keyboard navigation through step headers", async () => {
    renderWithProviders(<ContactFormWizard onSubmit={jest.fn()} />);

    fillAgencyDetailsStep();
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    const agencyStepTab = screen.getByRole("tab", { name: /agency details/i });
    expect(agencyStepTab).toHaveAttribute("aria-selected", "false");
    fireEvent.click(agencyStepTab);

    expect(screen.getByRole("heading", { level: 2, name: /agency details/i })).toBeInTheDocument();
  });
});
