import Image from "next/image";
import Link from "next/link";
import logo from "../../PixelLift_AI_removebg.png";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr] lg:gap-16">
          <div className="max-w-xl">
            <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold text-blue-700">
              <Image
                src={logo}
                alt="PixelLift AI logo"
                width={64}
                height={64}
                className="h-[56px] w-[56px] rounded-xl sm:h-[64px] sm:w-[64px]"
              />
              <span>PixelLift AI</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
              Professional AI-powered image enhancement for photographers, designers, and content creators.
              Transform your images to ultra-high resolution while preserving quality.
            </p>
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-slate-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-slate-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">Copyright 2024 PixelLift AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
