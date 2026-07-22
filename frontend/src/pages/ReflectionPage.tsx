import { Card } from '../components/ui/Card'
import { StatusGauge } from '../components/ui/StatusGauge'
import type { WeeklyReasonSummary } from '../types'

type Props = {
  weeklySummary: WeeklyReasonSummary[]
  recentEnemyReason: string | null
  counterCompletionRate: number
  lastCounter?: {
    label: string
    duration: number
    note?: string
  }
  onReturnHome: () => void
}

export function ReflectionPage({
  weeklySummary,
  recentEnemyReason,
  counterCompletionRate,
  lastCounter,
  onReturnHome,
}: Props) {
  return (
    <section className="screen reflection-screen">
      <Card>
        <p className="page-title">週次振り返り</p>
        <div className="reflection-row">
          <div>
            <p className="reflection-row__label">最近の敵</p>
            <p className="reflection-row__value">
              {recentEnemyReason ?? 'まだ敵も育っていない'}
            </p>
          </div>
          <StatusGauge
            label="反撃率"
            description="備えたら必ず挑戦"
            value={Math.round(counterCompletionRate * 100)}
            accent="#FF7EB6"
          />
        </div>
        <div className="reason-summary">
          {weeklySummary.map((summary) => (
            <div key={summary.id} className="reason-summary__card">
              <p className="reason-summary__label">{summary.label}</p>
              <p className="reason-summary__counts">
                直近7日: {summary.occurrences7}
              </p>
              <p className="reason-summary__counts">
                直近30日: {summary.occurrences30}
              </p>
              <p className="reason-summary__counts">
                最終反撃: {summary.lastCounterSeconds ?? 0}秒
              </p>
            </div>
          ))}
        </div>
        {lastCounter && (
          <div className="reflection-last-counter">
            <p className="reflection-last-counter__title">前回の反撃</p>
            <p>
              {lastCounter.label} {lastCounter.duration}秒
            </p>
            {lastCounter.note && <p className="reflection-last-counter__note">{lastCounter.note}</p>}
          </div>
        )}
        <button type="button" className="primary-button" onClick={onReturnHome}>
          ホームに戻る
        </button>
      </Card>
    </section>
  )
}
