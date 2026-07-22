import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { BottomNav } from './components/BottomNav'
import { Card } from './components/ui/Card'
import { reasonOptions, bottomNavItems } from './data/appData'
import { CounterActionPage } from './pages/CounterActionPage'
import { HomePage } from './pages/HomePage'
import { ReasonInputPage } from './pages/ReasonInputPage'
import { ReflectionPage } from './pages/ReflectionPage'
import type { DailyLog, Screen, WeeklyReasonSummary } from './types'

const STORAGE_KEY = 'petfit-daily-logs'
const getTodayKey = () => new Date().toISOString().slice(0, 10)
const clamp = (value: number) => Math.max(0, Math.min(100, value))
const getRecentLogs = (logs: DailyLog[], limit: number) =>
  [...logs].sort((a, b) => a.date.localeCompare(b.date)).slice(-limit)

const loadDailyLogs = (): DailyLog[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as DailyLog[]) : []
  } catch (error) {
    console.error(error)
    return []
  }
}

export function App() {
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => loadDailyLogs())
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedReasonId, setSelectedReasonId] = useState<string | null>(null)
  const [reasonMemo, setReasonMemo] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dailyLogs))
  }, [dailyLogs])

  const todayKey = getTodayKey()
  const todaysLog = dailyLogs.find((entry) => entry.date === todayKey)
  const recentSevenLogs = useMemo(() => getRecentLogs(dailyLogs, 7), [dailyLogs])
  const recentThirtyLogs = useMemo(() => getRecentLogs(dailyLogs, 30), [dailyLogs])

  const weeklyReasonSummary = useMemo<WeeklyReasonSummary[]>(() => {
    return reasonOptions.map((reason) => {
      const occurrences7 = recentSevenLogs.filter((log) => log.reasonId === reason.id).length
      const occurrences30 = recentThirtyLogs.filter((log) => log.reasonId === reason.id).length
      const lastLog = [...dailyLogs]
        .reverse()
        .find((log) => log.reasonId === reason.id)
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
    const option = reasonOptions.find((reason) => reason.id === winner[0])
    return option ? option.label : null
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
    if (todaysLog.succeeded) return '反撃済み → 自動的に更新'
    if ((todaysLog.counterDurationSeconds ?? 0) > 0) return '反撃完了'
    return 'パス済み'
  }, [todaysLog])

  const lastCounterLog = useMemo(() => {
    const log = [...dailyLogs]
      .sort((a, b) => b.date.localeCompare(a.date))
      .find((entry) => entry.reasonId)
    if (!log || !log.reasonId) return null
    const reason = reasonOptions.find((option) => option.id === log.reasonId)
    if (!reason) return null
    return {
      label: reason.label,
      duration: log.counterDurationSeconds ?? 0,
      note: log.note,
    }
  }, [dailyLogs])

  const upsertTodayLog = (log: DailyLog) => {
    setDailyLogs((prev) => [...prev.filter((entry) => entry.date !== log.date), log])
  }

  const handleYesTap = () => {
    upsertTodayLog({ date: todayKey, succeeded: true })
    setScreen('reflection')
  }

  const handleNoTap = () => {
    setScreen('reasonInput')
  }

  const handleReasonSubmit = () => {
    if (!selectedReasonId) return
    setScreen('counterAction')
  }

  const handleCounterComplete = (seconds: number) => {
    if (!selectedReasonId) {
      setScreen('home')
      return
    }
    upsertTodayLog({
      date: todayKey,
      succeeded: false,
      reasonId: selectedReasonId,
      counterDurationSeconds: seconds,
      note: reasonMemo || undefined,
    })
    setSelectedReasonId(null)
    setReasonMemo('')
    setScreen('reflection')
  }

  const handleCounterSkip = () => {
    if (!selectedReasonId) {
      setScreen('home')
      return
    }
    upsertTodayLog({
      date: todayKey,
      succeeded: false,
      reasonId: selectedReasonId,
      counterDurationSeconds: 0,
      note: reasonMemo || undefined,
    })
    setSelectedReasonId(null)
    setReasonMemo('')
    setScreen('reflection')
  }

  const navActiveKey: Screen =
    screen === 'reasonInput' || screen === 'counterAction' ? 'home' : screen

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
        return (
          <section className="screen">
            <Card>
              <p>理由を選んでから反撃してください。</p>
            </Card>
          </section>
        )
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
    return (
      <section className="screen placeholder-screen">
        <Card>
          <p>COMING SOON: {screen}</p>
        </Card>
      </section>
    )
  }

  return (
    <div className="app-shell">
      {renderScreen()}
      <div className="screen-indicator">現在 screen: {screen}</div>
      <BottomNav
        items={bottomNavItems}
        activeKey={navActiveKey}
        onNavigate={setScreen}
      />
    </div>
  )
}

export default App
