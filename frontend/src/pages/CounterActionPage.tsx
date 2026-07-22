import { Card } from '../components/ui/Card'
import type { ReasonOption } from '../types'

type Props = {
  reason: ReasonOption
  reasonMemo: string
  onCounterComplete: (_durationSeconds: number) => void
  onSkipCounter: () => void
}

export function CounterActionPage({
  reason,
  reasonMemo,
  onCounterComplete,
  onSkipCounter,
}: Props) {
  return (
    <section className="screen counter-screen">
      <Card>
        <p className="page-title">{reason.label} を攻略</p>
        <p className="page-subtitle">{reason.description}</p>
        <div className="counter-pill" style={{ borderColor: reason.accent }}>
          <span className="counter-pill__emoji">{reason.emoji}</span>
          <div>
            <p className="counter-pill__label">{reason.counterAdvice}</p>
            <p className="counter-pill__detail">{reason.durationSeconds}秒だけ集中</p>
          </div>
        </div>
        {reasonMemo && (
          <p className="counter-note">メモ：{reasonMemo}</p>
        )}
        <div className="page-actions">
          <button
            type="button"
            className="primary-button"
            onClick={() => onCounterComplete(reason.durationSeconds)}
          >
            反撃完了
          </button>
          <button type="button" className="secondary-button" onClick={onSkipCounter}>
            今日は控える
          </button>
        </div>
      </Card>
    </section>
  )
}
