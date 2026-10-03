import { useEffect, useState } from 'react'

const INHALE_MS = 4000
const EXHALE_MS = 6000
const CYCLE_MS = INHALE_MS + EXHALE_MS
const TOTAL_MS = 2 * 60 * 1000

type Phase = 'in' | 'out'

function formatTime(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function Meditation({ onExit }: { onExit: () => void }) {
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
      if (e >= TOTAL_MS) clearInterval(id)
    }, 200)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onExit()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onExit])

  const finished = elapsed >= TOTAL_MS
  const phase: Phase = elapsed % CYCLE_MS < INHALE_MS ? 'in' : 'out'
  const expanded = started && !finished && phase === 'in'

  return (
    <div
      role="dialog"
      aria-label="Meditation"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100"
    >
      <button
        onClick={onExit}
        className="absolute top-5 right-5 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
      >
        Exit (Esc)
      </button>

      <div className="relative flex h-[min(80vmin,32rem)] w-[min(80vmin,32rem)] items-center justify-center">
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-300 to-indigo-500 shadow-[0_0_80px_rgba(129,140,248,0.5)] ease-in-out"
          style={{
            transform: `scale(${expanded ? 1 : 0.35})`,
            transitionProperty: 'transform',
            transitionDuration: `${phase === 'in' ? INHALE_MS : EXHALE_MS}ms`,
          }}
        />
        <p
          aria-live="polite"
          className="relative text-2xl font-light tracking-widest text-white drop-shadow"
        >
          {finished ? 'Well done' : phase === 'in' ? 'Breathe in' : 'Breathe out'}
        </p>
      </div>

      <p className="absolute bottom-8 text-sm tabular-nums text-slate-400">
        {finished ? (
          <button onClick={onExit} className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
            Back to todos
          </button>
        ) : (
          formatTime(TOTAL_MS - elapsed)
        )}
      </p>
    </div>
  )
}
