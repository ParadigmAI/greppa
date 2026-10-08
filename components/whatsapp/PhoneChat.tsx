import { WhatsAppLogo } from "./WhatsAppLogo";

export type ChatMessage = {
  from: "me" | "bot";
  text: string;
  time: string;
  buttons?: string[];
};

// WhatsApp dark-theme palette.
const C = {
  bg: "#0b141a",
  header: "#202c33",
  incoming: "#202c33",
  outgoing: "#005c4b",
  text: "#e9edef",
  meta: "#8696a0",
  link: "#53bdeb",
  accent: "#00a884",
};

// Renders *bold* spans, "- " bullet lines and bare greppa.org links.
function renderLine(line: string, key: number) {
  const bullet = line.startsWith("- ");
  const content = bullet ? line.slice(2) : line;
  const parts = content.split(/(\*[^*]+\*|greppa\.org\/\S+)/g).filter(Boolean);
  const nodes = parts.map((p, i) => {
    if (p.startsWith("*") && p.endsWith("*")) return <strong key={i}>{p.slice(1, -1)}</strong>;
    if (p.startsWith("greppa.org/"))
      return (
        <span key={i} style={{ color: C.link }} className="underline decoration-1 underline-offset-2">
          {p}
        </span>
      );
    return <span key={i}>{p}</span>;
  });
  return bullet ? (
    <div key={key} className="flex gap-1.5 pl-1">
      <span style={{ color: C.meta }}>•</span>
      <span>{nodes}</span>
    </div>
  ) : (
    <div key={key}>{nodes}</div>
  );
}

function Ticks() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden className="inline-block">
      <path d="M1 5.800 4 9 10 1.500M6.200 8.200 7 9 13 1.500" stroke={C.link} strokeWidth="1.400" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PhoneChat({ messages, contact = "Greppa" }: { messages: ChatMessage[]; contact?: string }) {
  return (
    <figure className="mx-auto w-full max-w-[330px]">
      <div className="overflow-hidden rounded-[2.4rem] border-[9px] border-[#05080b] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7)]" style={{ background: C.bg }}>
        {/* WhatsApp header */}
        <div className="flex items-center gap-2.5 px-3 pb-2.5 pt-3.5" style={{ background: C.header }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 5 8 12l7 7" stroke={C.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime">
            <svg width="22" height="22" viewBox="0 0 40 40" aria-hidden>
              <circle cx="20" cy="20" r="19" fill="#aaf136" stroke="#0a2952" strokeWidth="1.500" />
              {[[12, 11], [24, 9], [30, 19], [26, 30], [14, 29], [8, 20], [19, 20]].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="2" fill="#0a2952" opacity="0.6" />
              ))}
            </svg>
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="text-[15px] font-medium" style={{ color: C.text }}>{contact}</div>
            <div className="text-[11px]" style={{ color: C.meta }}>online</div>
          </div>
          <WhatsAppLogo size={20} />
        </div>

        {/* Conversation */}
        <div
          className="flex flex-col gap-1.5 px-2.5 pb-4 pt-3"
          style={{
            background: C.bg,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        >
          <div className="mx-auto mb-1 rounded-md px-2.5 py-1 text-[10px] uppercase tracking-wide" style={{ background: "#182229", color: C.meta }}>
            today
          </div>

          {messages.map((m, i) => {
            const mine = m.from === "me";
            return (
              <div key={i} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[88%] rounded-lg px-2.5 pb-1.5 pt-1.5 text-[13px] leading-[1.35] ${mine ? "rounded-tr-none" : "rounded-tl-none"}`}
                  style={{ background: mine ? C.outgoing : C.incoming, color: C.text }}
                >
                  <div className="flex flex-col gap-0.5">{m.text.split("\n").map(renderLine)}</div>
                  <div className="-mb-0.5 mt-0.5 flex items-center justify-end gap-1 text-[10px]" style={{ color: C.meta }}>
                    {m.time}
                    {mine && <Ticks />}
                  </div>
                </div>
                {m.buttons && (
                  <div className="mt-1 flex w-[88%] flex-col gap-1">
                    {m.buttons.map((b) => (
                      <div
                        key={b}
                        className="rounded-lg py-2 text-center text-[13px] font-medium"
                        style={{ background: C.incoming, color: C.link }}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 px-2 pb-3 pt-2" style={{ background: C.bg }}>
          <div className="flex h-9 flex-1 items-center rounded-full px-3.5 text-[13px]" style={{ background: C.header, color: C.meta }}>
            Message
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: C.accent }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="9" y="3" width="6" height="11" rx="3" fill="#fff" />
              <path d="M5.500 11a6.500 6.500 0 0 0 13 0M12 17.500V21" stroke="#fff" strokeWidth="1.800" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>
      <figcaption className="mt-2 text-right text-[11px] opacity-40">illustrative</figcaption>
    </figure>
  );
}
