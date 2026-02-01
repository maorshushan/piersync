const dotColors = {
  owned: 'bg-purple',
  wishlist: 'bg-yellow'
}

export default function WishlistItem({ name, status, checked, onToggle }) {
  const dotClass = dotColors[status] ?? dotColors.wishlist
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-3 rounded-xl border border-purple/40 bg-purple-light/80 px-4 py-3 text-left transition hover:bg-purple-light"
    >
      <span className={`h-3 w-3 shrink-0 rounded-full ${dotClass}`} aria-hidden />
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-bg-dark">
        {name || 'Unnamed'}
      </span>
      <span className="shrink-0 text-bg-dark/50" aria-hidden>
        {checked ? '☑' : '☐'}
      </span>
    </button>
  )
}
