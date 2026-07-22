import { Card } from './ui/Card'

type WeeklyRecord = {
  label: string
  success: boolean
}

type Props = {
  records: WeeklyRecord[]
  streak: number
}

export function WeeklyRecordCard({ records, streak }: Props) {
  return (
    <Card className="weekly-card">
      <div className="card-row">
        <p className="card-title">直近7日</p>
        <span className="card-meta">連続 {streak} 日</span>
      </div>
      <div className="weekly-records">
        {records.map((record) => (
          <div
            key={record.label}
            className={`weekly-records__item ${record.success ? 'weekly-records__item--success' : 'weekly-records__item--failure'}`}
          >
            <span>{record.label}</span>
            <span className="weekly-records__flag" aria-hidden="true">
              {record.success ? '○' : '×'}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
