"use client";

import Link from "next/link";
import { useState } from "react";
import { WaitlistButton } from "./waitlist/WaitlistButton";

const links = [
  { href: "/#creation", label: "Tournament Creation" },
  { href: "/#publish", label: "Registration" },
  { href: "/#management", label: "Tournament Management" },
  { href: "/#facilities", label: "Facilities" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-30 flex justify-center px-4">
      <div className="w-full max-w-5xl rounded-[40px] border border-cream-dim/25 bg-navy/90 backdrop-blur-lg">
        <div className="flex h-[60px] items-center gap-2 px-4 min-[380px]:gap-4 min-[380px]:px-5 sm:h-[68px] sm:gap-7 sm:px-6">
          <Link href="/" aria-label="Greppa home" className="shrink-0 font-serif text-xl tracking-tight text-cream">
            Greppa
          </Link>

          <nav className="ml-2 hidden items-center gap-6 whitespace-nowrap text-sm text-cream-dim lg:flex" aria-label="Main navigation">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="py-3 transition hover:text-lime">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto">
            <WaitlistButton size="sm" className="whitespace-nowrap gap-2! px-3! min-[380px]:px-4! sm:gap-6! sm:px-5!">
              Join the game
            </WaitlistButton>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-full px-2 py-2 text-sm text-cream lg:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {open && (
          <nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            className="flex flex-col gap-1 border-t border-cream-dim/20 px-6 py-4 lg:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2 text-cream-dim transition hover:text-lime"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
