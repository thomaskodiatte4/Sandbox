import { useState } from 'react'
import { Meditation } from './components/Meditation'
import { TodoForm } from './components/TodoForm'
import { TodoItem } from './components/TodoItem'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Priority, Todo } from './types'

export default function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', [])
  const [meditating, setMeditating] = useState(false)

  function add(title: string, due: string | undefined, priority: Priority) {
    setTodos((t) => [
      { id: crypto.randomUUID(), title, due, priority, done: false, createdAt: Date.now() },
      ...t,
    ])
  }
  const toggle = (id: string) =>
    setTodos((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))
  const remove = (id: string) => setTodos((t) => t.filter((x) => x.id !== id))

  if (meditating) return <Meditation onExit={() => setMeditating(false)} />

  const remaining = todos.filter((t) => !t.done).length

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <header className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Todos</h1>
            <p className="text-sm text-slate-500">
              {todos.length === 0 ? 'Nothing yet' : `${remaining} of ${todos.length} remaining`}
            </p>
          </div>
          <button
            onClick={() => setMeditating(true)}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
          >
            🧘 Meditation mode
          </button>
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
