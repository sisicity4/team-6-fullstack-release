import { useState } from 'react'
import { petVariants } from '../assets/newpic/petVariants'
import { Card } from '../components/ui/Card'
import { emotionTagOptions } from '../data/appData'
import type {
  AuthProfile,
  ReflectionEntry,
  ReflectionMode,
} from '../types'

type Props = {
  latestReflection: ReflectionEntry | null
  profile: AuthProfile | null
  onStartReflection: (_mode: ReflectionMode) => void
  showReflectionForm: boolean
  reflectionMode: ReflectionMode | null
  reflectionForm: {
    action: string
    notes: string
    next_step: string
    success: boolean
    emotion_tags: string[]
  }
  submitMessage: string | null
  onReflectionChange: (_data: Partial<Props['reflectionForm']>) => void
  onSubmitReflection: () => void
  sparkleTrigger?: number
}

const positiveReasons = ['時間を守れた', '仲間と連携できた', '集中できた', '少し前向きになれた']
const negativeReasons = [
  '時間が足りなかった',
  '疲れていた',
  '気持ちが乗らなかった',
  '予定を忘れていた',
]

const enemyCatalog: Record<
  string,
  { name: string; icon: string; counterAction: string; hp: number; flavor: string }
> = {
  '時間が足りなかった': {
    name: 'タイムスティーラー',
    icon: '⏳',
    counterAction: '明日は10分だけ先に着手する',
    hp: 72,
    flavor: '隙を見て時間を奪う敵',
  },
  '疲れていた': {
    name: 'スリープクラウド',
    icon: '😴',
    counterAction: '今日は早めに休む宣言をする',
    hp: 64,
    flavor: '気力を吸い取る敵',
  },
  '気持ちが乗らなかった': {
    name: 'モチベショック',
    icon: '⚡️',
    counterAction: '最初の5分だけ動いてみる',
    hp: 68,
    flavor: 'やる気を奪う敵',
  },
  '予定を忘れていた': {
    name: 'ミスリマインド',
    icon: '🔔',
    counterAction: '明日の予定を先にメモする',
    hp: 70,
    flavor: '記憶をすり抜ける敵',
  },
}

type ReasonPickerProps = {
  reasons: string[]
  helper: string
  selected: string | null
  onSelect: (_reason: string) => void
}

function ReasonPicker({ reasons, helper, selected, onSelect }: ReasonPickerProps) {
  return (
    <>
      <div className="reason-list">
        {reasons.map((reason) => (
          <button
            key={reason}
            type="button"
            className={`reason-chip ${selected === reason ? 'reason-chip--active' : ''}`}
            onClick={() => onSelect(reason)}
          >
            {reason}
          </button>
        ))}
      </div>
      <p className="section-helper">{helper}</p>
    </>
  )
}

const getPetPresentation = (
  latestReflection: ReflectionEntry | null,
  emotionalTone: string | undefined,
  sparkleTrigger: number | undefined,
) => {
  if (sparkleTrigger || latestReflection?.success) {
    return { image: petVariants.expression.happy, label: '喜んでいるペット' }
  }

  const feelsTired =
    emotionalTone?.includes('疲') ||
    latestReflection?.emotion_tags.some((tag) => tag.includes('疲'))
  if (feelsTired) {
    return { image: petVariants.expression.sleepy, label: '眠そうなペット' }
  }

  if (latestReflection) {
    return { image: petVariants.expression.encouraging, label: '応援するペット' }
  }

  return { image: petVariants.default, label: 'ペット' }
}

export function HomePage({
  latestReflection,
  profile,
  onStartReflection,
  showReflectionForm,
  reflectionForm,
  submitMessage,
  onReflectionChange,
  onSubmitReflection,
  reflectionMode,
  sparkleTrigger,
}: Props) {
  const emotionTags = new Set(reflectionForm.emotion_tags)
  const [selectedPositiveReason, setSelectedPositiveReason] = useState<string | null>(null)
  const [selectedNegativeReason, setSelectedNegativeReason] = useState<string | null>(null)
  const currentEnemy = selectedNegativeReason ? enemyCatalog[selectedNegativeReason] : null
  const toggleTag = (tag: string) => {
    const next = new Set(emotionTags)
    if (next.has(tag)) {
      next.delete(tag)
    } else {
      next.add(tag)
    }
    onReflectionChange({ emotion_tags: Array.from(next) })
  }

  const handleStartReflection = (mode: ReflectionMode) => {
    setSelectedPositiveReason(null)
    setSelectedNegativeReason(null)
    onStartReflection(mode)
  }

  const handleSelectPositive = (reason: string) => {
    setSelectedPositiveReason(reason)
    onReflectionChange({ action: reason, success: true })
  }

  const handleSelectNegative = (reason: string) => {
    setSelectedNegativeReason(reason)
    const enemy = enemyCatalog[reason]
    onReflectionChange({
      action: reason,
      next_step: enemy?.counterAction ?? '',
      success: false,
    })
  }
  const pet = getPetPresentation(
    latestReflection,
    profile?.emotional_tone,
    sparkleTrigger,
  )
  return (
    <section className="screen home-screen">
      <div
        key={sparkleTrigger ?? 0}
        className={`sparkle-layer ${sparkleTrigger ? 'sparkle-layer--visible' : ''}`}
      />
      <Card className="home-hero panel-card">
        <div className="home-hero__badge">
          <img src={pet.image} alt={pet.label} />
        </div>
        <div className="home-hero__text">
          <p className="home-hero__eyebrow">振り返り</p>
          <h2>今日はどんな日だった？</h2>
          <p className="home-hero__body">
            {profile?.emotional_tone
              ? `今の気持ち: ${profile.emotional_tone}`
              : '今の気持ちを言葉にしてみよう。'}
          </p>
        </div>
      </Card>

      <Card className="panel-card summary-card">
        <p className="section-title">今日の失敗（敵）</p>
        <p className="summary-text">
          {latestReflection?.action || 'まだ記録がありません'}
        </p>
        <p className="summary-subtext">
          {latestReflection?.notes || '小さな一言で大丈夫。'}
        </p>
        <div className="home-actions">
          <button className="primary-button" onClick={() => handleStartReflection('positive')}>
            Yes（ポジティブ）
          </button>
          <button className="secondary-button" onClick={() => handleStartReflection('negative')}>
            No（ネガティブ）
          </button>
        </div>
        {submitMessage && (
          <p className="home-submit-message">{submitMessage}</p>
        )}
      </Card>

      {showReflectionForm && reflectionMode === 'positive' && (
        <Card className="panel-card reason-card">
          <p className="section-title">できた理由をひとつ選ぶ</p>
          <ReasonPicker
            reasons={positiveReasons}
            selected={selectedPositiveReason}
            onSelect={handleSelectPositive}
            helper="選んだ理由が振り返りのテーマになります。"
          />
        </Card>
      )}

      {showReflectionForm && reflectionMode === 'negative' && (
        <Card className="panel-card reason-card">
          <p className="section-title">できなかった理由</p>
          <ReasonPicker
            key="negative"
            reasons={negativeReasons}
            selected={selectedNegativeReason}
            onSelect={handleSelectNegative}
            helper="選んだ理由をメモに書きましょう。"
          />
        </Card>
      )}

      {showReflectionForm && reflectionMode === 'negative' && currentEnemy && (
        <Card className="panel-card enemy-card">
          <div className="enemy-card__head">
            <div className="enemy-card__icon">{currentEnemy.icon}</div>
            <div>
              <p className="section-title">敵化: {currentEnemy.name}</p>
              <p className="summary-subtext">{currentEnemy.flavor}</p>
            </div>
          </div>
          <div className="enemy-hp">
            <div className="enemy-hp__label">反撃完了まで</div>
            <div className="enemy-hp__bar">
              <div
                className="enemy-hp__fill"
                style={{ width: `${currentEnemy.hp}%` }}
              />
            </div>
            <div className="enemy-hp__value">{currentEnemy.hp}%</div>
          </div>
          <div className="enemy-counter">
            <p className="section-title">次に打ち勝つべきアクション</p>
            <p className="summary-text">{currentEnemy.counterAction}</p>
          </div>
        </Card>
      )}

      {showReflectionForm && (
        <Card className="panel-card reflection-form-card">
          <p className="section-title">振り返りメモ</p>
          <div className="reflection-form">
            <label>
              何が起こった？
              <input
                type="text"
                value={reflectionForm.action}
                onChange={(event) => onReflectionChange({ action: event.target.value })}
                placeholder="例: 締め切りに間に合わなかった"
              />
            </label>
            <label>
              どう感じた？
              <textarea
                value={reflectionForm.notes}
                onChange={(event) => onReflectionChange({ notes: event.target.value })}
                placeholder="例: 焦ったけど、少し安心した"
              />
            </label>
            <label>
              次の一歩
              <input
                type="text"
                value={reflectionForm.next_step}
                onChange={(event) => onReflectionChange({ next_step: event.target.value })}
                placeholder="例: 早めに相談する"
              />
            </label>
            <div className="tag-row">
              {emotionTagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-chip ${emotionTags.has(tag) ? 'tag-chip--active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={reflectionForm.success}
                onChange={(event) => onReflectionChange({ success: event.target.checked })}
              />
              <span>今日は少し前に進めた</span>
            </label>
            <button type="button" className="primary-button" onClick={onSubmitReflection}>
              送信する
            </button>
          </div>
        </Card>
      )}
    </section>
  )
}
