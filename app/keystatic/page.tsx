import { notFound } from "next/navigation";
import KeystaticApp from "./keystatic";

export const dynamic = "force-dynamic";

export default function KeystaticPage() {
  // Local mode only: edit blog posts locally, commit the saved files, and let Vercel deploy the static content.
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KeystaticApp />;
}
