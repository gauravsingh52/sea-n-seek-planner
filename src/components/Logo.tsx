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
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      {/* Globe circle */}
      <circle cx="32" cy="32" r="26" stroke="url(#logo-grad)" strokeWidth="3" fill="none" />
      {/* Horizontal line */}
      <ellipse cx="32" cy="32" rx="26" ry="10" stroke="url(#logo-grad)" strokeWidth="2" fill="none" />
      {/* Vertical meridian */}
      <ellipse cx="32" cy="32" rx="10" ry="26" stroke="url(#logo-grad)" strokeWidth="2" fill="none" />
      {/* Route arc */}
      <path
        d="M18 44 Q28 28, 46 22"
        stroke="hsl(var(--sunset))"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Origin dot */}
      <circle cx="18" cy="44" r="3.5" fill="hsl(var(--primary))" />
      {/* Destination pin */}
      <path
        d="M46 14 C46 14, 46 22, 46 22 C43 25, 49 25, 46 22 Z"
        fill="hsl(var(--sunset))"
      />
      <circle cx="46" cy="16" r="3" fill="hsl(var(--sunset))" />
      <circle cx="46" cy="16" r="1.5" fill="hsl(var(--background))" />
    </svg>
  );
}
