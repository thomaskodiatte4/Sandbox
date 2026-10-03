import type { Priority, Todo } from '../types'

const badge: Record<Priority, string> = {
  low: 'bg-emerald-100 text-emerald-800',
  med: 'bg-amber-100 text-amber-800',
  high: 'bg-rose-100 text-rose-800',
}
const label: Record<Priority, string> = { low: 'Low', med: 'Medium', high: 'High' }

function todayISO() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function formatDue(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface Props {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  const overdue = !!todo.due && !todo.done && todo.due < todayISO()

  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.title}" as ${todo.done ? 'not done' : 'done'}`}
        className="h-5 w-5 cursor-pointer accent-indigo-600"
      />
      <div className="min-w-0 flex-1">
        <p className={`truncate ${todo.done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
          {todo.title}
        </p>
        {todo.due && (
          <p className={`text-xs ${overdue ? 'font-medium text-rose-600' : 'text-slate-500'}`}>
            {overdue ? 'Overdue · ' : 'Due '}
            {formatDue(todo.due)}
          </p>
        )}
      </div>
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge[todo.priority]}`}>
        {label[todo.priority]}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.title}"`}
        className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
      >
        ✕
      </button>
    </li>
  )
}
