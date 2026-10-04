import { useTheme } from '../utils/theme'
import type { Screen } from '../types'
import { IconShield, IconLock } from '../components/Icons'

interface Props {
  onNavigate: (screen: Screen) => void
}

export default function PrivacyPolicyScreen({ onNavigate }: Props) {
  const theme = useTheme()

  return (
    <div
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        width: '100%',
        maxWidth: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: theme.bg,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 'max(14px, env(safe-area-inset-top, 14px)) clamp(16px, 4vw, 24px) 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
          borderBottom: '1px solid #141414',
        }}
      >
        <button
          onClick={() => onNavigate('settings')}
          className="interactive-btn"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#111',
            border: '1px solid #1E1E1E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#F5F5F5',
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 24, letterSpacing: '0.04em', color: '#F5F5F5', textTransform: 'uppercase' }}>
            PRIVACY POLICY
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 11.5, color: '#7E7E87', marginTop: 1 }}>
            Effective September 2026 · 100% In-App Disclosure
          </div>
        </div>
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
          gap: 14,
          paddingInline: 'clamp(16px, 4vw, 24px)',
          paddingTop: 12,
          paddingBottom: 'clamp(30px, 6vh, 60px)',
        }}
      >
        {/* Core Promise Hero Card */}
        <div
          style={{
            background: `rgba(${theme.accentRgb},0.05)`,
            border: `1px solid rgba(${theme.accentRgb},0.2)`,
            borderRadius: 16,
            padding: '16px',
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: `rgba(${theme.accentRgb},0.12)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IconShield size={22} color={theme.accent} />
          </div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              LOCAL-FIRST & 100% ANONYMOUS
            </div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#C0C0C0', lineHeight: 1.5, marginTop: 4 }}>
              Scrolln't does NOT require any email, phone number, password, or login. Your focus history, streaks, and blocked apps stay on your device.
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <div style={{ background: '#0D0D0D', border: '1px solid #161616', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            1. SENSITIVE PERMISSIONS (ACCESSIBILITY SERVICE)
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#8E8E93', lineHeight: 1.55 }}>
            Scrolln't utilizes Android's <strong style={{ color: '#E0E0E0' }}>AccessibilityService API</strong> (<code style={{ color: theme.accent }}>BIND_ACCESSIBILITY_SERVICE</code>) solely to detect when a package from your chosen Shielded Apps list enters the foreground during an active focus timer.
            <div style={{ marginTop: 8, padding: '8px 12px', background: '#121212', borderRadius: 8, borderLeft: `3px solid ${theme.accent}` }}>
              🔒 <strong style={{ color: '#F0F0F0' }}>Zero Data Logging:</strong> We do NOT read, collect, inspect, record, or transmit keystrokes, personal messages, passwords, screen content, or banking data.
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div style={{ background: '#0D0D0D', border: '1px solid #161616', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            2. USAGE ACCESS & OVERLAY PERMISSIONS
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#8E8E93', lineHeight: 1.55 }}>
            • <strong style={{ color: '#E0E0E0' }}>Usage Stats:</strong> Used strictly on-device to compute time saved from doomscrolling and daily focus hours.<br />
            • <strong style={{ color: '#E0E0E0' }}>Draw Over Other Apps:</strong> Used to render the motivational block overlay when you try to open a shielded app during focus.
          </div>
        </div>

        {/* Section 3 */}
        <div style={{ background: '#0D0D0D', border: '1px solid #161616', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            3. MULTIPLAYER SQUADS & LEADERBOARDS
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#8E8E93', lineHeight: 1.55 }}>
            If you create or join a Squad, an anonymous random UUID, your chosen gamer tag, and your focus XP are synced with our secure server (<code style={{ color: '#888' }}>https://scrolln-t-production.up.railway.app</code>) to show live group progress. No personal identifying information (PII) is ever linked or stored.
          </div>
        </div>

        {/* Section 4 */}
        <div style={{ background: '#0D0D0D', border: '1px solid #161616', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            4. PAYMENTS & GOOGLE PLAY BILLING
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#8E8E93', lineHeight: 1.55 }}>
            All subscriptions (Scrolln't Pro) are handled directly through the official Google Play Billing system. We never process, see, or store your credit card, bank, or billing information.
          </div>
        </div>

        {/* Section 5 */}
        <div style={{ background: '#0D0D0D', border: '1px solid #161616', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            5. DATA DELETION & CONTROL
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#8E8E93', lineHeight: 1.55 }}>
            You have full control over your data. In <strong style={{ color: '#E0E0E0' }}>Settings → Danger Zone → Reset Everything</strong>, you can permanently wipe all local storage, streaks, and session records with a single tap.
          </div>
        </div>

        {/* Section 6 */}
        <div style={{ background: '#0D0D0D', border: '1px solid #161616', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            6. DEVELOPER CONTACT
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#8E8E93', lineHeight: 1.55 }}>
            For privacy inquiries, questions, or support:<br />
            📧 <strong style={{ color: theme.accent }}>scrollnt.support@gmail.com</strong>
          </div>
        </div>

        {/* Bottom Done Button */}
        <button
          onClick={() => onNavigate('settings')}
          className="interactive-btn"
          style={{
            width: '100%',
            height: 48,
            borderRadius: 14,
            background: theme.accent,
            border: 'none',
            fontFamily: "'Barlow Condensed'",
            fontWeight: 800,
            fontSize: 16,
            color: '#080808',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            cursor: 'pointer',
            marginTop: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <IconLock size={16} color="#080808" /> I UNDERSTAND & AGREE
        </button>
      </div>
    </div>
  )
}
