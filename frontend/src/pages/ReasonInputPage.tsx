import { Card } from '../components/ui/Card'
import type { ReasonOption } from '../types'

type Props = {
  reasonOptions: ReasonOption[]
  selectedReasonId: string | null
  reasonMemo: string
  onSelectReason: (_reasonId: string) => void
  onMemoChange: (_value: string) => void
  onSubmit: () => void
  onGoBack: () => void
}

export function ReasonInputPage({
  reasonOptions,
  selectedReasonId,
  reasonMemo,
  onSelectReason,
  onMemoChange,
  onSubmit,
  onGoBack,
}: Props) {
  return (
    <section className="screen reason-screen">
      <Card>
        <p className="page-title">今日できなかった理由</p>
        <p className="page-subtitle">迷わず1つ選んで、必要ならメモ。</p>
        <div className="reason-grid">
          {reasonOptions.map((reason) => (
            <button
              key={reason.id}
              type="button"
              className={`reason-chip ${
                reason.id === selectedReasonId ? 'reason-chip--active' : ''
              }`}
              onClick={() => onSelectReason(reason.id)}
            >
              <span className="reason-chip__emoji">{reason.emoji}</span>
              <div>
                <p className="reason-chip__label">{reason.label}</p>
                <p className="reason-chip__description">{reason.description}</p>
              </div>
            </button>
          ))}
        </div>
        <textarea
          value={reasonMemo}
          className="reason-textarea"
          placeholder="任意メモ（例：今日の会議は延長した）"
          onChange={(event) => onMemoChange(event.target.value)}
        />
        <div className="page-actions">
          <button
            type="button"
            className="primary-button"
            onClick={onSubmit}
            disabled={!selectedReasonId}
          >
            反撃の準備へ
          </button>
          <button type="button" className="secondary-button" onClick={onGoBack}>
            ホームに戻る
          </button>
        </div>
      </Card>
    </section>
  )
}
