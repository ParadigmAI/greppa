import { PhoneChat, type ChatMessage } from "@/components/whatsapp/PhoneChat";
import { WhatsAppLogo } from "@/components/whatsapp/WhatsAppLogo";

/* A phone chat with an optional "what appeared" card tucked under it. */
function ChatWithResult({ messages, children }: { messages: ChatMessage[]; children?: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[400px] flex-col">
      <PhoneChat messages={messages} />
      {children && <div className="relative z-10 -mt-4 ml-auto w-[92%]">{children}</div>}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#0d2447] p-4 text-cream shadow-[0_24px_50px_-20px_rgba(0,0,0,0.65)] ${className}`}
    >
      {children}
    </div>
  );
}

function Pill({ children, tone = "lime" }: { children: React.ReactNode; tone?: "lime" | "clay" | "plain" }) {
  const styles = {
    lime: "bg-lime text-navy",
    clay: "bg-clay text-cream",
    plain: "border border-white/15 text-cream-dim",
  }[tone];
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles}`}>
      {children}
    </span>
  );
}

/* ---------- Tournament creation ---------- */
const creationChat: ChatMessage[] = [
  { from: "me", time: "9:02", text: "make me a tournament for next month at pocket pickleball club" },
  { from: "bot", time: "9:02", text: "on it. what's it called, and what date are we looking at?" },
  { from: "me", time: "9:03", text: "columbus fall classic, nov 14-15, starting 8:30" },
  {
    from: "bot",
    time: "9:03",
    text: "got it: *sat nov 14 – sun nov 15*, 8:30 am. for divisions i'd suggest:\n- mixed doubles 3.5\n- men's doubles 4.0\n- women's singles 3.5\n- men's singles 4.5\nsound right?",
    buttons: ["Looks good", "Change them"],
  },
  { from: "me", time: "9:04", text: "looks good" },
  {
    from: "bot",
    time: "9:04",
    text: "done! *columbus fall classic* is live and registration is open.\ngreppa.org/t/columbus-fall-classic\nplayers can sign up right now. want to restyle the page or add a logo?",
  },
];

export function CreationVisual() {
  return (
    <ChatWithResult messages={creationChat}>
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-serif text-lg font-bold tracking-[-0.02em]">Columbus Fall Classic</div>
            <div className="mt-0.5 text-xs text-cream-dim">Sat Nov 14 – Sun Nov 15 · Pocket Pickleball Club</div>
          </div>
          <Pill>registration open</Pill>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Mixed Doubles 3.5", "Men's Doubles 4.0", "Women's Singles 3.5", "Men's Singles 4.5"].map((d) => (
            <span key={d} className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-cream">
              {d}
            </span>
          ))}
        </div>
      </Card>
    </ChatWithResult>
  );
}

/* ---------- Public page, restyled by chat ---------- */
const pageChat: ChatMessage[] = [
  { from: "me", time: "9:06", text: "make the page feel like a sunset beach" },
  {
    from: "bot",
    time: "9:06",
    text: "done — warm orange and coral, sunset gradient banner. i nudged one colour so the text stays readable.",
  },
];

export function PublicPageVisual() {
  return (
    <ChatWithResult messages={pageChat}>
      <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.65)]">
        <div
          className="p-4 text-white"
          style={{ background: "linear-gradient(160deg, #ff9a5a 0%, #e8556b 60%, #8f3a78 100%)" }}
        >
          <span className="inline-block rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8f2f4a]">
            registration open
          </span>
          <div className="mt-2 text-2xl font-bold leading-tight tracking-tight">Columbus Fall Classic</div>
          <div className="mt-1 text-xs text-white/85">Sat Nov 14 – Sun Nov 15, 2026 · 8:30 AM</div>
          <div className="text-xs text-white/75">Pocket Pickleball Club</div>
          <div className="mt-3 flex gap-2">
            {[
              ["37", "days"],
              ["6", "hrs"],
              ["5", "min"],
            ].map(([n, l]) => (
              <div key={l} className="w-14 rounded-xl bg-black/20 py-1.5 text-center">
                <div className="text-lg font-bold leading-none">{n}</div>
                <div className="mt-0.5 text-[9px] uppercase tracking-wider text-white/75">{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#8f2f4a]">register now</span>
            <span className="rounded-xl border border-white/40 px-3 py-2 text-xs">copy link</span>
            <span className="flex items-center gap-1.5 rounded-xl border border-white/40 px-3 py-2 text-xs">
              <WhatsAppLogo size={14} /> share on whatsapp
            </span>
          </div>
        </div>
      </div>
    </ChatWithResult>
  );
}

/* ---------- Registration ---------- */
const registrationChat: ChatMessage[] = [
  { from: "me", time: "9:41", text: "how's registration going?" },
  {
    from: "bot",
    time: "9:41",
    text: "*32 teams in*, +2 on the waitlist:\n- mixed doubles 3.5: 13\n- men's doubles 4.0: 8/8 (full, 2 waiting)\n- women's singles 3.5: 6\n- men's singles 4.5: 5",
  },
];

export function RegistrationVisual() {
  const rows = [
    { name: "Mixed Doubles 3.5", have: 13, cap: 16, note: "13 teams" },
    { name: "Men's Doubles 4.0", have: 8, cap: 8, note: "8 / 8 · 2 waitlisted" },
    { name: "Women's Singles 3.5", have: 6, cap: 16, note: "6 teams" },
    { name: "Men's Singles 4.5", have: 5, cap: 16, note: "5 teams" },
  ];
  return (
    <ChatWithResult messages={registrationChat}>
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-widest text-cream-dim">teams in</div>
          <div className="font-serif text-2xl font-bold leading-none text-lime">32</div>
        </div>
        <div className="flex flex-col gap-2.5">
          {rows.map((r) => (
            <div key={r.name}>
              <div className="flex items-baseline justify-between text-[11px]">
                <span>{r.name}</span>
                <span className="text-cream-dim">{r.note}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-lime" style={{ width: `${(r.have / r.cap) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </ChatWithResult>
  );
}

/* ---------- Pools & brackets ---------- */
const drawsChat: ChatMessage[] = [
  { from: "me", time: "10:12", text: "registration's closed — build the brackets" },
  {
    from: "bot",
    time: "10:12",
    text: "for 13 teams in mixed doubles 3.5 i'd go pools then playoffs. the smaller divisions: single elim for men's doubles 4.0 (8 teams), round robin for women's singles (6), double elim for men's singles (5). seeding by rating — ok?",
    buttons: ["Do it"],
  },
  { from: "me", time: "10:13", text: "do it" },
  {
    from: "bot",
    time: "10:13",
    text: "draws are built:\n- *mixed 3.5*: 3 pools (5/4/4) → playoffs\n- *men's doubles 4.0*: single elim, 8 teams\n- *women's singles 3.5*: round robin, 6 players\n- *men's singles 4.5*: double elim, 5 players\nwant players to see them?",
    buttons: ["Show players"],
  },
];

export function DrawsVisual() {
  const pools = [
    {
      name: "Pool A",
      teams: [
        [1, "Maya Kim & Liam Brown"],
        [6, "Ella Mendez & Jack Patel"],
        [7, "Nora Schmidt & Leo Novak"],
        [12, "Gwen Kim & Seth Brown"],
        [13, "Lena Quigley & Kai Johnson"],
      ],
    },
    {
      name: "Pool B",
      teams: [
        [2, "Sofia Quigley & Noah Johnson"],
        [5, "Zoe Singh & Owen Rossi"],
        [8, "Jade Haddad"],
        [11, "Tess Silva & Dean Petrov"],
      ],
    },
  ];
  return (
    <ChatWithResult messages={drawsChat}>
      <Card>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-semibold">Mixed Doubles 3.5</div>
            <div className="text-[11px] text-cream-dim">Pools → playoffs · 13 teams</div>
          </div>
          <Pill>published</Pill>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {pools.map((p) => (
            <div key={p.name} className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-cream-dim">{p.name}</div>
              <ul className="flex flex-col gap-1.5">
                {p.teams.map(([seed, team]) => (
                  <li key={seed} className="flex items-center gap-2 text-[11px] leading-tight">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-lime text-[9px] font-bold text-navy">
                      {seed}
                    </span>
                    {team}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </ChatWithResult>
  );
}

/* ---------- Schedule ---------- */
const scheduleChat: ChatMessage[] = [
  { from: "me", time: "11:20", text: "we have 6 courts, play 8:30 to 6 both days" },
  {
    from: "bot",
    time: "11:20",
    text: "schedule built: *57 matches*, saturday play wraps around *3:25 pm*. nobody's double-booked and everyone gets 20 min rest between matches. it's on the schedule tab.",
  },
  { from: "me", time: "Sat 7:15", text: "it's raining — push saturday back 90 min" },
  {
    from: "bot",
    time: "Sat 7:15",
    text: "done. i shifted play 90 min and kept every match that could stay put. players see the new times.",
  },
];

export function ScheduleVisual() {
  const times = ["8:30", "8:55", "9:20", "9:45"];
  // 6 courts x 4 slots; value = division colour index (or -1 for empty)
  const grid = [
    [0, 1, 0, 2],
    [0, 1, 2, 0],
    [0, 3, 1, 2],
    [0, 3, 0, 1],
    [2, 1, 3, 0],
    [2, -1, 3, 1],
  ];
  const colours = ["bg-[#1f7a43]", "bg-[#2a63a8]", "bg-[#7a4aa3]", "bg-[#b0643f]"];
  return (
    <ChatWithResult messages={scheduleChat}>
      <Card>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-semibold">Timetable</div>
            <div className="text-[11px] text-cream-dim">57 matches · play ends about 3:25 PM</div>
          </div>
          <Pill tone="clay">rain delay +90 min</Pill>
        </div>
        <div className="mt-3 grid grid-cols-[2rem_repeat(6,1fr)] gap-1 text-[9px] text-cream-dim">
          <div />
          {["Ctr", "2", "3", "4", "5", "6"].map((c) => (
            <div key={c} className="text-center uppercase tracking-wide">
              {c}
            </div>
          ))}
          {times.map((t, row) => (
            <div key={t} className="contents">
              <div className="flex items-center">{t}</div>
              {grid.map((court, ci) => {
                const v = court[row];
                return <div key={ci} className={`h-5 rounded ${v < 0 ? "bg-white/8" : colours[v]}`} />;
              })}
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Pill tone="plain">pause play (rain, late start)</Pill>
          <Pill tone="plain">a court is out</Pill>
        </div>
      </Card>
    </ChatWithResult>
  );
}

/* ---------- What's next ---------- */
export function RoadmapVisual() {
  const items = [
    "Score entry & live standings",
    "Online payments & email confirmations",
    "Court & facility management",
    "Equipment & supply ordering",
    "Player profiles & history",
  ];
  return (
    <div className="w-full rounded-3xl border border-navy/15 bg-navy p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:p-7">
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-cream-dim/40 px-4 py-3"
          >
            <span className="text-sm text-cream sm:text-base">{item}</span>
            <span className="shrink-0 rounded-full bg-white/8 px-2.5 py-1 text-[10px] uppercase tracking-wide text-cream-dim">
              Coming soon
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
