export default function HomeHeader({ greeting = 'looking good, gorgeous ✨' }) {
  return (
    <header className="px-4 pt-2 pb-4">
      <p className="text-sm text-bg-dark/80">{greeting}</p>
    </header>
  )
}
