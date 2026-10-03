import { useState, type FormEvent } from 'react'
import type { Priority } from '../types'

interface Props {
  onAdd: (title: string, due: string | undefined, priority: Priority) => void
}

export function TodoForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')
  const [priority, setPriority] = useState<Priority>('med')

  function submit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd(trimmed, due || undefined, priority)
    setTitle('')
    setDue('')
    setPriority('med')
  }

  const field =
    'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        aria-label="Todo title"
        className={`${field} flex-1`}
      />
      <input
        type="date"
        value={due}
        onChange={(e) => setDue(e.target.value)}
        aria-label="Due date"
        className={field}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        aria-label="Priority"
        className={field}
      >
        <option value="low">Low</option>
        <option value="med">Medium</option>
        <option value="high">High</option>
      </select>
      <button
        type="submit"
        disabled={!title.trim()}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Add
      </button>
    </form>
  )
}
