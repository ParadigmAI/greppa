import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Privacy Policy — Greppa",
  description: "How Greppa collects, uses, and protects your information.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-serif text-xl font-bold tracking-[-0.02em] text-navy sm:text-2xl">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-base leading-relaxed text-navy/75">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-cream px-[7%] pb-24 pt-36 text-navy">
        <div className="mx-auto flex max-w-2xl flex-col gap-10">
          <div>
            <h1 className="font-serif text-4xl font-bold leading-[1.04] tracking-[-0.03em] text-navy sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-navy/60">Last updated October 2026</p>
          </div>

          <Section title="Who we are">
            <p>
              Greppa (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) operates greppa.org
              (the &ldquo;Site&rdquo;). This policy explains what information we collect when you
              visit the Site or join our waitlist, and how we use it.
            </p>
          </Section>

          <Section title="Information we collect">
            <p>The Site currently collects only what&apos;s needed to join the waitlist:</p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">
                <strong>Email address</strong> — required to join the waitlist.
              </li>
              <li className="list-disc">
                <strong>Name</strong> — optional, only if you choose to provide it.
              </li>
            </ul>
            <p>
              The Site does not yet offer a live product, and we don&apos;t collect payment
              information or any other personal data beyond what&apos;s listed above.
            </p>
          </Section>

          <Section title="How we use your information">
            <p>
              We use your email address to let you know when Greppa becomes available and to
              share occasional updates about the product. We don&apos;t sell your information to
              third parties, and we don&apos;t use it for advertising.
            </p>
          </Section>

          <Section title="How your information is stored">
            <p>
              Waitlist information is collected through Formspree, a third-party form service, and is accessible only to the Greppa team.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              You can ask us to remove your information from the waitlist at any time by
              contacting us using the details below.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this policy as the product develops. Significant changes will be
              reflected by updating the date at the top of this page.
            </p>
          </Section>

          <Section title="Contact us">
            <p>
              Greppa
              <br />
              8415 Pulsar Pl Ste 300
              <br />
              Columbus, OH 43240-4032
              <br />
              United States
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}
