export type Screen =
  | 'home'
  | 'reasonInput'
  | 'counterAction'
  | 'reflection'
  | 'exercise'
  | 'shop'
  | 'takecare'

export type DailyLog = {
  date: string
  succeeded: boolean
  reasonId?: string
  counterDurationSeconds?: number
  note?: string
}

export type ReasonOption = {
  id: string
  label: string
  description: string
  counterAdvice: string
  durationSeconds: number
  emoji: string
  accent: string
}

export type PetStatus = {
  energy: number
  mood: number
  hunger: number
}

export type WeeklyReasonSummary = {
  id: string
  label: string
  occurrences7: number
  occurrences30: number
  lastCounterSeconds: number | null
}

export type BottomNavItem = {
  key: Screen
  label: string
  note?: string
}
