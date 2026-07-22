import type { CSSProperties } from 'react'

type Props = {
  value: number
}

export function ProgressBar({ value }: Props) {
  const normalized = Math.max(0, Math.min(100, value))
  const style: CSSProperties = { width: `${normalized}%` }

  return (
    <div className="progress-bar" role="img" aria-label={`達成率 ${normalized}%`}>
      <div className="progress-bar__fill" style={style} />
    </div>
  )
}
