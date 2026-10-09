import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const sansFont = Schibsted_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Greppa — Your pickleball tournament manager, right on your phone",
  description:
    "Greppa is your pickleball tournament manager, right on your phone. Create, run and share your tournament by chatting: registration page, pools, brackets and a court schedule built for you. Get started for free.",
  metadataBase: new URL("https://greppa.org"),
  other: {
    "facebook-domain-verification": "8e03e8hk7r74eesfpvpzvkr102n992",
  },
  openGraph: {
    title: "Greppa — Your pickleball tournament manager, right on your phone",
    description:
      "Greppa sets up your tournament, takes registrations, draws the brackets and builds the schedule, all from your phone.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Greppa — Your pickleball tournament manager, right on your phone",
    description:
      "Greppa sets up your tournament, takes registrations, draws the brackets and builds the schedule, all from your phone.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sansFont.variable} h-full`}>
      <body className="min-h-full bg-navy text-cream antialiased">
        {children}
      </body>
    </html>
  );
}
