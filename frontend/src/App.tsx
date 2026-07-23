import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  ApiError,
  apiRequest,
  clearAuthSession,
  loadAuthSession,
  login,
  refreshAccessToken,
  registerAccount,
  saveAuthSession,
  type AuthSession,
  type ReflectionResponse,
} from './api/client'
import { BottomNav } from './components/BottomNav'
import { Card } from './components/ui/Card'
import { bottomNavItems, reasonOptions } from './data/appData'
import { AuthPage } from './pages/AuthPage'
import { CounterActionPage } from './pages/CounterActionPage'
import { HomePage } from './pages/HomePage'
import { ReasonInputPage } from './pages/ReasonInputPage'
import { ReflectionPage } from './pages/ReflectionPage'
import type { DailyLog, Screen, WeeklyReasonSummary } from './types'

const getTodayKey = () =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date())
const clamp = (value: number) => Math.max(0, Math.min(100, value))
const getRecentLogs = (logs: DailyLog[], limit: number) =>
  [...logs].sort((a, b) => a.date.localeCompare(b.date)).slice(-limit)

const toDailyLog = (reflection: ReflectionResponse): DailyLog => ({
  date: reflection.log_date,
  succeeded: reflection.success,
  reasonId: reflection.reason_id || undefined,
  counterDurationSeconds: reflection.counter_duration_seconds ?? undefined,
  note: reflection.notes || undefined,
})

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : '通信に失敗しました。時間をおいて再試行してください。'

async function authenticatedRequest<T>(
  session: AuthSession,
  path: string,
  options: RequestInit,
  onSessionRefresh: (_session: AuthSession) => void,
): Promise<T> {
  try {
    return await apiRequest<T>(path, { ...options, token: session.access })
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error

    const { access } = await refreshAccessToken(session.refresh)
    const refreshedSession = { ...session, access }
    saveAuthSession(refreshedSession)
    onSessionRefresh(refreshedSession)
    return apiRequest<T>(path, { ...options, token: access })
  }
}

export function App() {
  const [session, setSession] = useState<AuthSession | null>(() => loadAuthSession())
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([])
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedReasonId, setSelectedReasonId] = useState<string | null>(null)
  const [reasonMemo, setReasonMemo] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)
  const [isSavingLog, setIsSavingLog] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      setDailyLogs([])
      return
    }

    let cancelled = false
    setIsLoadingLogs(true)
    setError(null)
    void authenticatedRequest<ReflectionResponse[]>(session, 'reflections/', {}, setSession)
      .then((reflections) => {
        if (!cancelled) setDailyLogs(reflections.map(toDailyLog))
      })
      .catch((requestError) => {
        if (!cancelled) setError(getErrorMessage(requestError))
      })
      .finally(() => {
        if (!cancelled) setIsLoadingLogs(false)
      })

    return () => {
      cancelled = true
    }
  }, [session])

  const todayKey = getTodayKey()
  const todaysLog = dailyLogs.find((entry) => entry.date === todayKey)
  const recentSevenLogs = useMemo(() => getRecentLogs(dailyLogs, 7), [dailyLogs])
  const recentThirtyLogs = useMemo(() => getRecentLogs(dailyLogs, 30), [dailyLogs])

  const weeklyReasonSummary = useMemo<WeeklyReasonSummary[]>(() => {
    return reasonOptions.map((reason) => {
      const occurrences7 = recentSevenLogs.filter((log) => log.reasonId === reason.id).length
      const occurrences30 = recentThirtyLogs.filter((log) => log.reasonId === reason.id).length
      const lastLog = [...dailyLogs].reverse().find((log) => log.reasonId === reason.id)
      return {
        id: reason.id,
        label: reason.label,
        occurrences7,
        occurrences30,
        lastCounterSeconds: lastLog?.counterDurationSeconds ?? null,
      }
    })
  }, [dailyLogs, recentSevenLogs, recentThirtyLogs])

  const counterLogs = dailyLogs.filter((log) => log.reasonId)
  const counterCompletionRate = counterLogs.length
    ? counterLogs.filter((log) => (log.counterDurationSeconds ?? 0) > 0).length / counterLogs.length
    : 0

  const recentEnemyReason = useMemo(() => {
    const countMap: Record<string, number> = {}
    recentSevenLogs.forEach((log) => {
      if (!log.reasonId) return
      countMap[log.reasonId] = (countMap[log.reasonId] ?? 0) + 1
    })
    const winner = Object.entries(countMap).sort((a, b) => b[1] - a[1])[0]
    if (!winner) return null
    return reasonOptions.find((reason) => reason.id === winner[0])?.label ?? null
  }, [recentSevenLogs])

  const petStatus = useMemo(() => {
    const successCount = recentSevenLogs.filter((log) => log.succeeded).length
    const failureCount = recentSevenLogs.filter((log) => !log.succeeded).length
    return {
      energy: clamp(70 + successCount * 3 - failureCount * 4),
      mood: clamp(66 + successCount * 2 - failureCount * 2),
      hunger: clamp(64 + successCount - failureCount * 3),
    }
  }, [recentSevenLogs])

  const todayCounterStatus = useMemo(() => {
    if (!todaysLog) return 'まだ記録なし'
    if (todaysLog.succeeded) return '反撃済み → 同期済み'
    if ((todaysLog.counterDurationSeconds ?? 0) > 0) return '反撃完了 → 同期済み'
    return 'パス済み → 同期済み'
  }, [todaysLog])

  const lastCounterLog = useMemo(() => {
    const log = [...dailyLogs].sort((a, b) => b.date.localeCompare(a.date)).find((entry) => entry.reasonId)
    if (!log?.reasonId) return null
    const reason = reasonOptions.find((option) => option.id === log.reasonId)
    if (!reason) return null
    return { label: reason.label, duration: log.counterDurationSeconds ?? 0, note: log.note }
  }, [dailyLogs])

  const persistDailyLog = async (log: DailyLog) => {
    if (!session || isSavingLog) return
    const reason = reasonOptions.find((option) => option.id === log.reasonId)
    setIsSavingLog(true)
    setError(null)

    try {
      const reflection = await authenticatedRequest<ReflectionResponse>(
        session,
        'reflections/',
        {
          method: 'POST',
          body: JSON.stringify({
            log_date: log.date,
            action: log.succeeded ? '運動を実行' : reason?.counterAdvice ?? '反撃を記録',
            mood: log.succeeded ? 75 : 50,
            notes: log.note ?? '',
            emotion_tags: log.reasonId ? [log.reasonId] : [],
            next_step: reason?.counterAdvice ?? '',
            success: log.succeeded,
            reason_id: log.reasonId ?? '',
            counter_duration_seconds: log.counterDurationSeconds ?? null,
          }),
        },
        setSession,
      )
      const syncedLog = toDailyLog(reflection)
      setDailyLogs((previous) => [
        ...previous.filter((entry) => entry.date !== syncedLog.date),
        syncedLog,
      ])
      setSelectedReasonId(null)
      setReasonMemo('')
      setScreen('reflection')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSavingLog(false)
    }
  }

  const handleAuth = async (mode: 'login' | 'register', username: string, password: string) => {
    setIsAuthenticating(true)
    setError(null)
    try {
      if (mode === 'register') await registerAccount(username, password)
      const tokens = await login(username, password)
      const nextSession = { username, ...tokens }
      saveAuthSession(nextSession)
      setSession(nextSession)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleLogout = () => {
    clearAuthSession()
    setSession(null)
    setScreen('home')
    setSelectedReasonId(null)
    setReasonMemo('')
    setError(null)
  }

  const handleYesTap = () => {
    void persistDailyLog({ date: todayKey, succeeded: true })
  }

  const handleNoTap = () => {
    setScreen('reasonInput')
  }

  const handleReasonSubmit = () => {
    if (selectedReasonId) setScreen('counterAction')
  }

  const handleCounterComplete = (seconds: number) => {
    if (!selectedReasonId) return
    void persistDailyLog({
      date: todayKey,
      succeeded: false,
      reasonId: selectedReasonId,
      counterDurationSeconds: seconds,
      note: reasonMemo || undefined,
    })
  }

  const handleCounterSkip = () => {
    if (!selectedReasonId) return
    void persistDailyLog({
      date: todayKey,
      succeeded: false,
      reasonId: selectedReasonId,
      counterDurationSeconds: 0,
      note: reasonMemo || undefined,
    })
  }

  if (!session) {
    return (
      <main className="app-shell">
        <AuthPage
          isSubmitting={isAuthenticating}
          error={error}
          onSubmit={(mode, username, password) => void handleAuth(mode, username, password)}
        />
      </main>
    )
  }

  const navActiveKey: Screen = screen === 'reasonInput' || screen === 'counterAction' ? 'home' : screen
  const currentReasonOption = reasonOptions.find((reason) => reason.id === selectedReasonId)

  const renderScreen = () => {
    if (screen === 'home') {
      return (
        <HomePage
          petStatus={petStatus}
          recentEnemyReason={recentEnemyReason}
          todayCounterStatus={todayCounterStatus}
          onTapYes={handleYesTap}
          onTapNo={handleNoTap}
          onViewReflection={() => setScreen('reflection')}
        />
      )
    }
    if (screen === 'reasonInput') {
      return (
        <ReasonInputPage
          reasonOptions={reasonOptions}
          selectedReasonId={selectedReasonId}
          reasonMemo={reasonMemo}
          onSelectReason={setSelectedReasonId}
          onMemoChange={setReasonMemo}
          onSubmit={handleReasonSubmit}
          onGoBack={() => setScreen('home')}
        />
      )
    }
    if (screen === 'counterAction') {
      if (!currentReasonOption) {
        return <section className="screen"><Card><p>理由を選んでから反撃してください。</p></Card></section>
      }
      return (
        <CounterActionPage
          reason={currentReasonOption}
          reasonMemo={reasonMemo}
          onCounterComplete={handleCounterComplete}
          onSkipCounter={handleCounterSkip}
        />
      )
    }
    if (screen === 'reflection') {
      return (
        <ReflectionPage
          weeklySummary={weeklyReasonSummary}
          recentEnemyReason={recentEnemyReason}
          counterCompletionRate={counterCompletionRate}
          lastCounter={lastCounterLog ?? undefined}
          onReturnHome={() => setScreen('home')}
        />
      )
    }
    return <section className="screen placeholder-screen"><Card><p>COMING SOON: {screen}</p></Card></section>
  }

  return (
    <main className="app-shell">
      <header className="auth-bar">
        <span>{session.username} としてログイン中</span>
        <button type="button" className="link-button" onClick={handleLogout}>ログアウト</button>
      </header>
      {isLoadingLogs && <p className="sync-status">記録を読み込んでいます…</p>}
      {isSavingLog && <p className="sync-status">記録を保存しています…</p>}
      {error && <p className="sync-error" role="alert">{error}</p>}
      {renderScreen()}
      <BottomNav items={bottomNavItems} activeKey={navActiveKey} onNavigate={setScreen} />
    </main>
  )
}

export default App
