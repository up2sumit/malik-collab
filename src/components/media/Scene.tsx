import { useId } from "react";

export type SceneVariant =
  | "hero"
  | "running"
  | "cycling"
  | "basketball"
  | "surfing"
  | "fitness"
  | "outdoor"
  | "cricket"
  | "football"
  | "group";

interface Palette {
  sky: [string, string];
  sun: string;
  far: string;
  mid: string;
  near: string;
  ink: string;
}

const palettes: Record<SceneVariant, Palette> = {
  hero: { sky: ["#F4D9BC", "#EFB98E"], sun: "#D88750", far: "#C9B9A3", mid: "#81917D", near: "#2D493C", ink: "#232B27" },
  running: { sky: ["#F6E1C6", "#EBB78B"], sun: "#D88750", far: "#CBB89F", mid: "#81917D", near: "#2D493C", ink: "#232B27" },
  cycling: { sky: ["#E9E3CF", "#D8C7A4"], sun: "#E3A265", far: "#A9B79F", mid: "#6F876F", near: "#2D493C", ink: "#232B27" },
  basketball: { sky: ["#EBC09A", "#D9906A"], sun: "#F4D9BC", far: "#C98562", mid: "#A64E30", near: "#5B2E20", ink: "#232B27" },
  surfing: { sky: ["#DCE6DF", "#BFD3CB"], sun: "#F1C79B", far: "#9BB5AE", mid: "#5F8A85", near: "#2D493C", ink: "#1F3A33" },
  fitness: { sky: ["#EFD7C0", "#E2B796"], sun: "#D88750", far: "#C8A98F", mid: "#A66A4E", near: "#4A3226", ink: "#232B27" },
  outdoor: { sky: ["#F1DFC4", "#DDB98F"], sun: "#E09A5E", far: "#B9BFA9", mid: "#6F876F", near: "#223A2F", ink: "#1B2A22" },
  cricket: { sky: ["#F3E4B8", "#E3C77E"], sun: "#E8A55E", far: "#BFC39A", mid: "#7F9B6C", near: "#365B3F", ink: "#232B27" },
  football: { sky: ["#E5E7D2", "#C9D2AE"], sun: "#EBC48A", far: "#A5B88E", mid: "#6E9461", near: "#2F5A3A", ink: "#232B27" },
  group: { sky: ["#F6D8B8", "#E8A777"], sun: "#D88750", far: "#C8B49B", mid: "#81917D", near: "#2D493C", ink: "#232B27" },
};

function Motif({ variant, p }: { variant: SceneVariant; p: Palette }) {
  switch (variant) {
    case "cycling":
      return (
        <g fill="none" stroke={p.ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
          <circle cx="120" cy="390" r="48" />
          <circle cx="285" cy="390" r="48" />
          <path d="M120 390 178 322h62l45 68M178 322l30 68h-88M240 322l-6-26h-26M240 322l12-30h26" />
        </g>
      );
    case "basketball":
      return (
        <g>
          <path d="M290 470V250" stroke={p.ink} strokeWidth="8" strokeLinecap="round" />
          <rect x="240" y="150" width="104" height="72" rx="6" fill="#FFFCF7" opacity="0.92" stroke={p.ink} strokeWidth="5" />
          <rect x="274" y="180" width="36" height="26" fill="none" stroke="#A64E30" strokeWidth="4" />
          <ellipse cx="292" cy="236" rx="30" ry="8" fill="none" stroke="#A64E30" strokeWidth="6" />
          <path d="M268 240l10 36m14-34v38m14-38-10 36" stroke="#FFFCF7" strokeWidth="2.5" fill="none" opacity="0.85" />
          <circle cx="150" cy="170" r="34" fill="#D88750" stroke={p.ink} strokeWidth="4" />
          <path d="M116 170h68M150 136v68M126 146c14 12 14 36 0 48M174 146c-14 12-14 36 0 48" fill="none" stroke={p.ink} strokeWidth="3" />
        </g>
      );
    case "surfing":
      return (
        <g>
          <path d="M-10 420C60 330 150 300 235 330c-40 12-62 40-60 78 10 24 40 36 80 40l155 6v50H-10z" fill={p.mid} />
          <path d="M-10 455c80-40 150-40 220-8s130 28 220-10v80H-10z" fill={p.near} />
          <path d="M20 400c60-50 130-62 200-32" stroke="#FFFCF7" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.85" />
          <ellipse cx="270" cy="345" rx="52" ry="9" transform="rotate(-24 270 345)" fill="#FFFCF7" stroke={p.ink} strokeWidth="3" />
        </g>
      );
    case "fitness":
      return (
        <g fill={p.ink} opacity="0.92">
          <rect x="92" y="392" width="216" height="12" rx="6" />
          <rect x="70" y="352" width="26" height="92" rx="8" />
          <rect x="44" y="370" width="22" height="56" rx="7" />
          <rect x="304" y="352" width="26" height="92" rx="8" />
          <rect x="334" y="370" width="22" height="56" rx="7" />
        </g>
      );
    case "outdoor":
      return (
        <g fill={p.near}>
          {[
            [60, 430, 1],
            [128, 450, 0.75],
            [310, 440, 1.15],
            [362, 468, 0.7],
          ].map(([x, y, s], i) => (
            <path
              key={i}
              d={`M${x} ${Number(y) - 160 * Number(s)} L${Number(x) + 46 * Number(s)} ${Number(y) - 40 * Number(s)} H${Number(x) + 24 * Number(s)} L${Number(x) + 58 * Number(s)} ${Number(y) + 20 * Number(s)} H${Number(x) - 58 * Number(s)} L${Number(x) - 24 * Number(s)} ${Number(y) - 40 * Number(s)} H${Number(x) - 46 * Number(s)} Z`}
              transform={`translate(0 ${-10 * i})`}
            />
          ))}
        </g>
      );
    case "cricket":
      return (
        <g>
          <g stroke={p.ink} strokeWidth="7" strokeLinecap="round">
            <path d="M300 300v130M326 300v130M352 300v130" />
          </g>
          <path d="M296 296h62" stroke={p.ink} strokeWidth="5" strokeLinecap="round" />
          <rect x="120" y="210" width="38" height="190" rx="14" transform="rotate(24 139 305)" fill="#E9CFA2" stroke={p.ink} strokeWidth="4" />
          <circle cx="215" cy="410" r="20" fill="#A64E30" stroke={p.ink} strokeWidth="3" />
          <path d="M198 404c10 8 24 8 34 0" stroke="#FFFCF7" strokeWidth="2.5" fill="none" />
        </g>
      );
    case "football":
      return (
        <g>
          <circle cx="205" cy="360" r="62" fill="#FFFCF7" stroke={p.ink} strokeWidth="5" />
          <path d="m205 330 28 20-11 32h-34l-11-32z" fill={p.ink} />
          <path d="M205 330v-22M233 350l24-9M222 382l15 22M188 382l-15 22M177 350l-24-9" stroke={p.ink} strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "running":
    case "hero":
    case "group":
    default:
      return (
        <path
          d="M180 520c20-40 80-60 60-110s-90-50-60-110c14-26 56-36 70-60"
          fill="none"
          stroke="#FFFCF7"
          strokeOpacity="0.8"
          strokeWidth="14"
          strokeLinecap="round"
        />
      );
  }
}

interface SceneProps {
  variant: SceneVariant;
  className?: string;
}

/**
 * Art-directed vector stand-in for a photograph. It exists so the layout, crop
 * behaviour and colour balance can be reviewed and shipped safely; replace by
 * registering a real photo for the same slot in `src/lib/photos.ts`.
 */
export function Scene({ variant, className }: SceneProps) {
  const uid = useId().replace(/:/g, "");
  const p = palettes[variant];

  return (
    <svg
      className={className}
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="1" stopColor={p.sky[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#sky-${uid})`} />
      <circle cx={variant === "basketball" ? 90 : 285} cy="140" r={variant === "hero" ? 92 : 66} fill={p.sun} opacity="0.92" />
      <path d="M-10 330 70 235l50 55 70-95 88 110 52-50 130 75v70H-10z" fill={p.far} opacity="0.85" />
      <path d="M-10 380 90 285l60 70 80-90 80 100 30-30 80 60v105H-10z" fill={p.mid} />
      {variant !== "surfing" && <path d="M-10 440c80-50 160-30 230-6s130 10 190-24v110H-10z" fill={p.near} />}
      <Motif variant={variant} p={p} />
    </svg>
  );
}
