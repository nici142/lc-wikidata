/**
 * PlantBuddy-Logo: ein Sprössling (Stiel + zwei Blätter) auf einer App-Icon-
 * artigen, abgerundeten Kachel. Wird identisch als Nav-Logo und als Favicon
 * (siehe public/favicon.svg) verwendet.
 */
export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden role="img">
      <rect width="40" height="40" rx="11" fill="url(#plantbuddy-logo-gradient)" />
      <path d="M20 29 L20 20" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M20 22 C 13 21, 9 17, 11 11 C 17 12, 21 16, 20 22 Z"
        fill="white"
      />
      <path
        d="M20 22 C 27 21, 31 17, 29 11 C 23 12, 19 16, 20 22 Z"
        fill="white"
      />
      <defs>
        <linearGradient id="plantbuddy-logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8fbd6c" />
          <stop offset="1" stopColor="#385a26" />
        </linearGradient>
      </defs>
    </svg>
  );
}
