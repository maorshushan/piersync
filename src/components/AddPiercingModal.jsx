import { useState } from 'react'
import { X } from 'lucide-react'
import {
  RANGE_PIERCING_TYPES,
  FIXED_PIERCING_TYPES,
  getRangeTypeCenter
} from '../constants/piercingTypes'

export default function AddPiercingModal({ onAdd, onClose }) {
  const [step, setStep] = useState(1)
  const [typeId, setTypeId] = useState(null)
  const [style, setStyle] = useState(null)

  const isRange = typeId && RANGE_PIERCING_TYPES.some((t) => t.id === typeId)
  const isFixed = typeId && FIXED_PIERCING_TYPES.some((t) => t.id === typeId)
  const typeConfig = isRange
    ? RANGE_PIERCING_TYPES.find((t) => t.id === typeId)
    : isFixed
      ? FIXED_PIERCING_TYPES.find((t) => t.id === typeId)
      : null

  const handleChooseType = (id) => {
    setTypeId(id)
    setStyle(null)
    if (id === 'custom') {
      onAdd({ type: 'custom', style: 'stud', x: 111, y: 179 })
      onClose()
      return
    }
    const rangeT = RANGE_PIERCING_TYPES.find((t) => t.id === id)
    const fixedT = FIXED_PIERCING_TYPES.find((t) => t.id === id)
    if (rangeT) {
      if (rangeT.styles.length === 1) {
        const center = getRangeTypeCenter(id)
        onAdd({ type: id, style: rangeT.styles[0], fixed: false, ...center })
        onClose()
        return
      }
      setStep(2)
    } else if (fixedT) {
      const styles = [fixedT.style]
      if (fixedT.altStyle) styles.push(fixedT.altStyle)
      if (styles.length === 1) {
        onAdd({ type: id, style: fixedT.style, fixed: true })
        onClose()
        return
      }
      setStep(2)
    }
  }

  const handleChooseStyle = (s) => {
    setStyle(s)
    if (isRange) {
      const center = getRangeTypeCenter(typeId)
      onAdd({ type: typeId, style: s, fixed: false, ...center })
    } else if (isFixed) {
      onAdd({ type: typeId, style: s, fixed: true })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-dark/50 p-4" onClick={onClose}>
      <div
        className="relative max-h-[85vh] w-full max-w-md overflow-hidden rounded-2xl bg-purple-light shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-purple/30 px-4 py-3">
          <h2 className="text-lg font-semibold text-bg-dark">
            {step === 1 ? 'Add piercing' : 'Choose style'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-bg-dark/70 hover:bg-purple/30 hover:text-bg-dark"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-bg-dark/80">Range placement</p>
              <div className="flex flex-wrap gap-2">
                {RANGE_PIERCING_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleChooseType(t.id)}
                    className="rounded-xl border-2 px-3 py-2 text-sm font-medium transition"
                    style={{ borderColor: t.color, color: t.color }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
              <p className="text-sm font-medium text-bg-dark/80">Fixed placement</p>
              <div className="flex flex-wrap gap-2">
                {FIXED_PIERCING_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleChooseType(t.id)}
                    className="rounded-xl border-2 px-3 py-2 text-sm font-medium transition"
                    style={{ borderColor: t.color, color: t.color }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
              <p className="text-sm font-medium text-bg-dark/80">Other</p>
              <button
                type="button"
                onClick={() => handleChooseType('custom')}
                className="rounded-xl border-2 border-purple bg-purple/20 px-3 py-2 text-sm font-medium text-bg-dark"
              >
                Custom
              </button>
            </div>
          )}
          {step === 2 && typeConfig && (
            <div className="space-y-4">
              <p className="text-sm text-bg-dark/70">Style for {typeConfig.name}</p>
              <div className="flex flex-wrap gap-2">
                {(typeConfig.styles ?? [typeConfig.style]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleChooseStyle(s)}
                    className="rounded-xl border-2 border-purple bg-purple/20 px-4 py-2 text-sm font-medium capitalize text-bg-dark"
                  >
                    {s}
                  </button>
                ))}
                {isFixed && typeConfig.altStyle && (
                  <button
                    type="button"
                    onClick={() => handleChooseStyle(typeConfig.altStyle)}
                    className="rounded-xl border-2 px-4 py-2 text-sm font-medium capitalize transition"
                    style={{ borderColor: typeConfig.altColor, color: typeConfig.altColor }}
                  >
                    {typeConfig.altStyle}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
