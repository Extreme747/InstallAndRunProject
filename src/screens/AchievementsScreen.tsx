import { useState } from 'react'
import { useTheme } from '../utils/theme'
import type { Screen } from '../types'
import { BottomNav } from './HomeScreen'
import { useAppStore } from '../store/useAppStore'
import {
  IconCheck,
  IconSeed,
  IconFlame,
  IconSword,
  IconBrain,
  IconHundred,
  IconMoon,
  IconButterfly,
  IconDiamond,
  IconTrophy,
  IconLocked,
  IconCross,
  IconBolt,
  IconMedal,
  IconSparkle,
  IconSkull
} from '../components/Icons'

interface Props { onNavigate: (screen: Screen) => void }

function ScreenHeader({ title, subtitle, onBack }: { title: string; subtitle?: string; onBack?: () => void }) {
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

// ─── MILESTONES ──────────────────────────────────────────────────────────────

const CATS = ['All', 'Streaks', 'Focus', 'XP', 'Social']

export function MilestonesScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  const [activeTab, setActiveTab] = useState('All')

  const completedSessions = store.completedSessions ?? store.sessions.filter(s => s.completed).length
  const totalMinutesFocused = store.totalMinutesFocused ?? 0
  const currentStreak = store.currentStreak ?? 0
  const bestStreak = store.bestStreak ?? 0
  const maxStreak = Math.max(currentStreak, bestStreak)
  const totalXP = store.totalXP ?? 0
  const nightSessions = store.sessions.filter(s => { const h = new Date(s.date).getHours(); return s.completed && (h >= 22 || h < 5) }).length
  const squadMembersCount = store.squadMembers?.length ?? 0

  const BADGES = [
    { icon: (unlocked: boolean) => <IconCheck size={36} color={unlocked ? "#34D399" : "#555"} />, name: 'FIRST SESSION', desc: 'First session complete', unlocked: completedSessions >= 1, cat: 'Focus', progress: completedSessions, total: 1 },
    { icon: (unlocked: boolean) => <IconSeed size={36} color={unlocked ? "#34D399" : "#555"} />, name: 'FOCUS APPRENTICE', desc: '1 hour total focus', unlocked: totalMinutesFocused >= 60, cat: 'Focus', progress: Math.floor(totalMinutesFocused / 60), total: 1, progressText: `${Math.floor(totalMinutesFocused/60)}/1h` },
    { icon: (unlocked: boolean) => <IconFlame size={36} color={unlocked ? "#FFB800" : "#555"} />, name: 'STREAK STARTER', desc: '3-day streak', unlocked: maxStreak >= 3, cat: 'Streaks', progress: maxStreak, total: 3 },
    { icon: (unlocked: boolean) => <IconSword size={36} color={unlocked ? "#C0C0C0" : "#555"} />, name: 'WEEK WARRIOR', desc: '7-day streak', unlocked: bestStreak >= 7, cat: 'Streaks', progress: bestStreak, total: 7 },
    { icon: (unlocked: boolean) => <IconBrain size={36} color={unlocked ? "#BF7FFF" : "#555"} />, name: 'FOCUS MASTER', desc: '10 hours total focus', unlocked: totalMinutesFocused >= 600, cat: 'Focus', progress: Math.floor(totalMinutesFocused / 60), total: 10, progressText: `${Math.floor(totalMinutesFocused/60)}/10h` },
    { icon: (unlocked: boolean) => <IconHundred size={36} color={unlocked ? "#FFB800" : "#555"} />, name: 'CENTURION', desc: '100 sessions done', unlocked: completedSessions >= 100, cat: 'Focus', progress: completedSessions, total: 100 },
    { icon: (unlocked: boolean) => <IconMoon size={36} color={unlocked ? "#BF7FFF" : "#555"} />, name: 'NIGHT OWL', desc: 'Late-night session', unlocked: nightSessions >= 1, cat: 'Focus', progress: nightSessions, total: 1 },
    { icon: (unlocked: boolean) => <IconButterfly size={36} color={unlocked ? "#BF7FFF" : "#555"} />, name: 'SOCIAL BUTTERFLY', desc: '3 squad members', unlocked: squadMembersCount >= 3, cat: 'Social', progress: squadMembersCount, total: 3 },
    { icon: (unlocked: boolean) => <IconDiamond size={36} color={unlocked ? "#60A5FA" : "#555"} />, name: 'DIAMOND MIND', desc: '30-day streak', unlocked: bestStreak >= 30, cat: 'Streaks', progress: bestStreak, total: 30 },
    { icon: (unlocked: boolean) => <IconTrophy size={36} color={unlocked ? "#FFB800" : "#555"} />, name: 'LEGEND STATUS', desc: '10000 XP earned', unlocked: totalXP >= 10000, cat: 'XP', progress: totalXP, total: 10000 },
  ]

  const filtered = activeTab === 'All' ? BADGES : BADGES.filter((b) => b.cat === activeTab)
  const unlocked = BADGES.filter((b) => b.unlocked).length

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <ScreenHeader title="MILESTONES" subtitle={`${unlocked} of ${BADGES.length} unlocked`} onBack={() => onNavigate('home')} />

      {/* Progress bar */}
      <div style={{ padding: '8px clamp(16px, 4vw, 24px) 0', flexShrink: 0 }}>
        <div style={{ height: 4, background: '#141414', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${(unlocked / BADGES.length) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${theme.accent}, #BF7FFF)`, borderRadius: 2 }} />
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ padding: '8px clamp(16px, 4vw, 24px) 0', display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0 }}>
        {CATS.map((c) => (
          <button key={c} onClick={() => setActiveTab(c)} className="interactive-btn" style={{ height: 30, paddingInline: 12, borderRadius: 8, border: `1px solid ${activeTab === c ? theme.accent : '#1A1A1A'}`, background: activeTab === c ? `rgba(${theme.accentRgb},0.1)` : '#0A0A0A', color: activeTab === c ? theme.accent : '#7E7E87', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s ease' }}>{c}</button>
        ))}
      </div>

      {/* Scrollable Badge grid */}
      <div style={{ paddingInline: 'clamp(16px, 4vw, 24px)', paddingTop: 10, paddingBottom: 'clamp(70px, 10vh, 100px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {filtered.map((b, i) => (
          <div key={i} style={{ background: b.unlocked ? `rgba(${theme.accentRgb},0.04)` : '#0A0A0A', border: `1px solid ${b.unlocked ? `rgba(${theme.accentRgb},0.15)` : '#141414'}`, borderRadius: 14, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', overflow: 'hidden' }}>
            {!b.unlocked && (
              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                <IconLocked size={13} color="#555" />
              </div>
            )}
            <div style={{ lineHeight: 1 }}>{b.icon(b.unlocked)}</div>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: b.unlocked ? '#F5F5F5' : '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.1 }}>{b.name}</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87', marginTop: 2, lineHeight: 1.3 }}>{b.desc}</div>
            </div>
            {!b.unlocked && b.progress !== undefined && b.total !== undefined && (
              <div>
                <div style={{ height: 3, background: '#141414', borderRadius: 2, overflow: 'hidden', marginBottom: 2 }}>
                  <div style={{ width: `${(Math.min(b.progress, b.total) / b.total) * 100}%`, height: '100%', background: '#333', borderRadius: 2 }} />
                </div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9.5, color: '#7E7E87' }}>{b.progressText || `${b.progress}/${b.total}`}</div>
              </div>
            )}
            {b.unlocked && (
              <button
                onClick={() => onNavigate('success-milestone')}
                className="interactive-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `rgba(${theme.accentRgb},0.1)`, border: `1px solid rgba(${theme.accentRgb},0.2)`, borderRadius: 6, padding: '2px 6px', cursor: 'pointer', width: 'fit-content' }}
              >
                <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 10.5, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.06em' }}>EARNED ›</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <BottomNav active="stats" onNavigate={onNavigate} />
    </div>
  )
}

// ─── XP & AURA DASHBOARD ─────────────────────────────────────────────────────

const RANK_TIERS = [
  { name: 'BRONZE', color: '#CD7F32', min: 0 },
  { name: 'SILVER', color: '#A0A0A0', min: 500 },
  { name: 'GOLD', color: '#FFB800', min: 2000 },
  { name: 'PLATINUM', color: '#60A5FA', min: 5000 },
  { name: 'DIAMOND', color: '#BF7FFF', min: 10000 },
  { name: 'MOAI GOD', color: '#C8FF00', min: 25000 },
]

export function XpDashboardScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  const totalXP = store.totalXP
  const currentLevel = store.level

  const baseXP = currentLevel <= 1 ? 0 : Math.round(100 * Math.pow(currentLevel - 1, 1.5))
  const nextXpBase = Math.round(100 * Math.pow(currentLevel, 1.5))
  const progressPct = Math.min(100, Math.max(5, Math.round(((totalXP - baseXP) / Math.max(1, nextXpBase - baseXP)) * 100)))
  const xpRemaining = Math.max(0, nextXpBase - totalXP)

  const currentTier = RANK_TIERS[Math.min(RANK_TIERS.length - 1, Math.floor(currentLevel / 5))] || RANK_TIERS[1] 
  const nextTier = RANK_TIERS[Math.min(RANK_TIERS.length - 1, Math.floor(currentLevel / 5) + 1)] || RANK_TIERS[2]

  const recentActivity = store.sessions.slice(0, 5).map(s => ({
    label: s.completed ? `Session complete (${s.durationMinutes}m)` : `Distracted by ${s.attemptedApps[0] || 'app'}`,
    xp: s.completed ? s.durationMinutes * 10 : 0,
    time: new Date(s.date).toLocaleDateString(),
    icon: s.completed ? <IconCheck size={14} color="#34D399" /> : <IconCross size={14} color="#FF3B30" />
  }))

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <ScreenHeader title="XP & AURA" subtitle="Your energy. Your rank." onBack={() => onNavigate('home')} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {/* XP + Level card */}
        <div style={{ background: '#0A0A0A', border: '1px solid #161616', borderRadius: 16, padding: '14px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle, rgba(${theme.accentRgb},0.06) 0%, transparent 70%)` }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Total XP</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 'clamp(36px, 5vh, 44px)', color: '#BF7FFF', letterSpacing: '-1px', lineHeight: 1, filter: 'drop-shadow(0 0 12px rgba(191,127,255,0.25))' }}>{totalXP.toLocaleString()}</div>
            </div>
            <div style={{ background: `rgba(${theme.accentRgb},0.1)`, border: `1.5px solid rgba(${theme.accentRgb},0.3)`, borderRadius: 12, padding: '8px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 22, color: theme.accent, lineHeight: 1 }}>LVL {currentLevel}</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 9.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 1 }}>rank</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87' }}>Level {currentLevel} → {currentLevel + 1}</span>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: '#7E7E87' }}>{totalXP} / {nextXpBase} XP</span>
          </div>
          <div style={{ height: 5, background: '#141414', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${progressPct}%`, height: '100%', background: `linear-gradient(90deg, #BF7FFF, ${theme.accent})`, borderRadius: 3 }} />
          </div>
          <div style={{ marginTop: 6, fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87' }}>{xpRemaining} XP until Level {currentLevel + 1}</div>
        </div>

        {/* Rank tier */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <div style={{ flex: 1, background: '#0A0A0A', border: `1px solid ${currentTier.color}30`, borderRadius: 12, padding: '10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${currentTier.color}15`, border: `1.5px solid ${currentTier.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: currentTier.color, boxShadow: `0 0 8px ${currentTier.color}60` }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: currentTier.color, textTransform: 'uppercase' }}>{currentTier.name}</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 9.5, color: '#7E7E87' }}>Current tier</div>
            </div>
          </div>
          <div style={{ flex: 1, background: '#0A0A0A', border: '1px solid #161616', borderRadius: 12, padding: '10px', display: 'flex', alignItems: 'center', gap: 8, opacity: 0.5 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#111', border: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconLocked size={12} color="#555" />
            </div>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: nextTier.color, textTransform: 'uppercase' }}>{nextTier.name}</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 9.5, color: '#7E7E87' }}>Next at {nextTier.min.toLocaleString()} XP</div>
            </div>
          </div>
        </div>

        {/* Aura energy card → aura-progress */}
        <button
          onClick={() => onNavigate('aura-progress')}
          className="interactive-btn"
          style={{ background: `rgba(${theme.accentRgb},0.04)`, border: `1px solid rgba(${theme.accentRgb},0.15)`, borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', width: '100%', flexShrink: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconBolt size={18} color="#BF7FFF" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Aura Energy · {store.auraScore ?? 0}</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87' }}>{Math.floor(((store.auraScore ?? 0) / 1000) * 100)}% to max · view full breakdown</div>
            </div>
          </div>
          <span style={{ color: '#7E7E87', fontSize: 15 }}>›</span>
        </button>

        {/* Milestones link */}
        <button
          onClick={() => onNavigate('milestones')}
          className="interactive-btn"
          style={{ background: '#0A0A0A', border: '1px solid #161616', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', width: '100%', flexShrink: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconMedal size={16} color="#FFB800" />
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Milestones & Badges</span>
          </div>
          <span style={{ color: '#7E7E87', fontSize: 15 }}>›</span>
        </button>

        {/* Recent XP activity */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>RECENT ACTIVITY</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: '#0A0A0A', border: '1px solid #161616', borderRadius: 12, overflow: 'hidden' }}>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderBottom: i < recentActivity.length - 1 ? '1px solid #0E0E0E' : 'none', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ flexShrink: 0 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#888', fontWeight: 500 }}>{a.label}</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 9.5, color: '#7E7E87' }}>{a.time}</div>
                  </div>
                </div>
                <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, color: '#BF7FFF', letterSpacing: '0.04em', flexShrink: 0 }}>+{a.xp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="stats" onNavigate={onNavigate} />
    </div>
  )
}

// ─── AURA PROGRESS ───────────────────────────────────────────────────────────

export function AuraProgressScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  
  const chronologicalSessions = [...(store.sessions || [])].reverse()
  let runningAura = 100
  const allEntries = chronologicalSessions.map(s => {
    if (s.completed) {
      runningAura += 25
      return { session: s, auraChange: 25, isDeduction: false }
    } else {
      const deduction = Math.floor(runningAura * 0.5)
      runningAura -= deduction
      return { session: s, auraChange: -deduction, isDeduction: true }
    }
  })

  const displayEntries = [...allEntries].reverse().slice(0, 10)
  
  const AURA_SOURCES = displayEntries.map(e => ({
    icon: e.isDeduction ? <IconSkull size={16} color="#FF3B30" /> : <IconCheck size={16} color="#34D399" />,
    label: e.isDeduction ? 'Missed Goal' : 'Deep Focus',
    aura: e.auraChange, 
    desc: new Date(e.session.date).toLocaleDateString(),
    color: e.isDeduction ? '#FF3B30' : theme.accent
  }))

  const totalAura = store.auraScore ?? Math.max(0, runningAura)
  const maxAura = 1000
  const pct = Math.max(0, Math.min(100, (totalAura / maxAura) * 100))
  const r = 85
  const circ = 2 * Math.PI * r
  const dashoffset = circ * (1 - pct / 100)

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <ScreenHeader title="YOUR AURA" subtitle="A vibe score only you can earn." onBack={() => onNavigate('xp-dashboard')} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {/* Aura ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'relative', width: 200, height: 200 }}>
            {/* Glow */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle, rgba(${theme.accentRgb},0.06) 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="100" cy="100" r={r} fill="none" stroke="#0E0E0E" strokeWidth="7" />
              {/* Gradient arc */}
              <defs>
                <linearGradient id="aura-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#BF7FFF" />
                  <stop offset="50%" stopColor={theme.accent} />
                  <stop offset="100%" stopColor="#FFB800" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r={r} fill="none" stroke="url(#aura-grad)" strokeWidth="7" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dashoffset} style={{ filter: `drop-shadow(0 0 8px rgba(${theme.accentRgb},0.4))`, transition: 'stroke-dashoffset 1s ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <IconSparkle size={26} color="#FFB800" />
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 38, color: theme.accent, letterSpacing: '-1px', lineHeight: 1, filter: `drop-shadow(0 0 12px rgba(${theme.accentRgb},0.3))` }}>{totalAura}</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AURA</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 12, color: '#555', textTransform: 'uppercase' }}>/ {maxAura}</div>
            </div>
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#7E7E87', textAlign: 'center', marginTop: 2 }}>
            Top {Math.max(1, 100 - Math.floor((totalAura / 1000) * 85))}% globally · <span style={{ color: theme.accent, display: 'inline-flex', alignItems: 'center', gap: 4 }}>{store.currentStreak > 0 ? <><IconFlame size={12} color="#FFB800" /> {store.currentStreak}d streak active</> : 'Lock in to grow aura'}</span>
          </div>
        </div>

        {/* Aura sources */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>AURA BREAKDOWN</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {AURA_SOURCES.map((s, i) => {
              const barPct = Math.min(100, (Math.abs(s.aura) / Math.max(1, totalAura)) * 100)
              return (
                <div key={i} style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ flexShrink: 0 }}>{s.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, color: '#D0D0D0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</span>
                      <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 13, color: s.color }}>{s.aura > 0 ? '+' : ''}{s.aura}</span>
                    </div>
                    <div style={{ height: 3, background: '#141414', borderRadius: 2, overflow: 'hidden', marginBottom: 3 }}>
                      <div style={{ width: `${barPct}%`, height: '100%', background: s.color, borderRadius: 2, boxShadow: `0 0 4px ${s.color}50` }} />
                    </div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87' }}>{s.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <BottomNav active="stats" onNavigate={onNavigate} />
    </div>
  )
}
