import type { SVGProps } from "react";

export type IconName =
  | "arrow"
  | "arrow-up-right"
  | "check"
  | "users"
  | "star"
  | "trend"
  | "menu"
  | "close"
  | "chevron-left"
  | "chevron-right"
  | "play"
  | "mail"
  | "running"
  | "cycling"
  | "fitness"
  | "basketball"
  | "surfing"
  | "outdoor"
  | "cricket"
  | "football";

const paths: Record<IconName, React.ReactNode> = {
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M8 7h9v9" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19c.5-3.2 3-5 6-5s5.5 1.8 6 5" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M17 14c2.4 0 3.9 1.4 4.3 4" />
    </>
  ),
  star: <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9L3.5 9.7l5.9-.8z" />,
  trend: <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  "chevron-left": <path d="m15 5-7 7 7 7" />,
  "chevron-right": <path d="m9 5 7 7-7 7" />,
  play: <path d="M8 5.5v13l11-6.5z" />,
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m4 7.5 8 6 8-6" />
    </>
  ),
  running: (
    <>
      <circle cx="15" cy="5" r="2" />
      <path d="m13 8-3 3 3.2 2.2L11 18m-1-7-3.5 1M13.2 13.2l3.3 1.8 1.7 4" />
    </>
  ),
  cycling: (
    <>
      <circle cx="6" cy="17" r="3.5" />
      <circle cx="18" cy="17" r="3.5" />
      <path d="m6 17 4-7h5l3 7m-8-7 2 7m1.5-10H16" />
    </>
  ),
  fitness: <path d="M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12" />,
  basketball: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3v18M5.6 5.6c3 3 3 9 0 12.8M18.4 5.6c-3 3-3 9 0 12.8" />
    </>
  ),
  surfing: <path d="M3 18c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5M5 13c1-4 5-7.5 10-7-2.5 1-3.5 3-3.5 6" />,
  outdoor: <path d="m3 19 6-11 4 7 3-4 5 8z" />,
  cricket: (
    <>
      <path d="m14 4 6 6-9 9-4.5 1 1-4.5z" />
      <circle cx="6" cy="6" r="1.8" />
    </>
  ),
  football: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m12 8 3 2.2-1.1 3.5h-3.8L9 10.2zM12 8V3.5m3 6.7 4-1.3m-5.1 4.8 2.5 3.3m-6.3 0-2.5 3.3M9 10.2 5 8.9" />
    </>
  ),
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

/** Decorative by default. Pass aria-label to expose it to assistive tech. */
export function Icon({ name, size = 20, ...rest }: IconProps) {
  const labelled = rest["aria-label"] !== undefined;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={name === "play" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={labelled ? undefined : true}
      role={labelled ? "img" : undefined}
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

export function sportIcon(slug: string): IconName {
  const known: IconName[] = ["running", "cycling", "fitness", "basketball", "surfing", "outdoor", "cricket", "football"];
  return (known as string[]).includes(slug) ? (slug as IconName) : "star";
}
