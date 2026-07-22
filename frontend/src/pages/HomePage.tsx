import petSpark from '../assets/pet-spark.svg'
import { Card } from '../components/ui/Card'
import { StatusGauge } from '../components/ui/StatusGauge'
import type { PetStatus } from '../types'

type Props = {
  petStatus: PetStatus
  recentEnemyReason: string | null
  todayCounterStatus: string
  onTapYes: () => void
  onTapNo: () => void
  onViewReflection: () => void
}

export function HomePage({
  petStatus,
  recentEnemyReason,
  todayCounterStatus,
  onTapYes,
  onTapNo,
  onViewReflection,
}: Props) {
  return (
    <section className="screen home-screen">
      <Card className="home-hero">
        <div className="home-hero__badge">
          <img src={petSpark} alt="ペット" />
        </div>
        <div className="home-hero__text">
          <p className="home-hero__eyebrow">ペットの部屋</p>
          <h2>今日の自分とペットを覗いてみよう</h2>
          <p className="home-hero__body">失敗を“敵”と見立てて、次の反撃を準備しよう。</p>
        </div>
      </Card>

      <div className="home-status-row">
        <StatusGauge
          label="元気"
          description="最近の成功でアップ"
          value={petStatus.energy}
          accent="#F48FB1"
        />
        <StatusGauge
          label="ご機嫌"
          description="失敗の数に左右されがち"
          value={petStatus.mood}
          accent="#A880FF"
        />
        <StatusGauge
          label="空腹"
          description="反撃後は落ち着く"
          value={petStatus.hunger}
          accent="#60D4B1"
        />
      </div>

      <Card className="home-recent-enemy">
        <p className="home-recent-enemy__label">最近の敵</p>
        <p className="home-recent-enemy__value">
          {recentEnemyReason ?? 'まだ敵はいない'}
        </p>
        <p className="home-recent-enemy__subtitle">直近7日で最も出現した理由</p>
      </Card>

      <Card className="home-status-actions">
        <p className="home-status-actions__title">今日はできた？</p>
        <p className="home-status-actions__status">今日の反撃：{todayCounterStatus}</p>
        <div className="home-actions">
          <button className="primary-button" onClick={onTapYes}>
            Yes（反撃完了）
          </button>
          <button className="secondary-button" onClick={onTapNo}>
            No（理由を記録）
          </button>
        </div>
      </Card>

      <button className="link-button" type="button" onClick={onViewReflection}>
        週次振り返りへ
      </button>
    </section>
  )
}
