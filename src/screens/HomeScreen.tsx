import { useMemo, useState, type ReactElement } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../utils/theme'
import type { Screen } from '../types'
import { useAppStore } from '../store/useAppStore'
import { formatAppName } from './BlockedAppsScreen'
import { ScrollntProBadge } from './SocialScreens'
import DynamicMoai from '../components/DynamicMoai'
import {
  IconBolt,
  IconCalendar,
  IconChart,
  IconClock,
  IconFlame,
  IconLock,
  IconPalette,
  IconShield,
  IconTarget,
  IconUsers,
  IconWarning,
  getMascotComponent,
} from '../components/Icons'

interface Props {
  onNavigate: (screen: Screen) => void
}

const DURATIONS = [
  { label: '15', value: 15 },
  { label: '25', value: 25 },
  { label: '45', value: 45 },
  { label: '60', value: 60 },
  { label: '90', value: 90 },
]

function BottomNav({ active, onNavigate }: { active: Screen; onNavigate: (screen: Screen) => void }) {
  const theme = useTheme()
  const items: { id: Screen; label: string; icon: ReactElement }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <path d="M3 9.5L11 3l8 6.5V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 20v-7h6v7" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ),
    },
    {
      id: 'focus',
      label: 'Focus',
      icon: (
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M11 3V1M11 21v-2M3 11H1M21 11h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'stats',
      label: 'Stats',
      icon: (
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="12" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="1.6" />
          <rect x="9" y="7" width="4" height="13" rx="1" stroke="currentColor" strokeWidth="1.6" />
          <rect x="15" y="3" width="4" height="17" rx="1" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M9.2 2.8 8 5.3l-2.7.3-1.9 1.9.3 2.7-2.5 1.2v1.2l2.5 1.2-.3 2.7 1.9 1.9 2.7-.3L9.2 19.2h1.6l1.2-2.5 2.7.3 1.9-1.9-.3-2.7 2.5-1.2v-1.2l-2.5-1.2.3-2.7-1.9-1.9-2.7.3L10.8 2.8H9.2Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      ),
    },
  ]

  return (
    <nav
      style={{
        display: 'flex',
        borderTop: '1px solid rgba(255,255,255,0.055)',
        background: 'rgba(8,8,10,0.96)',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
        paddingTop: 5,
        backdropFilter: 'blur(18px)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 50,
      }}
    >
      {items.map((item) => {
        const selected = active === item.id
        return (
          <button
            type="button"
            key={item.id}
            onClick={() => {
              if (item.id === 'focus' && !(useAppStore.getState().blockedApps || []).length) {
                onNavigate('blocked-apps')
                return
              }
              onNavigate(item.id)
            }}
            className="interactive-btn"
            style={{
              flex: 1,
              minHeight: 43,
              padding: '5px 0 1px',
              border: 0,
              background: 'transparent',
              color: selected ? theme.accent : '#62626B',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {selected && (
              <motion.span
                layoutId="bottom-nav-active"
                style={{
                  position: 'absolute',
                  top: -6,
                  width: 25,
                  height: 2,
                  borderRadius: 3,
                  background: theme.accent,
                  boxShadow: `0 0 12px rgba(${theme.accentRgb},0.7)`,
                }}
              />
            )}
            {item.icon}
            <span
              style={{
                fontFamily: "'DM Sans'",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export { BottomNav }

export default function HomeScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  const [mode, setMode] = useState<'solo' | 'squad'>(() => store.focusMode || 'solo')

  const selectedDuration = store.durationMinutes
  const permissions = store.permissions
  const blockedApps = store.blockedApps || []
  const activeDailyCount =
    store.challenges?.filter((challenge: any) => challenge.type === 'daily' && !challenge.completed)
      .length || 0
  const shieldsReady = permissions.usage && permissions.overlay
  const canStart = shieldsReady && blockedApps.length > 0

  const todayMinutes = useMemo(() => {
    const today = new Date()
    return store.sessions.reduce((total, session) => {
      const sessionDate = new Date(session.date)
      const sameDay =
        sessionDate.getDate() === today.getDate() &&
        sessionDate.getMonth() === today.getMonth() &&
        sessionDate.getFullYear() === today.getFullYear()
      return total + (sameDay && session.completed ? session.durationMinutes : 0)
    }, 0)
  }, [store.sessions])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Morning protocol'
    if (hour < 17) return 'Afternoon grind'
    return 'Evening lock-in'
  }, [])

  const activeRoutine =
    store.routines?.find((routine) => routine.id === store.activeRoutineId) ||
    store.routines?.find((routine) => routine.enabled)
  const quotaApps = store.appLimits?.length || 0
  const quotaLocked = store.exhaustedLimits?.length || 0
  const levelStart = store.level <= 1 ? 0 : Math.round(100 * Math.pow(store.level - 1, 1.5))
  const levelEnd = Math.round(100 * Math.pow(store.level, 1.5))
  const levelProgress = Math.min(
    100,
    Math.max(4, ((store.totalXP - levelStart) / Math.max(1, levelEnd - levelStart)) * 100),
  )

  const startFocus = () => {
    if (!shieldsReady) {
      onNavigate('permissions-hub')
      return
    }
    if (!blockedApps.length) {
      onNavigate('blocked-apps')
      return
    }
    onNavigate('focus')
  }

  const commandCards: {
    id: Screen
    title: string
    subtitle: string
    icon: ReactElement
    accent: string
    badge?: string | number
  }[] = [
    {
      id: 'daily-challenges',
      title: 'Challenges',
      subtitle: `${activeDailyCount} active today`,
      icon: <IconTarget size={21} />,
      accent: '#FFB800',
      badge: activeDailyCount || undefined,
    },
    {
      id: 'squad-dashboard',
      title: 'Squad',
      subtitle: store.squadName || 'Build your circle',
      icon: <IconUsers size={21} />,
      accent: '#60A5FA',
    },
    {
      id: 'deep-analytics',
      title: 'Analytics',
      subtitle: `${todayMinutes}m focused today`,
      icon: <IconChart size={21} />,
      accent: theme.accent,
    },
    {
      id: 'theme-store',
      title: 'Loadout',
      subtitle: 'Themes, skins & sound',
      icon: <IconPalette size={21} />,
      accent: '#BF7FFF',
    },
  ]

  return (
    <div
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: theme.bg,
        color: '#F5F5F5',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -160,
          right: -120,
          width: 390,
          height: 390,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${theme.accentRgb},0.12), transparent 68%)`,
          pointerEvents: 'none',
        }}
      />

      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: 'max(14px, env(safe-area-inset-top, 14px)) clamp(16px, 4vw, 24px) 9px 62px',
          position: 'relative',
          zIndex: 2,
          flexShrink: 0,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: theme.accent,
              fontFamily: "'Barlow Condensed'",
              fontSize: 19,
              fontWeight: 900,
              letterSpacing: '0.05em',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            {getMascotComponent(store.activeSkin, 18)}
            Scrolln't
            {store.isSubscribed && <ScrollntProBadge />}
          </div>
          <div
            style={{
              marginTop: 4,
              color: '#62626B',
              fontFamily: "'JetBrains Mono'",
              fontSize: 7,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {greeting} · {store.userName || 'Anonymous'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <button
            type="button"
            onClick={() => onNavigate('xp-dashboard')}
            className="interactive-btn"
            style={{
              height: 35,
              padding: '0 10px',
              border: '1px solid rgba(255,184,0,0.2)',
              borderRadius: 11,
              background: 'rgba(255,184,0,0.06)',
              color: '#FFB800',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer',
            }}
          >
            <IconFlame size={14} />
            <span
              style={{
                fontFamily: "'Barlow Condensed'",
                fontSize: 15,
                fontWeight: 900,
              }}
            >
              {store.currentStreak}
            </span>
            <span style={{ width: 1, height: 13, background: 'rgba(255,184,0,0.18)' }} />
            <IconBolt size={12} />
            <span
              style={{
                fontFamily: "'Barlow Condensed'",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {store.totalXP.toLocaleString()}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className="interactive-btn"
            aria-label="Open settings"
            style={{
              width: 35,
              height: 35,
              border: '1px solid #202025',
              borderRadius: 11,
              background: '#0E0E11',
              color: '#777780',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M19.4 14.8a1 1 0 0 0 .2 1.1l.1.1a1.2 1.2 0 0 1-1.7 1.7l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V18.5a1.2 1.2 0 0 1-2.4 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.2 1.2 0 0 1-1.7-1.7l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H9.5a1.2 1.2 0 0 1 0-2.4h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1.2 1.2 0 0 1 1.7-1.7l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V5.5a1.2 1.2 0 0 1 2.4 0v.1a1 1 0 0 0 .6.9h.1a1 1 0 0 0 1.1-.2l.1-.1a1.2 1.2 0 0 1 1.7 1.7l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6h.1a1.2 1.2 0 0 1 0 2.4h-.1a1 1 0 0 0-.9.6Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          </button>
        </div>
      </header>

      <main
        className="screen-scrollable"
        style={{
          padding: '5px clamp(16px, 4vw, 24px) 22px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {!shieldsReady && (
          <button
            type="button"
            onClick={() => onNavigate('permissions-hub')}
            className="interactive-btn"
            style={{
              width: '100%',
              minHeight: 43,
              marginBottom: 9,
              padding: '8px 10px',
              border: '1px solid rgba(255,184,0,0.25)',
              borderRadius: 12,
              background: 'rgba(255,184,0,0.055)',
              color: '#FFB800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconWarning size={15} />
              <span>
                <span
                  style={{
                    display: 'block',
                    fontFamily: "'Barlow Condensed'",
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                  }}
                >
                  Shields need permission
                </span>
                <span style={{ display: 'block', marginTop: 1, color: '#826D34', fontSize: 8 }}>
                  Enable Usage Access and Overlay before locking in.
                </span>
              </span>
            </span>
            <span
              style={{
                padding: '4px 7px',
                borderRadius: 7,
                background: '#FFB800',
                color: '#080808',
                fontFamily: "'JetBrains Mono'",
                fontSize: 7,
                fontWeight: 900,
              }}
            >
              FIX
            </span>
          </button>
        )}

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: 16,
            border: `1px solid rgba(${theme.accentRgb},0.24)`,
            borderRadius: 22,
            background: `linear-gradient(145deg, rgba(${theme.accentRgb},0.105), rgba(13,13,16,0.97) 57%)`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 24px 60px rgba(0,0,0,0.25)`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -90,
              right: -75,
              width: 250,
              height: 250,
              borderRadius: '50%',
              border: `1px solid rgba(${theme.accentRgb},0.08)`,
              boxShadow: `inset 0 0 60px rgba(${theme.accentRgb},0.045)`,
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, position: 'relative' }}>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: theme.accent,
                  fontFamily: "'JetBrains Mono'",
                  fontSize: 7,
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: canStart ? theme.accent : '#FFB800',
                    boxShadow: canStart ? `0 0 9px ${theme.accent}` : '0 0 8px #FFB800',
                  }}
                />
                {canStart ? 'Protocol ready' : 'Setup required'}
              </div>
              <div
                style={{
                  marginTop: 5,
                  fontFamily: "'Barlow Condensed'",
                  fontSize: 24,
                  fontWeight: 900,
                  lineHeight: 0.95,
                  textTransform: 'uppercase',
                }}
              >
                Enter focus mode
              </div>
            </div>
            <div
              style={{
                padding: '5px 8px',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8,
                background: 'rgba(0,0,0,0.2)',
                color: '#73737C',
                fontFamily: "'JetBrains Mono'",
                fontSize: 7,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {blockedApps.length} shields armed
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 112px',
              alignItems: 'center',
              gap: 12,
              minHeight: 126,
              marginTop: 5,
              position: 'relative',
            }}
          >
            <div>
              <div
                style={{
                  color: theme.accent,
                  fontFamily: "'JetBrains Mono'",
                  fontSize: 'clamp(44px, 8vh, 62px)',
                  fontWeight: 800,
                  lineHeight: 0.9,
                  letterSpacing: '-0.055em',
                  filter: `drop-shadow(0 0 18px rgba(${theme.accentRgb},0.24))`,
                }}
              >
                {String(selectedDuration).padStart(2, '0')}:00
              </div>
              <div
                style={{
                  marginTop: 9,
                  maxWidth: 190,
                  color: '#686871',
                  fontSize: 9,
                  lineHeight: 1.5,
                }}
              >
                {blockedApps.length
                  ? `${blockedApps
                      .slice(0, 2)
                      .map((app) => formatAppName(app).name)
                      .join(', ')}${blockedApps.length > 2 ? ` +${blockedApps.length - 2}` : ''} stay locked.`
                  : 'Choose distracting apps before starting your protocol.'}
              </div>
            </div>

            <div
              style={{
                position: 'relative',
                width: 112,
                height: 112,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: `1px solid rgba(${theme.accentRgb},0.18)`,
                  borderRadius: '50%',
                  boxShadow: `0 0 30px rgba(${theme.accentRgb},0.07), inset 0 0 30px rgba(${theme.accentRgb},0.04)`,
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 9,
                  border: '1px dashed rgba(255,255,255,0.08)',
                  borderRadius: '50%',
                }}
              />
              <DynamicMoai
                size={55}
                state="idle"
                skin={store.activeSkin}
                interactive
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 5, marginTop: 3, position: 'relative' }}>
            {DURATIONS.map((duration) => {
              const selected = selectedDuration === duration.value
              return (
                <button
                  type="button"
                  key={duration.value}
                  onClick={() => store.setDurationMinutes(duration.value)}
                  className="interactive-btn"
                  style={{
                    flex: 1,
                    height: 37,
                    border: selected
                      ? `1px solid rgba(${theme.accentRgb},0.45)`
                      : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10,
                    background: selected ? theme.accent : 'rgba(0,0,0,0.22)',
                    color: selected ? '#080808' : '#686871',
                    fontFamily: "'Barlow Condensed'",
                    fontSize: 14,
                    fontWeight: 900,
                    cursor: 'pointer',
                  }}
                >
                  {duration.label}
                  <span style={{ marginLeft: 1, fontSize: 8, opacity: 0.72 }}>m</span>
                </button>
              )
            })}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '0.8fr 1.5fr',
              gap: 7,
              marginTop: 8,
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 3,
                padding: 3,
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                background: '#0A0A0D',
              }}
            >
              {(['solo', 'squad'] as const).map((focusMode) => {
                const selected = mode === focusMode
                return (
                  <button
                    type="button"
                    key={focusMode}
                    onClick={() => {
                      setMode(focusMode)
                      store.setFocusMode(focusMode)
                    }}
                    className="interactive-btn"
                    aria-label={`${focusMode} focus mode`}
                    style={{
                      border: 0,
                      borderRadius: 9,
                      background: selected
                        ? focusMode === 'squad'
                          ? 'rgba(96,165,250,0.16)'
                          : 'rgba(255,255,255,0.08)'
                        : 'transparent',
                      color: selected
                        ? focusMode === 'squad'
                          ? '#60A5FA'
                          : '#F5F5F5'
                        : '#55555E',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {focusMode === 'solo' ? <IconTarget size={15} /> : <IconUsers size={15} />}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={startFocus}
              className="interactive-btn"
              style={{
                height: 49,
                border: 0,
                borderRadius: 13,
                background: canStart ? theme.accent : '#FFB800',
                boxShadow: canStart
                  ? `0 0 25px rgba(${theme.accentRgb},0.2)`
                  : '0 0 20px rgba(255,184,0,0.12)',
                color: '#080808',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                fontFamily: "'Barlow Condensed'",
                fontSize: 17,
                fontWeight: 900,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              <IconLock size={16} />
              {canStart ? 'Lock in now' : shieldsReady ? 'Choose apps' : 'Enable shields'}
            </button>
          </div>
        </motion.section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 7,
            marginTop: 10,
          }}
        >
          {[
            { label: 'Today', value: `${todayMinutes}m`, icon: <IconClock size={14} />, color: theme.accent },
            { label: 'Blocked', value: store.distractionCount, icon: <IconShield size={14} />, color: '#FF6259' },
            { label: 'Aura', value: store.auraScore, icon: <IconBolt size={14} />, color: '#BF7FFF' },
          ].map((metric) => (
            <div
              key={metric.label}
              style={{
                padding: '10px 9px',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                background: '#0E0E11',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: metric.color }}>
                {metric.icon}
                <span
                  style={{
                    fontFamily: "'Barlow Condensed'",
                    fontSize: 19,
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  {metric.value}
                </span>
              </div>
              <div
                style={{
                  marginTop: 5,
                  color: '#55555E',
                  fontFamily: "'JetBrains Mono'",
                  fontSize: 6,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            margin: '20px 2px 9px',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Barlow Condensed'",
                fontSize: 18,
                fontWeight: 900,
                textTransform: 'uppercase',
              }}
            >
              Automation deck
            </div>
            <div style={{ marginTop: 2, color: '#56565F', fontSize: 9 }}>
              Set discipline once. Let the system enforce it.
            </div>
          </div>
          <IconBolt size={16} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 8 }}>
          <button
            type="button"
            onClick={() => onNavigate('schedules')}
            className="interactive-btn"
            style={{
              minHeight: 102,
              padding: 13,
              border: activeRoutine
                ? `1px solid rgba(${theme.accentRgb},0.28)`
                : '1px solid rgba(255,255,255,0.065)',
              borderRadius: 15,
              background: activeRoutine
                ? `linear-gradient(145deg, rgba(${theme.accentRgb},0.075), #101013 64%)`
                : '#101013',
              color: '#F5F5F5',
              cursor: 'pointer',
              textAlign: 'left',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: `rgba(${theme.accentRgb},0.09)`,
                  color: theme.accent,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <IconCalendar size={16} />
              </div>
              <span
                style={{
                  color: activeRoutine ? theme.accent : '#55555E',
                  fontFamily: "'JetBrains Mono'",
                  fontSize: 7,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                }}
              >
                {activeRoutine ? 'ARMED' : 'SETUP'}
              </span>
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: "'Barlow Condensed'",
                fontSize: 16,
                fontWeight: 900,
                textTransform: 'uppercase',
              }}
            >
              {activeRoutine?.name || 'Focus routines'}
            </div>
            <div style={{ marginTop: 3, color: '#62626B', fontSize: 8 }}>
              {activeRoutine
                ? `${activeRoutine.startTime} → ${activeRoutine.endTime}`
                : 'Automate your lock-in hours'}
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('app-limits')}
            className="interactive-btn"
            style={{
              minHeight: 102,
              padding: 13,
              border: quotaLocked
                ? '1px solid rgba(255,59,48,0.24)'
                : '1px solid rgba(255,255,255,0.065)',
              borderRadius: 15,
              background: quotaLocked
                ? 'linear-gradient(145deg, rgba(255,59,48,0.06), #101013 64%)'
                : '#101013',
              color: '#F5F5F5',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: quotaLocked ? 'rgba(255,59,48,0.1)' : '#19191D',
                color: quotaLocked ? '#FF6259' : theme.accent,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <IconClock size={16} />
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: "'Barlow Condensed'",
                fontSize: 16,
                fontWeight: 900,
                textTransform: 'uppercase',
              }}
            >
              App quotas
            </div>
            <div style={{ marginTop: 3, color: '#62626B', fontSize: 8 }}>
              {quotaApps} tracked · {quotaLocked} locked
            </div>
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '20px 2px 9px',
          }}
        >
          <div
            style={{
              fontFamily: "'Barlow Condensed'",
              fontSize: 18,
              fontWeight: 900,
              textTransform: 'uppercase',
            }}
          >
            Command center
          </div>
          <button
            type="button"
            onClick={() => onNavigate('xp-dashboard')}
            className="interactive-btn"
            style={{
              border: 0,
              background: 'transparent',
              color: '#BF7FFF',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono'",
                fontSize: 7,
                fontWeight: 800,
                letterSpacing: '0.08em',
              }}
            >
              LV {store.level}
            </span>
            <span
              style={{
                width: 62,
                height: 4,
                borderRadius: 4,
                background: '#202025',
                overflow: 'hidden',
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: `${levelProgress}%`,
                  height: '100%',
                  borderRadius: 4,
                  background: '#BF7FFF',
                  boxShadow: '0 0 7px rgba(191,127,255,0.55)',
                }}
              />
            </span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {commandCards.map((card, index) => (
            <motion.button
              type="button"
              key={card.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * index }}
              onClick={() => onNavigate(card.id)}
              className="interactive-btn"
              style={{
                minHeight: 95,
                padding: 12,
                border: `1px solid ${card.accent}1F`,
                borderRadius: 15,
                background: `linear-gradient(145deg, ${card.accent}0D, #101013 68%)`,
                color: '#F5F5F5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {card.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: 9,
                    right: 9,
                    minWidth: 18,
                    height: 18,
                    padding: '0 5px',
                    borderRadius: 6,
                    background: card.accent,
                    color: '#080808',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: "'JetBrains Mono'",
                    fontSize: 7,
                    fontWeight: 900,
                  }}
                >
                  {card.badge}
                </span>
              )}
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: `${card.accent}14`,
                  color: card.accent,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {card.icon}
              </span>
              <span
                style={{
                  marginTop: 9,
                  fontFamily: "'Barlow Condensed'",
                  fontSize: 15,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                }}
              >
                {card.title}
              </span>
              <span
                style={{
                  marginTop: 2,
                  color: '#5F5F68',
                  fontFamily: "'DM Sans'",
                  fontSize: 8,
                }}
              >
                {card.subtitle}
              </span>
            </motion.button>
          ))}
        </div>
      </main>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  )
}
