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
        <linearGradient id="logo-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="hsl(var(--sunset))" />
        </linearGradient>
        <linearGradient id="logo-ring" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Outer compass ring */}
      <circle cx="32" cy="32" r="30" stroke="url(#logo-ring)" strokeWidth="2" fill="none" />
      <circle cx="32" cy="32" r="26" stroke="url(#logo-ring)" strokeWidth="0.5" fill="none" opacity="0.4" />
      {/* Cardinal ticks */}
      {[0, 90, 180, 270].map((angle) => (
        <line
          key={angle}
          x1="32"
          y1="4"
          x2="32"
          y2="8"
          stroke="url(#logo-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${angle} 32 32)`}
        />
      ))}
      {/* Minor ticks */}
      {[45, 135, 225, 315].map((angle) => (
        <line
          key={angle}
          x1="32"
          y1="5"
          x2="32"
          y2="7"
          stroke="url(#logo-grad)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
          transform={`rotate(${angle} 32 32)`}
        />
      ))}
      {/* Compass needle — North (teal/accent) */}
      <polygon points="32,10 28,32 32,28 36,32" fill="url(#logo-grad)" />
      {/* Compass needle — South (subtle) */}
      <polygon points="32,54 28,32 32,36 36,32" fill="hsl(var(--muted-foreground))" opacity="0.3" />
      {/* Center pin */}
      <circle cx="32" cy="32" r="3" fill="url(#logo-grad)" />
      {/* Route dots */}
      <circle cx="22" cy="22" r="2" fill="hsl(var(--primary))" opacity="0.7" />
      <circle cx="42" cy="44" r="2" fill="hsl(var(--accent))" opacity="0.7" />
      {/* Route dashed line */}
      <path
        d="M22 22 Q32 28, 32 32 Q32 38, 42 44"
        stroke="url(#logo-grad)"
        strokeWidth="1.5"
        strokeDasharray="3 2"
        fill="none"
        opacity="0.6"
      />
      {/* Map pin at destination */}
      <path
        d="M42 40 C42 40, 42 44, 42 44 C42 46.5, 39 48, 42 50 C45 48, 42 46.5, 42 44 Z"
        fill="hsl(var(--sunset))"
        opacity="0.8"
      />
    </svg>
  );
}
