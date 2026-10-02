import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative bg-navy px-[7%] pb-10 pt-20 sm:pt-28">
      <div className="mx-auto flex w-full max-w-5xl flex-col">
        <p className="font-serif text-[clamp(3rem,16vw,9rem)] font-bold leading-[0.9] tracking-[-0.03em] text-lime">
          Simply love
          <br />
          to play.
        </p>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-cream-dim/20 pt-6 text-xs text-cream-dim/70 sm:flex-row">
          <span>Greppa &mdash; pickleball, organized</span>
          <span>&copy; {new Date().getFullYear()} Greppa. All rights reserved.</span>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-2 text-[11px] text-cream-dim/50 sm:flex-row">
          <span>Greppa, 8415 Pulsar Pl Ste 300, Columbus, OH 43240-4032, United States</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition hover:text-lime">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-lime">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
