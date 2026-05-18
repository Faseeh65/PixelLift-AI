import { notFound } from "next/navigation";
import Script from "next/script";
import KeystaticApp from "../keystatic";
import { isKeystaticProductionAdminEnabled } from "@/lib/keystatic-server";

export const dynamic = "force-dynamic";

export default function KeystaticPage() {
  // Production only works when GitHub-backed Keystatic is fully configured.
  if (!isKeystaticProductionAdminEnabled()) {
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
