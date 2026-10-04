import type { Screen } from '../types'
import { BottomNav } from './HomeScreen'
import { useAppStore } from '../store/useAppStore'
import { useTheme } from '../utils/theme'
import {
  IconFlame,
  IconTrophy,
  IconTimer,
  IconCheck,
  IconMedal,
  IconInsight,
  IconBlocked,
  IconHeatmap,
  IconCopy,
  IconChart,
  IconShare,
} from '../components/Icons'

function StatCard({ icon, value, label, accent }: { icon: React.ReactNode; value: string; label: string; accent?: string }) {
  return (
    <div style={{ flex: 1, background: '#0A0A0A', border: '1px solid #161616', borderRadius: 18, padding: '16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>{icon}</div>
        {accent && <div style={{ width: 6, height: 6, borderRadius: 3, background: accent }} />}
      </div>
      <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 28, color: '#F5F5F5', marginTop: 8 }}>{value}</div>
      <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87' }}>{label}</div>
    </div>
  )
}
interface Props {
  onNavigate: (screen: Screen) => void
}

export default function StatsScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  const currentStreak = useAppStore((s) => s.currentStreak)
  const bestStreak = useAppStore((s) => s.bestStreak)
  const totalMinutes = useAppStore((s) => s.totalMinutesFocused)
  const sessions = useAppStore((s) => s.sessions)

  const completedSessions = sessions.filter((s) => s.completed)
  const totalHours = (totalMinutes / 60).toFixed(1)

  // Compute WEEK_DATA based on actual sessions
  const WEEK_DATA = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({ day, minutes: 0, isToday: false }))
  const now = new Date()
  const dayOfWeek = now.getDay() // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - mondayOffset)
  weekStart.setHours(0, 0, 0, 0)

  const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Make Mon=0, Sun=6
  WEEK_DATA[todayIndex].isToday = true
  
  completedSessions.filter(s => new Date(s.date) >= weekStart).forEach(session => {
    const sessionDate = new Date(session.date)
    const sessionDay = sessionDate.getDay()
    const sessionIndex = sessionDay === 0 ? 6 : sessionDay - 1
    WEEK_DATA[sessionIndex].minutes += session.durationMinutes
  })

  const MAX = Math.max(...WEEK_DATA.map(d => d.minutes), 60)

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
      {/* Header */}
      <div style={{ padding: 'max(14px, env(safe-area-inset-top, 14px)) clamp(16px, 4vw, 24px) 6px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
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
              letterSpacing: '-0.5px',
              lineHeight: 1,
            }}
          >
            YOUR STATS
          </div>
          <div
            style={{
              fontFamily: "'DM Sans'",
              fontSize: 11,
              color: '#7E7E87',
              marginTop: 1,
            }}
          >
            {completedSessions.length > 0
              ? `${completedSessions.length} focus sessions completed. Keep it up!`
              : 'No sessions completed yet. Lock in to start building your stats!'}
          </div>
        </div>
      </div>

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {/* Stat cards row 1 */}
        <div style={{ display: 'flex', gap: 8 }}>
          <StatCard icon={<IconFlame size={20} color="#FFB800" glow />} value={String(currentStreak)} label="Current Streak" accent="#FFB800" />
          <StatCard icon={<IconTrophy size={20} color="#C8FF00" glow />} value={String(bestStreak)} label="Best Streak" accent={theme.accent} />
        </div>

        {/* Stat cards row 2 */}
        <div style={{ display: 'flex', gap: 8, width: '100%', boxSizing: 'border-box' }}>
          <StatCard icon={<IconTimer size={24} color="#C8FF00" />} value={`${totalHours}h`} label="Total Focus Time" />
          <StatCard icon={<IconCheck size={24} color="#34D399" />} value={String(completedSessions.length)} label="Sessions Done" />
        </div>

        {/* Weekly chart */}
        <div
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: '#0A0A0A',
            border: '1px solid #161616',
            borderRadius: 18,
            padding: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontFamily: "'Barlow Condensed'",
                fontWeight: 700,
                fontSize: 14,
                color: '#7E7E87',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              THIS WEEK
            </div>
            <div
              style={{
                fontFamily: "'DM Sans'",
                fontSize: 12,
                color: '#7E7E87',
              }}
            >
              Mon → Sun
            </div>
          </div>

          {/* Bar chart */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
            {WEEK_DATA.map((d, i) => {
              const barH = d.minutes ? Math.max(6, (d.minutes / MAX) * 72) : 4
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    justifyContent: 'flex-end',
                    height: 80,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: barH,
                      borderRadius: 4,
                      background: d.isToday
                        ? theme.accent
                        : d.minutes
                          ? '#1A3800'
                          : '#0E0E0E',
                      boxShadow: d.isToday ? `0 0 8px rgba(${theme.accentRgb},0.3)` : 'none',
                      transition: 'height 0.4s ease',
                      border: d.isToday ? 'none' : d.minutes ? '1px solid #203000' : '1px solid #141414',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono'",
                      fontSize: 10,
                      color: d.isToday ? theme.accent : '#7E7E87',
                      fontWeight: d.isToday ? 700 : 400,
                    }}
                  >
                    {d.day}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div
            style={{
              marginTop: 12,
              fontFamily: "'DM Sans'",
              fontSize: 11,
              color: '#7E7E87',
              textAlign: 'right',
            }}
          >
            Peak: {MAX}m
          </div>
        </div>

        {/* Milestones banner */}
        <button
          onClick={() => onNavigate('milestones')}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: `rgba(${theme.accentRgb},0.05)`,
            border: `1px solid rgba(${theme.accentRgb},0.15)`,
            borderRadius: 16,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconMedal size={20} color="#FFB800" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Milestones & Badges</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginTop: 1 }}>{store.completedSessions} sessions logged</div>
            </div>
          </div>
          <span style={{ color: '#7E7E87', fontSize: 16 }}>›</span>
        </button>

        {/* Insight cards row */}
        <div style={{ display: 'flex', gap: 8, width: '100%', boxSizing: 'border-box' }}>
          {/* Focus Insights */}
          <button
            onClick={() => onNavigate('focus-insights')}
            style={{
              flex: 1,
              background: '#0A0A0A',
              border: '1px solid #161616',
              borderRadius: 14,
              padding: '12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <IconInsight size={18} color="#FFB800" />
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, color: '#D0D0D0', textTransform: 'uppercase', marginTop: 4 }}>Insights</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87', marginTop: 2 }}>{store.totalMinutesFocused}m total</div>
          </button>
          {/* Distraction Report */}
          <button
            onClick={() => onNavigate('distraction-report')}
            style={{
              flex: 1,
              background: '#0A0A0A',
              border: '1px solid #161616',
              borderRadius: 14,
              padding: '12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <IconBlocked size={18} color="#FF3B30" />
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, color: '#D0D0D0', textTransform: 'uppercase', marginTop: 4 }}>Distractions</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87', marginTop: 2 }}>{store.distractionCount || 0} blocks total</div>
          </button>
          {/* Heatmap */}
          <button
            onClick={() => onNavigate('heatmap')}
            style={{
              flex: 1,
              background: '#0A0A0A',
              border: '1px solid #161616',
              borderRadius: 14,
              padding: '12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <IconHeatmap size={18} color="#C8FF00" />
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, color: '#D0D0D0', textTransform: 'uppercase', marginTop: 4 }}>Heatmap</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87', marginTop: 2 }}>52-week view</div>
          </button>
        </div>

        {/* Session history link */}
        <div style={{ width: '100%', boxSizing: 'border-box' }}>
          <button
            onClick={() => onNavigate('session-history')}
            style={{
              width: '100%',
              background: '#0A0A0A',
              border: '1px solid #141414',
              borderRadius: 14,
              padding: '11px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconCopy size={16} color="#C8FF00" />
              <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 15, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Session History</span>
            </div>
            <span style={{ color: '#7E7E87', fontSize: 16 }}>›</span>
          </button>
        </div>

        {/* Reports row */}
        <div style={{ display: 'flex', gap: 8, width: '100%', boxSizing: 'border-box' }}>
          <button
            onClick={() => onNavigate('daily-recap')}
            style={{ flex: 1, background: '#0A0A0A', border: '1px solid #161616', borderRadius: 14, padding: '11px 12px', cursor: 'pointer', textAlign: 'left' }}
          >
            <IconCopy size={16} color="#C8FF00" />
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, color: '#D0D0D0', textTransform: 'uppercase', marginTop: 3 }}>Daily Recap</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87', marginTop: 1 }}>Today's summary</div>
          </button>
          <button
            onClick={() => onNavigate('weekly-report')}
            style={{ flex: 1, background: '#0A0A0A', border: '1px solid #161616', borderRadius: 14, padding: '11px 12px', cursor: 'pointer', textAlign: 'left' }}
          >
            <IconChart size={16} color="#C8FF00" />
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, color: '#D0D0D0', textTransform: 'uppercase', marginTop: 3 }}>Weekly Report</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87', marginTop: 1 }}>Full week view</div>
          </button>
        </div>

      {/* Share streak */}
      <div style={{ padding: '4px 0 10px', display: 'flex' }}>
        <button
          onClick={() => onNavigate('share-cards')}
          className="interactive-btn"
          style={{
            flex: 1,
            height: 46,
            borderRadius: 14,
            background: theme.accent,
            border: 'none',
            fontFamily: "'Barlow Condensed'",
            fontWeight: 800,
            fontSize: 16,
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
          <IconShare size={16} color="#080808" /> SHARE STREAK
        </button>
      </div>
      </div>

      <BottomNav active="stats" onNavigate={onNavigate} />
    </div>
  )
}

