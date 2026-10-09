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
              (the &ldquo;Site&rdquo;), a marketing site for the Greppa app at app.greppa.org.
            </p>
          </Section>

          <Section title="Information we collect">
            <p>
              The Site itself doesn&apos;t collect personal information: it has no forms, accounts
              or tracking cookies. When you choose &ldquo;Get started for free,&rdquo; you leave
              the Site for the Greppa app, where creating an account and using the product are
              covered by the app&apos;s own privacy policy.
            </p>
          </Section>

          <Section title="Third-party content">
            <p>
              Our home page embeds a video from YouTube (using YouTube&apos;s privacy-enhanced
              mode). Playing the video may cause YouTube to collect data under its own privacy
              policy.
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
