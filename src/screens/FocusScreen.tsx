import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../utils/theme'
import type { Screen } from '../types'
import { useAppStore } from '../store/useAppStore'
import { getRandomRoast, Roast } from '../data/moaiRoasts'
import { startFocusRoastInterval, stopFocusRoastInterval, sendRoastNotification } from '../utils/roastNotifier'
import { formatAppName } from './BlockedAppsScreen'
import {
  IconFlame,
  IconShield,
  IconBlocked,
  IconSkull,
  getMascotComponent,
} from '../components/Icons'
import DynamicMoai from '../components/DynamicMoai'
import FocusAudioConsole from '../components/FocusAudioConsole'
import GiveUpConfirmationModal from '../components/GiveUpConfirmationModal'

interface Props {
  onNavigate: (screen: Screen) => void
  durationMinutes?: number
}

export default function FocusScreen({ onNavigate, durationMinutes }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  const storeDuration = store.durationMinutes
  const addCompletedSession = store.addCompletedSession
  const addFailedSession = store.addFailedSession
  const currentStreak = store.currentStreak
  const distractionCount = store.distractionCount
  const blockedApps = store.blockedApps || []
  const activeSkin = store.activeSkin
  const setBlockingActive = store.setBlockingActive

  const effectiveDuration = durationMinutes || storeDuration
  const totalSeconds = effectiveDuration * 60
  const isHardcore = store.settings?.hardcoreMode
  const roastLang = store.settings?.roastLanguage || 'hinglish'
  const isSquadMode = (store.focusMode === 'squad') && !!store.squadCode
  const squadDisplayName = store.squadName || 'Squad'

  const SESSION_KEY = '@scrollnt_active_focus_session'

  const [showGiveUpModal, setShowGiveUpModal] = useState(false)
  const [isPaused, setIsPaused] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return Boolean(parsed.isPaused)
      }
    } catch (e) {}
    return false
  })

  const [targetEndTime, setTargetEndTime] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.isPaused && typeof parsed.secondsLeft === 'number') {
          return Date.now() + parsed.secondsLeft * 1000
        }
        if (parsed.targetEndTime && parsed.targetEndTime > Date.now()) {
          return parsed.targetEndTime
        }
      }
    } catch (e) {}
    const newTarget = Date.now() + totalSeconds * 1000
    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          startTime: Date.now(),
          targetEndTime: newTarget,
          durationMinutes: effectiveDuration,
          isPaused: false,
          secondsLeft: totalSeconds,
        })
      )
    } catch (e) {}
    return newTarget
  })

  const [secondsLeft, setSecondsLeft] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.isPaused && typeof parsed.secondsLeft === 'number') {
          return parsed.secondsLeft
        }
      }
    } catch (e) {}
    return Math.max(0, Math.round((targetEndTime - Date.now()) / 1000))
  })
  const [isZenMode, setIsZenMode] = useState(false)
  const [currentRoast, setCurrentRoast] = useState<Roast>(() => getRandomRoast('mid_session', roastLang))
  const [blockedAlert, setBlockedAlert] = useState<string | null>(null)

  const requestSessionExit = useCallback(() => {
    if (isHardcore) {
      onNavigate('emergency-unlock')
      return
    }
    setShowGiveUpModal(true)
  }, [isHardcore, onNavigate])

  // Turn on active native blocker, keep screen awake & notification interval on mount
  useEffect(() => {
    if (!isPaused) {
      setBlockingActive(true, targetEndTime)
      startFocusRoastInterval(effectiveDuration)
      store.sendFocusHeartbeat(true, effectiveDuration)
    } else {
      setBlockingActive(false, 0)
      store.sendFocusHeartbeat(false)
    }
    const currentApps = store.blockedApps || []
    if (currentApps.length > 0) {
      store.setBlockedApps(currentApps)
    }

    // Keep screen awake during active focus session
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
      (window as any).ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'SET_KEEP_SCREEN_ON', enabled: !isPaused })
      )
    }

    // Rotate live savage roast every 12 seconds
    const roastInterval = setInterval(() => {
      const currentLang = useAppStore.getState().settings?.roastLanguage || 'hinglish'
      setCurrentRoast(getRandomRoast('mid_session', currentLang))
    }, 12000)

    // Handle native blocked app detected event
    const handleBlockedApp = (e: any) => {
      const pkg = e.detail?.packageName || ''
      const appMeta = formatAppName(pkg)
      const appDisplayName = appMeta.name || pkg.split('.').pop()?.toUpperCase() || 'App'
      const currentLang = useAppStore.getState().settings?.roastLanguage || 'hinglish'

      // Record the real intercepted app in store
      store.recordBlockedAttempt(appDisplayName)

      const roast = getRandomRoast('attempt', currentLang)
      setBlockedAlert(`${appDisplayName.toUpperCase()} BLOCKED! ${roast.text}`)
      setTimeout(() => setBlockedAlert(null), 4500)
    }
    const handleBackAttempt = requestSessionExit
    window.addEventListener('blockedAppDetected', handleBlockedApp)
    window.addEventListener('focusBackAttempt', handleBackAttempt)

    return () => {
      setBlockingActive(false, 0)
      stopFocusRoastInterval()
      store.sendFocusHeartbeat(false)
      clearInterval(roastInterval)
      window.removeEventListener('blockedAppDetected', handleBlockedApp)
      window.removeEventListener('focusBackAttempt', handleBackAttempt)

      // Restore screen off timeout
      if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
        (window as any).ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'SET_KEEP_SCREEN_ON', enabled: false })
        )
      }
    }
  }, [setBlockingActive, effectiveDuration, isPaused, targetEndTime, requestSessionExit])

  // Complete session helper with duplicate execution guard
  const completedRef = useRef(false)
  const handleSessionComplete = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch (e) {}
    setBlockingActive(false, 0)
    stopFocusRoastInterval()
    store.sendFocusHeartbeat(false)
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
      (window as any).ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'SET_KEEP_SCREEN_ON', enabled: false })
      )
    }
    const currentLang = useAppStore.getState().settings?.roastLanguage || 'hinglish'
    sendRoastNotification(undefined, 'victory', currentLang)
    addCompletedSession(effectiveDuration)
    onNavigate('success')
  }, [effectiveDuration, addCompletedSession, onNavigate, setBlockingActive])

  // Wall-clock synced timer interval & background/sleep resume handler
  useEffect(() => {
    if (isPaused) return

    const tick = () => {
      const remaining = Math.max(0, Math.round((targetEndTime - Date.now()) / 1000))
      setSecondsLeft(remaining)
      if (remaining <= 0) {
        handleSessionComplete()
      }
    }

    // Run tick immediately on effect and resume
    tick()

    const id = setInterval(tick, 500)

    const handleResume = () => {
      tick()
    }

    document.addEventListener('visibilitychange', handleResume)
    window.addEventListener('focus', handleResume)
    window.addEventListener('pageshow', handleResume)
    window.addEventListener('appResumed', handleResume)
    ;(window as any).__onAppResume = handleResume

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', handleResume)
      window.removeEventListener('focus', handleResume)
      window.removeEventListener('pageshow', handleResume)
      window.removeEventListener('appResumed', handleResume)
      delete (window as any).__onAppResume
    }
  }, [isPaused, targetEndTime, effectiveDuration, onNavigate, handleSessionComplete])

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  const progress = 1 - secondsLeft / totalSeconds
  const pct = Math.round(progress * 100)

  const r = 104
  const circ = 2 * Math.PI * r
  const dashoffset = circ * (1 - progress)

  const confirmGiveUp = () => {
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch (e) {}
    setBlockingActive(false, 0)
    stopFocusRoastInterval()
    store.sendFocusHeartbeat(false)
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
      ;(window as any).ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'SET_KEEP_SCREEN_ON', enabled: false }),
      )
    }
    setShowGiveUpModal(false)
    const currentLang = useAppStore.getState().settings?.roastLanguage || 'hinglish'
    sendRoastNotification(undefined, 'failed', currentLang)
    addFailedSession('Focus Session')
    onNavigate('error')
  }

  return (
    <div
      onTouchStartCapture={() => {
        const remaining = Math.max(0, Math.round((targetEndTime - Date.now()) / 1000))
        setSecondsLeft(remaining)
        if (remaining <= 0) {
          handleSessionComplete()
        }
      }}
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: theme.bg,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top bar with back button & Zen Mode toggle */}
      <div
        className="zen-transition"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'max(12px, env(safe-area-inset-top, 12px)) clamp(16px, 4vw, 24px) 10px',
          borderBottom: '1px solid #101010',
          flexShrink: 0,
          opacity: isZenMode ? 0 : 1,
          pointerEvents: isZenMode ? 'none' : 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={requestSessionExit}
            className="interactive-btn"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: '#0E0E0E',
              border: '1px solid #1E1E1E',
              color: theme.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: theme.accent,
              animation: 'pulse-glow 1.5s ease-in-out infinite',
              boxShadow: `0 0 8px rgba(${theme.accentRgb}, 0.6)`,
            }}
          />
          <span
            style={{
              fontFamily: "'Barlow Condensed'",
              fontWeight: 800,
              fontSize: 15,
              color: '#888',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            FOCUS ACTIVE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setIsZenMode(true)}
            className="interactive-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: `rgba(${theme.accentRgb}, 0.1)`,
              border: `1px solid rgba(${theme.accentRgb}, 0.3)`,
              borderRadius: 20,
              padding: '4px 10px',
              fontFamily: "'Barlow Condensed'",
              fontWeight: 800,
              fontSize: 12,
              color: theme.accent,
              letterSpacing: '0.04em',
              cursor: 'pointer',
            }}
          >
            <span>✦</span> ZEN MODE
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'rgba(255,184,0,0.1)',
              border: '1px solid rgba(255,184,0,0.2)',
              borderRadius: 20,
              padding: '4px 10px',
            }}
          >
            <IconFlame size={14} color="#FFB800" />
            <span
              style={{
                fontFamily: "'Barlow Condensed'",
                fontWeight: 800,
                fontSize: 15,
                color: '#FFB800',
              }}
            >
              {currentStreak}
            </span>
          </div>
        </div>
      </div>

      <FocusAudioConsole theme={theme} hidden={isZenMode || showGiveUpModal} />

      {/* Blocked App Alert Toast */}
      {blockedAlert && (
        <div
          className="animate-glitch animate-scale-bounce"
          style={{
            position: 'absolute',
            top: 'max(60px, calc(env(safe-area-inset-top, 16px) + 48px))',
            left: 20,
            right: 20,
            background: '#FF3B30',
            color: '#FFFFFF',
            padding: '10px 14px',
            borderRadius: 12,
            fontFamily: "'Barlow Condensed'",
            fontWeight: 800,
            fontSize: 15,
            textAlign: 'center',
            zIndex: 999,
            boxShadow: '0 8px 30px rgba(255,59,48,0.6)',
          }}
        >
          {blockedAlert}
        </div>
      )}

      {/* Zen Mode Exit Hint Bar */}
      {isZenMode && (
        <div
          onClick={() => setIsZenMode(false)}
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: 'max(14px, env(safe-area-inset-top, 14px))',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(20,20,20,0.7)',
            border: '1px solid #333',
            borderRadius: 20,
            padding: '5px 14px',
            zIndex: 50,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.accent, boxShadow: `0 0 6px ${theme.accent}` }} />
          <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 12, color: '#AAA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ZEN MODE · TAP SCREEN TO EXIT
          </span>
        </div>
      )}

      {/* Timer + ring area */}
      <div
        onClick={() => {
          if (isZenMode) setIsZenMode(false)
        }}
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          padding: '46px clamp(16px, 4vw, 24px) 8px',
          width: '100%',
          cursor: isZenMode ? 'pointer' : 'default',
        }}
      >
        {/* Dynamic Glowing Squad Lock-in Banner */}
        {isSquadMode && (
          <div
            className="zen-transition animate-fade-up"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: `linear-gradient(135deg, rgba(${theme.accentRgb}, 0.14), rgba(96,165,250,0.1))`,
              border: `1px solid rgba(${theme.accentRgb}, 0.4)`,
              boxShadow: `0 0 16px rgba(${theme.accentRgb}, 0.18)`,
              borderRadius: 14,
              padding: '6px 12px',
              flexShrink: 0,
              opacity: isZenMode ? 0 : 1,
              pointerEvents: isZenMode ? 'none' : 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
              <span style={{ fontSize: 15 }}>🛡️</span>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed'",
                    fontWeight: 900,
                    fontSize: 14,
                    color: theme.accent,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {squadDisplayName} · SQUAD LOCK-IN
                </div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#A0A0AA' }}>
                  Live grinding with {Math.max(1, store.squadMembers?.length ?? 0)} members
                </div>
              </div>
            </div>
            <span
              style={{
                fontFamily: "'Barlow Condensed'",
                fontWeight: 900,
                fontSize: 11,
                color: '#080808',
                background: theme.accent,
                borderRadius: 6,
                padding: '2px 6px',
                letterSpacing: '0.05em',
                flexShrink: 0,
              }}
            >
              1.5X XP
            </span>
          </div>
        )}

        <div
          style={{
            position: 'relative',
            width: 'clamp(210px, 30vh, 260px)',
            height: 'clamp(210px, 30vh, 260px)',
            transform: isZenMode ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 280 280" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="140" cy="140" r={r} fill="none" stroke="#111" strokeWidth="6" />
            <circle
              cx="140"
              cy="140"
              r={r}
              fill="none"
              stroke={theme.accent}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dashoffset}
              style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 16px rgba(${theme.accentRgb}, 0.7))` }}
            />
          </svg>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            {/* Dynamic Interactive Moai */}
            <div style={{ marginBottom: 2 }}>
              <DynamicMoai
                size={48}
                state={blockedAlert ? 'blocked_rage' : (isZenMode ? 'zen' : 'focusing')}
                skin={activeSkin}
                interactive={true}
              />
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono'",
                fontWeight: 800,
                fontSize: 'clamp(36px, 5.5vh, 48px)',
                color: theme.accent,
                letterSpacing: '-2px',
                lineHeight: 1,
                filter: `drop-shadow(0 0 20px rgba(${theme.accentRgb}, 0.35))`,
              }}
            >
              {formatted}
            </div>
            <div
              style={{
                fontFamily: "'DM Sans'",
                fontSize: 10,
                color: '#7E7E87',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: 2,
              }}
            >
              {pct}% complete
            </div>
          </div>
        </div>

        {/* Live Squad Teammates grinding bar */}
        {isSquadMode && (store.squadMembers?.length ?? 0) > 0 && (
          <div
            className="zen-transition"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              justifyContent: 'center',
              flexWrap: 'wrap',
              width: '100%',
              marginBlock: 2,
              opacity: isZenMode ? 0 : 1,
              pointerEvents: isZenMode ? 'none' : 'auto',
            }}
          >
            {store.squadMembers.slice(0, 5).map((m: any, idx: number) => {
              const isMe = m.id === store.userId || (!store.userId && idx === 0);
              const memberName = isMe ? (store.userName || 'You') : (m.displayName || m.userName || 'Teammate');
              const isFocusing = isMe || m.isFocusing || m.status === 'focusing';
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: isFocusing ? `rgba(${theme.accentRgb}, 0.08)` : '#0E0E0E',
                    border: `1px solid ${isFocusing ? `rgba(${theme.accentRgb}, 0.35)` : '#1E1E1E'}`,
                    borderRadius: 20,
                    padding: '3px 8px 3px 4px',
                  }}
                >
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#181818', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getMascotComponent(isMe ? (store.activeSkin || 'moai') : (m.skin || 'moai'), 13)}
                  </div>
                  <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 11, color: isFocusing ? theme.accent : '#7E7E87', textTransform: 'uppercase' }}>
                    {memberName.slice(0, 6)}{isMe && ' (You)'}
                  </span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: isFocusing ? theme.accent : '#555', boxShadow: isFocusing ? `0 0 6px ${theme.accent}` : 'none' }} />
                </div>
              );
            })}
          </div>
        )}

        {/* Live Savage Moai Roast Speech Bubble */}
        <div
          className="zen-transition animate-roast-punch"
          style={{
            width: '100%',
            background: `rgba(${theme.accentRgb}, 0.06)`,
            border: `1px solid rgba(${theme.accentRgb}, 0.25)`,
            borderRadius: 14,
            padding: '8px 14px',
            textAlign: 'center',
            opacity: isZenMode ? 0 : 1,
            pointerEvents: isZenMode ? 'none' : 'auto',
          }}
        >
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 'clamp(13px, 1.9vh, 15px)', color: theme.accent, letterSpacing: '0.02em' }}>
            {currentRoast.text}
          </div>
          {currentRoast.subText && (
            <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87', marginTop: 2 }}>
              {currentRoast.subText}
            </div>
          )}
        </div>

        {/* Distractions & Shield Bar */}
        <div
          className="zen-transition"
          style={{
            display: 'flex',
            gap: 8,
            width: '100%',
            opacity: isZenMode ? 0 : 1,
            pointerEvents: isZenMode ? 'none' : 'auto',
          }}
        >
          <button
            onClick={() => onNavigate('distraction-report')}
            className="interactive-btn"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: 'rgba(255,59,48,0.08)',
              border: '1px solid rgba(255,59,48,0.2)',
              borderRadius: 12,
              padding: '7px 10px',
              cursor: 'pointer',
            }}
          >
            <IconBlocked size={13} color="#FF3B30" />
            <span
              style={{
                fontFamily: "'Barlow Condensed'",
                fontWeight: 800,
                fontSize: 12,
                color: '#FF3B30',
                textTransform: 'uppercase',
              }}
            >
              {distractionCount} BLOCKED
            </span>
          </button>

          <button
            onClick={() => onNavigate('blocked-apps')}
            className="interactive-btn"
            style={{
              flex: 1,
              background: '#0D0D0D',
              border: '1px solid #1A1A1A',
              borderRadius: 12,
              padding: '7px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <IconShield size={13} color={theme.accent} />
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 12, color: theme.accent, textTransform: 'uppercase' }}>
              {blockedApps.length} SHIELDED
            </span>
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div
        className="zen-transition"
        style={{
          padding: '0 clamp(16px, 4vw, 24px) max(16px, env(safe-area-inset-bottom, 16px))',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flexShrink: 0,
          opacity: isZenMode ? 0 : 1,
          pointerEvents: isZenMode ? 'none' : 'auto',
        }}
      >
        <button
          onClick={() => {
            if (isHardcore) {
              setBlockedAlert("💀 HARDCORE MODE ACTIVE! No pausing allowed. Stay locked in! 🗿")
              setTimeout(() => setBlockedAlert(null), 3500)
              return
            }
            if (isPaused) {
              const newEnd = Date.now() + secondsLeft * 1000
              setTargetEndTime(newEnd)
              try {
                const saved = localStorage.getItem(SESSION_KEY)
                if (saved) {
                  const p = JSON.parse(saved)
                  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...p, isPaused: false, secondsLeft, targetEndTime: newEnd }))
                }
              } catch (e) {}
              setIsPaused(false)
              setBlockingActive(true, newEnd)
              startFocusRoastInterval(effectiveDuration)
              store.sendFocusHeartbeat(true, effectiveDuration)
              if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
                (window as any).ReactNativeWebView.postMessage(
                  JSON.stringify({ type: 'SET_KEEP_SCREEN_ON', enabled: true })
                )
              }
            } else {
              setIsPaused(true)
              try {
                const saved = localStorage.getItem(SESSION_KEY)
                if (saved) {
                  const p = JSON.parse(saved)
                  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...p, isPaused: true, secondsLeft }))
                }
              } catch (e) {}
              setBlockingActive(false, 0)
              stopFocusRoastInterval()
              store.sendFocusHeartbeat(false)
              if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
                (window as any).ReactNativeWebView.postMessage(
                  JSON.stringify({ type: 'SET_KEEP_SCREEN_ON', enabled: false })
                )
              }
            }
          }}
          className="interactive-btn btn-glow-pulse"
          style={{
            width: '100%',
            height: 'clamp(44px, 5.5vh, 50px)',
            borderRadius: 14,
            background: isHardcore ? 'rgba(255,59,48,0.06)' : 'rgba(18,18,18,0.9)',
            border: isHardcore ? '1px dashed rgba(255,59,48,0.3)' : '1px solid rgba(255,255,255,0.08)',
            fontFamily: "'Barlow Condensed'",
            fontWeight: 800,
            fontSize: 17,
            color: isHardcore ? '#FF6B6B' : '#A0A0A0',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {isHardcore ? (
            <>
              <IconSkull size={16} color="#FF6B6B" /> HARDCORE (NO PAUSE)
            </>
          ) : isPaused ? (
            '▶ RESUME'
          ) : (
            '⏸ PAUSE'
          )}
        </button>

        <button
          onClick={requestSessionExit}
          className="interactive-btn"
          style={{
            width: '100%',
            height: 'clamp(42px, 5vh, 46px)',
            borderRadius: 14,
            background: 'rgba(255,59,48,0.08)',
            border: '1px solid rgba(255,59,48,0.25)',
            fontFamily: "'Barlow Condensed'",
            fontWeight: 800,
            fontSize: 16,
            color: '#FF3B30',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          GIVE UP (lose streak)
        </button>
      </div>

      {showGiveUpModal && (
        <GiveUpConfirmationModal
          streak={currentStreak}
          auraScore={store.auraScore}
          remainingTime={formatted}
          onStay={() => setShowGiveUpModal(false)}
          onConfirm={confirmGiveUp}
        />
      )}
    </div>
  )
}
