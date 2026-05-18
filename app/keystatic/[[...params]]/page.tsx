import { notFound } from "next/navigation";
import Script from "next/script";
import KeystaticApp from "../keystatic";

export const dynamic = "force-dynamic";

export default function KeystaticPage() {
  // Local mode only: edit blog posts locally, commit the saved files, and let Vercel deploy the static content.
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <>
      <Script
        id="keystatic-light-theme"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            try {
              localStorage.setItem('keystatic-color-scheme', 'light');
              document.documentElement.style.colorScheme = 'light';
            } catch (error) {}
          `,
        }}
      />
      <KeystaticApp />
    </>
  );
}
