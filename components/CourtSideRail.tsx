"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * A slim top-down court diagram pinned to the edge of the viewport, with a
 * marker that travels along it as the visitor scrolls — a minimap
 * counterpart to the traveling ball (CourtBall), showing roughly how far
 * through the "court" the page has gone.
 */
export function CourtSideRail() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  const markerTop = useSpring(useTransform(scrollYProgress, [0, 1], ["4%", "95%"]), {
    stiffness: 80,
    damping: 20,
    mass: 0.6,
  });

  if (shouldReduceMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-6 top-1/2 z-20 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative h-[62vh] w-10">
        <svg viewBox="0 0 40 200" preserveAspectRatio="none" className="h-full w-full opacity-60">
          <rect x="6" y="4" width="28" height="192" rx="2" fill="none" stroke="var(--cream-dim)" strokeWidth="1.5" />
          <line x1="6" y1="100" x2="34" y2="100" stroke="var(--lime)" strokeWidth="2" />
          <line x1="6" y1="62" x2="34" y2="62" stroke="var(--cream-dim)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="6" y1="138" x2="34" y2="138" stroke="var(--cream-dim)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="20" y1="4" x2="20" y2="62" stroke="var(--cream-dim)" strokeWidth="1" />
          <line x1="20" y1="138" x2="20" y2="196" stroke="var(--cream-dim)" strokeWidth="1" />
        </svg>
        <motion.div
          className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime"
          style={{ top: markerTop, boxShadow: "0 0 10px 2px rgba(170,241,54,0.55)" }}
        />
      </div>
    </div>
  );
}
