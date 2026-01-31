import { useCallback } from 'react'
import EarSVG from './EarSVG'
import Piercing from './Piercing'
import { EAR_VIEWBOX } from '../constants'

/**
 * Canvas: ear SVG + absolutely positioned piercings.
 * Click on ear to add a piercing; coordinates in viewBox units.
 */
export default function PiercingLayer({
  piercings,
  selectedId,
  onSelectPiercing,
  onAddPiercing,
  onCycleStatus
}) {
  const handleEarClick = useCallback(
    (e) => {
      const svg = e.currentTarget
      const rect = svg.getBoundingClientRect()
      const scaleX = EAR_VIEWBOX.width / rect.width
      const scaleY = EAR_VIEWBOX.height / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY
      onAddPiercing?.({ x, y })
    },
    [onAddPiercing]
  )

  return (
    <div className="relative inline-block">
      <EarSVG
        className="h-[280px] w-[233px] max-w-full text-purple cursor-crosshair"
        onClick={handleEarClick}
      />
      <svg
        viewBox={`0 0 ${EAR_VIEWBOX.width} ${EAR_VIEWBOX.height}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-[280px] w-[233px] max-w-full pointer-events-none"
        aria-hidden
      >
        <g pointerEvents="none">
          {piercings.map((p) => (
            <Piercing
              key={p.id}
              x={p.x}
              y={p.y}
              status={p.status}
              label={p.label}
              selected={selectedId === p.id}
              onClick={() => {
                onSelectPiercing?.(p.id)
                onCycleStatus?.(p.id)
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
