import { Card } from './ui/Card'
import { ProgressBar } from './ui/ProgressBar'

type Props = {
  rate: number
  successDays: number
  totalDays: number
}

export function AchievementCard({ rate, successDays, totalDays }: Props) {
  const normalized = Math.max(0, Math.min(100, rate))
  const display = Math.round(normalized)

  return (
    <Card className="achievement-card">
      <div className="achievement-card__top">
        <p className="achievement-card__label">達成率</p>
        <p className="achievement-card__value">{display}%</p>
      </div>
      <ProgressBar value={normalized} />
      <div className="achievement-card__detail">
        <span>達成：{successDays}日</span>
        <span>目標：{totalDays}日</span>
      </div>
    </Card>
  )
}
