import type { BottomNavItem, Screen } from '../types'

type Props = {
  items: BottomNavItem[]
  activeKey: Screen
  onNavigate: (_key: Screen) => void
}

export function BottomNav({ items, activeKey, onNavigate }: Props) {
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`bottom-nav__item ${item.key === activeKey ? 'bottom-nav__item--active' : ''}`.trim()}
          onClick={() => onNavigate(item.key)}
          aria-current={item.key === activeKey ? 'page' : undefined}
        >
          <span className="bottom-nav__icon" aria-hidden="true">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
