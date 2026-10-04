import { useEffect, useState } from 'react'
import type { Screen } from '../types'
import { useAppStore } from '../store/useAppStore'
import { useTheme } from '../utils/theme'
import { IconPhone, IconWindow, IconBolt, IconShield, IconRocket, IconLock, IconCheck } from '../components/Icons'
import AccessibilityDisclosureModal from '../components/AccessibilityDisclosureModal'

type PermType = 'usage' | 'overlay' | 'accessibility'

interface Props {
  type?: PermType
  onNavigate: (screen: Screen) => void
}

function getPermissionIcon(type: PermType, size = 24, glow = false, accentColor = '#C8FF00') {
  switch (type) {
    case 'usage':
      return <IconPhone size={size} color={accentColor} glow={glow} />
    case 'overlay':
      return <IconWindow size={size} color="#60A5FA" glow={glow} />
    case 'accessibility':
      return <IconBolt size={size} color="#BF7FFF" glow={glow} />
  }
}

const PERMISSION_DATA: Record<
  PermType,
  {
    tag: string
    title: string
    heading: string
    body: string
    detail: string
    cta: string
    skipLabel: string
  }
> = {
  usage: {
    tag: 'REQUIRED',
    title: 'Usage Access',
    heading: "WE NEED A\nLITTLE HELP",
    body: "Allow Scrolln't to see which apps are open — so we can shut them down when you're locked in.",
    detail: "Goes to Android Settings → Apps → Special Access → Usage Access. No data leaves your phone. Pinky promise.",
    cta: 'ALLOW USAGE ACCESS',
    skipLabel: "Skip (blocking won't work)",
  },
  overlay: {
    tag: 'REQUIRED',
    title: 'Draw Over Apps',
    heading: 'ONE MORE\nPERMISSION',
    body: "We need to draw an overlay over blocked apps — so when you try to open a blocked app mid-focus, we slap a wall in front of it.",
    detail: "Goes to Settings → Apps → Special App Access → Display Over Other Apps. Nothing is captured or stored.",
    cta: 'ALLOW OVERLAY',
    skipLabel: "Skip (no block screen)",
  },
  accessibility: {
    tag: 'STRICT MODE',
    title: 'Accessibility Service',
    heading: 'STRICT MODE\nOPTIONAL',
    body: "Enable Accessibility Service for instant app blocking. When you try to open a blocked app, we YEET you back to the home screen.",
    detail: "Only used to detect and close blocked apps during focus sessions. Zero personal data collected or transmitted. Google-compliant disclosure.",
    cta: 'ENABLE STRICT MODE',
    skipLabel: "Skip (standard mode is fine)",
  },
}

// ─── ALL-IN-ONE PERMISSIONS HUB SCREEN ───────────────────────────────────────

export function PermissionsHubScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const theme = useTheme()
  const store = useAppStore()
  const permissions = store.permissions
  const checkPermissions = store.checkPermissions
  const openPermission = store.openPermission
  const [opening, setOpening] = useState<string | null>(null)
  const [showAccessibilityDisclosure, setShowAccessibilityDisclosure] = useState(false)

  // Real-time permission checking on mount and when app regains focus
  useEffect(() => {
    checkPermissions()

    const interval = setInterval(() => {
      checkPermissions()
    }, 1000)

    const handleFocus = () => {
      checkPermissions()
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkPermissions()
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('permissionsUpdated', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('permissionsUpdated', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [checkPermissions])

  const handleGrant = (type: PermType) => {
    if (type === 'accessibility' && !permissions.accessibility) {
      setShowAccessibilityDisclosure(true)
      return
    }
    setOpening(type)
    openPermission(type)
    // Quick fallback check after trigger
    setTimeout(() => {
      checkPermissions()
      setOpening(null)
    }, 2000)
  }

  const handleConfirmAccessibility = () => {
    setShowAccessibilityDisclosure(false)
    setOpening('accessibility')
    openPermission('accessibility')
    setTimeout(() => {
      checkPermissions()
      setOpening(null)
    }, 2000)
  }

  const activeCount = (permissions.usage ? 1 : 0) + (permissions.overlay ? 1 : 0) + (permissions.accessibility ? 1 : 0)
  const isAllRequiredActive = permissions.usage && permissions.overlay

  const handleProceed = () => {
    store.setHasSeenOnboarding(true)
    onNavigate('blocked-apps')
  }

  return (
    <div
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: theme.bg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${theme.accentRgb},0.06) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div style={{ padding: 'max(14px, env(safe-area-inset-top, 14px)) clamp(16px, 4vw, 24px) 0', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <button
          onClick={() => onNavigate('home')}
          className="interactive-btn"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#0E0E0E',
            border: '1px solid #1E1E1E',
            color: theme.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 17,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <div>
          <div
            style={{
              fontFamily: "'Barlow Condensed'",
              fontWeight: 900,
              fontSize: 'clamp(24px, 3.5vh, 30px)',
              color: '#F5F5F5',
              textTransform: 'uppercase',
              letterSpacing: '-0.3px',
              lineHeight: 1,
            }}
          >
            APP PERMISSIONS
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginTop: 1 }}>
            Activate Android shields to block distractions
          </div>
        </div>
      </div>

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingTop: 6, paddingBottom: 16, position: 'relative', zIndex: 1 }}>
        {/* Status Progress Pill Banner */}
        <div style={{ background: 'rgba(200,255,0,0.05)', border: '1px solid rgba(200,255,0,0.2)', borderRadius: 14, padding: '10px 14px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconShield size={15} color={theme.accent} />
              <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {activeCount === 3 ? 'ALL PERMISSIONS ACTIVE' : `${activeCount} OF 3 ACTIVE`}
              </span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: activeCount >= 2 ? theme.accent : '#888', fontWeight: 700 }}>
              {Math.round((activeCount / 3) * 100)}%
            </span>
          </div>
          <div style={{ height: 5, background: '#141414', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                width: `${(activeCount / 3) * 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, #BF7FFF 0%, ${theme.accent} 100%)`,
                borderRadius: 3,
                transition: 'width 0.4s ease',
                boxShadow: `0 0 10px rgba(${theme.accentRgb},0.5)`,
              }}
            />
          </div>
        </div>

        {/* 3 Core Permission Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {(['usage', 'overlay', 'accessibility'] as PermType[]).map((type) => {
          const item = PERMISSION_DATA[type]
          const isGranted = Boolean(permissions[type])
          const isChecking = opening === type

          return (
            <div
              key={type}
              style={{
                background: isGranted ? `rgba(${theme.accentRgb},0.03)` : '#0A0A0A',
                border: `1.5px solid ${isGranted ? `rgba(${theme.accentRgb},0.3)` : '#161616'}`,
                borderRadius: 20,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                transition: 'all 0.2s ease',
                boxShadow: isGranted ? `0 0 20px rgba(${theme.accentRgb},0.05)` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: isGranted ? `rgba(${theme.accentRgb},0.12)` : '#111',
                      border: `1px solid ${isGranted ? `rgba(${theme.accentRgb},0.25)` : '#1E1E1E'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getPermissionIcon(type, 24, false, theme.accent)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 18, color: isGranted ? theme.accent : '#F5F5F5', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                        {item.title}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Barlow Condensed'",
                          fontWeight: 700,
                          fontSize: 10,
                          color: type === 'accessibility' ? '#BF7FFF' : '#FF9500',
                          background: type === 'accessibility' ? 'rgba(191,127,255,0.1)' : 'rgba(255,149,0,0.1)',
                          border: `1px solid ${type === 'accessibility' ? 'rgba(191,127,255,0.25)' : 'rgba(255,149,0,0.25)'}`,
                          padding: '1px 6px',
                          borderRadius: 4,
                          letterSpacing: '0.06em',
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#555', marginTop: 2 }}>
                      {item.body}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 4, borderTop: '1px solid #121212' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: isGranted ? theme.accent : '#FF3B30',
                      boxShadow: isGranted ? `0 0 8px rgba(${theme.accentRgb},0.8)` : 'none',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed'",
                      fontWeight: 800,
                      fontSize: 13,
                      color: isGranted ? theme.accent : '#FF3B30',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {isGranted ? 'ACTIVE' : 'OFF'}
                  </span>
                </div>

                {isGranted ? (
                  <div
                    style={{
                      background: `rgba(${theme.accentRgb},0.1)`,
                      border: `1px solid rgba(${theme.accentRgb},0.25)`,
                      borderRadius: 10,
                      padding: '6px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 13, color: theme.accent }}>✓</span>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, color: theme.accent, letterSpacing: '0.04em' }}>
                      ENABLED
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleGrant(type)}
                    className="interactive-btn"
                    style={{
                      height: 38,
                      paddingInline: 18,
                      borderRadius: 10,
                      background: theme.accent,
                      border: 'none',
                      fontFamily: "'Barlow Condensed'",
                      fontWeight: 800,
                      fontSize: 14,
                      color: '#080808',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {isChecking ? 'CHECKING...' : `ENABLE ${item.title.toUpperCase()}`}
                  </button>
                )}
              </div>
            </div>
          )
        })}
        </div>
      </div>

      {/* Bottom Floating Proceed Section */}
      <div style={{ padding: '12px 24px 24px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
        <button
          onClick={handleProceed}
          className="interactive-btn animate-pulse-glow"
          style={{
            width: '100%',
            height: 54,
            borderRadius: 16,
            background: isAllRequiredActive ? theme.accent : `rgba(${theme.accentRgb},0.15)`,
            border: isAllRequiredActive ? 'none' : `1px solid rgba(${theme.accentRgb},0.3)`,
            fontFamily: "'Barlow Condensed'",
            fontWeight: 900,
            fontSize: 20,
            color: isAllRequiredActive ? '#080808' : theme.accent,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {isAllRequiredActive ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              ALL SET — ENTER SCROLLN'T <IconRocket size={18} color="#080808" />
            </span>
          ) : (
            'CONTINUE TO APP →'
          )}
        </button>

        <div style={{ textAlign: 'center', fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <IconLock size={12} color="#7E7E87" /> You can toggle these permissions anytime in App Settings. No personal data collected.
        </div>
      </div>

      <AccessibilityDisclosureModal
        isOpen={showAccessibilityDisclosure}
        onAgree={handleConfirmAccessibility}
        onDecline={() => setShowAccessibilityDisclosure(false)}
      />
    </div>
  )
}

// ─── STEP-BY-STEP PERMISSION SCREEN ──────────────────────────────────────────

export default function PermissionScreen({ type = 'usage', onNavigate }: Props) {
  const theme = useTheme()
  const d = PERMISSION_DATA[type]
  const store = useAppStore()
  const isGranted = Boolean(store.permissions[type])
  const checkPermissions = store.checkPermissions
  const openPermission = store.openPermission
  const [checking, setChecking] = useState(false)
  const [showAccessibilityDisclosure, setShowAccessibilityDisclosure] = useState(false)

  const tagColor = type === 'accessibility' ? '#BF7FFF' : '#FFB800'
  const tagBg = type === 'accessibility' ? 'rgba(191,127,255,0.1)' : 'rgba(255,184,0,0.1)'
  const tagBorder = type === 'accessibility' ? 'rgba(191,127,255,0.25)' : 'rgba(255,184,0,0.25)'

  useEffect(() => {
    checkPermissions()

    const interval = setInterval(() => {
      checkPermissions()
    }, 1000)

    const handleFocus = () => {
      checkPermissions()
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('permissionsUpdated', handleFocus)
    document.addEventListener('visibilitychange', handleFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('permissionsUpdated', handleFocus)
      document.removeEventListener('visibilitychange', handleFocus)
    }
  }, [checkPermissions])

  const handleOpenSettings = () => {
    if (type === 'accessibility' && !isGranted) {
      setShowAccessibilityDisclosure(true)
      return
    }
    setChecking(true)
    openPermission(type)
    setTimeout(() => {
      checkPermissions()
      setChecking(false)
    }, 2000)
  }

  const handleConfirmAccessibility = () => {
    setShowAccessibilityDisclosure(false)
    setChecking(true)
    openPermission(type)
    setTimeout(() => {
      checkPermissions()
      setChecking(false)
    }, 2000)
  }

  const handleNext = () => {
    if (type === 'usage') onNavigate('permission-overlay')
    else if (type === 'overlay') onNavigate('permission-accessibility')
    else {
      store.setHasSeenOnboarding(true)
      onNavigate('blocked-apps')
    }
  }

  return (
    <div
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: theme.bg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${theme.accentRgb},0.05) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Top back button */}
      <div style={{ padding: 'max(14px, env(safe-area-inset-top, 14px)) clamp(16px, 4vw, 24px) 0', position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <button
          onClick={() => onNavigate('permissions-hub')}
          className="interactive-btn"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#0E0E0E',
            border: '1px solid #1E1E1E',
            color: theme.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 17,
            cursor: 'pointer',
          }}
        >
          ←
        </button>
      </div>

      {/* Main scrollable body */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '8px clamp(16px, 5vw, 28px)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Required/Optional badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: tagBg,
            border: `1px solid ${tagBorder}`,
            borderRadius: 6,
            padding: '3px 10px',
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: "'Barlow Condensed'",
              fontWeight: 700,
              fontSize: 11,
              color: tagColor,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
            }}
          >
            {d.tag}
          </span>
        </div>

        {/* Icon card */}
        <div
          className="animate-scale-bounce"
          style={{
            width: 'clamp(80px, 12vh, 105px)',
            height: 'clamp(80px, 12vh, 105px)',
            borderRadius: 24,
            background: '#0A0A0A',
            border: `1.5px solid ${isGranted ? theme.accent : '#1A1A1A'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
            boxShadow: isGranted ? `0 0 30px rgba(${theme.accentRgb},0.2)` : '0 16px 48px rgba(0,0,0,0.5)',
          }}
        >
          {isGranted ? <IconCheck size={40} color="#34D399" glow /> : getPermissionIcon(type, 44, true, theme.accent)}
        </div>

        {/* Heading */}
        <div
          className="animate-fade-up"
          style={{
            fontFamily: "'Barlow Condensed'",
            fontWeight: 900,
            fontSize: 'clamp(28px, 4.5vh, 38px)',
            color: '#F5F5F5',
            letterSpacing: '-0.5px',
            textTransform: 'uppercase',
            lineHeight: 0.95,
            whiteSpace: 'pre-line',
            marginBottom: 8,
          }}
        >
          {isGranted ? 'PERMISSION\nACTIVE! ✓' : d.heading}
        </div>

        {/* Body */}
        <div
          className="animate-fade-up-delay-1"
          style={{
            fontFamily: "'DM Sans'",
            fontSize: 12.5,
            color: 'rgba(245,245,245,0.65)',
            lineHeight: 1.5,
            maxWidth: 290,
            marginBottom: 10,
          }}
        >
          {isGranted ? 'Permission successfully granted. Scrolln\'t is ready to shield you.' : d.body}
        </div>

        {/* Detail card */}
        <div
          className="animate-fade-up-delay-2"
          style={{
            background: '#0A0A0A',
            border: '1px solid #161616',
            borderRadius: 12,
            padding: '10px 14px',
            width: '100%',
            maxWidth: 300,
          }}
        >
          <div
            style={{
              fontFamily: "'DM Sans'",
              fontSize: 11,
              color: '#666',
              lineHeight: 1.5,
              textAlign: 'left',
            }}
          >
            {d.detail}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          padding: '8px clamp(16px, 4vw, 24px) 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          position: 'relative',
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        {isGranted ? (
          <button
            onClick={handleNext}
            className="interactive-btn animate-pulse-glow"
            style={{
              width: '100%',
              height: 'clamp(44px, 5.8vh, 52px)',
              borderRadius: 14,
              background: theme.accent,
              border: 'none',
              fontFamily: "'Barlow Condensed'",
              fontWeight: 800,
              fontSize: 18,
              color: '#080808',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            PROCEED →
          </button>
        ) : (
          <>
            <button
              onClick={handleOpenSettings}
              className="interactive-btn"
              style={{
                width: '100%',
                height: 'clamp(44px, 5.8vh, 52px)',
                borderRadius: 14,
                background: theme.accent,
                border: 'none',
                fontFamily: "'Barlow Condensed'",
                fontWeight: 800,
                fontSize: 18,
                color: '#080808',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {checking ? 'CHECKING...' : d.cta}
            </button>

            <button
              onClick={() => onNavigate('permissions-hub')}
              style={{
                width: '100%',
                height: 36,
                borderRadius: 10,
                background: 'none',
                border: 'none',
                fontFamily: "'DM Sans'",
                fontSize: 12,
                color: '#7E7E87',
                cursor: 'pointer',
              }}
            >
              {d.skipLabel}
            </button>
          </>
        )}
      </div>

      <AccessibilityDisclosureModal
        isOpen={showAccessibilityDisclosure}
        onAgree={handleConfirmAccessibility}
        onDecline={() => setShowAccessibilityDisclosure(false)}
      />
    </div>
  )
}
