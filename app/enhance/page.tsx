import { EnhancementTool } from "@/components/tool/EnhancementTool";

export const metadata = {
  title: "Enhance Images | PixelLift AI",
  description: "Use PixelLift AI to enhance images directly in your browser with AI upscaling.",
};

export default function EnhancePage() {
  return (
    <div className="bg-[#F8FAFC]">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Browser enhancement
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Upscale images without leaving your browser
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Upload a JPG, PNG, or WEBP file and let PixelLift AI enhance it locally when your browser supports the model.
          </p>
        </div>

        <div className="mt-8">
          <EnhancementTool />
        </div>
      </section>
    </div>
  );
}
