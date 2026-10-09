import { GetStartedButton } from "@/components/GetStartedButton";

const VIDEO_ID = "NwjgDg1nfiw";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[60svh] items-center bg-navy px-[7%] pb-24 pt-36 sm:pb-28 sm:pt-44">
      <div className="grid w-full items-center gap-10 xl:grid-cols-[1fr_1.1fr] xl:gap-14">
        <div className="max-w-2xl">
          <h1 className="font-serif text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.03em] text-cream">
            Your pickleball tournament manager, right on your phone.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-cream-dim sm:text-lg">
            From “let’s run a tournament” to game day, Greppa sets it up, takes registrations, draws the brackets and builds the schedule.
          </p>
          <div className="mt-8">
            <GetStartedButton />
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
