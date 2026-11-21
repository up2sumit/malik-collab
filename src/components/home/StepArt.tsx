type Art = "laptop" | "connect" | "camera";

/** Custom editorial illustrations, one consistent flat style and palette. */
export function StepArt({ art, className }: { art: Art; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 120" fill="none" aria-hidden="true" focusable="false">
      {art === "laptop" && (
        <g>
          <ellipse cx="80" cy="108" rx="62" ry="6" fill="#2D493C" opacity="0.12" />
          <rect x="44" y="26" width="72" height="50" rx="6" fill="#FFFCF7" stroke="#232B27" strokeWidth="3" />
          <circle cx="66" cy="44" r="8" fill="#B85D3C" />
          <path d="M54 66c2-8 8-11 12-11s10 3 12 11" fill="#81917D" />
          <rect x="84" y="38" width="22" height="4" rx="2" fill="#D9CCBD" />
          <rect x="84" y="47" width="16" height="4" rx="2" fill="#D9CCBD" />
          <rect x="84" y="56" width="20" height="4" rx="2" fill="#D88750" />
          <path d="M32 80h96l-6 12H38z" fill="#232B27" />
          <circle cx="132" cy="92" r="11" fill="#D88750" stroke="#232B27" strokeWidth="3" />
          <path d="M121 92h22M132 81v22" stroke="#232B27" strokeWidth="2" />
          <path d="M20 54c6-14 18-16 22-14-4 6-10 10-22 14z" fill="#81917D" />
        </g>
      )}
      {art === "connect" && (
        <g>
          <ellipse cx="80" cy="108" rx="58" ry="6" fill="#2D493C" opacity="0.12" />
          <circle cx="62" cy="58" r="34" fill="#B85D3C" opacity="0.9" />
          <circle cx="98" cy="58" r="34" fill="#2D493C" opacity="0.9" />
          <path d="M80 30a34 34 0 0 1 0 56 34 34 0 0 1 0-56z" fill="#FFFCF7" />
          <path d="M70 60l7 7 14-15" stroke="#232B27" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M80 8v10M54 14l5 8M106 14l-5 8" stroke="#D88750" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      {art === "camera" && (
        <g>
          <ellipse cx="80" cy="110" rx="58" ry="6" fill="#2D493C" opacity="0.12" />
          <path d="M56 36l6-10h36l6 10" fill="#232B27" />
          <rect x="30" y="36" width="100" height="62" rx="10" fill="#2D493C" />
          <rect x="38" y="44" width="16" height="8" rx="3" fill="#D88750" />
          <circle cx="82" cy="68" r="24" fill="#FFFCF7" stroke="#232B27" strokeWidth="3" />
          <circle cx="82" cy="68" r="14" fill="#B85D3C" />
          <circle cx="82" cy="68" r="6" fill="#232B27" />
          <circle cx="76" cy="62" r="2.5" fill="#FFFCF7" />
          <rect x="108" y="46" width="14" height="6" rx="3" fill="#81917D" />
          <path d="M130 20l16 8-16 8z" fill="#D88750" />
        </g>
      )}
    </svg>
  );
}
