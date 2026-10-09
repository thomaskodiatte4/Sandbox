import type { Priority, Todo } from '../types'

const badge: Record<Priority, string> = {
  low: 'border-neon-lime/40 bg-neon-lime/10 text-neon-lime',
  med: 'border-amber-300/40 bg-amber-300/10 text-amber-300',
  high: 'border-neon-pink/50 bg-neon-pink/10 text-neon-pink',
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
    <li className="glass flex items-center gap-3 rounded-xl px-4 py-3 transition hover:border-neon-cyan/40">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.title}" as ${todo.done ? 'not done' : 'done'}`}
        className="h-5 w-5 cursor-pointer accent-cyan-400"
      />
      <div className="min-w-0 flex-1">
        <p className={`truncate ${todo.done ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
          {todo.title}
        </p>
        {todo.due && (
          <p className={`text-xs ${overdue ? 'font-medium text-neon-pink' : 'text-slate-400'}`}>
            {overdue ? 'Overdue · ' : 'Due '}
            {formatDue(todo.due)}
          </p>
        )}
      </div>
      <span className={`rounded-full border px-2 py-0.5 font-display text-[10px] tracking-wider uppercase ${badge[todo.priority]}`}>
        {label[todo.priority]}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.title}"`}
        className="rounded p-1 text-slate-500 hover:bg-neon-pink/10 hover:text-neon-pink"
      >
        ✕
      </button>
    </li>
  )
}
