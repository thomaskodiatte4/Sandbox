import { useState } from 'react'
import { Meditation } from './components/Meditation'
import { TodoForm } from './components/TodoForm'
import { TodoItem } from './components/TodoItem'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Priority, Todo } from './types'

const DURATIONS = [2, 5, 10] as const

function isToday(ts: number) {
  return new Date(ts).toDateString() === new Date().toDateString()
}

export default function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', [])
  const [storedMinutes, setMinutes] = useLocalStorage<number>('meditationMinutes', 2)
  const [meditating, setMeditating] = useState(false)

  // Guard against a stale or hand-edited value in localStorage.
  const minutes = DURATIONS.find((d) => d === storedMinutes) ?? DURATIONS[0]

  function add(title: string, due: string | undefined, priority: Priority) {
    setTodos((t) => [
      { id: crypto.randomUUID(), title, due, priority, done: false, createdAt: Date.now() },
      ...t,
    ])
  }
  const toggle = (id: string) =>
    setTodos((t) =>
      t.map((x) =>
        x.id === id
          ? { ...x, done: !x.done, completedAt: x.done ? undefined : Date.now() }
          : x,
      ),
    )
  const remove = (id: string) => setTodos((t) => t.filter((x) => x.id !== id))

  if (meditating) return <Meditation minutes={minutes} onExit={() => setMeditating(false)} />

  const remaining = todos.filter((t) => !t.done).length
  const completedToday = todos.filter((t) => t.done && t.completedAt && isToday(t.completedAt)).length

  return (
    <main className="app-bg min-h-screen px-4 py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="neon-text font-display text-3xl font-bold tracking-widest uppercase">Todos</h1>
            <p className="text-sm text-slate-400">
              {todos.length === 0 ? 'Nothing yet' : `${remaining} of ${todos.length} remaining`}
            </p>
            <p className="font-display text-[10px] tracking-[0.2em] text-neon-cyan/70 uppercase" data-testid="completed-today">
              {completedToday} completed today
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div role="group" aria-label="Meditation length" className="glass flex overflow-hidden rounded-lg text-sm">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setMinutes(d)}
                  aria-pressed={minutes === d}
                  className={`px-2.5 py-2 ${minutes === d ? 'bg-neon-cyan/20 text-neon-cyan shadow-[inset_0_0_12px_rgb(34_211_238/0.25)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                >
                  {d} min
                </button>
              ))}
            </div>
            <button
              onClick={() => setMeditating(true)}
              className="neon-btn rounded-lg px-3 py-2 text-sm"
            >
              🧘 Meditate
            </button>
          </div>
        </header>

        <TodoForm onAdd={add} />

        {todos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
            Add your first todo above.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {todos.map((t) => (
              <TodoItem key={t.id} todo={t} onToggle={toggle} onDelete={remove} />
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
