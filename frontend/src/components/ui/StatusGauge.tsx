import type { CSSProperties } from 'react'

type Props = {
  label: string
  description: string
  value: number
  accent: string
}

export function StatusGauge({ label, description, value, accent }: Props) {
  const pct = Math.max(0, Math.min(100, value))
  const fillStyle: CSSProperties = { width: `${pct}%`, background: accent }

  return (
    <div className="status-gauge">
      <div className="status-gauge__header">
        <p className="status-gauge__label">{label}</p>
        <span className="status-gauge__value">{pct}%</span>
      </div>
      <p className="status-gauge__description">{description}</p>
      <div className="status-gauge__bar">
        <div className="status-gauge__fill" style={fillStyle} />
      </div>
    </div>
  )
}
