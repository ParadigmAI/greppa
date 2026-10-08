import { CourtLineDivider } from "@/components/CourtLineDivider";
import { CourtSideRail } from "@/components/CourtSideRail";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Zone } from "@/components/sections/Zone";
import {
  CreationVisual,
  DrawsVisual,
  PublicPageVisual,
  RegistrationVisual,
  RoadmapVisual,
  ScheduleVisual,
} from "@/components/sections/visuals";

export default function Home() {
  return (
    <>
      <CourtSideRail />
      <Header />

      <main className="relative">
        <Hero />

        <CourtLineDivider label="Non-Volley Zone" />
        <HowItWorks />

        <Zone
          id="create"
          tone="dark"
          title="Make me a tournament."
          tagline="Say it in a message. It's done."
          body="Tell Greppa what you want to run. It only asks for what's missing, like a name and a date, then suggests divisions. Say “looks good” and your tournament is live with a link players can use right away."
          bullets={[
            "Set up by chat, on WhatsApp or the web",
            "Asks one or two questions at a time",
            "Suggests divisions you can accept or change",
            "A live, shareable link the moment it's created",
          ]}
          visual={<CreationVisual />}
        />

        <CourtLineDivider label="Courtside" />
        <Zone
          id="page"
          tone="light"
          title="A public page, shared in one tap."
          tagline="Restyle it by chat."
          body="Every tournament gets a mobile-first page with the dates, location, divisions and a countdown. Ask for a new look in plain words, then share it to your club's group chat on WhatsApp with one tap."
          bullets={[
            "Built for phones, live from the moment you create it",
            "Restyle it by chat: “make it feel like a sunset beach”",
            "One-tap share on WhatsApp, or copy the link",
          ]}
          visual={<PublicPageVisual />}
          reverse
        />

        <CourtLineDivider label="At the Net" />
        <Zone
          id="registration"
          tone="dark"
          title="Players sign up. You just ask."
          tagline="Full division? They're waitlisted."
          body="Players pick a division and register on your page in under a minute. Ask Greppa how it's going whenever you like and it tells you: teams in, who's waiting, which divisions are full."
          bullets={[
            "Players register themselves on the public page",
            "Full divisions fill a waitlist automatically",
            "Check numbers with a message, no spreadsheet",
          ]}
          visual={<RegistrationVisual />}
        />

        <CourtLineDivider label="The Draw" />
        <Zone
          id="draws"
          tone="light"
          title="Pools & brackets, built."
          tagline="One message builds every division."
          body="When registration closes, Greppa seeds the teams by rating, splits big divisions into balanced pools with playoffs, and picks the right format for the smaller ones. Publish it and players see their draw instantly."
          bullets={[
            "Seeded by rating, no drawing names from a hat",
            "Pools into playoffs, single or double elimination, round robin",
            "Hidden until you publish, then visible to players",
          ]}
          visual={<DrawsVisual />}
          reverse
        />

        <CourtLineDivider label="Court Time" />
        <Zone
          id="schedule"
          tone="dark"
          title="A schedule that adapts."
          tagline="Rain? One message re-plans the day."
          body="Tell Greppa how many courts you have and when you play, and the full timetable appears: nobody double-booked, everyone gets rest between matches. When something changes, it shifts only what has to move."
          bullets={[
            "A full court-by-time timetable from one message",
            "No double-booking, built-in rest between matches",
            "Rain delay or a court out? Re-planned with minimal changes",
            "Players see the new times",
          ]}
          visual={<ScheduleVisual />}
        />

        <CourtLineDivider label="Out of Bounds" />
        <Zone
          id="roadmap"
          tone="light"
          title="What's next."
          body="Tournament setup, registration, draws and scheduling are the serve. Here's what's coming behind them."
          visual={<RoadmapVisual />}
        />

        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
