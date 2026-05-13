"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import logo from "../../PixelLift_AI_removebg.png";

interface NavbarUser {
  email?: string;
  avatarUrl?: string | null;
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<NavbarUser | null>(null);
  const isLanding = pathname === "/";
  const shellClass = "border-b border-slate-200 bg-white/90 text-slate-900 backdrop-blur";
  const linkClass = "text-sm transition text-slate-600 hover:text-slate-900";
  const brandClass = "text-blue-700";
  const mobileShellClass = "border-t border-slate-200 bg-white";

  useEffect(() => {
    const supabase = createClient();
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(
        session?.user
          ? {
              email: session.user.email ?? undefined,
              avatarUrl:
                typeof session.user.user_metadata.avatar_url === "string"
                  ? session.user.user_metadata.avatar_url
                  : null,
            }
            : null
      );
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const links = [
    ...(isLanding
      ? [
          { href: "#how-it-works", label: "How it works" },
          { href: "/blog", label: "Blog" },
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
        ]
      : [
          { href: "/blog", label: "Blog" },
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
        ]),
  ];

  return (
    <header className={cn("sticky top-0 z-50", shellClass)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link href="/" className={cn("flex min-w-0 items-center gap-3 text-base font-semibold sm:text-lg", brandClass)}>
          <Image
            src={logo}
            alt="PixelLift AI logo"
            width={56}
            height={56}
            className="h-[52px] w-[52px] rounded-xl sm:h-[56px] sm:w-[56px]"
            priority
          />
          <span className="truncate">PixelLift AI</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user && !isLanding ? (
            <>
              <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm"
                aria-label="Dashboard"
              >
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.email ?? "User"}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-slate-700">
                    {user.email?.slice(0, 1).toUpperCase() ?? "U"}
                  </span>
                )}
              </Link>
            </>
          ) : null}
        </div>

        <button
          type="button"
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden",
            "border border-slate-200 text-slate-700"
          )}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={cn(
          mobileShellClass,
          "overflow-hidden transition-all duration-200 md:hidden",
          menuOpen ? "max-h-96 border-t opacity-100" : "max-h-0 border-t-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:px-6 lg:px-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
          {!isLanding && user ? (
            <div className="flex gap-3 pt-2">
              <Link href="/dashboard" className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-medium text-white">
                Dashboard
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
