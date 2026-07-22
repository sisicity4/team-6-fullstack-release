import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: Props) {
  return <section className={`card ${className}`.trim()}>{children}</section>
}
