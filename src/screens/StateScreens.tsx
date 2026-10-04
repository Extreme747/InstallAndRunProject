import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { Screen } from '../types'
import { useTheme } from '../utils/theme'
import { useAppStore } from '../store/useAppStore'
import DynamicMoai from '../components/DynamicMoai'
import {
  IconAlert,
  IconBolt,
  IconClock,
  IconFlame,
  IconLock,
  IconShare,
  IconShield,
  IconSkull,
  IconSparkles,
  IconTrophy,
} from '../components/Icons'

interface Props {
  onNavigate: (screen: Screen) => void
}

function StateCanvas({
  tone = 'accent',
  children,
}: {
  tone?: 'accent' | 'danger' | 'gold' | 'muted'
  children: ReactNode
}) {
  const theme = useTheme()
  const glow =
    tone === 'danger'
      ? '255, 59, 48'
      : tone === 'gold'
        ? '255, 184, 0'
        : tone === 'muted'
          ? '100, 100, 112'
          : theme.accentRgb

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
          inset: 0,
          background: `radial-gradient(circle at 50% 38%, rgba(${glow},0.12), transparent 34%), radial-gradient(circle at 50% 110%, rgba(${glow},0.055), transparent 42%)`,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.22,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(circle at center, black, transparent 72%)',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  )
}

function StatusBadge({
  children,
  color,
  rgb,
}: {
  children: ReactNode
  color: string
  rgb: string
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 8px',
        border: `1px solid rgba(${rgb},0.24)`,
        borderRadius: 8,
        background: `rgba(${rgb},0.07)`,
        color,
        fontFamily: "'JetBrains Mono'",
        fontSize: 7,
        fontWeight: 900,
        letterSpacing: '0.13em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  )
}

export function EmptyStateScreen({ onNavigate }: Props) {
  const theme = useTheme()
  return (
    <StateCanvas tone="muted">
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'max(30px, env(safe-area-inset-top, 30px)) 24px max(24px, env(safe-area-inset-bottom, 24px))',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <StatusBadge color="#85858E" rgb="100,100,112">
          <IconClock size={11} />
          Timeline empty
        </StatusBadge>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            width: 178,
            height: 178,
            marginTop: 26,
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.045), transparent 68%)',
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 17,
              border: '1px dashed rgba(255,255,255,0.08)',
              borderRadius: '50%',
            }}
          />
          <DynamicMoai size={65} state="idle" interactive />
        </motion.div>

        <div
          style={{
            marginTop: 22,
            maxWidth: 330,
            fontFamily: "'Barlow Condensed'",
            fontSize: 'clamp(39px, 6vh, 52px)',
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: '-0.025em',
            textTransform: 'uppercase',
          }}
        >
          Your first win is waiting.
        </div>
        <div style={{ maxWidth: 285, marginTop: 13, color: '#707079', fontSize: 11, lineHeight: 1.6 }}>
          No completed sessions yet. Pick a duration, shield the distractions, and put the first block on your timeline.
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: 340,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 7,
            marginTop: 24,
          }}
        >
          {[
            { value: '0m', label: 'Focused' },
            { value: '0', label: 'Streak' },
            { value: '0', label: 'XP' },
          ].map((metric) => (
            <div
              key={metric.label}
              style={{
                padding: '11px 8px',
                border: '1px solid rgba(255,255,255,0.055)',
                borderRadius: 12,
                background: '#0D0D10',
              }}
            >
              <div
                style={{
                  color: '#898991',
                  fontFamily: "'Barlow Condensed'",
                  fontSize: 20,
                  fontWeight: 900,
                }}
              >
                {metric.value}
              </div>
              <div
                style={{
                  marginTop: 3,
                  color: '#505058',
                  fontFamily: "'JetBrains Mono'",
                  fontSize: 6,
                  fontWeight: 700,
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                }}
              >
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="interactive-btn"
          style={{
            width: '100%',
            maxWidth: 340,
            height: 52,
            marginTop: 16,
            border: 0,
            borderRadius: 15,
            background: theme.accent,
            boxShadow: `0 0 25px rgba(${theme.accentRgb},0.18)`,
            color: '#080808',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: "'Barlow Condensed'",
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          <IconLock size={16} />
          Build first session
        </button>
      </main>
    </StateCanvas>
  )
}

export function LoadingScreen() {
  const theme = useTheme()
  return (
    <StateCanvas>
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 150,
            height: 150,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <svg width="150" height="150" viewBox="0 0 150 150" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            <circle cx="75" cy="75" r="62" fill="none" stroke="#17171B" strokeWidth="3" />
            <circle
              cx="75"
              cy="75"
              r="62"
              fill="none"
              stroke={theme.accent}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="80 310"
              className="animate-spin"
              style={{
                transformOrigin: '75px 75px',
                filter: `drop-shadow(0 0 9px rgba(${theme.accentRgb},0.6))`,
              }}
            />
          </svg>
          <DynamicMoai size={53} state="focusing" interactive={false} />
        </div>

        <div
          style={{
            marginTop: 19,
            color: theme.accent,
            fontFamily: "'JetBrains Mono'",
            fontSize: 8,
            fontWeight: 900,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          Synchronizing discipline
        </div>
        <div
          style={{
            marginTop: 7,
            fontFamily: "'Barlow Condensed'",
            fontSize: 29,
            fontWeight: 900,
            textTransform: 'uppercase',
          }}
        >
          Building your command center
        </div>
        <div style={{ marginTop: 6, color: '#606069', fontSize: 10 }}>
          Restoring streaks, sessions, and shield status.
        </div>

        <div style={{ width: '100%', maxWidth: 330, display: 'grid', gap: 8, marginTop: 28 }}>
          {[100, 72, 88].map((width, index) => (
            <div
              key={index}
              style={{
                height: index === 0 ? 58 : 42,
                padding: 10,
                border: '1px solid rgba(255,255,255,0.045)',
                borderRadius: 12,
                background: '#0D0D10',
              }}
            >
              <div
                className="animate-shimmer"
                style={{
                  width: `${width}%`,
                  height: 8,
                  borderRadius: 5,
                }}
              />
              <div
                className="animate-shimmer"
                style={{
                  width: `${Math.max(34, width - 38)}%`,
                  height: 6,
                  marginTop: 8,
                  borderRadius: 5,
                  opacity: 0.58,
                }}
              />
            </div>
          ))}
        </div>
      </main>
    </StateCanvas>
  )
}

export function SuccessScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  const duration = store.durationMinutes || 25
  const baseXP = Math.round(duration * 10 * (1 + 0.1 * Math.min(store.currentStreak, 30)))
  const xpEarned = store.isSubscribed ? baseXP * 2 : baseXP
  const isNewRecord = store.currentStreak > 1 && store.currentStreak >= store.bestStreak

  return (
    <StateCanvas tone="accent">
      {[theme.accent, '#BF7FFF', '#FFB800', '#60A5FA', '#FF6259'].map((color, index) => (
        <span
          key={color}
          className={`animate-confetti-${(index % 3) + 1}`}
          style={{
            position: 'absolute',
            top: `${12 + index * 9}%`,
            left: `${11 + index * 19}%`,
            width: 6,
            height: 6,
            borderRadius: index % 2 ? 2 : '50%',
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      ))}

      <main
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'max(24px, env(safe-area-inset-top, 24px)) 22px max(22px, env(safe-area-inset-bottom, 22px))',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <StatusBadge color={theme.accent} rgb={theme.accentRgb}>
          <IconShield size={11} />
          Protocol complete
        </StatusBadge>

        <motion.div
          initial={{ opacity: 0, scale: 0.72 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 18 }}
          style={{
            width: 164,
            height: 164,
            marginTop: 23,
            border: `1px solid rgba(${theme.accentRgb},0.25)`,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${theme.accentRgb},0.15), transparent 67%)`,
            boxShadow: `0 0 55px rgba(${theme.accentRgb},0.09)`,
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: 17, right: 17 }}>
            <IconTrophy size={33} />
          </div>
          <DynamicMoai size={69} state="victory" skin={store.activeSkin} interactive />
        </motion.div>

        <div
          style={{
            marginTop: 16,
            color: theme.accent,
            fontFamily: "'Barlow Condensed'",
            fontSize: 'clamp(52px, 8vh, 70px)',
            fontWeight: 900,
            lineHeight: 0.86,
            letterSpacing: '-0.035em',
            filter: `drop-shadow(0 0 22px rgba(${theme.accentRgb},0.35))`,
          }}
        >
          +{xpEarned} XP
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: "'Barlow Condensed'",
            fontSize: 34,
            fontWeight: 900,
            lineHeight: 0.92,
            textTransform: 'uppercase',
          }}
        >
          Discipline delivered.
        </div>
        <div style={{ maxWidth: 290, marginTop: 9, color: '#72727B', fontSize: 10, lineHeight: 1.55 }}>
          {duration} minutes protected. Your {store.currentStreak}-day streak lives to fight another scroll.
        </div>

        {isNewRecord && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 12,
              padding: '5px 9px',
              border: '1px solid rgba(255,184,0,0.25)',
              borderRadius: 8,
              background: 'rgba(255,184,0,0.07)',
              color: '#FFB800',
              fontFamily: "'JetBrains Mono'",
              fontSize: 7,
              fontWeight: 900,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            <IconBolt size={11} />
            New personal record
          </div>
        )}

        <div
          style={{
            width: '100%',
            maxWidth: 350,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 7,
            marginTop: 20,
          }}
        >
          {[
            { label: 'Duration', value: `${duration}m`, icon: <IconClock size={13} /> },
            { label: 'Streak', value: `${store.currentStreak}d`, icon: <IconFlame size={13} /> },
            { label: 'Level', value: store.level, icon: <IconBolt size={13} /> },
          ].map((metric) => (
            <div
              key={metric.label}
              style={{
                padding: '10px 7px',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                background: '#0D0D10',
              }}
            >
              <div style={{ color: theme.accent }}>{metric.icon}</div>
              <div style={{ marginTop: 4, fontFamily: "'Barlow Condensed'", fontSize: 19, fontWeight: 900 }}>
                {metric.value}
              </div>
              <div style={{ marginTop: 2, color: '#53535C', fontFamily: "'JetBrains Mono'", fontSize: 6, textTransform: 'uppercase' }}>
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ width: '100%', maxWidth: 350, display: 'grid', gridTemplateColumns: '1.35fr 0.65fr', gap: 8, marginTop: 14 }}>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="interactive-btn"
            style={{
              height: 51,
              border: 0,
              borderRadius: 14,
              background: theme.accent,
              color: '#080808',
              fontFamily: "'Barlow Condensed'",
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Go again
          </button>
          <button
            type="button"
            onClick={() => onNavigate('share-cards')}
            className="interactive-btn"
            aria-label="Share session"
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              background: '#111114',
              color: '#898991',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
          >
            <IconShare size={17} />
          </button>
        </div>
      </main>
    </StateCanvas>
  )
}

export function ErrorScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  return (
    <StateCanvas tone="danger">
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'max(28px, env(safe-area-inset-top, 28px)) 22px max(22px, env(safe-area-inset-bottom, 22px))',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <StatusBadge color="#FF6259" rgb="255,59,48">
          <IconAlert size={11} />
          Protocol terminated
        </StatusBadge>

        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            width: 174,
            height: 174,
            marginTop: 25,
            border: '1px solid rgba(255,59,48,0.22)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,59,48,0.12), transparent 68%)',
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: 18, right: 18 }}>
            <IconSkull size={29} />
          </div>
          <DynamicMoai size={67} state="blocked_rage" skin={store.activeSkin} interactive />
        </motion.div>

        <div
          style={{
            marginTop: 21,
            color: '#FF6259',
            fontFamily: "'Barlow Condensed'",
            fontSize: 'clamp(38px, 6vh, 52px)',
            fontWeight: 900,
            lineHeight: 0.9,
            textTransform: 'uppercase',
          }}
        >
          The scroll won this round.
        </div>
        <div style={{ maxWidth: 290, marginTop: 11, color: '#71717A', fontSize: 10, lineHeight: 1.6 }}>
          Session aborted. The data stays honest, but the next protocol can start immediately.
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: 350,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 7,
            marginTop: 22,
          }}
        >
          <div
            style={{
              padding: 12,
              border: '1px solid rgba(255,59,48,0.14)',
              borderRadius: 12,
              background: 'rgba(255,59,48,0.045)',
            }}
          >
            <div style={{ color: '#A44D48', fontFamily: "'JetBrains Mono'", fontSize: 7, textTransform: 'uppercase' }}>
              Aura remaining
            </div>
            <div style={{ marginTop: 5, color: '#FF6259', fontFamily: "'Barlow Condensed'", fontSize: 23, fontWeight: 900 }}>
              {store.auraScore}
            </div>
          </div>
          <div
            style={{
              padding: 12,
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              background: '#0D0D10',
            }}
          >
            <div style={{ color: '#55555E', fontFamily: "'JetBrains Mono'", fontSize: 7, textTransform: 'uppercase' }}>
              Current streak
            </div>
            <div style={{ marginTop: 5, fontFamily: "'Barlow Condensed'", fontSize: 23, fontWeight: 900 }}>
              {store.currentStreak}d
            </div>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: 350, display: 'grid', gap: 8, marginTop: 15 }}>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="interactive-btn"
            style={{
              height: 51,
              border: 0,
              borderRadius: 14,
              background: theme.accent,
              color: '#080808',
              fontFamily: "'Barlow Condensed'",
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Reset and lock in again
          </button>
          <button
            type="button"
            onClick={() => onNavigate('stats')}
            className="interactive-btn"
            style={{
              height: 43,
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              background: '#0D0D10',
              color: '#777780',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              fontFamily: "'Barlow Condensed'",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            <IconSparkles size={14} />
            Review the damage
          </button>
        </div>
      </main>
    </StateCanvas>
  )
}
