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
    'rounded-lg border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/30'

  return (
    <form onSubmit={submit} className="glass flex flex-col gap-2 rounded-2xl p-3 sm:flex-row">
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
        className="neon-btn rounded-lg px-5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        Add
      </button>
    </form>
  )
}
