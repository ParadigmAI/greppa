function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full rounded-3xl border border-cream-dim/40 bg-navy/40 p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:p-7">
      {children}
    </div>
  );
}

export function ChatBuildVisual() {
  return (
    <Panel>
      <div className="flex flex-col gap-3">
        <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white/8 px-4 py-2.5 text-sm text-cream">
          What format is your tournament?
        </div>
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-lime px-4 py-2.5 text-sm text-navy">
          Double elimination
        </div>
        <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white/8 px-4 py-2.5 text-sm text-cream">
          Divisions to include?
        </div>
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-lime px-4 py-2.5 text-sm text-navy">
          4.0, 4.5, and Open
        </div>
        <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white/8 px-4 py-2.5 text-sm text-cream">
          Building your bracket now…
        </div>
        <div className="mt-1 rounded-2xl border border-lime/40 bg-navy/60 p-4">
          <div className="text-xs uppercase tracking-widest text-lime">Tournament ready</div>
          <div className="mt-1 font-serif text-xl font-bold tracking-[-0.02em] text-cream">Fall Smash Open</div>
          <div className="mt-1 text-xs text-cream-dim">
            Double Elim · 3 divisions · Sat, Oct 18 · 32 players
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function PublicPageVisual() {
  const divisions = [
    { name: "4.0 Mixed Doubles", price: "$45" },
    { name: "4.5 Men's Doubles", price: "$45" },
    { name: "Open Women's Doubles", price: "$50" },
  ];
  return (
    <Panel>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 rounded-full border border-cream-dim/30 bg-white/5 px-4 py-2 text-xs text-cream-dim sm:text-sm">
          <span className="h-2 w-2 shrink-0 rounded-full bg-lime" />
          greppa.app/fall-smash-open
        </div>

        <div className="rounded-2xl border border-cream-dim/20 bg-navy/60 p-4">
          <div className="text-xs uppercase tracking-widest text-lime">Fall Smash Open</div>
          <div className="mt-1 font-serif text-lg font-bold tracking-[-0.02em] text-cream">
            Choose your division
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {divisions.map((d) => (
              <div
                key={d.name}
                className="flex items-center justify-between rounded-xl border border-cream-dim/20 bg-white/5 px-4 py-3 text-sm text-cream"
              >
                <span>{d.name}</span>
                <span className="text-cream-dim">{d.price}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-full bg-lime px-4 py-3 text-center text-sm font-medium text-navy">
            Register & pay online
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function BracketVisual() {
  const round1 = ["Alvarez / Kim", "Ortiz / Chen", "Nguyen / Patel", "Diaz / Reyes"];
  const round2 = ["Alvarez / Kim", "Nguyen / Patel"];
  return (
    <Panel>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        <div className="col-span-2 flex flex-col justify-around gap-3 sm:col-span-1">
          {round1.map((name) => (
            <div
              key={name}
              className="rounded-lg border border-cream-dim/40 bg-white/5 px-3 py-2 text-xs text-cream sm:text-sm"
            >
              {name}
            </div>
          ))}
        </div>
        <div className="col-span-2 flex flex-col justify-around gap-6 sm:col-span-1">
          {round2.map((name) => (
            <div
              key={name}
              className="rounded-lg border border-lime/50 bg-white/5 px-3 py-2 text-xs text-cream sm:text-sm"
            >
              {name}
            </div>
          ))}
        </div>
        <div className="col-span-2 flex items-center justify-center rounded-lg bg-lime px-3 py-3 text-center text-xs font-semibold text-navy sm:col-span-1 sm:text-sm">
          Alvarez / Kim
          <br />
          advance to final
        </div>
      </div>
    </Panel>
  );
}

export function FacilityVisual() {
  const courts = ["Court 1", "Court 2", "Court 3", "Court 4"];
  const slots = ["9:00", "9:30", "10:00", "10:30"];
  const busy = new Set(["Court 1-9:00", "Court 1-9:30", "Court 2-9:30", "Court 3-10:00", "Court 4-9:00", "Court 4-10:30"]);
  return (
    <Panel>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-5 gap-1.5 text-[10px] text-cream-dim sm:text-xs">
          <div />
          {courts.map((c) => (
            <div key={c} className="text-center">{c}</div>
          ))}
        </div>
        {slots.map((slot) => (
          <div key={slot} className="grid grid-cols-5 items-center gap-1.5">
            <div className="text-right text-[10px] text-cream-dim sm:text-xs">{slot}</div>
            {courts.map((c) => {
              const isBusy = busy.has(`${c}-${slot}`);
              return (
                <div
                  key={c}
                  className={`h-6 rounded-md sm:h-7 ${isBusy ? "bg-lime/70" : "bg-white/8"}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function RoadmapVisual() {
  const items = [
    "Guided setup for first-time organizers",
    "Equipment & supply ordering, built in",
    "Sponsor & payments tooling",
    "Multi-facility operator dashboard",
  ];
  return (
    <Panel>
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
    </Panel>
  );
}
