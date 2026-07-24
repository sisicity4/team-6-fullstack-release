import { useState } from 'react'
import { Card } from '../components/ui/Card'

type Props = {
  isSubmitting: boolean
  error: string | null
  onSubmit: (_mode: 'login' | 'register', _username: string, _password: string) => void
}

export function AuthPage({ isSubmitting, error, onSubmit }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(mode, username.trim(), password)
  }

  return (
    <section className="screen auth-screen">
      <Card>
        <p className="auth-eyebrow">PetFit / 忙しい日の運動リカバリー</p>
        <h1 className="auth-title">できなかった日を、0点で終わらせない。</h1>
        <p className="page-subtitle">理由を選んで20秒だけ反撃。ペットと一緒に、明日の自分を助けよう。</p>
        <div className="auth-tabs" role="tablist" aria-label="認証方法">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            aria-controls="auth-form-panel"
            className={mode === 'login' ? 'auth-tab auth-tab--active' : 'auth-tab'}
            onClick={() => setMode('login')}
          >
            ログイン
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            aria-controls="auth-form-panel"
            className={mode === 'register' ? 'auth-tab auth-tab--active' : 'auth-tab'}
            onClick={() => setMode('register')}
          >
            新規登録
          </button>
        </div>
        <form id="auth-form-panel" className="auth-form" role="tabpanel" onSubmit={submit}>
          <label>
            ユーザー名
            <input
              value={username}
              autoComplete="username"
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
          <label>
            パスワード
            <input
              type="password"
              value={password}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {mode === 'register' && (
            <p className="auth-help">8文字以上で、他人に推測されにくいパスワードを設定してください。</p>
          )}
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? '処理中…' : mode === 'login' ? 'ログインする' : 'アカウントを作成する'}
          </button>
        </form>
      </Card>
    </section>
  )
}
