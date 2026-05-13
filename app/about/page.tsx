import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "About - PixelLift AI",
  description: "Learn more about PixelLift AI and what it does.",
};

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden bg-[#F8FAFC]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_42%)]" />
      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">About</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            About PixelLift AI
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            PixelLift AI is an AI-powered image enhancement web app that helps users upscale, sharpen,
            denoise, and improve images in seconds.
          </p>
        </header>

        <section className="mt-10 space-y-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <p className="text-sm leading-7 text-slate-600 sm:text-base">
            Our platform is built for content creators, ecommerce sellers, students, bloggers, designers,
            and everyday users who need better-quality images without using complicated editing software.
          </p>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">
            With PixelLift AI, you can upload an image, choose an enhancement mode, preview the
            before-and-after result, and download the enhanced image directly from your browser.
          </p>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">
            PixelLift AI also includes an AI blog where users can learn about image enhancement, AI tools,
            editing tips, and practical tutorials.
          </p>
          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Our Mission</p>
            <p className="mt-3 text-lg leading-8 text-slate-900">
              Make AI image enhancement fast, easy, and accessible for everyone.
            </p>
          </div>
          <p className="text-base font-semibold text-slate-900">PixelLift AI - Enhance your images in seconds.</p>
        </section>
      </div>
    </div>
  );
}
