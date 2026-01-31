/**
 * Reusable ear illustration (left ear, side view).
 * viewBox 0 0 100 120 — coordinates match piercing placement.
 * Pass side="right" to mirror for future left/right support.
 */
export default function EarSVG({ className = '', side = 'left', ...props }) {
  const flip = side === 'right' ? 'scale(-1, 1)' : ''
  return (
    <svg
      viewBox="0 0 100 120"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      {...props}
    >
      <g transform={flip ? `translate(100, 0) ${flip} translate(-100, 0)` : ''}>
        {/* Outer ear outline — simple stylized ear shape */}
        <path
          d="M 50 8
             C 65 8 78 22 80 38
             C 82 52 75 68 62 78
             C 52 86 42 92 35 98
             C 30 102 28 108 30 112
             C 32 116 38 118 42 116
             C 48 112 55 105 58 98
             C 68 88 75 72 76 55
             C 76 38 65 22 50 18
             Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          className="text-purple"
        />
        {/* Inner ear / conch hint */}
        <path
          d="M 50 28 C 60 30 68 42 68 55 C 68 68 60 78 50 80 C 40 78 32 68 32 55 C 32 42 40 30 50 28 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="text-purple-light"
          opacity="0.8"
        />
      </g>
    </svg>
  )
}
