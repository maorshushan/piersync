import { useRef, useState, useCallback, useEffect } from 'react'
import { RotateCcw } from 'lucide-react'
import leftEar from '../assets/Lear-large.svg'
import rightEar from '../assets/Rear-large.svg'
import face from '../assets/face-large.svg'
import { VIEW_TYPE, EAR_LAYOUT } from './DesignerViewSwitcher'

const MIN_SCALE = 0.25
const MAX_SCALE = 3

const FIT_PADDING = 0.92

function measureFitScale(containerEl, contentEl) {
  if (!containerEl || !contentEl) return 1
  const cw = containerEl.offsetWidth
  const ch = containerEl.offsetHeight
  const contW = contentEl.offsetWidth
  const contH = contentEl.offsetHeight
  if (contW <= 0 || contH <= 0) return 1
  const scaleX = (cw * FIT_PADDING) / contW
  const scaleY = (ch * FIT_PADDING) / contH
  return Math.min(1, scaleX, scaleY)
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

export default function DesignerCanvas({ viewType, earLayout }) {
  const containerRef = useRef(null)
  const transformRef = useRef(null)
  const contentRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStartRef = useRef(null)
  const pinchStartRef = useRef(null)
  const currentRef = useRef({ scale: 1, translate: { x: 0, y: 0 } })
  const rafRef = useRef(null)
  const fitScaleRef = useRef(1)

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
      const delta = -e.deltaY * 0.002
      const s = clampScale(currentRef.current.scale + delta)
      currentRef.current.scale = s
      applyTransform(s, currentRef.current.translate.x, currentRef.current.translate.y)
      setScale(s)
    },
    [applyTransform]
  )

  const handlePointerDown = useCallback((e) => {
    if (e.button !== 0 || e.pointerType === 'touch') return
    setIsPanning(true)
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      translate: { ...currentRef.current.translate }
    }
  }, [])

  const handlePointerMove = useCallback(
    (e) => {
      if (!panStartRef.current || e.pointerType === 'touch') return
      e.preventDefault()
      const start = panStartRef.current
      const tx = start.translate.x + (e.clientX - start.x)
      const ty = start.translate.y + (e.clientY - start.y)
      currentRef.current.translate = { x: tx, y: ty }
      applyTransform(currentRef.current.scale, tx, ty)
    },
    [applyTransform]
  )

  const handlePointerUp = useCallback(() => {
    if (panStartRef.current) {
      panStartRef.current = null
      setIsPanning(false)
      syncStateFromRef()
    }
  }, [syncStateFromRef])

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      pinchStartRef.current = {
        distance: getDistance(e.touches[0], e.touches[1]),
        midpoint: getMidpoint(e.touches[0], e.touches[1]),
        scale: currentRef.current.scale,
        translate: { ...currentRef.current.translate }
      }
    } else if (e.touches.length === 1) {
      panStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        translate: { ...currentRef.current.translate }
      }
    }
  }, [])

  const handleTouchMove = useCallback(
    (e) => {
      if (e.touches.length === 2 && pinchStartRef.current) {
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
      } else if (e.touches.length === 1 && panStartRef.current) {
        e.preventDefault()
        const start = panStartRef.current
        const tx = start.translate.x + (e.touches[0].clientX - start.x)
        const ty = start.translate.y + (e.touches[0].clientY - start.y)
        currentRef.current.translate = { x: tx, y: ty }
        applyTransform(currentRef.current.scale, tx, ty)
      }
    },
    [applyTransform]
  )

  const handleTouchEnd = useCallback((e) => {
    if (e.touches.length < 2) {
      pinchStartRef.current = null
    }
    if (e.touches.length === 0) {
      panStartRef.current = null
      syncStateFromRef()
    }
  }, [syncStateFromRef])

  useEffect(() => {
    currentRef.current = { scale, translate: { ...translate } }
    applyTransform(scale, translate.x, translate.y)
  }, [scale, translate, applyTransform])

  const applyFitScale = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return
    const fit = clampScale(
      measureFitScale(containerRef.current, contentRef.current)
    )
    fitScaleRef.current = fit
    currentRef.current = { scale: fit, translate: { x: 0, y: 0 } }
    applyTransform(fit, 0, 0)
    setScale(fit)
    setTranslate({ x: 0, y: 0 })
  }, [applyTransform])

  useEffect(() => {
    applyFitScale()
  }, [viewType, earLayout, applyFitScale])

  useEffect(() => {
    const contentEl = contentRef.current
    if (!contentEl || !containerRef.current) return
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        if (!containerRef.current || !contentRef.current) return
        const contW = contentRef.current.offsetWidth
        const contH = contentRef.current.offsetHeight
        if (contW <= 0 || contH <= 0) return
        applyFitScale()
      })
    })
    ro.observe(contentEl)
    return () => ro.disconnect()
  }, [viewType, earLayout, applyFitScale])

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
      if (panStartRef.current || pinchStartRef.current) e.preventDefault()
    }
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', onTouchMove)
  }, [])

  const showEars = viewType === VIEW_TYPE.EARS
  const showFace = viewType === VIEW_TYPE.FACIAL
  const showSplit = showEars && earLayout === EAR_LAYOUT.SPLIT
  const showLeft = showEars && (earLayout === EAR_LAYOUT.LEFT || showSplit)
  const showRight = showEars && (earLayout === EAR_LAYOUT.RIGHT || showSplit)

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-xl bg-dot-grid touch-none"
      style={{ minHeight: 320, touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        ref={transformRef}
        className="flex h-full w-full items-center justify-center will-change-transform"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          cursor: isPanning ? 'grabbing' : 'grab'
        }}
      >
        <div
        ref={contentRef}
        className="inline-flex items-center justify-center gap-4 p-8"
        style={{ minWidth: 0, minHeight: 0 }}
      >
          {showLeft && (
            <img
              src={leftEar}
              alt="Left ear"
              className="h-48 w-auto max-w-[45%] select-none object-contain pointer-events-none"
              draggable={false}
            />
          )}
          {showRight && (
            <img
              src={rightEar}
              alt="Right ear"
              className="h-48 w-auto max-w-[45%] select-none object-contain pointer-events-none"
              draggable={false}
            />
          )}
          {showFace && (
            <img
              src={face}
              alt="Face"
              className="h-48 w-auto max-w-[80%] select-none object-contain pointer-events-none"
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
