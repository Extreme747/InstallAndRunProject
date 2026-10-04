import { useTheme } from '../utils/theme'
import { IconShield, IconBolt, IconLock, IconCheck } from './Icons'

interface Props {
  isOpen: boolean
  onAgree: () => void
  onDecline: () => void
}

export default function AccessibilityDisclosureModal({ isOpen, onAgree, onDecline }: Props) {
  const theme = useTheme()

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          maxHeight: '90vh',
          background: '#0E1015',
          border: '1.5px solid #242936',
          borderRadius: 24,
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(191,127,255,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 20px 14px',
            borderBottom: '1px solid #1E222D',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'linear-gradient(180deg, rgba(191,127,255,0.08) 0%, transparent 100%)',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'rgba(191,127,255,0.15)',
              border: '1px solid rgba(191,127,255,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IconBolt size={24} color="#BF7FFF" />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Barlow Condensed'",
                fontWeight: 900,
                fontSize: 20,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                lineHeight: 1.1,
              }}
            >
              Accessibility Disclosure
            </div>
            <div
              style={{
                fontFamily: "'DM Sans'",
                fontSize: 11,
                color: '#BF7FFF',
                fontWeight: 600,
                marginTop: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Prominent Notice • Privacy First
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            padding: '18px 20px',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            fontFamily: "'DM Sans'",
            fontSize: 13,
            color: '#A0AEC0',
            lineHeight: 1.55,
          }}
        >
          <div style={{ color: '#E2E8F0', fontSize: 13.5 }}>
            Scrolln't uses the Android <strong style={{ color: '#FFFFFF' }}>AccessibilityService API</strong> (
            <code style={{ color: '#BF7FFF', background: '#1A1626', padding: '1px 4px', borderRadius: 4 }}>
              BIND_ACCESSIBILITY_SERVICE
            </code>
            ) strictly to provide core focus enforcement and app-blocking functionality.
          </div>

          {/* Core Purpose Card */}
          <div
            style={{
              background: '#141721',
              border: '1px solid #232838',
              borderRadius: 14,
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FFFFFF', fontWeight: 700, fontSize: 13 }}>
              <IconShield size={16} color={theme.accent} />
              <span>How Scrolln't Uses This Service</span>
            </div>
            <div style={{ fontSize: 12.5, color: '#A0AEC0' }}>
              When a focus session is active, Scrolln't detects foreground window changes to check if you open an app on your blocked list (like Instagram or YouTube). If detected, it immediately redirects you back to your focus session to protect your streak.
            </div>
          </div>

          {/* Privacy Guarantee Card */}
          <div
            style={{
              background: 'rgba(200, 255, 0, 0.04)',
              border: `1px solid rgba(${theme.accentRgb}, 0.2)`,
              borderRadius: 14,
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: theme.accent, fontWeight: 700, fontSize: 13 }}>
              <IconLock size={15} color={theme.accent} />
              <span>What We NEVER Collect</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#CBD5E0', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li><strong>NO</strong> keystrokes, typing, passwords, or personal messages are monitored or recorded.</li>
              <li><strong>NO</strong> screen content, personal media, or banking details are captured.</li>
              <li><strong>NO</strong> personal data leaves your device. All app detection runs purely on-device.</li>
            </ul>
          </div>

          <div style={{ fontSize: 11.5, color: '#718096' }}>
            This permission is completely optional and can be turned off anytime in Android Settings → Accessibility → Installed Apps → Scrolln't.
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '14px 20px 18px',
            borderTop: '1px solid #1E222D',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            background: '#0E1015',
          }}
        >
          <button
            onClick={onAgree}
            className="interactive-btn"
            style={{
              width: '100%',
              height: 48,
              borderRadius: 14,
              background: theme.accent,
              border: 'none',
              fontFamily: "'Barlow Condensed'",
              fontWeight: 900,
              fontSize: 17,
              color: '#080808',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: `0 0 16px rgba(${theme.accentRgb}, 0.35)`,
            }}
          >
            <IconCheck size={18} color="#080808" />
            AGREE &amp; ENABLE SERVICE
          </button>

          <button
            onClick={onDecline}
            className="interactive-btn"
            style={{
              width: '100%',
              height: 40,
              borderRadius: 12,
              background: 'transparent',
              border: '1px solid #242936',
              fontFamily: "'Barlow Condensed'",
              fontWeight: 700,
              fontSize: 14,
              color: '#A0AEC0',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
            }}
          >
            NOT NOW (CANCEL)
          </button>
        </div>
      </div>
    </div>
  )
}
