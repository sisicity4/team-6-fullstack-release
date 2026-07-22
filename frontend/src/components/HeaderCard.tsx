import { Card } from './ui/Card'

type Props = {
  title: string
  subtitle: string
  tagline?: string
}

export function HeaderCard({ title, subtitle, tagline = '統計' }: Props) {
  return (
    <Card className="header-card">
      <p className="header-card__tagline">{tagline}</p>
      <h1 className="header-card__title">{title}</h1>
      <p className="header-card__subtitle">{subtitle}</p>
    </Card>
  )
}
