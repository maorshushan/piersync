import { useRef, useState, useCallback, useEffect } from 'react'
import { RotateCcw } from 'lucide-react'
import leftEar from '../assets/Lear-large.svg'
import rightEar from '../assets/Rear-large.svg'
import face from '../assets/face-large.svg'
import { VIEW_TYPE, EAR_LAYOUT } from './DesignerViewSwitcher'
import PiercingOverlay from './PiercingOverlay'
import {
  GUIDE_VIEWBOX,
  clampToRangeBounds,
  clampToGuidePath,
  GUIDE_PATHS_LEFT,
  GUIDE_PATHS_RIGHT,
  RANGE_PIERCING_TYPES
} from '../constants/piercingTypes'

const MIN_SCALE = 0.25
const MAX_SCALE = 6

function measureFillScale(containerEl, contentEl) {
  if (!containerEl || !contentEl) return 1
  const cw = containerEl.offsetWidth
  const ch = containerEl.offsetHeight
  const contW = contentEl.offsetWidth
  const contH = contentEl.offsetHeight
  if (contW <= 0 || contH <= 0) return 1
  const scaleX = cw / contW
  const scaleY = ch / contH
  return Math.max(scaleX, scaleY)
}

function getDistance(a, b) {
  return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)
}

function getMidpoint(a, b) {
  return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 }
}

function clampScale(s) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))
}

function getEarScale(rect) {
  if (!rect || rect.width <= 0 || rect.height <= 0) return 1
  return Math.min(rect.width / GUIDE_VIEWBOX.width, rect.height / GUIDE_VIEWBOX.height)
}

export default function DesignerCanvas({
  viewType,
  earLayout,
  piercings = [],
  selectedId,
  onSelectPiercing,
  onUpdatePiercing,
  fillContainer = false
}) {
  const containerRef = useRef(null)
  const transformRef = useRef(null)
  const contentRef = useRef(null)
  const leftEarRef = useRef(null)
  const rightEarRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [isDraggingPiercing, setIsDraggingPiercing] = useState(false)
  const panStartRef = useRef(null)
  const pinchStartRef = useRef(null)
  const pierceDragRef = useRef(null)
  const pointerDownTargetRef = useRef(null)
  const didDragPiercingRef = useRef(false)
  const currentRef = useRef({ scale: 1, translate: { x: 0, y: 0 } })
  const rafRef = useRef(null)
  const fitScaleRef = useRef(1)

  const selected = selectedId ? piercings.find((p) => p.id === selectedId) : null
  const selectedMovable = selected && !selected.fixed

  const isReset =
    Math.abs(scale - fitScaleRef.current) < 0.001 &&
    Math.abs(translate.x) < 0.5 &&
    Math.abs(translate.y) < 0.5

  const applyTransform = useCallback((s, tx, ty) => {
    const el = transformRef.current
    if (!el) return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      el.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`
      rafRef.current = null
    })
  }, [])

  const syncStateFromRef = useCallback(() => {
    const { scale: s, translate: t } = currentRef.current
    setScale(s)
    setTranslate({ x: t.x, y: t.y })
  }, [])

  const resetView = useCallback(() => {
    const s = fitScaleRef.current
    currentRef.current = { scale: s, translate: { x: 0, y: 0 } }
    applyTransform(s, 0, 0)
    setScale(s)
    setTranslate({ x: 0, y: 0 })
  }, [applyTransform])

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault()
      if (selectedId) return
      const delta = -e.deltaY * 0.002
      const s = clampScale(currentRef.current.scale + delta)
      currentRef.current.scale = s
      applyTransform(s, currentRef.current.translate.x, currentRef.current.translate.y)
      setScale(s)
    },
    [applyTransform, selectedId]
  )

  const handlePointerDown = useCallback(
    (e) => {
      if (e.button !== 0 || e.pointerType === 'touch') return
      pointerDownTargetRef.current = e.target
      if (selectedMovable) {
        pierceDragRef.current = {
          clientX: e.clientX,
          clientY: e.clientY,
          x: selected.x ?? 0,
          y: selected.y ?? 0
        }
        return
      }
      setIsPanning(true)
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        translate: { ...currentRef.current.translate }
      }
    },
    [selectedMovable, selected]
  )

  const handlePointerMove = useCallback(
    (e) => {
      if (pierceDragRef.current) {
        e.preventDefault()
        const drag = pierceDragRef.current
        const earEl = selected?.ear === 'right' ? rightEarRef.current : leftEarRef.current
        if (!earEl || !onUpdatePiercing) return
        const rect = earEl.getBoundingClientRect()
        const scalePx = getEarScale(rect)
        const deltaVbX = (e.clientX - drag.clientX) / scalePx
        const deltaVbY = (e.clientY - drag.clientY) / scalePx
        const newX = selected?.ear === 'right' ? drag.x - deltaVbX : drag.x + deltaVbX
        const newY = drag.y + deltaVbY
        const clamped =
          selected?.type && selected.type !== 'custom' && GUIDE_PATHS_LEFT[selected.type]
            ? clampToGuidePath(selected.type, selected.ear ?? 'left', newX, newY, drag.x, drag.y)
            : selected?.type && selected.type !== 'custom'
              ? clampToRangeBounds(selected.type, newX, newY)
              : {
                  x: Math.max(0, Math.min(GUIDE_VIEWBOX.width, newX)),
                  y: Math.max(0, Math.min(GUIDE_VIEWBOX.height, newY))
                }
        onUpdatePiercing(selected.id, clamped)
        pierceDragRef.current = { ...drag, clientX: e.clientX, clientY: e.clientY, x: clamped.x, y: clamped.y }
        didDragPiercingRef.current = true
        setIsDraggingPiercing(true)
        return
      }
      if (!panStartRef.current || e.pointerType === 'touch') return
      e.preventDefault()
      const start = panStartRef.current
      const tx = start.translate.x + (e.clientX - start.x)
      const ty = start.translate.y + (e.clientY - start.y)
      currentRef.current.translate = { x: tx, y: ty }
      applyTransform(currentRef.current.scale, tx, ty)
    },
    [applyTransform, selected, onUpdatePiercing]
  )

  const handlePointerUp = useCallback(() => {
    if (pierceDragRef.current) {
      const shouldDeselect =
        !didDragPiercingRef.current &&
        (pointerDownTargetRef.current?.hasAttribute?.('data-deselect') ||
          pointerDownTargetRef.current?.closest?.('[data-deselect]'))
      pierceDragRef.current = null
      didDragPiercingRef.current = false
      setIsDraggingPiercing(false)
      if (shouldDeselect) onSelectPiercing?.(null)
      return
    }
    if (panStartRef.current) {
      panStartRef.current = null
      setIsPanning(false)
      syncStateFromRef()
    }
  }, [syncStateFromRef, onSelectPiercing])

  const handleTouchStart = useCallback(
    (e) => {
      if (e.touches.length === 2) {
        if (!selectedId) {
          pinchStartRef.current = {
            distance: getDistance(e.touches[0], e.touches[1]),
            midpoint: getMidpoint(e.touches[0], e.touches[1]),
            scale: currentRef.current.scale,
            translate: { ...currentRef.current.translate }
          }
        }
      } else if (e.touches.length === 1) {
        if (selectedMovable) {
          pointerDownTargetRef.current = e.target
          pierceDragRef.current = {
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY,
            x: selected?.x ?? 0,
            y: selected?.y ?? 0
          }
        } else {
          panStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            translate: { ...currentRef.current.translate }
          }
        }
      }
    },
    [selectedMovable, selected, selectedId]
  )

  const handleTouchEnd = useCallback(
    (e) => {
      if (e.touches.length < 2) pinchStartRef.current = null
      if (e.touches.length === 0) {
        if (pierceDragRef.current) {
          const shouldDeselect =
            !didDragPiercingRef.current &&
            (pointerDownTargetRef.current?.hasAttribute?.('data-deselect') ||
              pointerDownTargetRef.current?.closest?.('[data-deselect]'))
          pierceDragRef.current = null
          didDragPiercingRef.current = false
          setIsDraggingPiercing(false)
          if (shouldDeselect) onSelectPiercing?.(null)
        } else {
          panStartRef.current = null
          syncStateFromRef()
        }
      }
    },
    [syncStateFromRef, onSelectPiercing]
  )

  useEffect(() => {
    currentRef.current = { scale, translate: { ...translate } }
    applyTransform(scale, translate.x, translate.y)
  }, [scale, translate, applyTransform])

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return
    const run = () => {
      const fit = clampScale(measureFillScale(containerRef.current, contentRef.current))
      fitScaleRef.current = fit
      currentRef.current = { scale: fit, translate: { x: 0, y: 0 } }
      applyTransform(fit, 0, 0)
      setScale(fit)
      setTranslate({ x: 0, y: 0 })
    }
    const id = requestAnimationFrame(() => requestAnimationFrame(run))
    return () => cancelAnimationFrame(id)
  }, [viewType, earLayout, applyTransform])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  useEffect(() => {
    const onPointerMove = (e) => handlePointerMove(e)
    const onPointerUp = () => handlePointerUp()
    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onTouchMove = (e) => {
      if (e.touches.length === 2) {
        if (selected) {
          e.preventDefault()
          return
        }
        if (pinchStartRef.current) {
          e.preventDefault()
          const start = pinchStartRef.current
          const distance = getDistance(e.touches[0], e.touches[1])
          const ratio = distance / start.distance
          const s = clampScale(start.scale * ratio)
          const mid = getMidpoint(e.touches[0], e.touches[1])
          const tx = start.translate.x + (mid.x - start.midpoint.x)
          const ty = start.translate.y + (mid.y - start.midpoint.y)
          currentRef.current = { scale: s, translate: { x: tx, y: ty } }
          applyTransform(s, tx, ty)
        }
      } else if (e.touches.length === 1) {
        if (pierceDragRef.current) {
          e.preventDefault()
          const drag = pierceDragRef.current
          const earEl = selected?.ear === 'right' ? rightEarRef.current : leftEarRef.current
          if (earEl && onUpdatePiercing) {
            const rect = earEl.getBoundingClientRect()
            const scalePx = getEarScale(rect)
            const deltaVbX = (e.touches[0].clientX - drag.clientX) / scalePx
            const deltaVbY = (e.touches[0].clientY - drag.clientY) / scalePx
            const newX = selected?.ear === 'right' ? drag.x - deltaVbX : drag.x + deltaVbX
            const newY = drag.y + deltaVbY
            const clamped =
              selected?.type && selected.type !== 'custom' && GUIDE_PATHS_LEFT[selected.type]
                ? clampToGuidePath(selected.type, selected.ear ?? 'left', newX, newY, drag.x, drag.y)
                : selected?.type && selected.type !== 'custom'
                  ? clampToRangeBounds(selected.type, newX, newY)
                  : {
                      x: Math.max(0, Math.min(GUIDE_VIEWBOX.width, newX)),
                      y: Math.max(0, Math.min(GUIDE_VIEWBOX.height, newY))
                    }
            onUpdatePiercing(selected.id, clamped)
            pierceDragRef.current = {
              ...drag,
              clientX: e.touches[0].clientX,
              clientY: e.touches[0].clientY,
              x: clamped.x,
              y: clamped.y
            }
            didDragPiercingRef.current = true
            setIsDraggingPiercing(true)
          }
          return
        }
        if (panStartRef.current) {
          e.preventDefault()
          const start = panStartRef.current
          const tx = start.translate.x + (e.touches[0].clientX - start.x)
          const ty = start.translate.y + (e.touches[0].clientY - start.y)
          currentRef.current.translate = { x: tx, y: ty }
          applyTransform(currentRef.current.scale, tx, ty)
        }
      }
    }
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', onTouchMove)
  }, [applyTransform, selected, onUpdatePiercing])

  const showEars = viewType === VIEW_TYPE.EARS
  const showFace = viewType === VIEW_TYPE.FACIAL
  const showSplit = showEars && earLayout === EAR_LAYOUT.SPLIT
  const showLeft = showEars && (earLayout === EAR_LAYOUT.LEFT || showSplit)
  const showRight = showEars && (earLayout === EAR_LAYOUT.RIGHT || showSplit)

  return (
    <div
      ref={containerRef}
      data-deselect
      className={
        fillContainer
          ? 'relative h-full w-full overflow-hidden rounded-xl bg-dot-grid touch-none'
          : 'relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-xl bg-dot-grid touch-none'
      }
      style={{ minHeight: fillContainer ? 0 : 320, touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        ref={transformRef}
        data-deselect
        className="flex h-full w-full items-center justify-center will-change-transform"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          cursor: selectedMovable ? 'default' : isPanning ? 'grabbing' : 'grab'
        }}
      >
        <div ref={contentRef} data-deselect className="flex items-center justify-center gap-8 p-16 shrink-0">
          {showLeft && (
            <div
              ref={leftEarRef}
              data-deselect
              className={"relative inline-block h-96 max-h-[90%] w-auto shrink-0 " + (showRight ? 'max-w-[30%]' : '')}
            >
              {selectedMovable && (selected?.ear ?? 'left') === 'left' && selected?.type && GUIDE_PATHS_LEFT[selected.type] && (() => {
                const typeConfig = RANGE_PIERCING_TYPES.find((t) => t.id === selected.type)
                const pathD = GUIDE_PATHS_LEFT[selected.type]
                const fill = typeConfig?.color ?? '#888'
                return (
                  <svg
                    viewBox={`0 0 ${GUIDE_VIEWBOX.width} ${GUIDE_VIEWBOX.height}`}
                    preserveAspectRatio="xMidYMid meet"
                    className="absolute inset-0 h-full w-full pointer-events-none select-none"
                    aria-hidden
                  >
                    <path
                      d={pathD}
                      fill={fill}
                      stroke={fill}
                      strokeWidth={2}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      fillOpacity={isDraggingPiercing ? 0.5 : undefined}
                      strokeDasharray={isDraggingPiercing ? '1 1' : 'none'}
                      style={{ opacity: isDraggingPiercing ? 1 : 0.35, transition: 'opacity 0.15s ease' }}
                    />
                  </svg>
                )
              })()}
              <img
                src={leftEar}
                alt="Left ear"
                className="relative z-10 block h-96 w-auto max-h-full select-none object-contain pointer-events-none"
                draggable={false}
              />
              <PiercingOverlay
                piercings={piercings.filter((p) => (p.ear ?? 'left') === 'left')}
                selectedId={selectedId}
                onSelect={onSelectPiercing}
                ear="left"
              />
            </div>
          )}
          {showRight && (
            <div
              ref={rightEarRef}
              data-deselect
              className={"relative inline-block h-96 max-h-[90%] w-auto shrink-0 " + (showLeft ? 'max-w-[30%]' : '')}
            >
              {selectedMovable && selected?.ear === 'right' && selected?.type && GUIDE_PATHS_RIGHT[selected.type] && (() => {
                const typeConfig = RANGE_PIERCING_TYPES.find((t) => t.id === selected.type)
                const pathD = GUIDE_PATHS_RIGHT[selected.type]
                const fill = typeConfig?.color ?? '#888'
                return (
                  <svg
                    viewBox={`0 0 ${GUIDE_VIEWBOX.width} ${GUIDE_VIEWBOX.height}`}
                    preserveAspectRatio="xMidYMid meet"
                    className="absolute inset-0 h-full w-full pointer-events-none select-none"
                    aria-hidden
                  >
                    <path
                      d={pathD}
                      fill={fill}
                      stroke={fill}
                      strokeWidth={2}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      fillOpacity={isDraggingPiercing ? 0.5 : undefined}
                      strokeDasharray={isDraggingPiercing ? '1 1' : 'none'}
                      style={{ opacity: isDraggingPiercing ? 1 : 0.35, transition: 'opacity 0.15s ease' }}
                    />
                  </svg>
                )
              })()}
              <img
                src={rightEar}
                alt="Right ear"
                className="relative z-10 block h-96 w-auto max-h-full select-none object-contain pointer-events-none"
                draggable={false}
              />
              <PiercingOverlay
                piercings={piercings.filter((p) => p.ear === 'right')}
                selectedId={selectedId}
                onSelect={onSelectPiercing}
                ear="right"
              />
            </div>
          )}
          {showFace && (
            <img
              src={face}
              alt="Face"
              className="h-96 w-auto max-w-[80%] select-none object-contain pointer-events-none"
              draggable={false}
            />
          )}
        </div>
      </div>

      {!isReset && (
        <button
          type="button"
          onClick={resetView}
          className="absolute bottom-3 right-3 rounded-full bg-bg-dark/90 p-2.5 text-white shadow-lg transition hover:bg-bg-dark"
          aria-label="Reset view"
        >
          <RotateCcw className="h-5 w-5" strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
