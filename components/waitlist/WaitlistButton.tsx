"use client";

import { useWaitlist } from "./WaitlistProvider";

type Variant = "solid" | "ghost";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-6 rounded-full transition-transform duration-200 ease-out will-change-transform hover:-translate-y-[3px] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime";

const variants: Record<Variant, string> = {
  solid: "bg-lime text-navy",
  ghost: "border border-cream-dim text-cream hover:border-lime hover:text-lime",
};

const sizes: Record<Size, string> = {
  md: "min-h-[54px] px-6 py-4 text-[15px]",
  sm: "min-h-[48px] px-5 py-3 text-sm",
};

export function WaitlistButton({
  children = "Join Waitlist",
  variant = "solid",
  size = "md",
  className = "",
}: {
  children?: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const { open } = useWaitlist();

  return (
    <button
      type="button"
      onClick={open}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
      <span aria-hidden>↗</span>
    </button>
  );
}
