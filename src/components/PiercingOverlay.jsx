import { FIXED_PIERCING_TYPES, RANGE_PIERCING_TYPES, GUIDE_VIEWBOX } from '../constants/piercingTypes'

const mirrorX = (x) => GUIDE_VIEWBOX.width - x

function getFixedPosition(typeId, style, ear) {
  const t = FIXED_PIERCING_TYPES.find((x) => x.id === typeId)
  if (!t) return null
  let pos = null
  if (style === t.style && t.positions?.[0]) {
    const p = t.positions[0]
    if ('x' in p) pos = { kind: 'point', x: p.x, y: p.y }
    else if ('cx' in p) pos = { kind: 'point', x: p.cx, y: p.cy }
    else if ('x1' in p) pos = { kind: 'line', ...p }
  }
  if (!pos && t.altStyle === style && t.altPositions?.[0]) {
    const p = t.altPositions[0]
    pos = { kind: 'line', x1: p.x1, y1: p.y1, x2: p.x2, y2: p.y2 }
  }
  if (!pos && t.positions?.[0]) {
    const p = t.positions[0]
    if ('x1' in p) pos = { kind: 'line', ...p }
    else if ('x' in p) pos = { kind: 'point', x: p.x, y: p.y }
  }
  if (!pos) return null
  if (ear === 'right') {
    if (pos.kind === 'point') return { ...pos, x: mirrorX(pos.x) }
    return { ...pos, x1: mirrorX(pos.x1), x2: mirrorX(pos.x2) }
  }
  return pos
}

function getTypeColor(typeId, style) {
  const range = RANGE_PIERCING_TYPES.find((t) => t.id === typeId)
  if (range) return range.color
  const fixed = FIXED_PIERCING_TYPES.find((t) => t.id === typeId)
  if (!fixed) return '#888'
  if (fixed.altStyle === style && fixed.altColor) return fixed.altColor
  return fixed.color
}

export default function PiercingOverlay({ piercings, selectedId, onSelect, ear = 'left' }) {
  const mx = (x) => (ear === 'right' ? mirrorX(x) : x)
  return (
    <svg
      viewBox={`0 0 ${GUIDE_VIEWBOX.width} ${GUIDE_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full pointer-events-none"
      aria-hidden
    >
      <g pointerEvents="auto">
        <rect
          width={GUIDE_VIEWBOX.width}
          height={GUIDE_VIEWBOX.height}
          fill="transparent"
          data-deselect
          className="[pointer-events:auto]"
          aria-hidden
        />
        {piercings.map((p) => {
          const color = getTypeColor(p.type ?? 'custom', p.style ?? 'stud')
          const isSelected = selectedId === p.id
          const stroke = isSelected ? '#242529' : 'transparent'
          const strokeWidth = isSelected ? 2 : 0

          if (p.fixed) {
            const t = FIXED_PIERCING_TYPES.find((x) => x.id === p.type)
            const pos = getFixedPosition(p.type, p.style, ear)
            if (!pos) return null
            if (pos.kind === 'line') {
              return (
                <line
                  key={p.id}
                  x1={pos.x1}
                  y1={pos.y1}
                  x2={pos.x2}
                  y2={pos.y2}
                  stroke={color}
                  strokeWidth={3}
                  strokeLinecap="round"
                  className="cursor-pointer [pointer-events:auto]"
                  onClick={() => onSelect?.(p.id)}
                />
              )
            }
            if (t?.positions?.length > 1 && (p.style === 'curved' || p.style === 'industrial')) {
              return (
                <g key={p.id} onClick={() => onSelect?.(p.id)} className="cursor-pointer [pointer-events:auto]">
                  {t.positions.map((pt, i) => (
                    <circle
                      key={i}
                      cx={mx(pt.x ?? pt.cx)}
                      cy={pt.y ?? pt.cy}
                      r={p.size ?? 2}
                      fill={color}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                    />
                  ))}
                </g>
              )
            }
            return (
              <circle
                key={p.id}
                cx={pos.x}
                cy={pos.y}
                r={p.size ?? 3}
                fill={color}
                stroke={stroke}
                strokeWidth={strokeWidth}
                className="cursor-pointer [pointer-events:auto]"
                onClick={() => onSelect?.(p.id)}
              />
            )
          }

          const x = mx(p.x ?? 0)
          const y = p.y ?? 0
          const size = p.size ?? 3
          const rot = ((p.rotation ?? 0) * Math.PI) / 180
          const L = 10

          if (p.style === 'hoop') {
            const x1 = x - L * Math.cos(rot)
            const y1 = y - L * Math.sin(rot)
            const x2 = x + L * Math.cos(rot)
            const y2 = y + L * Math.sin(rot)
            return (
              <line
                key={p.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
                className="cursor-pointer [pointer-events:auto]"
                onClick={() => onSelect?.(p.id)}
              />
            )
          }

          return (
            <circle
              key={p.id}
              cx={x}
              cy={y}
              r={size}
              fill={color}
              stroke={stroke}
              strokeWidth={strokeWidth}
              className="cursor-pointer [pointer-events:auto]"
              onClick={() => onSelect?.(p.id)}
            />
          )
        })}
      </g>
    </svg>
  )
}
