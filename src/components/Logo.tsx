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
        <linearGradient id="logo-grad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      {/* Compass circle */}
      <circle cx="32" cy="32" r="28" fill="hsl(var(--primary) / 0.1)" stroke="url(#logo-grad)" strokeWidth="3" />
      {/* North arrow */}
      <polygon points="32,10 27,30 32,26 37,30" fill="hsl(var(--primary))" />
      {/* South arrow */}
      <polygon points="32,54 37,34 32,38 27,34" fill="hsl(var(--primary) / 0.35)" />
      {/* Pin dot */}
      <circle cx="32" cy="32" r="4" fill="hsl(var(--sunset))" />
      <circle cx="32" cy="32" r="1.5" fill="hsl(var(--background))" />
      {/* Route arc */}
      <path
        d="M20 44 Q32 24, 46 20"
        stroke="hsl(var(--sunset))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="4 3"
        fill="none"
      />
    </svg>
  );
}
