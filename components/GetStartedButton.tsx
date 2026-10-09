export const APP_SIGNUP_URL = "https://app.greppa.org/sign-up";

const base =
  "inline-flex items-center justify-center gap-6 rounded-full bg-lime text-navy transition-transform duration-200 ease-out will-change-transform hover:-translate-y-[3px] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime";

const sizes = {
  md: "min-h-[54px] px-6 py-4 text-[15px]",
  sm: "min-h-[48px] px-5 py-3 text-sm",
};

export function GetStartedButton({
  children = "Get started for free",
  size = "md",
  className = "",
}: {
  children?: React.ReactNode;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <a href={APP_SIGNUP_URL} className={`${base} ${sizes[size]} ${className}`}>
      {children}
      <span aria-hidden>↗</span>
    </a>
  );
}
