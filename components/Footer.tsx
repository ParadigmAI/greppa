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
      </div>
    </footer>
  );
}
