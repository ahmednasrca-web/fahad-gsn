interface LogoIconProps {
  size?: number
  className?: string
  color?: 'current' | 'walnut' | 'copper' | 'light'
}

const COLOR_MAP = {
  current: 'currentColor',
  walnut: '#2C1810',
  copper: '#C4854A',
  light: '#FAF7F2',
}

/**
 * High-performance vector brand mark for Fahad Gsn (The minimalist woodcraft branch).
 * Ensures CLS = 0, instantaneous load time, and razor-sharp rendering on all screens.
 */
export default function LogoIcon({
  size = 36,
  className = '',
  color = 'copper',
}: LogoIconProps) {
  const strokeColor = COLOR_MAP[color]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Central Trunk */}
      <path
        d="M50 12V118"
        stroke={strokeColor}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top Right Branch */}
      <path
        d="M50 36L78 18"
        stroke={strokeColor}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Middle Left Branch */}
      <path
        d="M50 62L22 44"
        stroke={strokeColor}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom Right Branch */}
      <path
        d="M50 82L73 66"
        stroke={strokeColor}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
