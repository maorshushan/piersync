const VIEW_TYPE = { EARS: 'ears', FACIAL: 'facial' }
const EAR_LAYOUT = { LEFT: 'left', RIGHT: 'right', SPLIT: 'split' }

export { VIEW_TYPE, EAR_LAYOUT }

export default function DesignerViewSwitcher({ viewType, earLayout, onViewTypeChange, onEarLayoutChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex rounded-lg border border-purple/40 bg-purple-light/50 p-1">
        <button
          type="button"
          onClick={() => onViewTypeChange?.(VIEW_TYPE.EARS)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            viewType === VIEW_TYPE.EARS ? 'bg-purple text-bg-dark' : 'text-bg-dark/70 hover:bg-purple/30'
          }`}
        >
          Ears
        </button>
        <button
          type="button"
          onClick={() => onViewTypeChange?.(VIEW_TYPE.FACIAL)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            viewType === VIEW_TYPE.FACIAL ? 'bg-purple text-bg-dark' : 'text-bg-dark/70 hover:bg-purple/30'
          }`}
        >
          Facial
        </button>
      </div>
      {viewType === VIEW_TYPE.EARS && (
        <div className="flex rounded-lg border border-purple/40 bg-purple-light/50 p-1">
          <button
            type="button"
            onClick={() => onEarLayoutChange?.(EAR_LAYOUT.LEFT)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              earLayout === EAR_LAYOUT.LEFT ? 'bg-purple text-bg-dark' : 'text-bg-dark/70 hover:bg-purple/30'
            }`}
          >
            Left
          </button>
          <button
            type="button"
            onClick={() => onEarLayoutChange?.(EAR_LAYOUT.RIGHT)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              earLayout === EAR_LAYOUT.RIGHT ? 'bg-purple text-bg-dark' : 'text-bg-dark/70 hover:bg-purple/30'
            }`}
          >
            Right
          </button>
          <button
            type="button"
            onClick={() => onEarLayoutChange?.(EAR_LAYOUT.SPLIT)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              earLayout === EAR_LAYOUT.SPLIT ? 'bg-purple text-bg-dark' : 'text-bg-dark/70 hover:bg-purple/30'
            }`}
          >
            Split
          </button>
        </div>
      )}
    </div>
  )
}
