import { Link } from 'react-router-dom'
import leftEar from '../assets/Lear-small.svg'
import rightEar from '../assets/Rear-small.svg'
import face from '../assets/face-small.svg'

function EarCard() {
  return (
    <Link
      to="/design"
      className="flex aspect-[52/83] w-24 shrink-0 items-center justify-center gap-0.5 rounded-xl border border-purple/50 bg-purple-light p-2 transition hover:border-purple hover:bg-purple-light"
      aria-label="Left and right ear"
    >
      <img src={leftEar} alt="" className="h-full w-auto object-contain" />
      <img src={rightEar} alt="" className="h-full w-auto object-contain" />
    </Link>
  )
}

function FaceCard() {
  return (
    <Link
      to="/design?view=face"
      className="flex aspect-[83/80] w-24 shrink-0 items-center justify-center rounded-xl border border-purple/50 bg-purple-light p-2 transition hover:border-purple hover:bg-purple-light"
      aria-label="Face"
    >
      <img src={face} alt="" className="h-full w-auto object-contain" />
    </Link>
  )
}

export default function BodyPartSelector() {
  return (
    <section className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
      <EarCard />
      <FaceCard />
    </section>
  )
}
