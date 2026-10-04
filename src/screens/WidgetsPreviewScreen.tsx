import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Screen } from '../types'
import { useTheme } from '../utils/theme'
import { useAppStore } from '../store/useAppStore'
import { BottomNav } from './HomeScreen'
import DynamicMoai from '../components/DynamicMoai'
import {
  IconAndroid,
  IconBolt,
  IconCheck,
  IconClock,
  IconFlame,
  IconLock,
  IconPhone,
  IconShield,
} from '../components/Icons'

interface Props {
  onNavigate: (screen: Screen) => void
}

type WidgetVariant = 'compact' | 'expanded'

export default function WidgetsPreviewScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  const [variant, setVariant] = useState<WidgetVariant>('compact')
  const [showGuide, setShowGuide] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const todayMinutes = useMemo(() => {
    const today = new Date()
    return store.sessions.reduce((total, session) => {
      const sessionDate = new Date(session.date)
      const isToday =
        sessionDate.getDate() === today.getDate() &&
        sessionDate.getMonth() === today.getMonth() &&
        sessionDate.getFullYear() === today.getFullYear()
      return total + (isToday && session.completed ? session.durationMinutes : 0)
    }, 0)
  }, [store.sessions])

  const savedTime = `${Math.floor(todayMinutes / 60)}h ${String(todayMinutes % 60).padStart(2, '0')}m`
  const mascotMessage =
    store.currentStreak >= 14
      ? 'Streak elite hai. Aaj bhi standard neeche mat gira.'
      : store.currentStreak >= 7
        ? 'Momentum ban gaya hai. Ab excuses ko entry mat de.'
        : store.currentStreak > 0
          ? 'Streak shuru ho gayi. Ab bas roz ek lock-in.'
          : 'Padhai karle bhai, phone dekhne se ghar nahi chalta.'

  const widgetData = useMemo(
    () => ({
      todayMinutesSaved: todayMinutes,
      currentStreak: store.currentStreak,
      totalXP: store.totalXP,
      durationMinutes: store.durationMinutes,
      mascotMessage,
      activeSkin: store.activeSkin,
      accent: theme.accent,
      accentRgb: theme.accentRgb,
    }),
    [
      mascotMessage,
      store.activeSkin,
      store.currentStreak,
      store.durationMinutes,
      store.totalXP,
      theme.accent,
      theme.accentRgb,
      todayMinutes,
    ],
  )

  const nativeBridge = (
    window as typeof window & {
      ReactNativeWebView?: { postMessage: (payload: string) => void }
    }
  ).ReactNativeWebView

  const sendNativeMessage = (type: string, extra: Record<string, unknown> = {}) => {
    nativeBridge?.postMessage(JSON.stringify({ type, ...extra }))
  }

  useEffect(() => {
    sendNativeMessage('SYNC_WIDGET_DATA', { data: widgetData })
  }, [widgetData])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }

  const pinWidget = () => {
    if (!nativeBridge) {
      setShowGuide(true)
      return
    }
    sendNativeMessage('REQUEST_WIDGET_PIN', {
      variant,
      data: widgetData,
    })
    showToast(`${variant === 'compact' ? '1 × 2' : '2 × 4'} widget request sent`)
  }

  const quickLockIn = () => {
    sendNativeMessage('WIDGET_QUICK_START', {
      durationMinutes: store.durationMinutes,
    })
    if (!store.blockedApps?.length) {
      onNavigate('blocked-apps')
      return
    }
    onNavigate('focus')
  }

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
          top: -120,
          right: -110,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${theme.accentRgb}, 0.12), transparent 68%)`,
          pointerEvents: 'none',
        }}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed',
              top: 'max(18px, env(safe-area-inset-top, 18px))',
              left: 20,
              right: 20,
              zIndex: 160,
              padding: '11px 14px',
              borderRadius: 12,
              background: theme.accent,
              boxShadow: `0 10px 35px rgba(${theme.accentRgb}, 0.24)`,
              color: '#080808',
              fontFamily: "'Barlow Condensed'",
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: '0.05em',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: 'max(14px, env(safe-area-inset-top, 14px)) clamp(16px, 4vw, 24px) 8px',
          position: 'relative',
          zIndex: 2,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className="interactive-btn"
            aria-label="Back to settings"
            style={{
              width: 36,
              height: 36,
              border: '1px solid #202025',
              borderRadius: 10,
              background: '#0E0E11',
              color: theme.accent,
              display: 'grid',
              placeItems: 'center',
              fontSize: 17,
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <div>
            <div
              style={{
                color: '#7E7E87',
                fontFamily: "'JetBrains Mono'",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: '0.17em',
                textTransform: 'uppercase',
              }}
            >
              Home screen arsenal
            </div>
            <div
              style={{
                fontFamily: "'Barlow Condensed'",
                fontSize: 'clamp(25px, 3.5vh, 31px)',
                fontWeight: 900,
                lineHeight: 0.95,
                textTransform: 'uppercase',
              }}
            >
              AMOLED Widgets
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 8px',
            border: `1px solid rgba(${theme.accentRgb}, 0.25)`,
            borderRadius: 9,
            background: `rgba(${theme.accentRgb}, 0.07)`,
            color: theme.accent,
            fontFamily: "'JetBrains Mono'",
            fontSize: 7,
            fontWeight: 800,
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
          }}
        >
          <IconAndroid size={12} />
          Android
        </div>
      </header>

      <main
        className="screen-scrollable"
        style={{
          padding: '12px clamp(16px, 4vw, 24px) 22px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <section
          style={{
            padding: 16,
            border: `1px solid rgba(${theme.accentRgb}, 0.18)`,
            borderRadius: 18,
            background: `linear-gradient(145deg, rgba(${theme.accentRgb}, 0.075), #101013 58%)`,
          }}
        >
          <div
            style={{
              color: theme.accent,
              fontFamily: "'JetBrains Mono'",
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
            }}
          >
            Discipline at a glance
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: "'Barlow Condensed'",
              fontSize: 28,
              fontWeight: 900,
              lineHeight: 0.95,
              textTransform: 'uppercase',
            }}
          >
            Lock in before you unlock the scroll.
          </div>
          <div style={{ marginTop: 8, color: '#6C6C75', fontSize: 10, lineHeight: 1.5 }}>
            Live focus stats, streak pressure, mascot accountability, and one-tap session start directly from your Android home screen.
          </div>
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 6,
            marginTop: 13,
            padding: 4,
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
            background: '#0B0B0E',
          }}
        >
          {[
            { id: 'compact' as const, title: '1 × 2', subtitle: 'Quick glance' },
            { id: 'expanded' as const, title: '2 × 4', subtitle: 'Full command' },
          ].map((option) => {
            const selected = variant === option.id
            return (
              <button
                type="button"
                key={option.id}
                onClick={() => setVariant(option.id)}
                className="interactive-btn"
                style={{
                  minHeight: 48,
                  border: selected
                    ? `1px solid rgba(${theme.accentRgb}, 0.3)`
                    : '1px solid transparent',
                  borderRadius: 9,
                  background: selected ? `rgba(${theme.accentRgb}, 0.09)` : 'transparent',
                  color: selected ? theme.accent : '#66666F',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: "'Barlow Condensed'",
                    fontSize: 15,
                    fontWeight: 900,
                  }}
                >
                  {option.title}
                </span>
                <span
                  style={{
                    display: 'block',
                    marginTop: 1,
                    fontFamily: "'JetBrains Mono'",
                    fontSize: 7,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {option.subtitle}
                </span>
              </button>
            )
          })}
        </div>

        <div
          style={{
            marginTop: 13,
            padding: '28px 12px',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 18,
            background:
              'radial-gradient(circle at 22% 18%, rgba(104,104,118,0.12), transparent 24%), linear-gradient(145deg, #18181E, #0D0D11)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.18,
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.32) 1px, transparent 1px)',
              backgroundSize: '19px 19px',
              pointerEvents: 'none',
            }}
          />

          <AnimatePresence mode="wait">
            {variant === 'compact' ? (
              <motion.div
                key="compact"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                style={{
                  width: 'min(100%, 330px)',
                  height: 132,
                  margin: '0 auto',
                  padding: 14,
                  border: `1px solid rgba(${theme.accentRgb}, 0.52)`,
                  borderRadius: 20,
                  background: '#000000',
                  boxShadow: `0 14px 40px rgba(0,0,0,0.48), 0 0 24px rgba(${theme.accentRgb}, 0.1)`,
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: -45,
                    right: -25,
                    width: 130,
                    height: 130,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, rgba(${theme.accentRgb}, 0.14), transparent 68%)`,
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                  <div
                    style={{
                      color: theme.accent,
                      fontFamily: "'Barlow Condensed'",
                      fontSize: 12,
                      fontWeight: 900,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Scrolln't
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#FFB800' }}>
                    <IconFlame size={12} />
                    <span
                      style={{
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 13,
                        fontWeight: 900,
                      }}
                    >
                      {store.currentStreak} days
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 16, position: 'relative' }}>
                  <div>
                    <div
                      style={{
                        color: '#676770',
                        fontFamily: "'JetBrains Mono'",
                        fontSize: 7,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Time saved today
                    </div>
                    <div
                      style={{
                        marginTop: 3,
                        color: theme.accent,
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 31,
                        fontWeight: 900,
                        lineHeight: 0.9,
                      }}
                    >
                      {savedTime}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={quickLockIn}
                    className="interactive-btn"
                    style={{
                      width: 76,
                      height: 35,
                      border: 0,
                      borderRadius: 10,
                      background: theme.accent,
                      color: '#080808',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                      fontFamily: "'Barlow Condensed'",
                      fontSize: 11,
                      fontWeight: 900,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    <IconLock size={12} />
                    Lock in
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                style={{
                  width: 'min(100%, 330px)',
                  minHeight: 235,
                  margin: '0 auto',
                  padding: 16,
                  border: `1px solid rgba(${theme.accentRgb}, 0.5)`,
                  borderRadius: 22,
                  background: '#000000',
                  boxShadow: `0 14px 40px rgba(0,0,0,0.5), 0 0 26px rgba(${theme.accentRgb}, 0.1)`,
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: -50,
                    right: -25,
                    width: 180,
                    height: 180,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, rgba(${theme.accentRgb}, 0.15), transparent 68%)`,
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                  <div>
                    <div
                      style={{
                        color: theme.accent,
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 14,
                        fontWeight: 900,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Scrolln't command
                    </div>
                    <div
                      style={{
                        marginTop: 1,
                        color: '#575760',
                        fontFamily: "'JetBrains Mono'",
                        fontSize: 6,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Discipline status · live
                    </div>
                  </div>
                  <IconShield size={23} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginTop: 15, position: 'relative' }}>
                  <div
                    style={{
                      padding: 10,
                      border: '1px solid rgba(255,255,255,0.065)',
                      borderRadius: 12,
                      background: '#09090C',
                    }}
                  >
                    <div style={{ color: '#575760', fontFamily: "'JetBrains Mono'", fontSize: 6, fontWeight: 700, textTransform: 'uppercase' }}>
                      Time saved
                    </div>
                    <div style={{ marginTop: 4, color: theme.accent, fontFamily: "'Barlow Condensed'", fontSize: 25, fontWeight: 900, lineHeight: 0.9 }}>
                      {savedTime}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: 10,
                      border: '1px solid rgba(255,184,0,0.12)',
                      borderRadius: 12,
                      background: 'rgba(255,184,0,0.035)',
                    }}
                  >
                    <div style={{ color: '#625A42', fontFamily: "'JetBrains Mono'", fontSize: 6, fontWeight: 700, textTransform: 'uppercase' }}>
                      Current streak
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, color: '#FFB800' }}>
                      <IconFlame size={15} />
                      <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 25, fontWeight: 900, lineHeight: 0.9 }}>
                        {store.currentStreak}d
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginTop: 9,
                    padding: 9,
                    border: '1px solid rgba(255,255,255,0.055)',
                    borderRadius: 12,
                    background: '#08080A',
                    position: 'relative',
                  }}
                >
                  <DynamicMoai
                    size={32}
                    state={store.currentStreak > 0 ? 'focusing' : 'idle'}
                    skin={store.activeSkin}
                    interactive={false}
                  />
                  <div
                    style={{
                      color: '#82828A',
                      fontFamily: "'DM Sans'",
                      fontSize: 7,
                      fontWeight: 600,
                      lineHeight: 1.4,
                    }}
                  >
                    “{mascotMessage}”
                  </div>
                </div>

                <button
                  type="button"
                  onClick={quickLockIn}
                  className="interactive-btn"
                  style={{
                    width: '100%',
                    height: 37,
                    marginTop: 9,
                    border: 0,
                    borderRadius: 10,
                    background: theme.accent,
                    color: '#080808',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    fontFamily: "'Barlow Condensed'",
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <IconBolt size={13} />
                  Lock in · {store.durationMinutes} min
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 7,
            marginTop: 12,
          }}
        >
          {[
            { icon: <IconClock size={14} />, value: savedTime, label: 'Saved' },
            { icon: <IconFlame size={14} />, value: `${store.currentStreak}d`, label: 'Streak' },
            { icon: <IconBolt size={14} />, value: store.totalXP.toLocaleString(), label: 'XP' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: '10px 8px',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 11,
                background: '#0E0E11',
                textAlign: 'center',
              }}
            >
              <div style={{ color: theme.accent }}>{stat.icon}</div>
              <div
                style={{
                  marginTop: 3,
                  fontFamily: "'Barlow Condensed'",
                  fontSize: 17,
                  fontWeight: 900,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  marginTop: 2,
                  color: '#55555E',
                  fontFamily: "'JetBrains Mono'",
                  fontSize: 6,
                  fontWeight: 700,
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={pinWidget}
          className="interactive-btn"
          style={{
            width: '100%',
            height: 50,
            marginTop: 12,
            border: 0,
            borderRadius: 14,
            background: theme.accent,
            boxShadow: `0 0 24px rgba(${theme.accentRgb}, 0.16)`,
            color: '#080808',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: "'Barlow Condensed'",
            fontSize: 15,
            fontWeight: 900,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          <IconPhone size={16} />
          Add {variant === 'compact' ? '1 × 2' : '2 × 4'} to home screen
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            marginTop: 10,
            padding: 11,
            border: '1px solid rgba(255,255,255,0.055)',
            borderRadius: 12,
            background: '#0B0B0E',
            color: '#606069',
            fontSize: 9,
            lineHeight: 1.5,
          }}
        >
          <IconCheck size={13} />
          Widget data syncs from your latest focus session. Android may refresh widgets periodically to preserve battery.
        </div>
      </main>

      <BottomNav active="settings" onNavigate={onNavigate} />

      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGuide(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 150,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.section
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 390, damping: 38 }}
              onClick={(event) => event.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 520,
                padding: '10px 20px max(22px, env(safe-area-inset-bottom, 22px))',
                border: `1px solid rgba(${theme.accentRgb}, 0.22)`,
                borderBottom: 0,
                borderRadius: '24px 24px 0 0',
                background: '#121216',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 38,
                  height: 3,
                  margin: '0 auto 18px',
                  borderRadius: 10,
                  background: '#35353C',
                }}
              />
              <div
                style={{
                  color: theme.accent,
                  fontFamily: "'JetBrains Mono'",
                  fontSize: 8,
                  fontWeight: 800,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                }}
              >
                Manual Android setup
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontFamily: "'Barlow Condensed'",
                  fontSize: 27,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                }}
              >
                Add to your home screen
              </div>

              <div style={{ display: 'grid', gap: 8, marginTop: 17 }}>
                {[
                  {
                    title: 'Long-press an empty area',
                    detail: 'Hold anywhere on your Android home screen until the launcher menu appears.',
                  },
                  {
                    title: 'Open the Widgets menu',
                    detail: 'Choose Widgets, then find Scrolln’t in the app list.',
                  },
                  {
                    title: `Drag the ${variant === 'compact' ? '1 × 2' : '2 × 4'} widget`,
                    detail: 'Drop it on your preferred page and resize it if your launcher supports it.',
                  },
                ].map((step, index) => (
                  <div
                    key={step.title}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: 11,
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 12,
                      background: '#0B0B0E',
                    }}
                  >
                    <div
                      style={{
                        width: 25,
                        height: 25,
                        borderRadius: 8,
                        background: theme.accent,
                        color: '#080808',
                        display: 'grid',
                        placeItems: 'center',
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 13,
                        fontWeight: 900,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Barlow Condensed'",
                          fontSize: 14,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                        }}
                      >
                        {step.title}
                      </div>
                      <div style={{ marginTop: 3, color: '#686871', fontSize: 9, lineHeight: 1.5 }}>
                        {step.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="interactive-btn"
                style={{
                  width: '100%',
                  height: 47,
                  marginTop: 15,
                  border: 0,
                  borderRadius: 12,
                  background: theme.accent,
                  color: '#080808',
                  fontFamily: "'Barlow Condensed'",
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Got it
              </button>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
