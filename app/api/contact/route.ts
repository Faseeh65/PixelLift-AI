import { NextRequest, NextResponse } from "next/server";
import { sendContactNotificationEmail } from "@/lib/email";
import { getClientIP } from "@/lib/utils";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_RATE_LIMIT_WINDOW_MS = 60_000;
const CONTACT_RATE_LIMIT_MAX_REQUESTS = 3;
const contactRateLimit = new Map<string, number[]>();

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  company?: unknown;
  source?: unknown;
};

function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isRateLimited(ipAddress: string): boolean {
  const now = Date.now();
  const recentRequests = contactRateLimit.get(ipAddress)?.filter((timestamp) => now - timestamp < CONTACT_RATE_LIMIT_WINDOW_MS) ?? [];

  if (recentRequests.length >= CONTACT_RATE_LIMIT_MAX_REQUESTS) {
    contactRateLimit.set(ipAddress, recentRequests);
    return true;
  }

  contactRateLimit.set(ipAddress, [...recentRequests, now]);
  return false;
}

function validationError(error: string) {
  return NextResponse.json({ success: false, error }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    let payload: ContactPayload;

    try {
      payload = (await request.json()) as ContactPayload;
    } catch {
      return validationError("Please submit a valid contact form.");
    }

    const name = getString(payload.name);
    const email = getString(payload.email).toLowerCase();
    const subject = getString(payload.subject);
    const message = getString(payload.message);
    const company = getString(payload.company);
    const ipAddress = getClientIP(request);
    const source = (getString(payload.source) || request.headers.get("referer")?.trim() || "Contact page").slice(0, 500);
    const submittedAt = new Date().toISOString();

    if (company) {
      return NextResponse.json({ success: true, message: "Message sent successfully." });
    }

    if (isRateLimited(ipAddress)) {
      return validationError("Please wait a moment before sending another message.");
    }

    if (!name || !email || !message) {
      return validationError("Please provide your name, email, and message.");
    }

    if (name.length > 100) {
      return validationError("Name must be 100 characters or fewer.");
    }

    if (email.length > 254) {
      return validationError("Email must be 254 characters or fewer.");
    }

    if (subject.length > 150) {
      return validationError("Subject must be 150 characters or fewer.");
    }

    if (message.length > 3000) {
      return validationError("Message must be 3000 characters or fewer.");
    }

    if (!isValidEmail(email)) {
      return validationError("Please enter a valid email address.");
    }

    if (message.length < 10) {
      return validationError("Your message is too short.");
    }

    await sendContactNotificationEmail({
      name,
      email,
      subject,
      message,
      ip: ipAddress,
      source,
      submittedAt,
    });

    return NextResponse.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("[api/contact] error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to send message right now. Please try again later." },
      { status: 500 }
    );
  }
}
