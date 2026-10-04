import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SCREEN_GROUPS, type Screen } from '../types'

interface ScreenNavigatorProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
}

const screenCount = SCREEN_GROUPS.reduce((total, group) => total + group.items.length, 0)

export default function ScreenNavigator({ currentScreen, onNavigate }: ScreenNavigatorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return SCREEN_GROUPS

    return SCREEN_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.id.toLowerCase().includes(normalizedQuery),
      ),
    })).filter((group) => group.items.length > 0)
  }, [query])

  const selectScreen = (screen: Screen) => {
    onNavigate(screen)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <>
      <button
        type="button"
        className="screen-nav-trigger"
        aria-label="Open all screens panel"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <span className="screen-nav-trigger-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="screen-nav-trigger-label">Screens</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              className="screen-nav-backdrop"
              aria-label="Close screens panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              className="screen-nav-panel"
              aria-label="All app screens"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 420, damping: 38 }}
            >
              <div className="screen-nav-header">
                <div>
                  <p className="screen-nav-eyebrow">Quick access</p>
                  <p className="screen-nav-title">All screens</p>
                  <p className="screen-nav-count">{screenCount} destinations</p>
                </div>
                <button
                  type="button"
                  className="screen-nav-close"
                  aria-label="Close screens panel"
                  onClick={() => setIsOpen(false)}
                >
                  <span aria-hidden="true" />
                  <span aria-hidden="true" />
                </button>
              </div>

              <label className="screen-nav-search">
                <span className="screen-nav-search-icon" aria-hidden="true" />
                <span className="sr-only">Search screens</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search screens..."
                  autoFocus
                />
              </label>

              <div className="screen-nav-list">
                {filteredGroups.map((group) => (
                  <section className="screen-nav-group" key={group.label}>
                    <p className="screen-nav-group-label">{group.label}</p>
                    <div className="screen-nav-group-items">
                      {group.items.map((item) => {
                        const isActive = item.id === currentScreen
                        return (
                          <button
                            type="button"
                            key={item.id}
                            className={`screen-nav-item${isActive ? ' is-active' : ''}`}
                            aria-current={isActive ? 'page' : undefined}
                            onClick={() => selectScreen(item.id)}
                          >
                            <span className="screen-nav-item-indicator" aria-hidden="true" />
                            <span>{item.name}</span>
                            <span className="screen-nav-item-id">{item.id}</span>
                          </button>
                        )
                      })}
                    </div>
                  </section>
                ))}

                {filteredGroups.length === 0 && (
                  <div className="screen-nav-empty">
                    <p>No screen found</p>
                    <button type="button" onClick={() => setQuery('')}>
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
