import { WaitlistButton } from "@/components/waitlist/WaitlistButton";

const VIDEO_ID = "NwjgDg1nfiw";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[60svh] items-center bg-navy px-[7%] py-24 sm:py-28">
      <div className="grid w-full items-center gap-10 xl:grid-cols-[1fr_1.1fr] xl:gap-14">
        <div className="max-w-2xl">
          <p className="mb-3 font-serif text-xl font-bold tracking-[-0.02em] text-lime sm:text-2xl">
            Meet Greppa
          </p>
          <h1 className="font-serif text-[clamp(2rem,5.5vw,3.75rem)] font-bold leading-[1.08] tracking-[-0.03em] text-cream">
            The full-time manager of your pickleball court.
          </h1>
          <div className="mt-8">
            <WaitlistButton>Join Waitlist</WaitlistButton>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-3xl border border-cream-dim bg-black shadow-[0_20px_80px_-20px_rgba(0,0,0,0.6)]">
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0`}
              title="Greppa - The Best Pickleball Tournament Manager"
              loading="lazy"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
