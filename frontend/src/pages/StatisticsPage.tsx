import { AchievementCard } from '../components/AchievementCard'
import { BottomNav } from '../components/BottomNav'
import { HeaderCard } from '../components/HeaderCard'
import { ReasonCard } from '../components/ReasonCard'
import { WeeklyRecordCard } from '../components/WeeklyRecordCard'
import type { BottomNavItem } from '../types'

const weeklyRecords = [
  { label: '月', success: true },
  { label: '火', success: true },
  { label: '水', success: false },
  { label: '木', success: true },
  { label: '金', success: false },
  { label: '土', success: true },
  { label: '日', success: true },
]

const reasons = [
  { title: '夕方に打ち合わせ', detail: 'ミーティングが伸びてトレーニングがずれた' },
  { title: '体調を優先', detail: '睡眠不足なので無理をせず休息をとった' },
]

const navItems: BottomNavItem[] = [
  { key: 'home', label: 'ホーム' },
  { key: 'reasonInput', label: '記録' },
  { key: 'takecare', label: 'お世話' },
  { key: 'reflection', label: '振り返り' },
]

export function StatisticsPage() {
  return (
    <main className="statistics-page">
      <HeaderCard
        title="あなたの頑張りを振り返ろう"
        subtitle="日々の成果をまとめて確認しながら、次の一歩を考えよう"
      />
      <AchievementCard rate={14} successDays={5} totalDays={30} />
      <WeeklyRecordCard records={weeklyRecords} streak={5} />
      <ReasonCard reasons={reasons} />
      <BottomNav items={navItems} activeKey="reflection" onNavigate={() => undefined} />
    </main>
  )
}
