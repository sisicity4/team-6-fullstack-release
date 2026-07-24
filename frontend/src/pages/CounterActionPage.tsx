import { useEffect, useState } from 'react'
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
  const [remainingSeconds, setRemainingSeconds] = useState(reason.durationSeconds)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning || remainingSeconds === 0) return
    const timer = window.setTimeout(() => {
      setRemainingSeconds((previous) => Math.max(previous - 1, 0))
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [isRunning, remainingSeconds])

  const timerLabel = `残り ${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(remainingSeconds % 60).padStart(2, '0')}`
  const primaryLabel = remainingSeconds === 0
    ? '反撃を記録する'
    : isRunning
      ? '一時停止する'
      : '反撃をはじめる'

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
        <div className="counter-timer" aria-live="polite">
          <p className="counter-timer__label">ペットと一緒に、ここだけ集中</p>
          <p className="counter-timer__value" role="timer">{timerLabel}</p>
          <p className="counter-timer__message">
            {remainingSeconds === 0
              ? 'できた！ 小さな反撃が、明日の自分を助ける。'
              : isRunning
                ? '画面を見なくて大丈夫。呼吸を整えて続けよう。'
                : '始めるを押すと、短いタイマーが動き出す。'}
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              if (remainingSeconds === 0) onCounterComplete(reason.durationSeconds)
              else setIsRunning((previous) => !previous)
            }}
          >
            {primaryLabel}
          </button>
          <button type="button" className="secondary-button" onClick={onSkipCounter}>
            今日は控える
          </button>
        </div>
      </Card>
    </section>
  )
}
