import { petVariants } from '../assets/newpic/petVariants'
import { Card } from '../components/ui/Card'
import { StatusGauge } from '../components/ui/StatusGauge'
import type { PetStatus } from '../types'

type Props = {
  petStatus: PetStatus
  recentEnemyReason: string | null
  todayCounterStatus: string
  hasTodayLog: boolean
  todaySucceeded: boolean
  recordingStreak: number
  onTapYes: () => void
  onTapNo: () => void
  onViewReflection: () => void
}

export function HomePage({
  petStatus,
  recentEnemyReason,
  todayCounterStatus,
  hasTodayLog,
  todaySucceeded,
  recordingStreak,
  onTapYes,
  onTapNo,
  onViewReflection,
}: Props) {
  const pet = todaySucceeded
    ? { image: petVariants.expression.happy, label: '喜んでいるペット' }
    : hasTodayLog && petStatus.energy < 60
      ? { image: petVariants.expression.sleepy, label: '眠そうなペット' }
      : hasTodayLog
        ? { image: petVariants.expression.encouraging, label: '応援するペット' }
        : { image: petVariants.default, label: 'ペット' }

  return (
    <section className="screen home-screen">
      <Card className="home-hero">
        <div className="home-hero__badge">
          <img src={pet.image} alt={pet.label} />
        </div>
        <div className="home-hero__text">
          <p className="home-hero__eyebrow">忙しい日の運動リカバリー</p>
          <h2>できなかった日を、0点で終わらせない。</h2>
          <p className="home-hero__body">
            {todaySucceeded
              ? '今日の一歩、ちゃんとペットに届いているよ。'
              : hasTodayLog
                ? '記録できた時点で、もう明日の反撃を準備できている。'
                : '忙しい日も、20秒の反撃なら次の一歩に変えられる。'}
          </p>
          {recordingStreak > 0 && (
            <p className="home-hero__streak">ペットと {recordingStreak}日連続で記録中</p>
          )}
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
        <p className="home-status-actions__title">今日は、どちらの一歩にする？</p>
        <p className="home-status-actions__status">今日の反撃：{todayCounterStatus}</p>
        <div className="home-actions">
          <button className="primary-button" onClick={onTapYes}>
            Yes（運動を記録）
          </button>
          <button className="secondary-button" onClick={onTapNo}>
            No（20秒の反撃へ）
          </button>
        </div>
      </Card>

      <button className="home-reflection-cta" type="button" onClick={onViewReflection}>
        <span>
          <span className="home-reflection-cta__label">週次振り返り</span>
          <span className="home-reflection-cta__detail">直近7日を確認する</span>
        </span>
        <span className="home-reflection-cta__arrow" aria-hidden="true">→</span>
      </button>
    </section>
  )
}
