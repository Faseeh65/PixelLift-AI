import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";

export const revalidate = 86400;
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pixelliftai.online";

export const metadata: Metadata = {
  title: "Contact - PixelLift AI",
  description: "Get in touch with PixelLift AI.",
};

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden bg-[#F8FAFC]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_42%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <section className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Contact</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Get in touch with PixelLift AI
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Have questions, feedback, or suggestions? Send us a message through the form below.
            </p>

            <div className="mt-8 space-y-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
              <div>
                <p className="text-sm font-medium text-slate-500">Support</p>
                <p className="mt-1 text-base leading-7 text-slate-600">
                  Use the contact form on this page for support, privacy requests, copyright concerns, or product feedback.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Website</p>
                <Link
                  href={siteUrl}
                  className="mt-1 inline-flex break-all text-base font-semibold text-blue-600 hover:text-blue-700"
                >
                  {siteUrl}
                </Link>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Response time</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">
                  Messages are recorded for review. A direct public support email is not currently listed.
                </p>
              </div>
            </div>
          </section>

          <div className="min-w-0">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
