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
  title: "Greppa — Tournament day, without the tournament headache",
  description:
    "Greppa is the pickleball tournament platform that starts with a conversation. Create a tournament by chatting it into existence, then manage players, courts, and facilities from one place. Join the waitlist.",
  metadataBase: new URL("https://greppa.app"),
  openGraph: {
    title: "Greppa — Pickleball tournaments, created by chat",
    description:
      "Create a tournament in minutes through a guided chat, then manage players, matches, and facilities from one place.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Greppa — Pickleball tournaments, created by chat",
    description:
      "Create a tournament in minutes through a guided chat, then manage players, matches, and facilities from one place.",
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
