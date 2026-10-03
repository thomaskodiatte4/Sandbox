export type Priority = 'low' | 'med' | 'high'

export interface Todo {
  id: string
  title: string
  /** ISO date (YYYY-MM-DD), optional */
  due?: string
  priority: Priority
  done: boolean
  createdAt: number
}
