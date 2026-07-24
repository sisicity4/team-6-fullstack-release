import { petVariants } from '../assets/newpic/petVariants'
import { Card } from '../components/ui/Card'
import { StatusGauge } from '../components/ui/StatusGauge'
import type { PetStatus } from '../types'

type Props = {
  petStatus: PetStatus
  totalLogCount: number
  recentSuccessCount: number
  recordingStreak: number
  onStartRecord: () => void
}

const getGrowth = (totalLogCount: number) => {
  if (totalLogCount < 3) {
    return { image: petVariants.growth.baby, label: '幼体', message: '毎日の小さな記録で、少しずつ仲良くなろう。' }
  }
  if (totalLogCount < 10) {
    return { image: petVariants.growth.young, label: '成長中', message: '記録を重ねて、冒険に出られるようになってきた。' }
  }
  return { image: petVariants.growth.adult, label: '成体', message: '習慣を積み重ねた、頼れるパートナー。' }
}

export function CarePage({
  petStatus,
  totalLogCount,
  recentSuccessCount,
  recordingStreak,
  onStartRecord,
}: Props) {
  const growth = getGrowth(totalLogCount)
  const image = recentSuccessCount >= 3 ? petVariants.texture.stardustGlow : growth.image
  const imageLabel = recentSuccessCount >= 3 ? '星屑が輝くペット' : `${growth.label}のペット`

  return (
    <section className="screen care-screen">
      <Card className="care-hero">
        <div className="care-hero__copy">
          <p className="auth-eyebrow">Pet care</p>
          <h1 className="care-hero__title">星砂フェネック</h1>
          <p className="page-subtitle">{growth.message}</p>
          <p className="care-hero__detail">これまでの記録: {totalLogCount}日 / 直近7日の成功: {recentSuccessCount}日</p>
        </div>
        <img className="care-hero__image" src={image} alt={imageLabel} />
      </Card>

      <div className="care-status-row">
        <StatusGauge label="元気" description="成功すると回復" value={petStatus.energy} accent="#F48FB1" />
        <StatusGauge label="ご機嫌" description="記録で安定" value={petStatus.mood} accent="#A880FF" />
        <StatusGauge label="空腹" description="反撃後に落ち着く" value={petStatus.hunger} accent="#60D4B1" />
      </div>

      <Card className="care-next-action">
        <p className="page-title">明日の自分に、20秒の余白を残そう</p>
        <p className="page-subtitle">できなかった日も、理由を記録すればペットと次の一歩を考えられます。</p>
        <div className="care-streak" aria-label={`現在 ${recordingStreak}日連続で記録中`}>
          <span className="care-streak__count">{recordingStreak}</span>
          <span>日連続でペットに会えた</span>
        </div>
        <button type="button" className="primary-button" onClick={onStartRecord}>
          今日の20秒を選ぶ
        </button>
      </Card>
    </section>
  )
}
