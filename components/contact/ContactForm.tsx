"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "",
};

const directEmail = "faseeeh.65@gmail.com";

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please provide your name, email, and message.");
      return;
    }

    if (form.message.trim().length < 10) {
      toast.error("Your message is too short.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          source: window.location.href,
        }),
      });

      const payload = (await response.json()) as { success?: boolean; message?: string; error?: string };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? `Unable to send message right now. You can email us directly at ${directEmail}.`);
      }

      toast.success(payload.message ?? "Message sent successfully.");
      setForm(initialState);
    } catch (error) {
      console.error("[contact-form] error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Unable to send message right now. You can email us directly at ${directEmail}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
      <label className="hidden" aria-hidden="true">
        Company
        <input
          value={form.company}
          onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
          tabIndex={-1}
          autoComplete="off"
          type="text"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
            placeholder="Your name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Subject <span className="font-normal text-slate-400">(optional)</span></span>
        <input
          value={form.subject}
          onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
          placeholder="How can we help?"
          type="text"
          maxLength={150}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Message</span>
        <textarea
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          className="min-h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
          placeholder="Write your message here..."
          rows={7}
          required
          minLength={10}
          maxLength={3000}
        />
      </label>

      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
        Send Message
      </Button>

      <p className="text-sm leading-6 text-slate-500">
        You can also email us directly at{" "}
        <a href={`mailto:${directEmail}`} className="font-semibold text-blue-600 hover:text-blue-700">
          {directEmail}
        </a>
        .
      </p>
    </form>
  );
}
