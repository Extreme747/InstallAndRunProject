import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Screen } from '../types'
import { useTheme } from '../utils/theme'
import { useAppStore } from '../store/useAppStore'
import {
  IconAlert,
  IconBrain,
  IconCheck,
  IconGorilla,
  IconLock,
  IconShield,
  IconSkull,
} from '../components/Icons'

interface Props {
  onNavigate: (screen: Screen) => void
}

type UnlockMode = 'math' | 'squats' | 'penalty'

const MATH_QUESTIONS = [
  {
    label: 'Derivative protocol',
    prompt: 'd/dx (3x² + 5x)',
    helper: 'Differentiate each term with respect to x.',
    answers: ['6x+5', '6*x+5'],
  },
  {
    label: 'Mental arithmetic',
    prompt: '17 × 6 − 23',
    helper: 'No calculator. Your brain requested this exit.',
    answers: ['79'],
  },
  {
    label: 'Final checksum',
    prompt: '√144 + (7 × 3)',
    helper: 'One clean answer unlocks the protocol.',
    answers: ['33'],
  },
]

function normalizeAnswer(value: string) {
  return value.toLowerCase().replace(/\s+/g, '').replace(/−/g, '-')
}

export default function EmergencyUnlockScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  const [mode, setMode] = useState<UnlockMode>('math')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [mathComplete, setMathComplete] = useState(false)
  const [squatCount, setSquatCount] = useState(0)
  const [squatTracking, setSquatTracking] = useState(false)
  const [paymentPending, setPaymentPending] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const activeSession = useMemo(() => {
    try {
      const saved = localStorage.getItem('@scrollnt_active_focus_session')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }, [])

  const currentQuestion = MATH_QUESTIONS[questionIndex]
  const unlockReady = mathComplete || squatCount >= 20 || paymentComplete

  const sendNativeMessage = (type: string, extra: Record<string, unknown> = {}) => {
    const nativeBridge = (
      window as typeof window & {
        ReactNativeWebView?: { postMessage: (payload: string) => void }
      }
    ).ReactNativeWebView
    nativeBridge?.postMessage(JSON.stringify({ type, ...extra }))
  }

  useEffect(() => {
    if (activeSession?.targetEndTime) {
      store.setBlockingActive(true, activeSession.targetEndTime)
      store.sendFocusHeartbeat(true, activeSession.durationMinutes)
    }

    const updateSquats = (payload: unknown) => {
      const detail =
        (payload as { detail?: { count?: number } })?.detail ||
        (payload as { count?: number })
      if (typeof detail?.count === 'number') {
        setSquatCount(Math.min(20, Math.max(0, Math.round(detail.count))))
      }
    }

    const completePayment = () => {
      setPaymentPending(false)
      setPaymentComplete(true)
    }

    const handleSquatEvent = (event: Event) => updateSquats(event as CustomEvent)
    const handlePaymentEvent = () => completePayment()

    ;(window as any).__onSquatRepUpdated = updateSquats
    ;(window as any).__onPenaltyPaymentCompleted = completePayment
    window.addEventListener('squatRepUpdated', handleSquatEvent)
    window.addEventListener('penaltyPaymentCompleted', handlePaymentEvent)

    return () => {
      delete (window as any).__onSquatRepUpdated
      delete (window as any).__onPenaltyPaymentCompleted
      window.removeEventListener('squatRepUpdated', handleSquatEvent)
      window.removeEventListener('penaltyPaymentCompleted', handlePaymentEvent)
      sendNativeMessage('STOP_SQUAT_CHALLENGE')
    }
  }, [])

  const submitMathAnswer = () => {
    if (!answer.trim() || mathComplete) return
    const normalized = normalizeAnswer(answer)
    const isCorrect = currentQuestion.answers.some(
      (expected) => normalizeAnswer(expected) === normalized,
    )

    if (!isCorrect) {
      setWrongAttempts((attempts) => attempts + 1)
      setAnswer('')
      return
    }

    if (questionIndex === MATH_QUESTIONS.length - 1) {
      setMathComplete(true)
      setAnswer('')
      return
    }

    setQuestionIndex((index) => index + 1)
    setAnswer('')
  }

  const startSquatChallenge = () => {
    setSquatTracking(true)
    sendNativeMessage('START_SQUAT_CHALLENGE', { targetReps: 20 })
  }

  const startPenaltyPayment = () => {
    setPaymentPending(true)
    sendNativeMessage('START_PENALTY_PAYMENT', {
      amount: 50,
      currency: 'INR',
      destination: 'SQUAD_GOAL_POOL',
    })
  }

  const cancelUnlock = () => {
    sendNativeMessage('CANCEL_EMERGENCY_UNLOCK')
    onNavigate(activeSession ? 'focus' : 'home')
  }

  const completeEmergencyUnlock = () => {
    if (!unlockReady || isExiting) return
    setIsExiting(true)
    try {
      localStorage.removeItem('@scrollnt_active_focus_session')
    } catch {}
    store.setBlockingActive(false, 0)
    store.sendFocusHeartbeat(false)
    store.addFailedSession('Focus Session')
    sendNativeMessage('EMERGENCY_UNLOCK_APPROVED', {
      method: mathComplete ? 'math' : paymentComplete ? 'penalty' : 'squats',
    })
    onNavigate('error')
  }

  return (
    <div
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: '#070707',
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
          background:
            'radial-gradient(circle at 50% 0%, rgba(255,59,48,0.12), transparent 34%), radial-gradient(circle at 50% 100%, rgba(255,59,48,0.05), transparent 42%)',
          pointerEvents: 'none',
        }}
      />

      <header
        style={{
          padding: 'max(18px, env(safe-area-inset-top, 18px)) 20px 10px',
          position: 'relative',
          zIndex: 2,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <button
            type="button"
            onClick={cancelUnlock}
            className="interactive-btn"
            aria-label="Cancel emergency unlock"
            style={{
              width: 36,
              height: 36,
              border: '1px solid #27272D',
              borderRadius: 10,
              background: '#101013',
              color: '#92929A',
              display: 'grid',
              placeItems: 'center',
              fontSize: 17,
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 9px',
              border: '1px solid rgba(255,59,48,0.24)',
              borderRadius: 9,
              background: 'rgba(255,59,48,0.07)',
              color: '#FF6259',
              fontFamily: "'JetBrains Mono'",
              fontSize: 7,
              fontWeight: 900,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            <IconLock size={11} />
            Session remains locked
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              color: '#FF6259',
              fontFamily: "'JetBrains Mono'",
              fontSize: 8,
              fontWeight: 900,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            <IconAlert size={14} />
            Emergency exit requested
          </div>
          <div
            style={{
              marginTop: 6,
              maxWidth: 340,
              fontFamily: "'Barlow Condensed'",
              fontSize: 'clamp(31px, 5vh, 42px)',
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            Prove you actually need out.
          </div>
          <div style={{ marginTop: 9, maxWidth: 340, color: '#6F6F78', fontSize: 10, lineHeight: 1.55 }}>
            Scrolln't has no easy exit. Complete one protocol or return to your focus session.
          </div>
        </div>
      </header>

      <main
        className="screen-scrollable"
        style={{
          padding: '10px 20px 18px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 6,
            padding: 4,
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 13,
            background: '#0B0B0E',
          }}
        >
          {[
            { id: 'math' as const, label: 'Math', icon: <IconBrain size={14} /> },
            { id: 'squats' as const, label: 'Squats', icon: <IconGorilla size={14} /> },
            { id: 'penalty' as const, label: '₹50 stake', icon: <IconShield size={14} /> },
          ].map((item) => {
            const active = mode === item.id
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setMode(item.id)}
                className="interactive-btn"
                style={{
                  height: 42,
                  border: active ? '1px solid rgba(255,59,48,0.28)' : '1px solid transparent',
                  borderRadius: 10,
                  background: active ? 'rgba(255,59,48,0.09)' : 'transparent',
                  color: active ? '#FF6259' : '#65656E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontFamily: "'Barlow Condensed'",
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {item.icon}
                {item.label}
              </button>
            )
          })}
        </div>

        {mode === 'math' && (
          <motion.section
            key="math"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ marginTop: 14 }}
          >
            <div
              style={{
                padding: 17,
                border: mathComplete
                  ? `1px solid rgba(${theme.accentRgb}, 0.32)`
                  : '1px solid rgba(255,255,255,0.075)',
                borderRadius: 18,
                background: mathComplete
                  ? `linear-gradient(145deg, rgba(${theme.accentRgb}, 0.08), #101013 62%)`
                  : '#101013',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div
                  style={{
                    color: mathComplete ? theme.accent : '#74747D',
                    fontFamily: "'JetBrains Mono'",
                    fontSize: 8,
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  {mathComplete
                    ? 'Cognitive proof accepted'
                    : `Question ${questionIndex + 1} of ${MATH_QUESTIONS.length}`}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {MATH_QUESTIONS.map((_, index) => (
                    <span
                      key={index}
                      style={{
                        width: 19,
                        height: 4,
                        borderRadius: 8,
                        background:
                          mathComplete || index < questionIndex
                            ? theme.accent
                            : index === questionIndex
                              ? '#FF6259'
                              : '#29292F',
                      }}
                    />
                  ))}
                </div>
              </div>

              {mathComplete ? (
                <div
                  style={{
                    display: 'grid',
                    justifyItems: 'center',
                    gap: 9,
                    padding: '38px 10px 30px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      border: `1px solid rgba(${theme.accentRgb}, 0.3)`,
                      borderRadius: '50%',
                      background: `rgba(${theme.accentRgb}, 0.1)`,
                      color: theme.accent,
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: `0 0 28px rgba(${theme.accentRgb}, 0.12)`,
                    }}
                  >
                    <IconCheck size={27} />
                  </div>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed'",
                      fontSize: 24,
                      fontWeight: 900,
                      textTransform: 'uppercase',
                    }}
                  >
                    Brain is online
                  </div>
                  <div style={{ color: '#6E6E77', fontSize: 10 }}>
                    Emergency unlock authorization is ready.
                  </div>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      minHeight: 164,
                      marginTop: 13,
                      border: '1px solid rgba(255,255,255,0.055)',
                      borderRadius: 14,
                      background: '#09090C',
                      textAlign: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: '#696972',
                          fontFamily: "'JetBrains Mono'",
                          fontSize: 8,
                          fontWeight: 700,
                          letterSpacing: '0.11em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {currentQuestion.label}
                      </div>
                      <div
                        style={{
                          marginTop: 13,
                          fontFamily: "'JetBrains Mono'",
                          fontSize: 'clamp(25px, 5vh, 36px)',
                          fontWeight: 800,
                          letterSpacing: '-0.03em',
                        }}
                      >
                        {currentQuestion.prompt}
                      </div>
                      <div style={{ marginTop: 11, color: '#505059', fontSize: 9 }}>
                        {currentQuestion.helper}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, marginTop: 11 }}>
                    <input
                      type="text"
                      inputMode={questionIndex === 0 ? 'text' : 'numeric'}
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') submitMathAnswer()
                      }}
                      placeholder="Type your answer"
                      autoComplete="off"
                      style={{
                        minWidth: 0,
                        height: 48,
                        padding: '0 14px',
                        border: wrongAttempts
                          ? '1px solid rgba(255,59,48,0.3)'
                          : '1px solid #29292F',
                        borderRadius: 12,
                        outline: 0,
                        background: '#0B0B0E',
                        color: '#F5F5F5',
                        fontFamily: "'JetBrains Mono'",
                        fontSize: 13,
                        fontWeight: 700,
                        userSelect: 'text',
                      }}
                    />
                    <button
                      type="button"
                      onClick={submitMathAnswer}
                      className="interactive-btn"
                      style={{
                        height: 48,
                        padding: '0 17px',
                        border: 0,
                        borderRadius: 12,
                        background: '#FF6259',
                        color: '#110504',
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 13,
                        fontWeight: 900,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      Verify
                    </button>
                  </div>
                  <div style={{ minHeight: 18, marginTop: 6, color: '#A34D48', fontSize: 9 }}>
                    {wrongAttempts > 0
                      ? `Incorrect attempt${wrongAttempts > 1 ? 's' : ''}: ${wrongAttempts}. Reset and think.`
                      : ''}
                  </div>
                </>
              )}
            </div>
          </motion.section>
        )}

        {mode === 'squats' && (
          <motion.section
            key="squats"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              display: 'grid',
              justifyItems: 'center',
              marginTop: 14,
              padding: '24px 18px 20px',
              border: squatCount >= 20
                ? `1px solid rgba(${theme.accentRgb}, 0.3)`
                : '1px solid rgba(255,255,255,0.075)',
              borderRadius: 18,
              background: '#101013',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 174,
                height: 174,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <svg width="174" height="174" viewBox="0 0 174 174" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                <circle cx="87" cy="87" r="76" fill="none" stroke="#242429" strokeWidth="8" />
                <motion.circle
                  cx="87"
                  cy="87"
                  r="76"
                  fill="none"
                  stroke={squatCount >= 20 ? theme.accent : '#FF6259'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 76}
                  animate={{ strokeDashoffset: 2 * Math.PI * 76 * (1 - squatCount / 20) }}
                />
              </svg>
              <div>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed'",
                    fontSize: 53,
                    fontWeight: 900,
                    lineHeight: 0.85,
                  }}
                >
                  {squatCount}
                  <span style={{ color: '#5F5F68', fontSize: 22 }}>/20</span>
                </div>
                <div
                  style={{
                    marginTop: 9,
                    color: squatCount >= 20 ? theme.accent : '#FF6259',
                    fontFamily: "'JetBrains Mono'",
                    fontSize: 8,
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  {squatCount >= 20 ? 'Target complete' : 'Squats detected'}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                fontFamily: "'Barlow Condensed'",
                fontSize: 24,
                fontWeight: 900,
                textTransform: 'uppercase',
              }}
            >
              Earn the exit physically
            </div>
            <div style={{ maxWidth: 290, marginTop: 7, color: '#686871', fontSize: 10, lineHeight: 1.55 }}>
              Keep the phone secure and complete 20 controlled squats. Accelerometer tracking counts clean reps.
            </div>

            {squatCount < 20 && (
              <button
                type="button"
                onClick={startSquatChallenge}
                disabled={squatTracking}
                className="interactive-btn"
                style={{
                  width: '100%',
                  height: 48,
                  marginTop: 19,
                  border: '1px solid rgba(255,59,48,0.28)',
                  borderRadius: 12,
                  background: squatTracking ? 'rgba(255,59,48,0.06)' : '#FF6259',
                  color: squatTracking ? '#FF6259' : '#110504',
                  fontFamily: "'Barlow Condensed'",
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  cursor: squatTracking ? 'default' : 'pointer',
                }}
              >
                {squatTracking ? 'Tracking reps…' : 'Start rep tracking'}
              </button>
            )}
          </motion.section>
        )}

        {mode === 'penalty' && (
          <motion.section
            key="penalty"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              display: 'grid',
              justifyItems: 'center',
              marginTop: 14,
              padding: '26px 18px 21px',
              border: paymentComplete
                ? `1px solid rgba(${theme.accentRgb}, 0.3)`
                : '1px solid rgba(255,184,0,0.2)',
              borderRadius: 18,
              background: paymentComplete
                ? `linear-gradient(145deg, rgba(${theme.accentRgb}, 0.07), #101013 62%)`
                : 'linear-gradient(145deg, rgba(255,184,0,0.055), #101013 62%)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                border: paymentComplete
                  ? `1px solid rgba(${theme.accentRgb}, 0.3)`
                  : '1px solid rgba(255,184,0,0.25)',
                borderRadius: 18,
                background: paymentComplete
                  ? `rgba(${theme.accentRgb}, 0.09)`
                  : 'rgba(255,184,0,0.08)',
                color: paymentComplete ? theme.accent : '#FFB800',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {paymentComplete ? <IconCheck size={28} /> : <IconShield size={28} />}
            </div>
            <div
              style={{
                marginTop: 16,
                color: paymentComplete ? theme.accent : '#FFB800',
                fontFamily: "'Barlow Condensed'",
                fontSize: 40,
                fontWeight: 900,
                lineHeight: 0.9,
              }}
            >
              ₹50
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: "'Barlow Condensed'",
                fontSize: 21,
                fontWeight: 900,
                textTransform: 'uppercase',
              }}
            >
              {paymentComplete ? 'Stake deposited' : 'Put real stakes on quitting'}
            </div>
            <div style={{ maxWidth: 292, marginTop: 8, color: '#6A6A73', fontSize: 10, lineHeight: 1.55 }}>
              The penalty goes to your Squad Goal Pool. Emergency exits should cost more than a weak impulse.
            </div>

            {!paymentComplete && (
              <button
                type="button"
                onClick={startPenaltyPayment}
                disabled={paymentPending}
                className="interactive-btn"
                style={{
                  width: '100%',
                  height: 48,
                  marginTop: 19,
                  border: paymentPending ? '1px solid rgba(255,184,0,0.25)' : 0,
                  borderRadius: 12,
                  background: paymentPending ? 'rgba(255,184,0,0.06)' : '#FFB800',
                  color: paymentPending ? '#FFB800' : '#100B00',
                  fontFamily: "'Barlow Condensed'",
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  cursor: paymentPending ? 'default' : 'pointer',
                }}
              >
                {paymentPending ? 'Waiting for payment…' : 'Deposit ₹50 & unlock'}
              </button>
            )}
          </motion.section>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 9,
            marginTop: 12,
            padding: 12,
            border: '1px solid rgba(255,255,255,0.055)',
            borderRadius: 13,
            background: '#0B0B0E',
            color: '#62626B',
            fontSize: 9,
            lineHeight: 1.5,
          }}
        >
          <IconSkull size={14} />
          Emergency unlock ends the current focus session and applies the normal failed-session consequences.
        </div>
      </main>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: unlockReady ? '0.8fr 1.5fr' : '1fr',
          gap: 9,
          padding: '0 20px max(22px, env(safe-area-inset-bottom, 22px))',
          position: 'relative',
          zIndex: 2,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={cancelUnlock}
          className="interactive-btn"
          style={{
            height: 50,
            border: `1px solid rgba(${theme.accentRgb}, 0.25)`,
            borderRadius: 14,
            background: `rgba(${theme.accentRgb}, 0.07)`,
            color: theme.accent,
            fontFamily: "'Barlow Condensed'",
            fontSize: 14,
            fontWeight: 900,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Stay locked in
        </button>
        {unlockReady && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={completeEmergencyUnlock}
            className="interactive-btn"
            style={{
              height: 50,
              border: 0,
              borderRadius: 14,
              background: '#FF6259',
              boxShadow: '0 0 25px rgba(255,59,48,0.18)',
              color: '#110504',
              fontFamily: "'Barlow Condensed'",
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Confirm emergency unlock
          </motion.button>
        )}
      </div>
    </div>
  )
}
