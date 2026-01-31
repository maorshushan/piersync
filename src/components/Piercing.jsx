import { PIERCING_STATUS } from '../constants'

const statusStyles = {
  [PIERCING_STATUS.OWNED]: 'fill-purple stroke-bg-dark/20 stroke-2 opacity-100',
  [PIERCING_STATUS.PLANNED]: 'fill-pink stroke-bg-dark/20 stroke-2 opacity-90',
  [PIERCING_STATUS.WISHLIST]: 'fill-yellow stroke-bg-dark/20 stroke-1 opacity-80'
}

/** Single piercing dot. x, y in viewBox units (0–100, 0–120). */
export default function Piercing({ x, y, status, label, selected, onClick }) {
  const style = statusStyles[status] ?? statusStyles[PIERCING_STATUS.WISHLIST]
  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="cursor-pointer select-none [pointer-events:auto]"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      aria-label={label ? `Piercing: ${label} (${status})` : `Piercing (${status})`}
    >
      <circle
        r={selected ? 6 : 5}
        className={`${style} transition-all ${selected ? 'stroke-[2.5] stroke-purple' : ''}`}
      />
      {selected && label && (
        <text
          y="14"
          textAnchor="middle"
          className="fill-bg-dark text-[10px] font-medium"
        >
          {label}
        </text>
      )}
    </g>
  )
}
