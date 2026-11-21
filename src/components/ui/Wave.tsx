/* All paths use absolute coordinates and finish exactly on x = 1440, so they
   always span the full width of the (non-uniformly scaled) SVG. */

const waves = {
  /** Gentle rolling hills */
  a: "M0 80 L0 46 C120 16 240 8 360 24 S600 56 720 50 S960 8 1080 14 S1320 44 1440 32 L1440 80 Z",
  /** Soft double crest */
  b: "M0 80 L0 30 C90 58 180 66 270 50 S450 4 540 12 S720 56 810 52 S990 16 1080 12 S1320 28 1440 42 L1440 80 Z",
  /** Mountain ridge */
  c: "M0 80 L0 52 L110 18 L200 48 L320 4 L430 50 L520 24 L650 62 L770 12 L880 48 L990 26 L1140 60 L1250 20 L1440 46 L1440 80 Z",
} as const;

interface WaveProps {
  /** Fill colour: use the colour of the section the wave belongs to. */
  fill: string;
  variant?: keyof typeof waves;
  flip?: boolean;
}

/** Organic separator. Place as the first child of a `relative` section that does not clip overflow. */
export function WaveTop({ fill, variant = "a", flip = false }: WaveProps) {
  return (
    <svg
      className="wave-top"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d={waves[variant]} fill={fill} />
    </svg>
  );
}

export type RidgePoint = readonly [x: number, y: number];

interface RidgeProps {
  /** Points from left (x = 0) to right (x = 1440), y measured from the top of the box. */
  points: readonly RidgePoint[];
  height: number;
  className?: string;
}

/** Decorative mountain silhouette, filled with currentColor. */
export function Ridge({ points, height, className }: RidgeProps) {
  const d = `M0 ${height} ${points.map(([x, y]) => `L${x} ${y}`).join(" ")} L1440 ${height} Z`;
  return (
    <svg className={className} viewBox={`0 0 1440 ${height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d={d} fill="currentColor" />
    </svg>
  );
}

export const ridges = {
  hero: [[0, 150], [120, 90], [210, 140], [350, 40], [470, 130], [560, 90], [710, 170], [820, 100], [950, 160], [1070, 110], [1200, 170], [1310, 120], [1440, 160]],
  page: [[0, 80], [140, 40], [250, 74], [400, 12], [520, 78], [630, 48], [780, 92], [900, 38], [1040, 88], [1170, 52], [1300, 92], [1440, 60]],
  closing: [[0, 96], [100, 48], [180, 88], [310, 18], [420, 98], [510, 68], [650, 120], [770, 60], [890, 112], [1010, 56], [1130, 100], [1250, 64], [1440, 104]],
} as const satisfies Record<string, readonly RidgePoint[]>;
