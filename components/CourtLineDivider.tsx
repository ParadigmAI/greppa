export function CourtLineDivider({ label }: { label: string }) {
  return (
    <div className="relative bg-navy px-6 py-5 sm:px-8 sm:py-6">
      <div className="relative mx-auto flex w-full max-w-5xl items-center gap-4 sm:gap-6">
        <span className="h-[1.5px] w-full flex-1 bg-cream-dim" />
        <span className="shrink-0 whitespace-nowrap font-serif text-xs tracking-[0.06em] text-lime sm:text-sm">
          {label}
        </span>
        <span className="h-[1.5px] w-full flex-1 bg-cream-dim" />
      </div>
    </div>
  );
}
