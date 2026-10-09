import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Terms of Use — Greppa",
  description: "The terms that apply to using the Greppa website.",
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

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="bg-cream px-[7%] pb-24 pt-36 text-navy">
        <div className="mx-auto flex max-w-2xl flex-col gap-10">
          <div>
            <h1 className="font-serif text-4xl font-bold leading-[1.04] tracking-[-0.03em] text-navy sm:text-5xl">
              Terms of Use
            </h1>
            <p className="mt-3 text-sm text-navy/60">Last updated October 2026</p>
          </div>

          <Section title="About this Site">
            <p>
              Greppa is a pickleball tournament creation and management platform. This Site
              describes the product; the product itself is the Greppa app at app.greppa.org. By
              using the Site, you agree to these Terms. Use of the app is also subject to the
              terms and privacy policy shown there. See our{" "}
              <Link href="/privacy" className="underline hover:text-lime">
                Privacy Policy
              </Link>{" "}
              for how this Site handles information.
            </p>
          </Section>

          <Section title="No warranty">
            <p>
              The Site and its content are provided &ldquo;as is,&rdquo; without warranties of any
              kind, express or implied.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p>
              To the fullest extent permitted by law, Greppa is not liable for any damages arising
              from your use of, or inability to use, the Site.
            </p>
          </Section>

          <Section title="Changes to these Terms">
            <p>
              We may update these Terms as the product develops. Continued use of the Site after
              changes are posted means you accept the updated Terms.
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
