import { Reveal } from "@/components/Reveal";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";

export function FinalCta() {
  return (
    <section id="join" className="relative overflow-hidden bg-navy px-[7%] py-28 text-center sm:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(170,241,54,0.10), transparent 65%)",
        }}
      />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center">
        <Reveal>
          <span className="font-serif text-xs tracking-[0.06em] text-lime sm:text-sm">
            Pickleball, organized.
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-balance font-serif text-4xl font-bold leading-[1.04] tracking-[-0.03em] text-cream sm:text-6xl">
            Start your next tournament from WhatsApp.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-md text-balance text-base text-cream-dim sm:text-lg">
            Join the waitlist and be one of the first organizers to run a tournament by chat.
          </p>
        </Reveal>
        <Reveal delay={0.24} className="mt-9">
          <WaitlistButton>Join Waitlist</WaitlistButton>
        </Reveal>
      </div>
    </section>
  );
}
