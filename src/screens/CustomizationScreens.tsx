import { useState } from 'react'
import type { Screen } from '../types'
import { BottomNav } from './HomeScreen'
import { useAppStore } from '../store/useAppStore'
import { useTheme } from '../utils/theme'
import {
  IconPalette,
  IconCrown,
  IconMusic,
  IconLocked,
  IconMute,
  IconRain,
  IconCity,
  IconBrain,
  IconSpace,
  IconHeadphones,
  getMascotComponent,
} from '../components/Icons'

interface Props { onNavigate: (screen: Screen) => void }

function SH({ title, subtitle, onBack }: { title: string; subtitle?: string; onBack?: () => void }) {
  const theme = useTheme()
  return (
    <div style={{ padding: 'max(14px, env(safe-area-inset-top, 14px)) clamp(16px, 4vw, 24px) 0', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
      {onBack && (
        <button
          onClick={onBack}
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
      )}
      <div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 'clamp(24px, 3.5vh, 30px)', color: '#F5F5F5', textTransform: 'uppercase', letterSpacing: '-0.3px', lineHeight: 1 }}>{title}</div>
        {subtitle && <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  )
}

function PremiumBadge() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(191,127,255,0.12)', border: '1px solid rgba(191,127,255,0.25)', borderRadius: 8, padding: '2px 8px' }}>
      <IconCrown size={12} color="#FFB800" />
      <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 11, color: '#BF7FFF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>PRO</span>
    </div>
  )
}

const CUSTOM_NAV_TABS = [
  { id: 'theme-store' as Screen, label: 'Themes', renderIcon: (active: boolean) => <IconPalette size={16} color={active ? '#C8FF00' : '#7E7E87'} /> },
  { id: 'mascot-customization' as Screen, label: 'Mascots', renderIcon: () => getMascotComponent('moai', 18) },
  { id: 'sound-packs' as Screen, label: 'Sounds', renderIcon: (active: boolean) => <IconMusic size={16} color={active ? '#C8FF00' : '#7E7E87'} /> },
]

// ─── THEME STORE ─────────────────────────────────────────────────────────────

const THEMES = [
  { id: 'default', name: 'MIDNIGHT', desc: 'Pure AMOLED default', bg: '#080808', accent: '#C8FF00', free: true, active: true },
  { id: 'ocean', name: 'DEEP OCEAN', desc: 'Blue-shift dark', bg: '#060C1A', accent: '#60A5FA', free: false },
  { id: 'purple', name: 'VOID', desc: 'Ultra-violet depths', bg: '#08060E', accent: '#BF7FFF', free: false },
  { id: 'ember', name: 'EMBER', desc: 'Volcanic focus mode', bg: '#0C0604', accent: '#FF6B2B', free: false },
  { id: 'matrix', name: 'MATRIX', desc: 'You are the one', bg: '#040F04', accent: '#00FF41', free: false },
  { id: 'gold', name: 'GOLD TIER', desc: 'You earned it', bg: '#0C0900', accent: '#FFB800', free: false },
]

export function ThemeStoreScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const activeTheme = useAppStore((s) => s.activeTheme)
  const equipTheme = useAppStore((s) => s.equipTheme)
  const isSubscribed = useAppStore((s) => s.isSubscribed)

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <SH title="THEME STORE" subtitle="Customize your lock-in environment" onBack={() => onNavigate('home')} />

      {/* Tabs */}
      <div style={{ padding: '8px clamp(16px, 4vw, 24px) 0', display: 'flex', gap: 6, flexShrink: 0 }}>
        {CUSTOM_NAV_TABS.map((t) => {
          const isActive = t.id === 'theme-store'
          return (
            <button
              key={t.id}
              onClick={() => onNavigate(t.id)}
              className="interactive-btn"
              style={{
                flex: 1,
                height: 32,
                borderRadius: 8,
                border: `1px solid ${isActive ? theme.accent : '#1A1A1A'}`,
                background: isActive ? `rgba(${theme.accentRgb},0.1)` : '#0A0A0A',
                color: isActive ? theme.accent : '#7E7E87',
                fontFamily: "'Barlow Condensed'",
                fontWeight: 700,
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
            >
              {t.renderIcon(isActive)}
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Theme grid */}
      <div style={{ padding: '10px clamp(16px, 4vw, 24px) clamp(70px, 10vh, 100px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {THEMES.map((themeObj) => {
          const isEquipped = activeTheme === themeObj.id
          const isLocked = !themeObj.free && !isSubscribed
          return (
            <div
              key={themeObj.id}
              onClick={() => {
                if (isLocked) onNavigate('premium-locked')
                else equipTheme(themeObj.id)
              }}
              style={{ background: '#0A0A0A', border: `1px solid ${isEquipped ? theme.accent : '#161616'}`, borderRadius: 14, padding: 10, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ height: 42, borderRadius: 8, background: themeObj.bg, border: '1px solid #1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: themeObj.accent, boxShadow: `0 0 10px ${themeObj.accent}66` }} />
                {isEquipped && (
                  <div style={{ position: 'absolute', top: 3, right: 3, background: theme.accent, borderRadius: 5, padding: '1px 4px', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 8.5, color: '#080808', textTransform: 'uppercase' }}>
                    EQUIPPED
                  </div>
                )}
                {isLocked && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <IconLocked size={12} color="#BF7FFF" />
                    <PremiumBadge />
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: isEquipped ? theme.accent : '#F5F5F5', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{themeObj.name}</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87' }}>{themeObj.desc}</div>
              </div>
            </div>
          )
        })}
      </div>

      <BottomNav active="settings" onNavigate={onNavigate} />
    </div>
  )
}

// ─── MASCOT CUSTOMIZATION ───────────────────────────────────────────────────

const MASCOTS = [
  { id: 'moai', name: 'OG MOAI', desc: 'Classic ancient discipline', free: true, active: true },
  { id: 'cactus', name: 'PRICKLY CACTUS', desc: 'Thrives in dry focus', free: true },
  { id: 'stone', name: 'ZEN BOULDER', desc: 'Immovable willpower', free: true },
  { id: 'gold', name: 'GIGACHAD GOLD MOAI', desc: 'Crown of absolute royalty', free: false },
  { id: 'cyber', name: 'CYBER SYNTH MOAI', desc: 'Neon pulse 0-distraction unit', free: false },
  { id: 'flame', name: 'INFERNO MOAI', desc: 'Blazing savage discipline', free: false },
  { id: 'robot', name: 'ROBO-MOAI 3000', desc: 'Automated laser focus unit', free: false },
  { id: 'ghost', name: 'PHANTOM', desc: 'Disappear from social media', free: false },
  { id: 'skull', name: 'DEADLOCKED', desc: 'No excuses, only results', free: false },
]

export function MascotCustomizationScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const activeSkin = useAppStore((s) => s.activeSkin)
  const equipSkin = useAppStore((s) => s.equipSkin)
  const isSubscribed = useAppStore((s) => s.isSubscribed)
  const [selected, setSelected] = useState(activeSkin || 'moai')

  const curMascot = MASCOTS.find((m) => m.id === selected) || MASCOTS[0]
  const isLocked = !curMascot.free && !isSubscribed

  const handleSave = () => {
    if (isLocked) onNavigate('premium-locked')
    else {
      equipSkin(selected)
      onNavigate('home')
    }
  }

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <SH title="MASCOT SKINS" subtitle="Choose your focus companion" onBack={() => onNavigate('home')} />

      {/* Tabs */}
      <div style={{ padding: '8px clamp(16px, 4vw, 24px) 0', display: 'flex', gap: 6, flexShrink: 0 }}>
        {CUSTOM_NAV_TABS.map((t) => {
          const isActive = t.id === 'mascot-customization'
          return (
            <button
              key={t.id}
              onClick={() => onNavigate(t.id)}
              className="interactive-btn"
              style={{
                flex: 1,
                height: 32,
                borderRadius: 8,
                border: `1px solid ${isActive ? theme.accent : '#1A1A1A'}`,
                background: isActive ? `rgba(${theme.accentRgb},0.1)` : '#0A0A0A',
                color: isActive ? theme.accent : '#7E7E87',
                fontFamily: "'Barlow Condensed'",
                fontWeight: 700,
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
            >
              {t.renderIcon(isActive)}
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {/* Mascot stage */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ width: 110, height: 110, borderRadius: '50%', background: `radial-gradient(ellipse at 50% 50%, rgba(${theme.accentRgb},0.08) 0%, transparent 70%)`, border: '1px solid #161616', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ animation: 'float 3.5s ease-in-out infinite' }}>
              {getMascotComponent(curMascot.id, 50)}
            </div>
            {isLocked && (
              <div style={{ position: 'absolute', bottom: 6, background: 'rgba(0,0,0,0.85)', borderRadius: 6, padding: '1px 6px', border: '1px solid rgba(191,127,255,0.3)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <IconLocked size={10} color="#BF7FFF" />
                <PremiumBadge />
              </div>
            )}
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 18, color: '#F5F5F5', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 6 }}>{curMascot.name}</div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87' }}>{curMascot.desc}</div>
        </div>

        {/* Selector grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, flex: 1 }}>
          {MASCOTS.map((m) => {
            const isSel = selected === m.id
            const locked = !m.free && !isSubscribed
            return (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                className="interactive-btn"
                style={{ background: isSel ? `rgba(${theme.accentRgb},0.06)` : '#0A0A0A', border: `1px solid ${isSel ? theme.accent : '#161616'}`, borderRadius: 12, padding: '10px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', position: 'relative', transition: 'all 0.15s ease' }}
              >
                {locked && (
                  <div style={{ position: 'absolute', top: 4, right: 4 }}>
                    <IconLocked size={11} color="#BF7FFF" />
                  </div>
                )}
                {getMascotComponent(m.id, 32)}
                <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 11, color: isSel ? theme.accent : '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>{m.name.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleSave}
          className="interactive-btn"
          style={{ width: '100%', height: 44, borderRadius: 12, background: isLocked ? '#1A1A1A' : theme.accent, border: isLocked ? '1px solid rgba(191,127,255,0.3)' : 'none', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: isLocked ? '#BF7FFF' : '#080808', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexShrink: 0 }}
        >
          {isLocked ? (
            <>
              <IconCrown size={14} color="#BF7FFF" /> UNLOCK WITH PRO
            </>
          ) : (
            'EQUIP MASCOT SKIN'
          )}
        </button>
      </div>

      <BottomNav active="settings" onNavigate={onNavigate} />
    </div>
  )
}

export function MoaiSkinsScreen({ onNavigate }: Props) {
  return <MascotCustomizationScreen onNavigate={onNavigate} />
}

// ─── SOUND PACKS (COMING SOON) ───────────────────────────────────────────────

const SOUNDS = [
  { id: 'silent', icon: IconMute, name: 'SILENT FOCUS', desc: 'Pure distraction-free silence', free: true, active: true },
  { id: 'rain', icon: IconRain, name: 'LO-FI RAIN BEATS', desc: 'Filtered brown noise rain drops', free: true },
  { id: 'cyberpunk', icon: IconCity, name: 'CYBERPUNK SYNTH', desc: '432Hz ambient focus synth pad', free: false },
  { id: 'binaural', icon: IconBrain, name: 'WHITE NOISE ALPHA', desc: 'High-isolation concentration waves', free: false },
  { id: 'drone', icon: IconSpace, name: 'DEEP SPACE DRONE', desc: '55Hz sub-bass ambient resonance', free: false },
]

export function SoundPacksScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const [toast, setToast] = useState<string | null>(null)

  const handleSoundTap = (name: string) => {
    setToast(`🎧 ${name}: Calibration in progress. Releasing in next update!`)
    setTimeout(() => setToast(null), 3200)
  }

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <SH title="SOUND PACKS" subtitle="Procedural Ambient Focus Engine" onBack={() => onNavigate('home')} />

      {toast && (
        <div className="animate-scale-bounce" style={{ margin: '6px clamp(16px, 4vw, 24px) 0', background: `rgba(${theme.accentRgb},0.15)`, border: `1px solid ${theme.accent}`, borderRadius: 12, padding: '8px 12px', color: theme.accent, fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13.5, textAlign: 'center', letterSpacing: '0.04em', flexShrink: 0 }}>
          {toast}
        </div>
      )}

      {/* Tabs */}
      <div style={{ padding: '8px clamp(16px, 4vw, 24px) 0', display: 'flex', gap: 6, flexShrink: 0 }}>
        {CUSTOM_NAV_TABS.map((t) => {
          const isActive = t.id === 'sound-packs'
          return (
            <button
              key={t.id}
              onClick={() => onNavigate(t.id)}
              className="interactive-btn"
              style={{
                flex: 1,
                height: 32,
                borderRadius: 8,
                border: `1px solid ${isActive ? theme.accent : '#1A1A1A'}`,
                background: isActive ? `rgba(${theme.accentRgb},0.1)` : '#0A0A0A',
                color: isActive ? theme.accent : '#7E7E87',
                fontFamily: "'Barlow Condensed'",
                fontWeight: 700,
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
            >
              {t.renderIcon(isActive)}
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {/* Coming Soon Hero Banner */}
        <div style={{ background: `rgba(${theme.accentRgb},0.06)`, border: `1px solid rgba(${theme.accentRgb},0.25)`, borderRadius: 14, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconHeadphones size={18} color={theme.accent} />
              <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                COMING SOON
              </span>
            </div>
            <div style={{ background: theme.accent, color: '#080808', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 9.5, padding: '2px 6px', borderRadius: 4, letterSpacing: '0.08em' }}>
              NEXT UPDATE
            </div>
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#888', lineHeight: 1.4 }}>
            Ambient Focus Soundscapes are currently undergoing acoustic calibration.
          </div>
        </div>

        {/* Sound list (Preview only) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          {SOUNDS.map((s) => {
            const IconComp = s.icon
            return (
              <div
                key={s.id}
                onClick={() => handleSoundTap(s.name)}
                className="interactive-btn"
                style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 14, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, opacity: 0.85, cursor: 'pointer' }}
              >
                <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconComp size={18} color="#7E7E87" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 1 }}>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: '#D0D0D0', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{s.name}</span>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 9, color: '#555', background: '#141414', padding: '1px 5px', borderRadius: 4, letterSpacing: '0.06em' }}>PREVIEW</span>
                  </div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87' }}>{s.desc}</div>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#111', color: '#7E7E87', border: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconLocked size={12} color="#7E7E87" />
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="interactive-btn"
          style={{ width: '100%', height: 44, borderRadius: 12, background: '#141414', border: '1px solid #222', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', flexShrink: 0 }}
        >
          ← BACK TO HOME
        </button>
      </div>

      <BottomNav active="settings" onNavigate={onNavigate} />
    </div>
  )
}
