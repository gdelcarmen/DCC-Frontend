import type { NextResponse } from "next/server";
import { TextDecoder, TextEncoder } from "util";

if (typeof global.TextEncoder === "undefined") {
  (global as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  (global as unknown as { TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Request, Response, Headers, fetch } = require("undici");

if (typeof global.Request === "undefined") {
  (global as unknown as { Request: typeof Request }).Request = Request;
}

if (typeof global.Response === "undefined") {
  (global as unknown as { Response: typeof Response }).Response = Response;
}

if (typeof global.Headers === "undefined") {
  (global as unknown as { Headers: typeof Headers }).Headers = Headers;
}

if (typeof global.fetch === "undefined") {
  (global as unknown as { fetch: typeof fetch }).fetch = fetch;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { POST } = require("../../app/api/contact/route") as {
  POST: (request: Request) => Promise<NextResponse>;
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createContactSubmission } = require("../../lib/sanity/mutations") as {
  createContactSubmission: jest.Mock;
};

jest.mock("../../lib/sanity/mutations", () => ({
  createContactSubmission: jest.fn()
}));

const createContactSubmissionMock = createContactSubmission as jest.Mock;

const buildRequest = (payload: Record<string, unknown>): Request => {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.7"
    },
    body: JSON.stringify(payload)
  });
};

const VALID_PAYLOAD = {
  agencyName: "Austin Police Department",
  contactName: "Jordan Williams",
  contactEmail: "chief@austinpd.gov",
  role: "Chief",
  serviceInterest: ["Bias-Free Policing", "Data Analytics"],
  message: "Need help with equity audits.",
  consent: true,
  honeypot: ""
};

describe("Contact API route", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    process.env.SANITY_API_TOKEN = "test-token";
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "project-id";
    process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
    process.env.RATE_LIMIT_SECRET = "rate-limit-secret";
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("accepts valid submissions and forwards them to Sanity", async () => {
    createContactSubmissionMock.mockResolvedValue({ _id: "mock-id" });

    const response = await POST(buildRequest(VALID_PAYLOAD));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ ok: true });
    expect(createContactSubmissionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        agencyName: VALID_PAYLOAD.agencyName,
        contactEmail: VALID_PAYLOAD.contactEmail,
        consent: true,
        ipHash: expect.any(String)
      })
    );
  });

  it("rejects honeypot submissions with validation error", async () => {
    const response = await POST(
      buildRequest({
        ...VALID_PAYLOAD,
        honeypot: "http://malicious.test"
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      ok: false,
      error: "VALIDATION_ERROR"
    });
    expect(createContactSubmissionMock).not.toHaveBeenCalled();
  });

  it("surfaces mutation errors as service unavailable", async () => {
    createContactSubmissionMock.mockRejectedValue(new Error("Service offline"));

    const response = await POST(buildRequest(VALID_PAYLOAD));
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body).toMatchObject({
      ok: false,
      error: "SERVICE_UNAVAILABLE"
    });
  });
});
