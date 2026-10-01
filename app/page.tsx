import { CourtLineDivider } from "@/components/CourtLineDivider";
import { CourtSideRail } from "@/components/CourtSideRail";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Zone } from "@/components/sections/Zone";
import {
  BracketVisual,
  ChatBuildVisual,
  FacilityVisual,
  PublicPageVisual,
  RoadmapVisual,
} from "@/components/sections/visuals";

export default function Home() {
  return (
    <>
      <CourtSideRail />
      <Header />

      <main className="relative">
        <Hero />

        <CourtLineDivider label="Non-Volley Zone" />
        <Zone
          id="creation"
          tone="light"
          title="Tournament Creation"
          tagline="Describe it. Watch it build itself."
          body="Skip the twelve-tab spreadsheet. Tell Greppa what you're running and it asks exactly what it needs — format, divisions, dates — then assembles a real tournament while you chat."
          bullets={[
            "Guided, conversational setup — no blank forms",
            "Formats, divisions, and seeding handled for you",
            "A full tournament, ready in minutes",
          ]}
          visual={<ChatBuildVisual />}
        />

        <CourtLineDivider label="Courtside" />
        <Zone
          id="publish"
          tone="dark"
          title="Tournament Registration"
          tagline="A live page, the moment it's built."
          body="As soon as your tournament is created, Greppa publishes a public page for it — share the link and let players take it from there."
          bullets={[
            "A shareable public page, live the moment you create the tournament",
            "Players pick their division and register themselves",
            "Payments collected online at signup",
          ]}
          visual={<PublicPageVisual />}
          reverse
        />

        <CourtLineDivider label="At the Net" />
        <Zone
          id="management"
          tone="light"
          title="Tournament Management"
          tagline="Run the whole event from one screen."
          body="Once the serve is in, Greppa stays with you through the whole match. Brackets update live, courts stay assigned, and results flow through without a whiteboard in sight."
          bullets={[
            "Live brackets and match scheduling",
            "Court assignments that update themselves",
            "Scores, standings, and results in real time",
            "A registration & payments dashboard — who's in, what's paid, what you've earned",
          ]}
          visual={<BracketVisual />}
        />

        <CourtLineDivider label="The Sidelines" />
        <Zone
          id="facilities"
          tone="dark"
          title="Facility & Utility Management"
          tagline="Your courts, your equipment, one dashboard."
          body="Greppa doesn't stop at tournament day. Track court utilization, plan maintenance, and manage the resources that keep a facility running."
          bullets={[
            "Court scheduling and utilization tracking",
            "Maintenance and resource planning",
            "A foundation for full facility operations",
          ]}
          visual={<FacilityVisual />}
          reverse
        />

        <CourtLineDivider label="Out of Bounds" />
        <Zone
          id="roadmap"
          tone="light"
          title="What's Next"
          body="Tournament creation and management are just the serve. Here's what's on the court behind it."
          visual={<RoadmapVisual />}
        />

        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
