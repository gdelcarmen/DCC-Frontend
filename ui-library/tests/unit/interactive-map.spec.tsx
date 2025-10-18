import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@dcc/ui-library";
import type { ReactNode } from "react";
import { InteractiveMap } from "@dcc/ui-library/components/InteractiveMap/InteractiveMap";

const agencies = [
  {
    id: "agency-austin",
    name: "Austin Police Department",
    jurisdiction: "Austin, Texas",
    coordinates: { lat: 30.2672, lng: -97.7431 },
    engagementTypes: ["Bias-Free Policing", "Data Analytics"],
    permissionReceived: true
  },
  {
    id: "agency-sac",
    name: "Sacramento County Sheriff",
    jurisdiction: "Sacramento County, California",
    coordinates: { lat: 38.5816, lng: -121.4944 },
    engagementTypes: ["Policy Assessment"],
    permissionReceived: true
  }
];

const renderWithTheme = (ui: ReactNode) =>
  render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>);

describe("InteractiveMap fallback behaviour", () => {
  it("supports keyboard navigation between agencies when using fallback list", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <InteractiveMap agencies={agencies} forceListFallback heading="Agency map" />
    );

    const listbox = screen.getByRole("listbox", { name: /agency map/i });
    const options = within(listbox).getAllByRole("option");

    options[0].focus();
    await user.keyboard("{ArrowDown}");

    expect(options[1]).toHaveFocus();
  });

  it("marks reduced motion preference for downstream animation guards", () => {
    renderWithTheme(
      <InteractiveMap
        agencies={agencies}
        forceListFallback
        heading="Agency map"
        prefersReducedMotion
      />
    );

    const region = screen.getByRole("region", { name: /agency map/i });
    expect(region).toHaveAttribute("data-reduced-motion", "true");
  });

  it("surfaces clustering fallback messaging when clustering is disabled", () => {
    renderWithTheme(
      <InteractiveMap
        agencies={agencies}
        forceListFallback
        heading="Agency map"
        supportsClustering={false}
      />
    );

    expect(
      screen.getByText(/showing simplified list while clustering is unavailable/i)
    ).toBeInTheDocument();
  });
});
