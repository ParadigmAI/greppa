"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useWaitlist } from "./WaitlistProvider";

type Status = "idle" | "submitting" | "success" | "error";

export function WaitlistModal() {
  const { isOpen, close } = useWaitlist();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    const timer = setTimeout(() => emailRef.current?.focus(), 50);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();

    if (!email) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Try again.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
            onClick={close}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Join the Greppa waitlist"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-cream-dim bg-navy shadow-[0_20px_80px_-20px_rgba(0,0,0,0.6)]"
          >
            <div
              className="absolute inset-x-0 top-0 h-1"
              style={{ background: "linear-gradient(90deg, transparent, var(--lime), transparent)" }}
            />

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-cream-dim transition hover:bg-white/5 hover:text-cream"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="px-8 pb-8 pt-10">
              {status === "success" ? (
                <SuccessState onClose={close} />
              ) : (
                <>
                  <div className="mb-1 font-serif text-3xl font-bold tracking-[-0.03em] text-cream">
                    Join the waitlist
                  </div>
                  <p className="mb-6 text-sm text-cream-dim">
                    Be first onto the court when Greppa opens up. Email only — name if you want a
                    personal welcome.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="waitlist-email" className="text-xs uppercase tracking-widest text-cream-dim">
                        Email
                      </label>
                      <input
                        ref={emailRef}
                        id="waitlist-email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="rounded-xl border border-cream-dim bg-white/5 px-4 py-3 text-cream placeholder:text-cream-dim/60 outline-none transition focus:border-lime focus:bg-white/[0.07]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="waitlist-name" className="text-xs uppercase tracking-widest text-cream-dim">
                        Name <span className="normal-case text-cream-dim/60">(optional)</span>
                      </label>
                      <input
                        id="waitlist-name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        className="rounded-xl border border-cream-dim bg-white/5 px-4 py-3 text-cream placeholder:text-cream-dim/60 outline-none transition focus:border-lime focus:bg-white/[0.07]"
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-sm text-red-300">{errorMessage}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="mt-2 inline-flex min-h-[54px] items-center justify-center gap-6 rounded-full bg-lime px-6 py-3 text-[15px] text-navy transition-transform duration-200 hover:-translate-y-[3px] disabled:opacity-60"
                    >
                      {status === "submitting" ? "Joining…" : "Count me in"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center py-4 text-center">
      <motion.div
        initial={{ rotate: 0, scale: 0.6, opacity: 0 }}
        animate={{ rotate: 360, scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="mb-4"
      >
        <BallIcon size={56} />
      </motion.div>
      <div className="mb-1 font-serif text-2xl font-bold tracking-[-0.03em] text-cream">
        You&apos;re on the list
      </div>
      <p className="mb-6 max-w-xs text-sm text-cream-dim">
        We&apos;ll email you when Greppa is ready for your first serve.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="rounded-full border border-cream-dim px-6 py-2.5 text-sm text-cream transition hover:border-lime hover:text-lime"
      >
        Close
      </button>
    </div>
  );
}

function BallIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="19" fill="var(--lime)" stroke="var(--navy)" strokeWidth="1" />
      {[
        [12, 10], [22, 8], [30, 14], [32, 24], [26, 32], [15, 33], [7, 27], [7, 16], [18, 20], [26, 20],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.6" fill="var(--navy)" opacity={0.55} />
      ))}
    </svg>
  );
}
