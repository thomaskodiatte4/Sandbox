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
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Todos</h1>
            <p className="text-sm text-slate-500">
              {todos.length === 0 ? 'Nothing yet' : `${remaining} of ${todos.length} remaining`}
            </p>
            <p className="text-xs text-slate-400" data-testid="completed-today">
              {completedToday} completed today
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div role="group" aria-label="Meditation length" className="flex overflow-hidden rounded-lg border border-slate-200 bg-white text-sm">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setMinutes(d)}
                  aria-pressed={minutes === d}
                  className={`px-2.5 py-2 ${minutes === d ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {d} min
                </button>
              ))}
            </div>
            <button
              onClick={() => setMeditating(true)}
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              🧘 Meditate
            </button>
          </div>
        </header>

        <TodoForm onAdd={add} />

        {todos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
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
