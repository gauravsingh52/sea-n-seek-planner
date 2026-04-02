export function Logo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-ring-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
        <linearGradient id="logo-pin-grad" x1="38" y1="10" x2="48" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(var(--sunset))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
        <linearGradient id="logo-trail-grad" x1="10" y1="52" x2="44" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.2)" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </linearGradient>
        <filter id="logo-pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="hsl(var(--sunset))" floodOpacity="0.45" />
        </filter>
        <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Open ring (270° arc) */}
      <path
        d="M 32 6 A 26 26 0 1 1 6 32"
        stroke="url(#logo-ring-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Globe latitude arc */}
      <path
        d="M 14 32 Q 32 20, 50 32"
        stroke="hsl(var(--primary) / 0.25)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Globe longitude arc */}
      <path
        d="M 32 14 Q 20 32, 32 50"
        stroke="hsl(var(--primary) / 0.25)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Second latitude arc (lower) */}
      <path
        d="M 16 40 Q 32 50, 48 40"
        stroke="hsl(var(--primary) / 0.15)"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />

      {/* Flight trail arc */}
      <path
        d="M 12 50 Q 24 28, 40 20"
        stroke="url(#logo-trail-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Tiny plane at trail tip */}
      <g transform="translate(39, 19) rotate(-50)">
        <polygon
          points="0,-3.5 2,2 0,1 -2,2"
          fill="hsl(var(--primary))"
        />
      </g>

      {/* Location pin — teardrop */}
      <g filter="url(#logo-pin-shadow)">
        <path
          d="M 44 16 C 44 11, 50 11, 50 16 C 50 20, 47 24, 47 24 C 47 24, 44 20, 44 16 Z"
          fill="url(#logo-pin-grad)"
        />
        {/* Pin inner glow dot */}
        <circle cx="47" cy="16" r="2" fill="hsl(var(--background))" filter="url(#logo-glow)" />
        <circle cx="47" cy="16" r="1" fill="hsl(var(--sunset))" />
      </g>
    </svg>
  );
}
