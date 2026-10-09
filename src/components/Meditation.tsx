import { useEffect, useState } from 'react'

const INHALE_MS = 4000
const EXHALE_MS = 6000
const CYCLE_MS = INHALE_MS + EXHALE_MS

type Phase = 'in' | 'out'

function formatTime(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

interface Props {
  minutes: number
  onExit: () => void
}

export function Meditation({ minutes, onExit }: Props) {
  const totalMs = minutes * 60 * 1000
  const [elapsed, setElapsed] = useState(0)
  // Mount contracted so the first inhale animates instead of starting expanded.
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setStarted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const start = performance.now()
    const id = setInterval(() => {
      const e = performance.now() - start
      setElapsed(e)
      if (e >= totalMs) clearInterval(id)
    }, 200)
    return () => clearInterval(id)
  }, [totalMs])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onExit()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onExit])

  const finished = elapsed >= totalMs
  const phase: Phase = elapsed % CYCLE_MS < INHALE_MS ? 'in' : 'out'
  const expanded = started && !finished && phase === 'in'

  return (
    <div
      role="dialog"
      aria-label="Meditation"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void text-slate-100"
    >
      <button
        onClick={onExit}
        className="glass absolute top-5 right-5 rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:text-neon-cyan"
      >
        Exit (Esc)
      </button>

      <div className="relative flex h-[min(80vmin,32rem)] w-[min(80vmin,32rem)] items-center justify-center">
        <div
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,#67e8f9,#818cf8_55%,#c084fc)] shadow-[0_0_100px_rgb(34_211_238/0.45),inset_0_0_60px_rgb(255_255_255/0.25)] ease-in-out"
          style={{
            transform: `scale(${expanded ? 1 : 0.35})`,
            transitionProperty: 'transform',
            transitionDuration: `${phase === 'in' ? INHALE_MS : EXHALE_MS}ms`,
          }}
        />
        <p
          aria-live="polite"
          className="relative font-display text-xl tracking-[0.3em] text-white uppercase drop-shadow-[0_0_12px_rgb(0_0_0/0.6)]"
        >
          {finished ? 'Well done' : phase === 'in' ? 'Breathe in' : 'Breathe out'}
        </p>
      </div>

      <p className="absolute bottom-8 font-display text-sm tracking-[0.3em] tabular-nums text-neon-cyan/70">
        {finished ? (
          <button onClick={onExit} className="rounded-lg neon-btn px-4 py-2">
            Back to todos
          </button>
        ) : (
          formatTime(totalMs - elapsed)
        )}
      </p>
    </div>
  )
}
