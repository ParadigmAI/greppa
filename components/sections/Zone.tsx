import { Reveal } from "@/components/Reveal";

type Tone = "dark" | "light";

const toneStyles: Record<Tone, { section: string; tagline: string; title: string; body: string; bullet: string; dot: string }> = {
  dark: {
    section: "bg-navy text-cream",
    tagline: "text-lime",
    title: "text-cream",
    body: "text-cream-dim",
    bullet: "text-cream",
    dot: "bg-lime",
  },
  light: {
    section: "bg-cream text-navy",
    tagline: "text-clay",
    title: "text-navy",
    body: "text-navy/75",
    bullet: "text-navy",
    dot: "bg-navy",
  },
};

export function Zone({
  title,
  tagline,
  body,
  bullets,
  visual,
  reverse = false,
  tone = "dark",
  id,
}: {
  title: string;
  tagline?: string;
  body: string;
  bullets?: string[];
  visual: React.ReactNode;
  reverse?: boolean;
  tone?: Tone;
  id?: string;
}) {
  const t = toneStyles[tone];

  return (
    <section id={id} className={`relative px-[7%] py-24 sm:py-32 ${t.section}`}>
      <div
        className={`mx-auto flex w-full max-w-5xl flex-col items-center gap-10 sm:gap-16 lg:flex-row ${
          reverse ? "lg:flex-row-reverse" : ""
        }`}
      >
        <div className="flex w-full flex-col gap-4 lg:w-1/2">
          <Reveal>
            <h2
              className={`text-balance font-serif text-4xl font-bold leading-[1.04] tracking-[-0.03em] sm:text-5xl ${t.title}`}
            >
              {title}
            </h2>
          </Reveal>
          {tagline && (
            <Reveal delay={0.08}>
              <p className={`text-balance font-serif text-lg font-bold tracking-[-0.01em] sm:text-xl ${t.tagline}`}>
                {tagline}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.16}>
            <p className={`max-w-md text-base leading-relaxed sm:text-lg ${t.body}`}>{body}</p>
          </Reveal>
          {bullets && (
            <Reveal delay={0.24}>
              <ul className="mt-2 flex flex-col gap-2.5">
                {bullets.map((b) => (
                  <li key={b} className={`flex items-start gap-2.5 text-sm sm:text-base ${t.bullet}`}>
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${t.dot}`} />
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.1} className="w-full lg:w-1/2" y={32}>
          {visual}
        </Reveal>
      </div>
    </section>
  );
}
