import { WaitlistButton } from "@/components/waitlist/WaitlistButton";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[60svh] items-center bg-navy px-[7%] py-24 sm:py-28">
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
    </section>
  );
}
