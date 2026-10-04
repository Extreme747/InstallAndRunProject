import { useState } from 'react'
import { useTheme } from '../utils/theme'
import type { Screen } from '../types'
import { BottomNav } from './HomeScreen'
import { useAppStore } from '../store/useAppStore'
import { formatAppName } from './BlockedAppsScreen'
import {
  IconChart,
  IconHeatmap,
  IconCalendar,
  IconInsight,
  IconTimer,
  IconCheck,
  IconCross,
  IconShield,
  IconFlame,
  IconBlocked,
  IconBolt,
  IconScroll,
  getMascotComponent,
} from '../components/Icons'

interface Props { onNavigate: (screen: Screen) => void }

function SH({ title, subtitle, onBack }: { title: string; subtitle?: string; onBack?: () => void }) {
  const theme = useTheme()
  const handleBack = () => {
    if (typeof (window as any).__handleBack === 'function') {
      (window as any).__handleBack()
    } else if (onBack) {
      onBack()
    }
  }
  return (
    <div style={{ padding: 'max(14px, env(safe-area-inset-top, 14px)) clamp(16px, 4vw, 24px) 0', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
      {onBack && (
        <button
          onClick={handleBack}
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

// ─── DEEP ANALYTICS ──────────────────────────────────────────────────────────

export function DeepAnalyticsScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const [tab, setTab] = useState<'focus' | 'apps' | 'time'>('focus')
  const sessions = useAppStore((s) => s.sessions)
  const totalMinutesFocused = useAppStore((s) => s.totalMinutesFocused)

  const TABS = [
    { id: 'focus', label: 'Focus' },
    { id: 'apps', label: 'Apps' },
    { id: 'time', label: 'Time of Day' },
  ] as const

  const NAV_TABS = [
    { id: 'deep-analytics' as Screen, label: 'Stats', icon: IconChart },
    { id: 'heatmap' as Screen, label: 'Heatmap', icon: IconHeatmap },
    { id: 'calendar-view' as Screen, label: 'Calendar', icon: IconCalendar },
    { id: 'focus-insights' as Screen, label: 'Insights', icon: IconInsight },
  ]

  const completedSessions = sessions.filter((s) => s.completed)
  const totalCount = sessions.length
  const completionRateNum = totalCount > 0 ? Math.round((completedSessions.length / totalCount) * 100) : 0
  const avgMins = completedSessions.length > 0 ? Math.round(totalMinutesFocused / completedSessions.length) : 0
  const maxSessionMins = completedSessions.length > 0 ? Math.max(...completedSessions.map((s) => s.durationMinutes)) : 0

  const focusData = {
    avgSession: `${avgMins}m`,
    longestSession: `${maxSessionMins}m`,
    totalTime: `${(totalMinutesFocused / 60).toFixed(1)}h`,
    focusScore: Math.min(100, Math.round(completionRateNum * 0.8 + Math.min(20, completedSessions.length * 2))),
    completionRate: `${completionRateNum}%`,
    dailyAvg: `${Math.round(totalMinutesFocused / Math.max(1, new Set(completedSessions.map((s: any) => s.date.slice(0, 10))).size))}m`,
  }

  const appCounts: Record<string, number> = {}
  sessions.forEach((s) => {
    if (s.attemptedApps) {
      s.attemptedApps.forEach((rawApp) => {
        if (rawApp && rawApp !== 'Focus Session') {
          const app = formatAppName(rawApp).name || rawApp
          appCounts[app] = (appCounts[app] || 0) + 1
        }
      })
    }
  })

  const topBlockedApps = Object.entries(appCounts)
    .map(([app, blocks]) => ({ app, blocks, color: theme.accent }))
    .sort((a, b) => b.blocks - a.blocks)

  const maxBlocks = topBlockedApps.length > 0 ? Math.max(...topBlockedApps.map((a) => a.blocks)) : 1

  const hourBuckets = [6, 8, 10, 12, 14, 16, 18, 20, 22, 0, 2, 4]
  const timeOfDayData = hourBuckets.map(h => ({
    hour: h === 0 ? '12AM' : h < 12 ? `${h}AM` : h === 12 ? '12PM' : `${h - 12}PM`,
    sessions: 0
  }))
  sessions.forEach(s => {
    if (s.completed) {
      const h = new Date(s.date).getHours()
      const bucketIdx = Math.floor(((h - 6 + 24) % 24) / 2)
      if (bucketIdx >= 0 && bucketIdx < 12) {
        timeOfDayData[bucketIdx].sessions++
      }
    }
  })
  const maxSessions = Math.max(1, ...timeOfDayData.map((d) => d.sessions))

  const last30Days = Array.from({ length: 30 }, () => 0)
  const now = new Date()
  now.setHours(0,0,0,0)
  sessions.forEach(s => {
    const d = new Date(s.date)
    d.setHours(0,0,0,0)
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 3600 * 24))
    if (diffDays >= 0 && diffDays < 30) {
      last30Days[29 - diffDays] += s.durationMinutes || 0
    }
  })
  const maxTrend = Math.max(1, ...last30Days)

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <SH title="DEEP ANALYTICS" subtitle="All-time focus intelligence" onBack={() => onNavigate('home')} />

      {/* Top nav tabs → other analytics screens */}
      <div style={{ padding: '8px clamp(16px, 4vw, 24px) 0', display: 'flex', gap: 5, overflowX: 'auto', flexShrink: 0 }} className="scrollbar-hide">
        {NAV_TABS.map((t) => {
          const Icon = t.icon
          const isActive = t.id === 'deep-analytics'
          return (
            <button
              key={t.id}
              onClick={() => onNavigate(t.id)}
              className="interactive-btn"
              style={{
                height: 30,
                paddingInline: 10,
                borderRadius: 8,
                border: `1px solid ${isActive ? theme.accent : '#1A1A1A'}`,
                background: isActive ? `rgba(${theme.accentRgb},0.1)` : '#0A0A0A',
                color: isActive ? theme.accent : '#7E7E87',
                fontFamily: "'Barlow Condensed'",
                fontWeight: 700,
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Icon size={13} color={isActive ? theme.accent : '#7E7E87'} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Tab switcher */}
      <div style={{ padding: '6px clamp(16px, 4vw, 24px) 0', display: 'flex', gap: 6, flexShrink: 0 }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="interactive-btn" style={{ flex: 1, height: 32, borderRadius: 8, border: `1px solid ${tab === t.id ? theme.accent : '#1A1A1A'}`, background: tab === t.id ? `rgba(${theme.accentRgb},0.1)` : '#0A0A0A', color: tab === t.id ? theme.accent : '#7E7E87', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.15s ease' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
      {tab === 'focus' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* KPI grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            {[
              { label: 'Total Focus Time', value: focusData.totalTime, color: theme.accent, icon: IconTimer },
              { label: 'Avg Session', value: focusData.avgSession, color: '#60A5FA', icon: IconChart },
              { label: 'Completion Rate', value: focusData.completionRate, color: '#BF7FFF', icon: IconCheck },
              { label: 'Daily Average', value: focusData.dailyAvg, color: '#FFB800', icon: IconCalendar },
            ].map((k) => {
              const IconComp = k.icon
              return (
                <div key={k.label} style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 16, padding: '12px 14px' }}>
                  <IconComp size={20} color={k.color} />
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 24, color: k.color, marginTop: 4, letterSpacing: '-0.3px', lineHeight: 1 }}>{k.value}</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{k.label}</div>
                </div>
              )
            })}
          </div>

          {/* Focus score */}
          <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 18, padding: '16px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 11, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 2 }}>FOCUS SCORE</div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 40, color: theme.accent, lineHeight: 1 }}>{focusData.focusScore}</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#555' }}>Top {Math.max(1, 100 - Math.floor(focusData.focusScore * 0.85))}% of users</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'flex-end' }}>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87' }}>Longest: {focusData.longestSession}</div>
              </div>
            </div>
            <div style={{ height: 8, background: '#141414', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${focusData.focusScore}%`, height: '100%', background: `linear-gradient(90deg, ${theme.accent}, #BF7FFF)`, borderRadius: 4 }} />
            </div>
          </div>

          {/* Monthly trend */}
          <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 18, padding: '14px' }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 11, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>30-DAY TREND</div>
            <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 56 }}>
              {last30Days.map((mins, i) => {
                const h = Math.max(4, (mins / maxTrend) * 56)
                const isToday = i === 29
                return <div key={i} style={{ flex: 1, height: h, borderRadius: 2, background: isToday ? theme.accent : '#1A3800', opacity: i < 20 ? 0.5 + (i / 20) * 0.5 : 1 }} />
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: '#7E7E87' }}>30 days ago</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: theme.accent }}>Today</span>
            </div>
          </div>
        </div>
      )}

      {tab === 'apps' && (
        <div style={{ padding: '12px 24px 0', flex: 1 }}>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: '#7E7E87', marginBottom: 12 }}>Apps blocked during focus sessions this month</div>
          {topBlockedApps.length === 0 ? (
            <div style={{ padding: '28px 16px', background: '#0A0A0A', borderRadius: 18, border: '1px solid #141414', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}><IconShield size={36} color={theme.accent} /></div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 18, color: theme.accent, textTransform: 'uppercase', fontWeight: 800 }}>0 APPS BLOCKED THIS MONTH</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#555', marginTop: 2 }}>Clean streak! No distractions attempted yet.</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {topBlockedApps.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: '#111', border: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 11, color: '#7E7E87', flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: '#D0D0D0', fontWeight: 600 }}>{a.app}</span>
                        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: '#FF3B30' }}>{a.blocks}× blocked</span>
                      </div>
                      <div style={{ height: 6, background: '#111', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${(a.blocks / maxBlocks) * 100}%`, height: '100%', background: 'rgba(255,59,48,0.6)', borderRadius: 3 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, background: 'rgba(255,59,48,0.06)', border: '1px solid rgba(255,59,48,0.15)', borderRadius: 14, padding: '12px 14px' }}>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 18, color: '#FF3B30' }}>{topBlockedApps.reduce((acc, a) => acc + a.blocks, 0)} total blocks this month</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#555', marginTop: 2 }}>That's {topBlockedApps.reduce((acc, a) => acc + a.blocks, 0)} potential doomscrolls avoided</div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'time' && (
        <div style={{ padding: '12px 24px 0', flex: 1 }}>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: '#7E7E87', marginBottom: 12 }}>When do you focus most?</div>
          <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 18, padding: '16px' }}>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 80 }}>
              {timeOfDayData.map((d, i) => {
                const h = Math.max(4, (d.sessions / maxSessions) * 72)
                const isPeak = d.sessions === maxSessions
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, justifyContent: 'flex-end', height: 80 }}>
                    <div style={{ width: '100%', height: h, borderRadius: 4, background: isPeak ? theme.accent : '#1A3800', border: isPeak ? 'none' : '1px solid #203000', boxShadow: isPeak ? `0 0 8px rgba(${theme.accentRgb},0.3)` : 'none' }} />
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 8, color: isPeak ? theme.accent : '#7E7E87', textAlign: 'center' }}>{d.hour}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div style={{ marginTop: 12, background: '#0A0A0A', border: '1px solid #141414', borderRadius: 16, padding: '14px 16px' }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 11, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>PEAK FOCUS WINDOWS</div>
            {(() => {
              const sorted = [...timeOfDayData].sort((a, b) => b.sessions - a.sessions)
              const peaks = sorted.slice(0, 2).filter(b => b.sessions > 0).map((b, i) => ({
                time: `${b.hour} Window`,
                label: i === 0 ? 'Your prime focus hour' : 'Secondary deep work',
                color: i === 0 ? theme.accent : '#60A5FA'
              }))
              const displayPeaks = peaks.length > 0 ? peaks : [{ time: '8 PM – 10 PM', label: 'Complete sessions to reveal', color: theme.accent }]
              return displayPeaks.map((p) => (
                <div key={p.time} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #0E0E0E' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 16, color: p.color, textTransform: 'uppercase' }}>{p.time}</span>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#7E7E87', marginLeft: 'auto' }}>{p.label}</span>
                </div>
              ))
            })()}
          </div>
        </div>
      )}

      </div>
      <BottomNav active="stats" onNavigate={onNavigate} />
    </div>
  )
}

// ─── HEATMAP (FULL 12 MONTHS / 52 WEEKS ROLLING TO TODAY) ─────────────────────

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function HeatmapScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const sessions = useAppStore((s) => s.sessions)
  const bestStreak = useAppStore((s) => s.bestStreak)

  // Map real sessions to 52-week rolling annual grid (364 days leading up to today)
  const today = new Date()
  const TOTAL_WEEKS = 52
  const TOTAL_DAYS = TOTAL_WEEKS * 7

  const cells = Array.from({ length: TOTAL_DAYS }, (_, idx) => {
    const offset = 6 - today.getDay()
    const daysAgo = (TOTAL_DAYS - 1) - idx - offset
    if (daysAgo < 0) return 0 // Future days

    const targetDate = new Date(today)
    targetDate.setDate(targetDate.getDate() - daysAgo)
    targetDate.setHours(12, 0, 0, 0)

    const y = targetDate.getFullYear()
    const m = String(targetDate.getMonth() + 1).padStart(2, '0')
    const d = String(targetDate.getDate()).padStart(2, '0')
    const dateStr = `${y}-${m}-${d}`

    const daySessions = sessions.filter((s) => {
      if (!s.completed || !s.date) return false
      const sD = new Date(s.date)
      const sStr = `${sD.getFullYear()}-${String(sD.getMonth() + 1).padStart(2, '0')}-${String(sD.getDate()).padStart(2, '0')}`
      return sStr === dateStr
    })

    const totalMins = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0)
    if (totalMins > 60) return 3
    if (totalMins > 30) return 2
    if (totalMins > 0) return 1
    return 0
  })

  // Dynamic Month labels for each 4-week interval calculated from real rolling dates
  const weekMonthLabels = Array.from({ length: TOTAL_WEEKS }).map((_, weekIdx) => {
    const offset = 6 - today.getDay()
    const daysAgo = (TOTAL_DAYS - 1) - (weekIdx * 7) - offset
    const targetDate = new Date(today)
    targetDate.setDate(targetDate.getDate() - daysAgo)
    return targetDate.toLocaleString('default', { month: 'short' })
  })

  const intensityColors = ['#0E0E0E', '#1A3800', '#3A7A00', theme.accent]
  const totalDays = cells.filter((c) => c > 0).length

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <SH title="HEATMAP" subtitle="Your focus calendar — 12 Months (52 weeks)" onBack={() => onNavigate('stats')} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {/* Summary */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {[{ label: 'Active Days', value: totalDays.toString(), color: theme.accent }, { label: 'Best Streak', value: `${bestStreak}d`, color: '#FFB800' }].map((s) => (
            <div key={s.label} style={{ flex: 1, background: '#0A0A0A', border: '1px solid #141414', borderRadius: 12, padding: '10px 12px' }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 24, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 9.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* Day labels */}
          <div style={{ display: 'flex', marginBottom: 4, position: 'sticky', top: 0, background: theme.bg, zIndex: 2, paddingBottom: 2 }}>
            <div style={{ width: 26 }} />
            {DAYS.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', fontFamily: "'JetBrains Mono'", fontSize: 9, color: '#444', fontWeight: 700 }}>{d}</div>
            ))}
          </div>

          {/* Grid rows (52 weeks rolling) */}
          {Array.from({ length: TOTAL_WEEKS }).map((_, weekIdx) => {
            const isMonthStart = weekIdx === 0 || weekMonthLabels[weekIdx] !== weekMonthLabels[weekIdx - 1]
            return (
              <div key={weekIdx} style={{ display: 'flex', gap: 2.5, marginBottom: 2.5, alignItems: 'center' }}>
                <div style={{ width: 26, fontFamily: "'JetBrains Mono'", fontSize: 8, color: isMonthStart ? theme.accent : '#222', fontWeight: isMonthStart ? 700 : 400, flexShrink: 0 }}>
                  {isMonthStart ? weekMonthLabels[weekIdx] : ''}
                </div>
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const intensity = cells[weekIdx * 7 + dayIdx]
                  const isToday = weekIdx === TOTAL_WEEKS - 1 && dayIdx === new Date().getDay()
                  return (
                    <div
                      key={dayIdx}
                      style={{
                        flex: 1,
                        aspectRatio: '1',
                        borderRadius: 2.5,
                        background: intensityColors[intensity],
                        border: isToday ? `1.5px solid ${theme.accent}` : '1px solid #141414',
                        boxShadow: isToday ? `0 0 8px rgba(${theme.accentRgb},0.6)` : intensity === 3 ? `0 0 4px rgba(${theme.accentRgb},0.3)` : 'none',
                      }}
                    />
                  )
                })}
              </div>
            )
          })}

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, marginBottom: 8, justifyContent: 'flex-end' }}>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 9.5, color: '#7E7E87' }}>Less</span>
            {intensityColors.map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c, border: i === 0 ? '1px solid #1A1A1A' : 'none' }} />
            ))}
            <span style={{ fontFamily: "'DM Sans'", fontSize: 9.5, color: '#7E7E87' }}>More</span>
          </div>
        </div>
      </div>

      <BottomNav active="stats" onNavigate={onNavigate} />
    </div>
  )
}

// ─── CALENDAR VIEW ───────────────────────────────────────────────────────────

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export function CalendarViewScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const sessions = useAppStore((s) => s.sessions)
  const now = new Date()
  const currentMonthName = now.toLocaleString('default', { month: 'long' })
  const currentYear = now.getFullYear()
  const [selectedDay, setSelectedDay] = useState(now.getDate())

  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = new Date(year, month, 1).getDay()
  const startOffset = (firstDayIndex + 6) % 7

  const focusedDays: Record<number, { sessions: number; mins: number; color: string; list: any[] }> = {}
  
  sessions.forEach((s) => {
    if (!s.date) return
    const d = new Date(s.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      if (s.completed) {
        const dayNum = d.getDate()
        if (!focusedDays[dayNum]) {
          focusedDays[dayNum] = { sessions: 0, mins: 0, color: '#1A3800', list: [] }
        }
        focusedDays[dayNum].sessions += 1
        focusedDays[dayNum].mins += s.durationMinutes || 0
        focusedDays[dayNum].list.push(s)
        const m = focusedDays[dayNum].mins
        focusedDays[dayNum].color = m >= 90 ? theme.accent : m >= 45 ? '#3A7A00' : '#1A3800'
      }
    }
  })

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <SH title="CALENDAR" subtitle={`${currentMonthName} ${currentYear}`} onBack={() => onNavigate('deep-analytics')} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {/* Calendar grid */}
        <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 14, padding: '10px', flexShrink: 0 }}>
          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 4 }}>
            {WEEKDAYS.map((d) => (
              <div key={d} style={{ textAlign: 'center', fontFamily: "'Barlow Condensed'", fontWeight: 600, fontSize: 11, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d}</div>
            ))}
          </div>
          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
            {/* Empty cells for offset */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const data = focusedDays[day]
              const isSelected = selectedDay === day
              const isToday = day === now.getDate()
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className="interactive-btn"
                  style={{
                    aspectRatio: '1',
                    borderRadius: 8,
                    background: isSelected ? theme.accent : data ? `${data.color}` : theme.bg,
                    border: isToday && !isSelected ? `1.5px solid ${theme.accent}` : '1px solid transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                >
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 11.5, fontWeight: 600, color: isSelected ? '#080808' : data ? (isSelected ? '#080808' : '#888') : '#7E7E87' }}>{day}</span>
                  {data && !isSelected && (
                    <div style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
                      {Array.from({ length: Math.min(data.sessions, 3) }).map((_, j) => (
                        <div key={j} style={{ width: 2.5, height: 2.5, borderRadius: '50%', background: theme.accent, opacity: 0.6 }} />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected day detail */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
            {currentMonthName.toUpperCase()} {selectedDay}, {currentYear}
          </div>
          {focusedDays[selectedDay] ? (
            <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 14, padding: '12px' }}>
              <div style={{ display: 'flex', gap: 14, marginBottom: 8 }}>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 26, color: theme.accent, lineHeight: 1 }}>{focusedDays[selectedDay].mins}m</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 9.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total focus</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 26, color: '#BF7FFF', lineHeight: 1 }}>{focusedDays[selectedDay].sessions}</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 9.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sessions</div>
                </div>
              </div>
              {/* Session timeline */}
              {focusedDays[selectedDay].list.map((s: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderTop: '1px solid #0E0E0E' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.accent, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#666' }}>{new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — Focus session</span>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: '#BF7FFF', marginLeft: 'auto' }}>+{s.durationMinutes * 10} XP</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: '#0A0A0A', border: '1px solid #0E0E0E', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>{getMascotComponent('moai', 32)}</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, color: '#7E7E87', textTransform: 'uppercase' }}>No sessions this day</div>
            </div>
          )}
        </div>
      </div>

      <BottomNav active="stats" onNavigate={onNavigate} />
    </div>
  )
}

// ─── FOCUS INSIGHTS ──────────────────────────────────────────────────────────

export function FocusInsightsScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const sessions = useAppStore((s) => s.sessions)
  const distractionCount = useAppStore((s) => s.distractionCount)
  const currentStreak = useAppStore((s) => s.currentStreak)
  const bestStreak = useAppStore((s) => s.bestStreak)
  const totalMinutesFocused = useAppStore((s) => s.totalMinutesFocused)

  const completedSessions = sessions.filter((s) => s.completed)
  const avgMins = completedSessions.length > 0 ? Math.round(totalMinutesFocused / completedSessions.length) : 0

  const insights = [
    {
      icon: IconTimer,
      color: theme.accent,
      title: `${completedSessions.length} Completed Sessions`,
      body: `You have completed ${completedSessions.length} total focus sessions with an average duration of ${avgMins} minutes.`,
    },
    {
      icon: IconFlame,
      color: '#FFB800',
      title: `Streak Status: ${currentStreak} Days`,
      body: currentStreak >= bestStreak && currentStreak > 0
        ? `You are currently at your all-time best streak of ${currentStreak} days! Keep the momentum going.`
        : `Your current streak is ${currentStreak} days. Your all-time best is ${bestStreak} days.`,
    },
    {
      icon: IconBlocked,
      color: '#FF3B30',
      title: `${distractionCount} Distractions Intercepted`,
      body: distractionCount > 0
        ? `Scrolln't has blocked ${distractionCount} app distraction attempts so far, saving you from doomscrolling.`
        : `No app distraction attempts recorded yet. Lock in to test your discipline.`,
    },
    {
      icon: IconBolt,
      color: '#BF7FFF',
      title: `Total Focus Time: ${(totalMinutesFocused / 60).toFixed(1)} Hours`,
      body: `You have accumulated ${totalMinutesFocused} minutes of uninterrupted focus time across all sessions.`,
    },
  ]

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <SH title="FOCUS INSIGHTS" subtitle="Real-time patterns from your data" onBack={() => onNavigate('stats')} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {insights.map((ins, i) => {
          const IconComp = ins.icon
          return (
            <div key={i} style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 14, padding: '12px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${ins.color}12`, border: `1px solid ${ins.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconComp size={18} color={ins.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, color: ins.color, textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 2 }}>{ins.title}</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 11.5, color: '#7E7E87', lineHeight: 1.4 }}>{ins.body}</div>
              </div>
            </div>
          )
        })}
      </div>

      <BottomNav active="stats" onNavigate={onNavigate} />
    </div>
  )
}

// ─── DISTRACTION REPORT ──────────────────────────────────────────────────────

export function DistractionReportScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const distractionCount = useAppStore((s) => s.distractionCount)
  const sessions = useAppStore((s) => s.sessions)

  // Calculate blocked app breakdown dynamically from store sessions
  const appCounts: Record<string, number> = {}
  sessions.forEach((s) => {
    if (s.attemptedApps) {
      s.attemptedApps.forEach((rawApp) => {
        if (rawApp && rawApp !== 'Focus Session') {
          const app = formatAppName(rawApp).name || rawApp
          appCounts[app] = (appCounts[app] || 0) + 1
        }
      })
    }
  })

  const topApps = Object.entries(appCounts)
    .map(([app, blocks]) => ({ app, blocks }))
    .sort((a, b) => b.blocks - a.blocks)

  const totalSavedMins = distractionCount * 5
  const savedDisplay = totalSavedMins >= 60 ? `${(totalSavedMins / 60).toFixed(1)}h` : `${totalSavedMins}m`

  const weekData = [0, 0, 0, 0, 0, 0, 0]
  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0)
  sessions.forEach(s => {
    const sDate = new Date(s.date)
    sDate.setHours(0, 0, 0, 0)
    const diffDays = Math.floor((todayDate.getTime() - sDate.getTime()) / (1000 * 3600 * 24))
    if (diffDays >= 0 && diffDays < 7) {
      weekData[6 - diffDays] += (s.attemptedApps?.length || 0)
    }
  })
  const maxVal = Math.max(1, ...weekData)

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <SH title="DISTRACTION REPORT" subtitle="What's trying to steal your time" onBack={() => onNavigate('stats')} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {/* Hero */}
        <div style={{ background: 'rgba(255,59,48,0.05)', border: '1px solid rgba(255,59,48,0.15)', borderRadius: 16, padding: '14px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Time saved from doomscrolling</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 'clamp(36px, 5vh, 46px)', color: '#FF3B30', letterSpacing: '-1px', lineHeight: 1, filter: 'drop-shadow(0 0 12px rgba(255,59,48,0.2))' }}>{savedDisplay}</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginTop: 3 }}>
                {distractionCount > 0
                  ? `from ${distractionCount} blocked app attempt${distractionCount > 1 ? 's' : ''}`
                  : 'Start a focus session to shield apps'}
              </div>
            </div>
            <IconShield size={36} color="#FF3B30" />
          </div>
        </div>

        {/* Weekly blocks chart */}
        <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 14, padding: '12px', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>BLOCKS THIS WEEK</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 56 }}>
            {weekData.map((v, i) => {
              const h = Math.max(4, (v / maxVal) * 50)
              const d = new Date(todayDate)
              d.setDate(d.getDate() - (6 - i))
              const dayLetter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()]
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, justifyContent: 'flex-end', height: 56 }}>
                  <div style={{ width: '100%', height: h, borderRadius: 3, background: v === maxVal ? '#FF3B30' : 'rgba(255,59,48,0.25)', boxShadow: v === maxVal ? '0 0 6px rgba(255,59,48,0.3)' : 'none' }} />
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: '#7E7E87' }}>{dayLetter}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Per-app breakdown */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>TOP DISTRACTORS</div>
          {topApps.length === 0 ? (
            <div style={{ padding: '20px 16px', background: '#0A0A0A', borderRadius: 12, border: '1px solid #141414', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🛡️</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 15, color: '#F0F0F0', textTransform: 'uppercase' }}>No app distractions intercepted yet</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 11.5, color: '#7E7E87', marginTop: 4, lineHeight: 1.4 }}>
                When you try to open a blocked app during a Focus Session, Scrolln't will intercept it and log it here!
              </div>
            </div>
          ) : (
            topApps.map((a, i) => {
              const meta = formatAppName(a.app)
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < topApps.length - 1 ? '1px solid #0A0A0A' : 'none' }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{meta.icon || '📱'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 15, color: '#D0D0D0', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{meta.name || a.app}</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87' }}>{a.blocks} blocks</div>
                  </div>
                  <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 17, color: '#FF3B30', flexShrink: 0 }}>{a.blocks}×</span>
                </div>
              )
            })
          )}
        </div>
      </div>

      <BottomNav active="stats" onNavigate={onNavigate} />
    </div>
  )
}

// ─── SESSION HISTORY ─────────────────────────────────────────────────────────

export function SessionHistoryScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const [filter, setFilter] = useState<'all' | 'complete' | 'aborted'>('all')
  const sessions = useAppStore((s) => s.sessions)

  const formattedSessions = sessions.map((s) => ({
    id: s.id,
    date: new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    time: new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: s.durationMinutes > 0 ? `${s.durationMinutes}m` : '0m',
    xp: s.durationMinutes * 10,
    status: s.completed ? 'complete' : 'aborted',
    attemptedApps: s.attemptedApps,
  }))

  const filtered = filter === 'all'
    ? formattedSessions
    : formattedSessions.filter((s) => s.status === filter)

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <SH title="SESSION HISTORY" subtitle={`${sessions.length} sessions logged`} onBack={() => onNavigate('stats')} />

      {/* Filter */}
      <div style={{ padding: '8px clamp(16px, 4vw, 24px) 0', display: 'flex', gap: 6, flexShrink: 0 }}>
        {[
          { id: 'all', label: 'All', icon: null },
          { id: 'complete', label: 'Completed', icon: IconCheck },
          { id: 'aborted', label: 'Aborted', icon: IconCross },
        ].map((f) => {
          const Icon = f.icon
          const isSel = filter === f.id
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className="interactive-btn"
              style={{
                height: 30,
                paddingInline: 10,
                borderRadius: 8,
                border: `1px solid ${isSel ? theme.accent : '#1A1A1A'}`,
                background: isSel ? `rgba(${theme.accentRgb},0.1)` : '#0A0A0A',
                color: isSel ? theme.accent : '#7E7E87',
                fontFamily: "'Barlow Condensed'",
                fontWeight: 700,
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {Icon && <Icon size={12} color={isSel ? theme.accent : '#7E7E87'} />}
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Sessions list */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 6, paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '24px 16px', textAlign: 'center', background: '#0A0A0A', borderRadius: 14, border: '1px solid #141414', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}><IconScroll size={30} color="#7E7E87" /></div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 16, color: '#666', textTransform: 'uppercase' }}>No sessions found</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginTop: 2 }}>Complete a focus session to log your history</div>
          </div>
        ) : (
          filtered.map((s) => {
            const isComplete = s.status === 'complete'
            return (
              <div key={s.id} style={{ background: '#0A0A0A', border: `1px solid ${isComplete ? '#141414' : 'rgba(255,59,48,0.1)'}`, borderRadius: 14, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, borderLeft: `3px solid ${isComplete ? theme.accent : '#FF3B30'}` }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: isComplete ? `rgba(${theme.accentRgb},0.06)` : 'rgba(255,59,48,0.06)', border: `1px solid ${isComplete ? `rgba(${theme.accentRgb},0.15)` : 'rgba(255,59,48,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isComplete ? <IconCheck size={18} color={theme.accent} /> : <IconCross size={18} color="#FF3B30" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: '#D0D0D0', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{s.duration} focus</span>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 15, color: isComplete ? '#BF7FFF' : '#7E7E87' }}>{isComplete ? `+${s.xp} XP` : 'No XP'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                    <span style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#555' }}>{s.date} · {s.time}</span>
                    {s.attemptedApps && s.attemptedApps.length > 0 && (
                      <span style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#FF3B30' }}>Blocked: {s.attemptedApps.join(', ')}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <BottomNav active="stats" onNavigate={onNavigate} />
    </div>
  )
}
