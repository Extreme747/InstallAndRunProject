import { useEffect } from 'react'
import { useTheme } from '../utils/theme'
import type { Screen } from '../types'
import { BottomNav } from './HomeScreen'
import { useAppStore } from '../store/useAppStore'
import {
  IconBolt,
  IconTarget,
  IconCalendar,
  IconTrophy,
  IconCheck,
  IconGift,
  IconCrown,
  IconMoon
} from '../components/Icons'

interface Props {
  onNavigate: (screen: Screen) => void
}

// ─── shared primitives ───────────────────────────────────────────────────────

function ScreenHeader({
  title,
  subtitle,
  right,
  onBack,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
  onBack?: () => void
}) {
  const theme = useTheme()
  return (
    <div style={{ padding: 'max(14px, env(safe-area-inset-top, 14px)) clamp(16px, 4vw, 24px) 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 'clamp(24px, 3.5vh, 30px)', color: '#F5F5F5', textTransform: 'uppercase', letterSpacing: '-0.3px', lineHeight: 1 }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginTop: 2 }}>{subtitle}</div>
          )}
        </div>
      </div>
      {right}
    </div>
  )
}

function ProgressBar({ pct, color }: { pct: number; color?: string }) {
  const theme = useTheme()
  const barColor = color || theme.accent
  return (
    <div style={{ height: 4, background: '#141414', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: barColor, borderRadius: 2, transition: 'width 0.4s ease' }} />
    </div>
  )
}

function XpPill({ xp }: { xp: number }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(191,127,255,0.1)', border: '1px solid rgba(191,127,255,0.2)', borderRadius: 8, padding: '2px 7px' }}>
      <IconBolt size={11} color="#BF7FFF" />
      <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 12, color: '#BF7FFF', letterSpacing: '0.04em' }}>+{xp} XP</span>
    </div>
  )
}

// ─── DAILY CHALLENGES ────────────────────────────────────────────────────────

function ChallengesTabBar({ active, onNavigate }: { active: Screen; onNavigate: (s: Screen) => void }) {
  const theme = useTheme()
  const tabs: { id: Screen; label: string; icon: React.ReactNode }[] = [
    { id: 'daily-challenges', label: 'Daily', icon: <IconTarget size={14} color={active === 'daily-challenges' ? theme.accent : '#7E7E87'} /> },
    { id: 'weekly-missions', label: 'Weekly', icon: <IconCalendar size={14} color={active === 'weekly-missions' ? theme.accent : '#7E7E87'} /> },
    { id: 'focus-challenges', label: 'Events', icon: <IconBolt size={14} color={active === 'focus-challenges' ? theme.accent : '#7E7E87'} /> },
  ]
  return (
    <div style={{ display: 'flex', padding: '8px clamp(16px, 4vw, 24px) 0', gap: 6, flexShrink: 0 }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onNavigate(t.id)}
          className="interactive-btn"
          style={{
            flex: 1, height: 32, borderRadius: 8,
            border: `1px solid ${active === t.id ? theme.accent : '#1A1A1A'}`,
            background: active === t.id ? `rgba(${theme.accentRgb},0.1)` : '#0A0A0A',
            color: active === t.id ? theme.accent : '#7E7E87',
            fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 13,
            textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5
          }}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  )
}

export function DailyChallengesScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  
  useEffect(() => {
    store.fetchChallenges().catch(() => {})
  }, [])

  const totalMins = store.totalMinutesFocused
  const streak = store.currentStreak
  const completedCount = store.sessions.filter((s: any) => s.completed).length
  
  const dailyChallenges = store.challenges
    .filter((c: any) => c.type === 'daily')
    .map((c: any) => {
      let currentVal = 0
      if (c.title.includes('30m')) currentVal = totalMins
      else if (c.title.includes('Streak')) currentVal = streak
      else currentVal = completedCount

      const target = c.target || 1
      const done = c.completed || currentVal >= target
      const pct = c.completed ? 100 : Math.min(100, Math.round((currentVal / target) * 100))

      return {
        id: c.id,
        title: c.title,
        desc: c.description,
        xp: c.xpReward,
        progress: pct,
        done,
        completed: !!c.completed,
      }
    })

  const doneCount = dailyChallenges.filter((c: any) => c.done).length
  const claimableChallenges = dailyChallenges.filter((c: any) => c.done && !c.completed)
  const totalDailyXp = dailyChallenges.reduce((sum: number, c: any) => sum + (c.xp || 100), 0)
  
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  const diffMs = midnight.getTime() - now.getTime()
  const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60))
  const minsLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const timeUntilMidnight = `${hoursLeft}h ${minsLeft}m`

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <ScreenHeader
        title="DAILY CHALLENGES"
        subtitle={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`}
        onBack={() => onNavigate('home')}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: `rgba(${theme.accentRgb},0.08)`, border: `1px solid rgba(${theme.accentRgb},0.2)`, borderRadius: 8, padding: '4px 8px' }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: theme.accent }}>{doneCount}/{dailyChallenges.length}</span>
          </div>
        }
      />
      <ChallengesTabBar active="daily-challenges" onNavigate={onNavigate} />

      {dailyChallenges.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7E7E87', fontFamily: "'DM Sans'", fontSize: 14 }}>Loading challenges...</div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
          <div style={{ background: doneCount === dailyChallenges.length && dailyChallenges.length > 0 ? `rgba(${theme.accentRgb},0.08)` : '#0A0A0A', border: `1px solid ${doneCount === dailyChallenges.length && dailyChallenges.length > 0 ? `rgba(${theme.accentRgb},0.25)` : '#161616'}`, borderRadius: 14, padding: '10px 14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: doneCount === dailyChallenges.length && dailyChallenges.length > 0 ? theme.accent : '#7E7E87', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                {doneCount === dailyChallenges.length && dailyChallenges.length > 0 ? <><IconTrophy size={13} color="#FFB800" /> All done! Legendary.</> : `${dailyChallenges.length - doneCount} challenges left today`}
              </span>
              <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 12, color: '#BF7FFF' }}>{totalDailyXp} XP total</span>
            </div>
            <ProgressBar pct={dailyChallenges.length > 0 ? (doneCount / dailyChallenges.length) * 100 : 0} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {dailyChallenges.map((c: any) => (
              <div
                key={c.id}
                style={{ background: c.done ? `rgba(${theme.accentRgb},0.04)` : '#0A0A0A', border: `1px solid ${c.done ? `rgba(${theme.accentRgb},0.15)` : '#161616'}`, borderRadius: 14, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'flex-start', opacity: c.done ? 0.7 : 1 }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: c.done ? `rgba(${theme.accentRgb},0.1)` : '#111', border: `1px solid ${c.done ? `rgba(${theme.accentRgb},0.2)` : '#1A1A1A'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {c.done ? <IconCheck size={16} color="#34D399" /> : <IconTarget size={16} color="#FFB800" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, color: c.done ? '#888' : '#F5F5F5', textTransform: 'uppercase', letterSpacing: '0.02em', textDecoration: c.done ? 'line-through' : 'none' }}>{c.title}</span>
                    <XpPill xp={c.xp} />
                  </div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginBottom: c.done ? 0 : 4 }}>{c.desc}</div>
                  {!c.done && c.progress > 0 && (
                    <>
                      <ProgressBar pct={c.progress} />
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87', marginTop: 2 }}>{c.progress}% complete</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Sub-bar */}
      <div style={{ padding: '6px clamp(16px, 4vw, 24px) 6px', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <button onClick={() => onNavigate('empty-challenges')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87', textDecoration: 'underline', padding: 0 }}>empty state</button>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconMoon size={11} color="#BF7FFF" /> {timeUntilMidnight}
        </div>
        {claimableChallenges.length > 0 && (
          <button
            onClick={() => {
              claimableChallenges.forEach((challenge: any) => {
                store.claimChallenge(challenge.id, challenge.xp || 100)
              })
              onNavigate('success-challenge')
            }}
            className="interactive-btn"
            style={{ height: 32, paddingInline: 12, borderRadius: 8, background: theme.accent, border: 'none', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, color: theme.bg, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <IconGift size={14} color="#080808" /> CLAIM ({claimableChallenges.length})
          </button>
        )}
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  )
}

// ─── WEEKLY MISSIONS ─────────────────────────────────────────────────────────

export function WeeklyMissionsScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  
  useEffect(() => {
    store.fetchChallenges().catch(() => {})
  }, [])

  const totalMins = store.totalMinutesFocused
  const streak = store.currentStreak
  const completedCount = store.sessions.filter((s: any) => s.completed).length
  const isSubscribed = store.isSubscribed
  
  const weeklyMissions = store.challenges
    .filter((c: any) => c.type === 'weekly')
    .map((c: any) => {
      let currentVal = 0
      if (c.title.includes('5-Day Streak')) currentVal = streak
      else if (c.title.includes('5 Hours')) currentVal = totalMins
      else currentVal = completedCount

      const target = c.target || 1
      const done = currentVal >= target
      const pct = Math.min(100, Math.round((currentVal / target) * 100))

      return {
        id: c.id,
        title: c.title,
        desc: c.description,
        xp: c.xpReward,
        progress: pct,
        done,
        completed: !!c.completed,
        current: Math.min(target, currentVal),
        target,
        unit: c.title.includes('Hours') ? 'mins' : 'times',
        locked: !isSubscribed && c.title.includes('Night')
      }
    })
    
  const nowDay = new Date().getDay()
  const daysLeft = nowDay === 0 ? 0 : 7 - nowDay
  const xpAtStake = weeklyMissions.reduce((acc: number, m: any) => acc + (m.xp || 0), 0)
  const earnedSoFar = weeklyMissions.filter((m: any) => m.done).reduce((acc: number, m: any) => acc + (m.xp || 0), 0)

  const claimableWeekly = weeklyMissions.filter((m: any) => m.done && !m.completed && !m.locked)

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <ScreenHeader
        title="WEEKLY MISSIONS"
        subtitle="Longer-term discipline targets"
        onBack={() => onNavigate('home')}
        right={
          <div style={{ background: '#0A0A0A', border: '1px solid #161616', borderRadius: 8, padding: '4px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: '#FFB800', lineHeight: 1 }}>{daysLeft}</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 9.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.06em' }}>days left</div>
          </div>
        }
      />
      <ChallengesTabBar active="weekly-missions" onNavigate={onNavigate} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {[
            { label: 'XP at stake', value: xpAtStake.toLocaleString(), color: '#BF7FFF' },
            { label: 'Earned so far', value: earnedSoFar.toLocaleString(), color: theme.accent },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, background: '#0A0A0A', border: '1px solid #161616', borderRadius: 12, padding: '10px 12px' }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 22, color: s.color, letterSpacing: '-0.3px' }}>{s.value} XP</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {weeklyMissions.map((m: any, i: number) => (
            <div
              key={i}
              style={{ background: '#0A0A0A', border: `1px solid ${m.locked ? 'rgba(191,127,255,0.15)' : '#161616'}`, borderRadius: 14, padding: '12px 14px', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#111', border: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconTrophy size={18} color="#FFB800" /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, color: m.locked ? '#777' : '#F5F5F5', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{m.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      {m.locked && (
                        <div style={{ background: 'rgba(191,127,255,0.12)', border: '1px solid rgba(191,127,255,0.25)', borderRadius: 6, padding: '1px 6px', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <IconCrown size={10} color="#FFB800" />
                          <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 9.5, color: '#BF7FFF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>PRO</span>
                        </div>
                      )}
                      <XpPill xp={m.xp} />
                    </div>
                  </div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginTop: 1 }}>{m.desc}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1 }}><ProgressBar pct={m.progress} color={m.locked ? '#BF7FFF' : theme.accent} /></div>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: '#7E7E87', flexShrink: 0 }}>{m.current}/{m.target} {m.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {claimableWeekly.length > 0 && (
        <div style={{ padding: '6px clamp(16px, 4vw, 24px) 6px', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
          <button
            onClick={() => {
              claimableWeekly.forEach((challenge: any) => {
                store.claimChallenge(challenge.id, challenge.xp || 250)
              })
              onNavigate('success-challenge')
            }}
            className="interactive-btn"
            style={{ height: 34, paddingInline: 14, borderRadius: 8, background: theme.accent, border: 'none', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: theme.bg, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <IconGift size={14} color="#080808" /> CLAIM WEEKLY XP ({claimableWeekly.length})
          </button>
        </div>
      )}

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  )
}


export function FocusChallengesScreen({ onNavigate }: Props) {
  const theme = useTheme()
  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden', position: 'relative' }}>
      <ScreenHeader
        title="FOCUS CHALLENGES"
        subtitle="Community-wide events. Compete & earn."
        onBack={() => onNavigate('home')}
      />
      <ChallengesTabBar active="focus-challenges" onNavigate={onNavigate} />

      <div style={{ padding: '12px clamp(16px, 4vw, 24px) 0', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ marginBottom: 8 }}><IconBolt size={36} color="#BF7FFF" /></div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 20, fontWeight: 700, color: '#888', textTransform: 'uppercase', textAlign: 'center' }}>No active events right now. Check back soon!</div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  )
}
