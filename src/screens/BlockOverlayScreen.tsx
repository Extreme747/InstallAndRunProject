import { useState } from 'react'
import type { Screen } from '../types'
import { useAppStore } from '../store/useAppStore'
import { useTheme } from '../utils/theme'
import { getRandomRoast } from '../data/moaiRoasts'
import { formatAppName } from './BlockedAppsScreen'
import { IconAlert, IconBlocked, IconMuscle, getMascotComponent } from '../components/Icons'

interface Props {
  onNavigate: (screen: Screen) => void
  appName?: string
}

export default function BlockOverlayScreen({ onNavigate, appName = 'Blocked App' }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  const lang = store.settings?.roastLanguage || 'hinglish'
  const [roast] = useState(() => getRandomRoast('attempt', lang))
  const displayName = formatAppName(appName).name
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.bg,
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        padding: '0 32px',
      }}
    >
      {/* Red tinted vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(255,59,48,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Scanline texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,59,48,0.015) 3px, rgba(255,59,48,0.015) 4px)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* Alert icon */}
        <div
          className="animate-scale-bounce"
          style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}
        >
          <IconAlert size={48} color="#FF3B30" glow />
        </div>

        {/* Moai */}
        <div style={{ marginBottom: 28, opacity: 0.8, display: 'flex', justifyContent: 'center' }}>
          {getMascotComponent('moai', 56)}
        </div>

        {/* Heading */}
        <div
          style={{
            fontFamily: "'Barlow Condensed'",
            fontWeight: 900,
            fontSize: 72,
            color: '#FF3B30',
            textTransform: 'uppercase',
            letterSpacing: '-1px',
            lineHeight: 0.88,
            marginBottom: 18,
            filter: 'drop-shadow(0 0 20px rgba(255,59,48,0.4))',
          }}
        >
          CAUGHT
          <br />
          YOU.
        </div>

        {/* App name */}
        <div
          style={{
            fontFamily: "'DM Sans'",
            fontSize: 15,
            color: 'rgba(245,245,245,0.55)',
            lineHeight: 1.6,
            marginBottom: 8,
          }}
        >
          You tried to open
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,59,48,0.1)',
            border: '1px solid rgba(255,59,48,0.25)',
            borderRadius: 12,
            padding: '8px 16px',
            marginBottom: 20,
          }}
        >
          <IconBlocked size={16} color="#FF3B30" />
          <span
            style={{
              fontFamily: "'Barlow Condensed'",
              fontWeight: 800,
              fontSize: 20,
              color: '#FF3B30',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {displayName}
          </span>
        </div>

        {/* Timer still running */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#0A0A0A',
            border: '1px solid #141414',
            borderRadius: 12,
            padding: '10px 20px',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: theme.accent,
              boxShadow: `0 0 8px rgba(${theme.accentRgb},0.6)`,
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono'",
              fontWeight: 600,
              fontSize: 14,
              color: '#888',
              letterSpacing: '0.04em',
            }}
          >
            Focus session active in background
          </span>
        </div>

        {/* Dynamic Savage Moai Roast */}
        <div
          className="animate-scale-bounce"
          style={{
            background: 'rgba(255,59,48,0.08)',
            border: '1px solid rgba(255,59,48,0.3)',
            borderRadius: 16,
            padding: '14px 18px',
            maxWidth: 320,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontFamily: "'Barlow Condensed'",
              fontWeight: 900,
              fontSize: 18,
              color: '#FF3B30',
              lineHeight: 1.3,
              textTransform: 'uppercase',
            }}
          >
            {roast.text}
          </div>
          {roast.subText && (
            <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#888', marginTop: 4 }}>
              {roast.subText}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 1,
        }}
      >
        <button
          onClick={() => onNavigate('focus')}
          style={{
            width: '100%',
            height: 56,
            borderRadius: 18,
            background: theme.accent,
            border: 'none',
            fontFamily: "'Barlow Condensed'",
            fontWeight: 800,
            fontSize: 21,
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
          STAY FOCUSED <IconMuscle size={18} color="#080808" />
        </button>

        <button
          onClick={() => {
            try {
              localStorage.removeItem('@scrollnt_active_focus_session')
            } catch (e) {}
            useAppStore.getState().setBlockingActive(false, 0)
            useAppStore.getState().sendFocusHeartbeat(false)
            if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
              (window as any).ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'SET_KEEP_SCREEN_ON', enabled: false })
              )
            }
            useAppStore.getState().addFailedSession(appName)
            onNavigate('error')
          }}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 14,
            background: 'rgba(255,59,48,0.08)',
            border: '1px solid rgba(255,59,48,0.2)',
            fontFamily: "'Barlow Condensed'",
            fontWeight: 700,
            fontSize: 16,
            color: '#FF3B30',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            cursor: 'pointer',
          }}
        >
          GIVE UP (lose streak)
        </button>
      </div>
    </div>
  )
}
