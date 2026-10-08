import { WhatsAppLogo } from "@/components/whatsapp/WhatsAppLogo";

const steps = [
  {
    title: "Sign up",
    body: "An email and a password. That's the only form you'll ever fill in.",
  },
  {
    title: "Scan the QR",
    body: "Your phone camera opens WhatsApp with a message ready to go. Hit send and you're linked.",
    whatsapp: true,
  },
  {
    title: "Just chat",
    body: "Say \"make me a tournament.\" Greppa only asks for what's missing.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative bg-cream px-[7%] py-20 text-navy sm:py-24">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="text-balance font-serif text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl">
          From zero to a live tournament in one chat.
        </h2>
        <ol className="mt-10 grid gap-5 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-3xl border border-navy/15 bg-white/50 p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy font-serif text-sm font-bold text-lime">
                  {i + 1}
                </span>
                {s.whatsapp && <WhatsAppLogo size={26} />}
              </div>
              <div className="mt-4 font-serif text-xl font-bold tracking-[-0.02em]">{s.title}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-navy/75 sm:text-base">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
