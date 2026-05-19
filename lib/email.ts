import "server-only";
import { Resend } from "resend";

export type ContactNotificationInput = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  ip?: string;
  source?: string;
  submittedAt: string;
};

const emailSubject = "New Contact Form Submission - PixelLift AI";

function getRequiredEnv(name: "RESEND_API_KEY" | "CONTACT_TO_EMAIL" | "CONTACT_FROM_EMAIL"): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required email environment variable: ${name}`);
  }

  return value;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatOptional(value?: string): string {
  return value?.trim() ? value.trim() : "Not provided";
}

function buildTextEmail(input: ContactNotificationInput): string {
  return [
    "New contact form submission from PixelLift AI",
    "",
    "Name:",
    input.name,
    "",
    "Email:",
    input.email,
    "",
    "Subject:",
    formatOptional(input.subject),
    "",
    "Message:",
    input.message,
    "",
    "Submitted at:",
    input.submittedAt,
    "",
    "Source:",
    formatOptional(input.source),
    "",
    "IP:",
    formatOptional(input.ip),
  ].join("\n");
}

function buildHtmlEmail(input: ContactNotificationInput): string {
  const rows: Array<[string, string]> = [
    ["Name", input.name],
    ["Email", input.email],
    ["Subject", formatOptional(input.subject)],
    ["Message", input.message],
    ["Submitted at", input.submittedAt],
    ["Source", formatOptional(input.source)],
    ["IP", formatOptional(input.ip)],
  ];

  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h2 style="margin: 0 0 16px;">New contact form submission from PixelLift AI</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <td style="width: 140px; padding: 10px; border: 1px solid #e2e8f0; font-weight: 700; vertical-align: top;">${escapeHtml(label)}</td>
                  <td style="padding: 10px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${escapeHtml(value)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

export async function sendContactNotificationEmail(input: ContactNotificationInput): Promise<void> {
  const resend = new Resend(getRequiredEnv("RESEND_API_KEY"));
  const to = getRequiredEnv("CONTACT_TO_EMAIL");
  const from = getRequiredEnv("CONTACT_FROM_EMAIL");

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: emailSubject,
    text: buildTextEmail(input),
    html: buildHtmlEmail(input),
  });

  if (error) {
    throw new Error(`Resend contact email failed: ${error.message}`);
  }
}
