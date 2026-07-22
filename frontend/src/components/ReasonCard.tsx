import { Card } from './ui/Card'

type Reason = {
  title: string
  detail: string
}

type Props = {
  reasons: Reason[]
}

export function ReasonCard({ reasons }: Props) {
  return (
    <Card className="reason-card">
      <p className="card-title">できなかった理由</p>
      <ul className="reason-list">
        {reasons.map((reason, index) => (
          <li key={`${reason.title}-${index}`} className="reason-list__item">
            <p className="reason-list__title">{reason.title}</p>
            <p className="reason-list__detail">{reason.detail}</p>
          </li>
        ))}
      </ul>
    </Card>
  )
}
