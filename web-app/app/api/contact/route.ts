import { NextResponse } from "next/server";

import { createContactSubmission } from "../../../lib/sanity/mutations";
import { hashIdentifier, rateLimit } from "../../../lib/security/rateLimit";
import { parseContactForm } from "../../../lib/validation/contact";

const RATE_LIMIT_LIMIT = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const getIpAddress = (request: Request): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "127.0.0.1";
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "127.0.0.1";
};

export async function POST(request: Request) {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) {
    return NextResponse.json(
      {
        ok: false,
        error: "SERVICE_UNAVAILABLE",
        message: "Rate limiting secret is not configured"
      },
      { status: 500 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID_JSON", message: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const parsed = parseContactForm(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "VALIDATION_ERROR",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      },
      { status: 400 }
    );
  }

  const ipAddress = getIpAddress(request);
  const ipHash = hashIdentifier(ipAddress, secret);

  const limitResult = rateLimit(`contact:${ipHash}`, {
    limit: RATE_LIMIT_LIMIT,
    windowMs: RATE_LIMIT_WINDOW_MS
  });

  if (limitResult.limited) {
    return NextResponse.json(
      {
        ok: false,
        error: "RATE_LIMITED",
        retryAfter: limitResult.retryAfter
      },
      {
        status: 429,
        headers: {
          "Retry-After": limitResult.retryAfter.toString()
        }
      }
    );
  }

  try {
    await createContactSubmission({
      agencyName: parsed.data.agencyName.trim(),
      contactName: parsed.data.contactName.trim(),
      contactEmail: parsed.data.contactEmail.trim().toLowerCase(),
      role: parsed.data.role?.trim() ?? "",
      serviceInterest: parsed.data.serviceInterest,
      message: parsed.data.message?.trim() ?? "",
      consent: parsed.data.consent,
      ipHash,
      metadata: {
        userAgent: request.headers.get("user-agent") ?? undefined,
        referrer: request.headers.get("referer") ?? undefined
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to create contact submission", error);
    }
    return NextResponse.json(
      {
        ok: false,
        error: "SERVICE_UNAVAILABLE",
        message: "Unable to store submission at this time"
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
