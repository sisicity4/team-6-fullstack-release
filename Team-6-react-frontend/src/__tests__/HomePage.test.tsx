import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from '../pages/HomePage'

const onStartReflection = vi.fn()
const baseProps = {
  latestReflection: {
    id: 1,
    action: '会議が長引いた',
    mood: 40,
    notes: '焦ったけど助けてもらえた',
    emotion_tags: ['不安'],
    next_step: '早めに相談する',
    success: false,
    logged_at: '2026-02-04T10:00:00Z',
  },
  profile: {
    username: 'tester',
    last_login: null,
    date_joined: '2026-02-01T00:00:00Z',
    is_authenticated: true,
    height_cm: null,
    weight_kg: null,
    goal_weight_kg: null,
    training_style: '',
    habit_frequency: '',
    emotional_tone: '落ち着きたい',
    intentions: '',
  },
  onStartReflection,
  showReflectionForm: false,
  reflectionForm: {
    action: '',
    notes: '',
    next_step: '',
    success: false,
    emotion_tags: [],
  },
  submitMessage: null,
  onReflectionChange: vi.fn(),
  onSubmitReflection: vi.fn(),
  reflectionMode: null,
  sparkleTrigger: 0,
}

describe('HomePage', () => {
  beforeEach(() => {
    onStartReflection.mockReset()
  })
  it('renders hero and CTA', () => {
    render(<HomePage {...baseProps} />)
    expect(screen.getByText('今日はどんな日だった？')).toBeInTheDocument()
    expect(screen.getByText('Yes（ポジティブ）')).toBeInTheDocument()
    expect(screen.getByText('No（ネガティブ）')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '応援するペット' })).toBeInTheDocument()
  })

  it('invokes handler on CTA click', () => {
    render(<HomePage {...baseProps} />)
    fireEvent.click(screen.getByText('Yes（ポジティブ）'))
    fireEvent.click(screen.getByText('No（ネガティブ）'))
    expect(onStartReflection).toHaveBeenNthCalledWith(1, 'positive')
    expect(onStartReflection).toHaveBeenNthCalledWith(2, 'negative')
  })

  it('changes the pet expression for a positive or tired reflection', () => {
    const { rerender } = render(
      <HomePage
        {...baseProps}
        latestReflection={{ ...baseProps.latestReflection, success: true }}
      />,
    )
    expect(screen.getByRole('img', { name: '喜んでいるペット' })).toBeInTheDocument()

    rerender(
      <HomePage
        {...baseProps}
        latestReflection={{ ...baseProps.latestReflection, emotion_tags: ['疲れた'] }}
      />,
    )
    expect(screen.getByRole('img', { name: '眠そうなペット' })).toBeInTheDocument()
  })

  it('shows reflection form when enabled', () => {
    render(
      <HomePage
        {...baseProps}
        showReflectionForm={true}
        reflectionMode="positive"
      />,
    )
    expect(screen.getByText('振り返りメモ')).toBeInTheDocument()
    expect(screen.getByText('できた理由をひとつ選ぶ')).toBeInTheDocument()
  })
})
