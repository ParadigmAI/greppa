import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { WaitlistProvider } from "@/components/waitlist/WaitlistProvider";
import { WaitlistModal } from "@/components/waitlist/WaitlistModal";

const sansFont = Schibsted_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Greppa — Run your pickleball tournament from WhatsApp",
  description:
    "Greppa runs your pickleball tournament from a WhatsApp chat: set it up by texting, share a public registration page, and get pools, brackets and a court schedule built for you. Join the waitlist.",
  metadataBase: new URL("https://greppa.org"),
  other: {
    "facebook-domain-verification": "8e03e8hk7r74eesfpvpzvkr102n992",
  },
  openGraph: {
    title: "Greppa — Run your pickleball tournament from WhatsApp",
    description:
      "Text Greppa to create a tournament, share a public page, and get brackets and a court schedule built for you.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Greppa — Run your pickleball tournament from WhatsApp",
    description:
      "Text Greppa to create a tournament, share a public page, and get brackets and a court schedule built for you.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sansFont.variable} h-full`}>
      <body className="min-h-full bg-navy text-cream antialiased">
        <WaitlistProvider>
          {children}
          <WaitlistModal />
        </WaitlistProvider>
      </body>
    </html>
  );
}
