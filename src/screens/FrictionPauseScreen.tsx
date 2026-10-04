import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Screen } from '../types'
import { useTheme } from '../utils/theme'
import { useAppStore } from '../store/useAppStore'
import { formatAppName } from './BlockedAppsScreen'
import DynamicMoai from '../components/DynamicMoai'
import { IconBlocked, IconBrain, IconLock, IconShield } from '../components/Icons'

interface Props {
  onNavigate: (screen: Screen) => void
  appName?: string
}

const PAUSE_SECONDS = 5

export default function FrictionPauseScreen({
  onNavigate,
  appName = 'com.instagram.android',
}: Props) {
  const theme = useTheme()
  const store = useAppStore()
  const [countdown, setCountdown] = useState(PAUSE_SECONDS)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale')
  const [choiceMade, setChoiceMade] = useState(false)
  const app = useMemo(() => formatAppName(appName), [appName])
  const unlocked = countdown === 0
  const progress = (PAUSE_SECONDS - countdown) / PAUSE_SECONDS
  const circumference = 2 * Math.PI * 112

  useEffect(() => {
    const countdownTimer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(countdownTimer)
          return 0
        }
        return current - 1
      })
    }, 1000)

    const breathingTimer = window.setInterval(() => {
      setBreathPhase((phase) => (phase === 'inhale' ? 'exhale' : 'inhale'))
    }, 2500)

    return () => {
      window.clearInterval(countdownTimer)
      window.clearInterval(breathingTimer)
    }
  }, [])

  const sendNativeMessage = (type: string) => {
    const nativeBridge = (
      window as typeof window & {
        ReactNativeWebView?: { postMessage: (payload: string) => void }
      }
    ).ReactNativeWebView
    nativeBridge?.postMessage(
      JSON.stringify({
        type,
        packageName: appName,
      }),
    )
  }

  const returnToFocus = () => {
    if (choiceMade) return
    setChoiceMade(true)
    sendNativeMessage('CANCEL_FRICTION_OPEN')
    onNavigate('home')
  }

  const openAnyway = () => {
    if (!unlocked || choiceMade) return
    setChoiceMade(true)
    store.recordBlockedAttempt(app.name)
    store.applyAuraPenalty(100)
    sendNativeMessage('ALLOW_APP_ONCE')
    onNavigate('home')
  }

  return (
    <div
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#050505',
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
          background: `radial-gradient(circle at 50% 42%, rgba(${theme.accentRgb}, 0.08), transparent 34%), radial-gradient(circle at 50% 100%, rgba(${theme.accentRgb}, 0.045), transparent 40%)`,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.32,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'linear-gradient(to bottom, black, transparent 76%)',
          pointerEvents: 'none',
        }}
      />

      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: 'max(18px, env(safe-area-inset-top, 18px)) 20px 8px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
          <div
            style={{
              width: 34,
              height: 34,
              border: `1px solid rgba(${theme.accentRgb}, 0.25)`,
              borderRadius: 10,
              background: `rgba(${theme.accentRgb}, 0.07)`,
              color: theme.accent,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <IconBrain size={17} />
          </div>
          <div>
            <div
              style={{
                color: theme.accent,
                fontFamily: "'JetBrains Mono'",
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              Mindful pause
            </div>
            <div
              style={{
                marginTop: 2,
                color: '#65656E',
                fontFamily: "'DM Sans'",
                fontSize: 9,
              }}
            >
              Break the reflex before it becomes a scroll
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 9px',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 9,
            background: '#0D0D10',
            color: '#85858D',
            fontFamily: "'JetBrains Mono'",
            fontSize: 8,
            fontWeight: 700,
          }}
        >
          {app.icon}
          {app.name.toUpperCase()}
        </div>
      </header>

      <main
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 24px 16px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 'clamp(230px, 34vh, 286px)',
            height: 'clamp(230px, 34vh, 286px)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 260 260"
            style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
          >
            <circle
              cx="130"
              cy="130"
              r="112"
              fill="none"
              stroke="#131317"
              strokeWidth="2"
            />
            <motion.circle
              cx="130"
              cy="130"
              r="112"
              fill="none"
              stroke={theme.accent}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: circumference * (1 - progress) }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              style={{
                filter: `drop-shadow(0 0 10px rgba(${theme.accentRgb}, 0.45))`,
              }}
            />
          </svg>

          <motion.div
            animate={{
              scale: breathPhase === 'inhale' ? 1.08 : 0.84,
              opacity: breathPhase === 'inhale' ? 1 : 0.68,
            }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '68%',
              height: '68%',
              border: `1px solid rgba(${theme.accentRgb}, 0.2)`,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(${theme.accentRgb}, 0.13), rgba(${theme.accentRgb}, 0.025) 62%, transparent 70%)`,
              boxShadow: `0 0 60px rgba(${theme.accentRgb}, 0.08), inset 0 0 40px rgba(${theme.accentRgb}, 0.055)`,
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <motion.div
              key={countdown}
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                color: unlocked ? theme.accent : '#F5F5F5',
                fontFamily: "'Barlow Condensed'",
                fontSize: 'clamp(68px, 11vh, 92px)',
                fontWeight: 900,
                lineHeight: 0.82,
                letterSpacing: '-0.03em',
                filter: unlocked
                  ? `drop-shadow(0 0 20px rgba(${theme.accentRgb}, 0.35))`
                  : 'none',
              }}
            >
              {String(countdown).padStart(2, '0')}
            </motion.div>
            <div
              style={{
                marginTop: 12,
                color: theme.accent,
                fontFamily: "'JetBrains Mono'",
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              {unlocked ? 'Choice unlocked' : `${breathPhase} slowly`}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            width: '100%',
            maxWidth: 350,
            marginTop: 8,
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <DynamicMoai size={42} state="zen" skin={store.activeSkin} />
          </div>
          <div
            style={{
              fontFamily: "'Barlow Condensed'",
              fontSize: 'clamp(20px, 3vh, 25px)',
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
            }}
          >
            Tu sach mein zaroori kaam ke liye aaya hai?
          </div>
          <div
            style={{
              marginTop: 8,
              color: '#71717A',
              fontFamily: "'DM Sans'",
              fontSize: 11,
              lineHeight: 1.55,
            }}
          >
            Ya bas muscle memory ne {app.name} khol diya? Five seconds. One honest decision.
          </div>
        </motion.div>
      </main>

      <div
        style={{
          display: 'grid',
          gap: 9,
          padding: '0 20px max(22px, env(safe-area-inset-bottom, 22px))',
          position: 'relative',
          zIndex: 2,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={returnToFocus}
          className="interactive-btn"
          style={{
            width: '100%',
            height: 54,
            border: 0,
            borderRadius: 16,
            background: theme.accent,
            boxShadow: `0 0 28px rgba(${theme.accentRgb}, 0.2)`,
            color: '#080808',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: "'Barlow Condensed'",
            fontSize: 17,
            fontWeight: 900,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          <IconShield size={17} />
          Nahi, mujhe focus karna hai
        </button>

        <button
          type="button"
          onClick={openAnyway}
          disabled={!unlocked || choiceMade}
          className="interactive-btn"
          style={{
            width: '100%',
            height: 47,
            border: unlocked
              ? '1px solid rgba(255,59,48,0.24)'
              : '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14,
            background: unlocked ? 'rgba(255,59,48,0.06)' : '#0B0B0E',
            color: unlocked ? '#C9635D' : '#3E3E45',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            fontFamily: "'Barlow Condensed'",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '0.05em',
            cursor: unlocked ? 'pointer' : 'not-allowed',
          }}
        >
          {unlocked ? <IconBlocked size={14} /> : <IconLock size={14} />}
          {unlocked ? 'Open anyway · Aura -100' : `Choice unlocks in ${countdown}s`}
        </button>
      </div>
    </div>
  )
}
