import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Privacy Policy - PixelLift AI",
  description: "Privacy practices for PixelLift AI.",
};

const sections = [
  {
    title: "1. Who We Are",
    body: [
      "PixelLift AI is an online AI image enhancement platform designed to help users upscale, denoise, sharpen, and enhance images quickly. The service also includes an AI blog and tutorial section.",
      "Website: [Website URL]",
      "Company / Owner: [Company Name]",
      "Business Address: [Business Address]",
      "Contact Email: [Support Email]",
      "Jurisdiction: [Jurisdiction]",
    ],
  },
  {
    title: "2. Information We Collect",
    body: [
      "We collect only the information necessary to provide, secure, improve, and operate PixelLift AI.",
    ],
    bullets: [
      "Images you upload, including JPG, JPEG, PNG, and WEBP files up to 5MB.",
      "Account information such as email address, user ID, display name, avatar URL, and session information.",
      "Usage information for free daily limits, including enhancement count, user ID or IP address, selected mode, and date of usage.",
      "Enhancement history for logged-in users, including original URL, enhanced URL, enhancement mode, file size, status, and error message.",
      "Device, log, and technical information such as browser type, device type, OS, referrer, pages visited, performance data, and security logs.",
      "Cookies and similar technologies for authentication, preferences, analytics, and AdSense on blog pages.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    body: [
      "We use collected information to provide the AI image enhancement tool, process uploads, return enhanced results, manage accounts, store enhancement history, enforce daily limits, improve performance, and comply with legal obligations.",
    ],
  },
  {
    title: "4. AI Image Processing",
    body: [
      "PixelLift AI processes uploaded images through its backend server before sending them to the AI processing provider.",
      "The documented system uses Next.js API routes, Replicate API, Real-ESRGAN, Vercel serverless functions, and Supabase for authentication, database, and usage tracking.",
    ],
    bullets: [
      "When you upload an image, the file is validated and checked against your usage limit.",
      "The image is then sent to Replicate for AI enhancement.",
      "The enhanced image URL is returned to the frontend for preview and download.",
      "Temporary image URLs may expire after approximately 24 hours.",
      "PixelLift AI does not train custom AI models in version 1.0.",
    ],
  },
  {
    title: "5. Legal Basis for Processing",
    bullets: [
      "Performance of a contract",
      "Legitimate interests",
      "Consent",
      "Legal obligations",
    ],
  },
  {
    title: "6. Data Sharing and Third-Party Services",
    body: [
      "We do not sell your uploaded images. We use third-party providers to operate the service.",
    ],
    bullets: [
      "Vercel: hosting, request logs, function logs, and performance logs.",
      "Supabase: authentication, user accounts, database storage, usage logs, enhancement history, and Row Level Security.",
      "Replicate: AI image processing using the Real-ESRGAN model.",
      "Google AdSense: ads on blog pages, depending on consent and regional law.",
      "Google OAuth: account creation and login if you choose Google sign-in.",
    ],
  },
  {
    title: "7. Data Retention",
    bullets: [
      "Account profiles are kept until the user deletes their account.",
      "Enhancement history is planned to be kept for the last 30 days per user.",
      "Usage logs are planned to be purged after 7 days.",
      "Temporary Replicate URLs may expire after approximately 24 hours.",
      "Anonymous usage data may be stored temporarily to enforce daily limits and prevent abuse.",
    ],
  },
  {
    title: "8. Data Security",
    bullets: [
      "API keys are kept server-side only.",
      "Replicate API token is never exposed to frontend code.",
      "Supabase service role key is server-side only.",
      "Uploaded images are validated server-side.",
      "File type and file size checks are enforced.",
      "Rate limiting is applied.",
      "Supabase Row Level Security protects user data.",
    ],
  },
  {
    title: "9. Image Upload Rules",
    bullets: [
      "Exceed 5MB",
      "Are not JPG, JPEG, PNG, or WEBP",
      "Have suspicious file names",
      "Contain unsupported formats",
      "Appear malicious or abusive",
      "Violate our Terms of Service",
    ],
  },
  {
    title: "10. User Accounts and Authentication",
    body: [
      "PixelLift AI uses Supabase Auth for login and registration. Users may be able to sign up or log in using email/password or Google OAuth.",
      "Logged-in users can access the dashboard and view enhancement history. Anonymous users can still use the tool but with a lower daily limit.",
    ],
  },
  {
    title: "11. User Rights",
    body: [
      "Depending on your location, you may have rights regarding your personal information, including access, correction, deletion, objection, withdrawal of consent, data portability, and opt-out rights for cookies or advertising technologies.",
      "To request access, correction, or deletion, contact us at [Support Email].",
    ],
  },
  {
    title: "12. Changes to This Privacy Policy",
    body: [
      "We may update this Privacy Policy from time to time. If we make material changes, we may notify users through website notices, in-app notices, email notices, or an updated Last Updated date.",
    ],
  },
  {
    title: "13. Contact Us",
    body: [
      "PixelLift AI",
      "Company / Owner: [Company Name]",
      "Address: [Business Address]",
      "Jurisdiction: [Jurisdiction]",
      "Email: [Support Email]",
      "Website: [Website URL]",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="relative overflow-hidden bg-[#F8FAFC]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_42%)]" />
      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Privacy Policy</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Privacy Policy for PixelLift AI
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            This policy explains how PixelLift AI collects, uses, stores, shares, and protects
            information when you use the website, AI image enhancement tool, dashboard, blog, and related
            services.
          </p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <p className="text-sm text-slate-500">Effective Date: [Effective Date]</p>
            <p className="mt-1 text-sm text-slate-500">Last Updated: [Last Updated Date]</p>
          </div>
        </header>

        <div className="mt-12 space-y-6">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8"
            >
              <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
                {section.body?.map((line) => <p key={line}>{line}</p>)}
                {section.bullets ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
