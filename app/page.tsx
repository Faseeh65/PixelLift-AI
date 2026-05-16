import { ShieldCheck, Sparkles, Zap } from "lucide-react";
import { EnhancementTool } from "@/components/tool/EnhancementTool";

export const revalidate = 86400;

export const metadata = {
  title: "PixelLift AI - AI Image Enhancement",
  description: "Transform your images to ultra-HD with AI-powered enhancement.",
};

const features = [
  {
    title: "Lightning Fast",
    description: "Enhanced in seconds, not minutes",
    icon: Zap,
    accent: "bg-blue-100 text-blue-600",
  },
  {
    title: "AI-Powered",
    description: "Advanced neural networks",
    icon: Sparkles,
    accent: "bg-violet-100 text-violet-600",
  },
  {
    title: "Secure Processing",
    description: "Images are processed through the enhancement backend",
    icon: ShieldCheck,
    accent: "bg-emerald-100 text-emerald-600",
  },
];

const steps = [
  ["Upload", "Add a JPG, PNG, or WEBP file."],
  ["Enhance", "Choose a mode and process the image."],
  ["Download", "Save the improved version instantly."],
] as const;

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-[#F8FAFC] text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_42%)]" />
      <section className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="flex flex-col items-center gap-8 sm:gap-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700 shadow-sm sm:px-5 sm:text-sm">
                <Sparkles className="h-4 w-4" />
                AI-Powered Enhancement
              </span>

              <div className="max-w-4xl text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl lg:text-6xl">
                  Transform Your Images to Ultra-HD
                </h1>
                <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  Upscale and enhance your photos to 10000x8000 pixels with AI precision. Preserve
                  details, sharpen edges, and restore natural colors in seconds.
                </p>
              </div>

              <div className="grid w-full gap-6 pt-2 sm:grid-cols-1 md:grid-cols-3">
                {features.map((feature) => (
                  <article key={feature.title} className="flex flex-col items-center text-center">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full ${feature.accent}`}>
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h2>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">{feature.description}</p>
                  </article>
                ))}
              </div>

              <div className="w-full pt-6 sm:pt-8">
                <p className="mb-4 text-center text-sm text-slate-500 sm:text-base">
                  Runs through the PixelLift enhancement engine.
                </p>
                <EnhancementTool showUsageCounter={false} variant="light" />
              </div>

              <div id="how-it-works" className="w-full pt-6">
                <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-1 md:grid-cols-3">
                  {steps.map(([title, description], index) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
                    >
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                        {index + 1}
                      </div>
                      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
