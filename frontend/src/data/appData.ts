import type { BottomNavItem, ReasonOption } from '../types'

export const reasonOptions: ReasonOption[] = [
  {
    id: 'time',
    label: '時間がない',
    description: '打ち合わせや残業で時間が削られてしまった',
    counterAdvice: '30秒のリズムストレッチ',
    durationSeconds: 30,
    emoji: '⏱',
    accent: '#F25C85',
  },
  {
    id: 'tired',
    label: '疲労感',
    description: '身体が重くて動く気になれなかった',
    counterAdvice: '深呼吸＋手首ほぐし30秒',
    durationSeconds: 30,
    emoji: '💤',
    accent: '#FFB347',
  },
  {
    id: 'mind',
    label: '気持ちが乗らない',
    description: 'モチベーションが湧かず集中できなかった',
    counterAdvice: 'ペットと一緒に1分のリズム運動',
    durationSeconds: 60,
    emoji: '🎮',
    accent: '#7C6FFF',
  },
  {
    id: 'energy',
    label: '体力が足りない',
    description: '眠気や空腹で踏ん張れなかった',
    counterAdvice: '深いスクワット20秒',
    durationSeconds: 20,
    emoji: '🏹',
    accent: '#3AC3FF',
  },
]

export const bottomNavItems: BottomNavItem[] = [
  { key: 'home', label: 'ホーム' },
  { key: 'exercise', label: '運動' },
  { key: 'shop', label: 'ショップ' },
  { key: 'takecare', label: 'お世話' },
  { key: 'reflection', label: '統計' },
]
