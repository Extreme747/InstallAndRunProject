import { useState } from 'react'
import { useTheme } from '../utils/theme'
import type { Screen } from '../types'
import { BottomNav } from './HomeScreen'
import { useAppStore } from '../store/useAppStore'
import {
  IconFlame,
  IconBolt,
  IconTarget,
  IconShare,
  IconMedal,
  IconUsers,
  IconCheck,
  IconBlocked,
  IconCrown,
  IconClock,
  IconDocument,
  getMascotComponent,
} from '../components/Icons'
import { shareContent } from '../utils/nativeShare'
import { triggerTestRoast } from '../utils/roastNotifier'
import {
  exportReportToPDF,
  downloadReportHTML,
  shareFullWeeklyReport,
  type WeeklyReportData,
} from '../utils/pdfExport'

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

// ─── DAILY RECAP ─────────────────────────────────────────────────────────────

export function DailyRecapScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  const today = new Date()
  const todaySessions = store.sessions.filter(s => {
    const sDate = new Date(s.date)
    return sDate.getDate() === today.getDate() && sDate.getMonth() === today.getMonth() && sDate.getFullYear() === today.getFullYear()
  })
  
  const date = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  const totalMinutes = todaySessions.reduce((acc, s) => acc + (s.completed ? s.durationMinutes : 0), 0)
  const sessions = todaySessions.length
  const xpEarned = todaySessions.reduce((acc, s) => acc + (s.completed ? s.durationMinutes * 10 : 0), 0)
  const challengesDone = store.challenges.filter((c: any) => (c.completed || c.done) && c.type === 'daily').length
  const challengesTotal = store.challenges.filter((c: any) => c.type === 'daily').length

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, position: 'relative', overflow: 'hidden' }}>
      {/* Subtle glow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, rgba(${theme.accentRgb},0.04) 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ padding: 'max(14px, env(safe-area-inset-top, 14px)) clamp(16px, 4vw, 24px) 0', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button
          onClick={() => {
            if (typeof (window as any).__handleBack === 'function') {
              (window as any).__handleBack()
            } else {
              onNavigate('stats')
            }
          }}
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
          <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 1 }}>{date}</div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 'clamp(24px, 3.5vh, 30px)', color: '#F5F5F5', textTransform: 'uppercase', letterSpacing: '-0.3px', lineHeight: 1 }}>DAILY RECAP</div>
        </div>
      </div>

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingBlock: 6, position: 'relative', zIndex: 1 }}>
        {/* Hero score */}
        <div style={{ background: `rgba(${theme.accentRgb},0.04)`, border: `1px solid rgba(${theme.accentRgb},0.15)`, borderRadius: 16, padding: '14px', textAlign: 'center', position: 'relative', flexShrink: 0 }}>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>TODAY'S FOCUS</div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 'clamp(44px, 6.5vh, 60px)', color: theme.accent, letterSpacing: '-2px', lineHeight: 1, filter: `drop-shadow(0 0 16px rgba(${theme.accentRgb},0.2))` }}>
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#7E7E87', marginTop: 4 }}>
            {sessions} sessions · +{xpEarned} XP earned
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {[
            { icon: IconFlame, label: 'Streak', value: `${store.currentStreak}d`, color: '#FFB800' },
            { icon: IconBolt, label: 'XP Today', value: `+${xpEarned}`, color: '#BF7FFF' },
            { icon: IconTarget, label: 'Challenges', value: `${challengesDone}/${challengesTotal}`, color: '#60A5FA' },
          ].map((s) => {
            const IconComp = s.icon
            return (
              <div key={s.label} style={{ flex: 1, background: '#0A0A0A', border: '1px solid #141414', borderRadius: 12, padding: '8px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IconComp size={16} color={s.color} />
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 18, color: s.color, lineHeight: 1, marginTop: 2 }}>{s.value}</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 9, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{s.label}</div>
              </div>
            )
          })}
        </div>

        {/* Session timeline */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>TODAY'S SESSIONS</div>
          {todaySessions.length === 0 ? (
            <div style={{ padding: '12px', background: '#0A0A0A', borderRadius: 12, border: '1px solid #141414', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 14, color: '#7E7E87' }}>No sessions yet today</div>
            </div>
          ) : (
            todaySessions.slice(0, 3).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < Math.min(todaySessions.length, 3) - 1 ? '1px solid #0A0A0A' : 'none' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.completed ? theme.accent : '#FF3B30', flexShrink: 0, boxShadow: s.completed ? `0 0 6px rgba(${theme.accentRgb},0.4)` : 'none' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, color: '#D0D0D0', textTransform: 'uppercase' }}>{new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {s.completed ? `${s.durationMinutes}m session` : 'Failed session'}</div>
                </div>
                <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 13, color: '#BF7FFF' }}>+{s.completed ? s.durationMinutes * 10 : 0} XP</span>
              </div>
            ))
          )}
        </div>

        {/* Tomorrow's goal */}
        <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 14, padding: '10px 14px', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>TOMORROW'S GOAL</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: '#888', textTransform: 'uppercase' }}>2h of focus · maintain {store.currentStreak + 1}-day streak</div>
            {getMascotComponent('moai', 20)}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            const text = `Today's Focus on Scrolln't:\n⏱ ${totalMinutes}m focused\n🔥 ${store.currentStreak}-day streak\n⚡ ${xpEarned} XP earned 🗿`
            shareContent({
              title: "Scrolln't Daily Recap",
              text,
            })
          }}
          className="interactive-btn"
          style={{ width: '100%', height: 'clamp(44px, 5.8vh, 50px)', borderRadius: 14, background: theme.accent, border: 'none', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 17, color: theme.bg, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexShrink: 0 }}
        >
          <IconShare size={17} color="#080808" />
          SHARE TODAY'S RECAP
        </button>
      </div>

      <BottomNav active="stats" onNavigate={onNavigate} />
    </div>
  )
}

// ─── WEEKLY REPORT ───────────────────────────────────────────────────────────

export function WeeklyReportScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  const [showExportModal, setShowExportModal] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  
  const weekData = Array(7).fill(0)
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - 6)
  const dateSubtitle = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  
  let prevWeekMins = 0
  let sessionsCompleted = 0
  let xpThisWeek = 0

  const todayMidnight = new Date(today)
  todayMidnight.setHours(0, 0, 0, 0)

  store.sessions.forEach(s => {
    if (!s.date) return
    const sDate = new Date(s.date)
    sDate.setHours(0, 0, 0, 0)
    const diffDays = Math.round((todayMidnight.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays >= 0 && diffDays < 7 && s.completed) {
      weekData[6 - diffDays] += s.durationMinutes
      sessionsCompleted++
      xpThisWeek += Math.round(s.durationMinutes * 10 * (1 + 0.1 * store.currentStreak))
    } else if (diffDays >= 7 && diffDays < 14 && s.completed) {
      prevWeekMins += s.durationMinutes
    }
  })
  
  const maxMins = Math.max(...weekData, 1)
  const totalMins = weekData.reduce((a, b) => a + b, 0)

  const improvement = prevWeekMins ? Math.round(((totalMins - prevWeekMins) / prevWeekMins) * 100) : (totalMins > 0 ? 100 : 0)

  let grade = 'C'
  if (totalMins > 300) grade = 'A+'
  else if (totalMins > 200) grade = 'A'
  else if (totalMins > 120) grade = 'B+'
  else if (totalMins > 60) grade = 'B'

  let squadRank = "No Squad"
  if (store.squadMembers && store.squadMembers.length > 0) {
    const sorted = [...store.squadMembers].sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0))
    const myIndex = sorted.findIndex(m => m.id === store.userId)
    if (myIndex !== -1) squadRank = `#${myIndex + 1}`
  }

  const reportData: WeeklyReportData = {
    userName: store.userName || 'Disciplined Warrior',
    dateRange: dateSubtitle,
    totalMinutes: totalMins,
    improvement,
    grade,
    currentStreak: store.currentStreak,
    xpEarned: xpThisWeek,
    sessionsCompleted,
    distractionsBlocked: store.distractionCount,
    squadRank,
    dailyMinutes: weekData,
    themeAccent: theme.accent,
  }

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleShare = () => {
    shareFullWeeklyReport(reportData)
  }

  const handleExportClick = () => {
    if (!store.isSubscribed) {
      onNavigate('premium-upgrade')
    } else {
      setShowExportModal(true)
    }
  }

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden', position: 'relative' }}>
      {toastMsg && (
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, background: theme.accent, color: '#080808', padding: '10px 16px', borderRadius: 12, fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, textAlign: 'center', zIndex: 100, boxShadow: `0 0 20px rgba(${theme.accentRgb},0.4)` }}>
          {toastMsg}
        </div>
      )}

      <SH title="WEEKLY REPORT" subtitle={dateSubtitle} onBack={() => onNavigate('stats')} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingBlock: 6 }}>
        {/* Headline card */}
        <div style={{ background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 16, padding: '14px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, rgba(${theme.accentRgb},0.07) 0%, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Total this week</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 'clamp(32px, 4.5vh, 40px)', color: theme.accent, letterSpacing: '-0.5px', lineHeight: 1 }}>
                {Math.floor(totalMins / 60)}h {totalMins % 60}m
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 11.5, color: improvement >= 0 ? theme.accent : '#FF3B30', marginTop: 2 }}>
                {improvement >= 0 ? '↑' : '↓'} {Math.abs(improvement)}% vs last week
              </div>
            </div>
            <div style={{ background: improvement >= 0 ? `rgba(${theme.accentRgb},0.1)` : 'rgba(255,59,48,0.1)', border: `1px solid ${improvement >= 0 ? `rgba(${theme.accentRgb},0.3)` : 'rgba(255,59,48,0.3)'}`, borderRadius: 12, padding: '8px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 22, color: improvement >= 0 ? theme.accent : '#FF3B30', lineHeight: 1 }}>{improvement >= 0 ? '+' : ''}{improvement}%</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 9.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 1 }}>vs last week</div>
            </div>
          </div>
        </div>

        {/* Weekly bar chart */}
        <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 14, padding: '10px 12px', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>DAILY BREAKDOWN</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 60 }}>
            {weekData.map((m, i) => {
              const h = m ? Math.max(6, (m / maxMins) * 52) : 4
              const d = new Date(today)
              d.setDate(d.getDate() - (6 - i))
              const dayLetter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()]
              const isMax = m === maxMins
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, justifyContent: 'flex-end', height: 60 }}>
                  {isMax && <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 8.5, color: theme.accent }}>{m}m</div>}
                  <div style={{ width: '100%', height: h, borderRadius: 4, background: m === 0 ? '#0E0E0E' : isMax ? theme.accent : '#1A3800', border: m === 0 ? '1px solid #141414' : 'none', boxShadow: isMax ? `0 0 8px rgba(${theme.accentRgb},0.3)` : 'none', transition: 'height 0.4s ease' }} />
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: isMax ? theme.accent : '#7E7E87' }}>{dayLetter}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Highlights */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>WEEK HIGHLIGHTS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { icon: IconMedal, label: 'Performance Grade', val: grade, color: theme.accent },
              { icon: IconUsers, label: 'Squad Rank', val: squadRank, color: '#60A5FA' },
              { icon: IconFlame, label: 'Streak maintained', val: `${store.currentStreak} days`, color: '#FFB800' },
              { icon: IconBolt, label: 'XP earned', val: `${xpThisWeek} XP`, color: '#BF7FFF' },
              { icon: IconCheck, label: 'Sessions completed', val: `${sessionsCompleted}`, color: theme.accent },
              { icon: IconBlocked, label: 'Distractions blocked', val: `${store.distractionCount} times`, color: '#FF3B30' },
            ].map((h, i) => {
              const IconComp = h.icon
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0A0A0A', border: '1px solid #141414', borderRadius: 12, padding: '8px 12px' }}>
                  <IconComp size={16} color={h.color} />
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#7E7E87', flex: 1 }}>{h.label}</span>
                  <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, color: h.color, flexShrink: 0 }}>{h.val}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
          <button onClick={handleShare} className="interactive-btn" style={{ width: '100%', height: 44, borderRadius: 12, background: theme.accent, border: 'none', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: '#080808', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <IconShare size={16} color="#080808" /> SHARE WEEKLY REPORT
          </button>
          <button onClick={handleExportClick} className="interactive-btn" style={{ width: '100%', height: 40, borderRadius: 12, background: store.isSubscribed ? `rgba(${theme.accentRgb},0.12)` : '#0A0A0A', border: `1px solid ${store.isSubscribed ? `rgba(${theme.accentRgb},0.4)` : 'rgba(191,127,255,0.25)'}`, fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, color: store.isSubscribed ? theme.accent : '#BF7FFF', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            {store.isSubscribed ? (
              <>
                <IconDocument size={16} color={theme.accent} />
                EXPORT PDF & PRINT REPORT
              </>
            ) : (
              <>
                <IconCrown size={14} color="#BF7FFF" />
                EXPORT PDF — PRO
              </>
            )}
          </button>
        </div>
      </div>

      {/* Export Action Modal */}
      {showExportModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 110, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ width: '100%', maxWidth: 480, background: '#0E0E0E', borderTop: '1px solid #222', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '20px 20px clamp(28px, 5vh, 40px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 20, color: theme.accent, textTransform: 'uppercase' }}>
                  📄 EXPORT WEEKLY REPORT
                </div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#888' }}>
                  Save, print, or share your high-res productivity report
                </div>
              </div>
              <button onClick={() => setShowExportModal(false)} style={{ background: '#1A1A1A', border: 'none', borderRadius: '50%', width: 32, height: 32, color: '#AAA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
            </div>

            {/* Option 1: PDF / Print */}
            <button
              onClick={async () => {
                setShowExportModal(false)
                showToast('🖨️ Opening Print & PDF Dialog...')
                await exportReportToPDF(reportData)
              }}
              className="interactive-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 12, background: `rgba(${theme.accentRgb},0.1)`, border: `1px solid rgba(${theme.accentRgb},0.35)`, borderRadius: 14, padding: '12px 14px', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 20 }}>🖨️</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: theme.accent, textTransform: 'uppercase' }}>Save as PDF / Print Document</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 11.5, color: '#AAA' }}>Standard formatted PDF printable document</div>
              </div>
            </button>

            {/* Option 2: Download HTML File */}
            <button
              onClick={() => {
                setShowExportModal(false)
                downloadReportHTML(reportData)
                showToast('📥 Report HTML Downloaded!')
              }}
              className="interactive-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#141414', border: '1px solid #222', borderRadius: 14, padding: '12px 14px', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 20 }}>📥</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: '#F5F5F5', textTransform: 'uppercase' }}>Download Offline Report (.html)</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 11.5, color: '#888' }}>Open and print offline in any mobile browser</div>
              </div>
            </button>

            {/* Option 3: Full Native Share */}
            <button
              onClick={() => {
                setShowExportModal(false)
                shareFullWeeklyReport(reportData)
              }}
              className="interactive-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#141414', border: '1px solid #222', borderRadius: 14, padding: '12px 14px', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 20 }}>📤</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: '#F5F5F5', textTransform: 'uppercase' }}>Share Structured Summary</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 11.5, color: '#888' }}>WhatsApp, Telegram, or system share sheet</div>
              </div>
            </button>

            <button
              onClick={() => setShowExportModal(false)}
              style={{ width: '100%', height: 40, borderRadius: 10, background: '#1A1A1A', border: 'none', color: '#888', fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, textTransform: 'uppercase', cursor: 'pointer', marginTop: 4 }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      <BottomNav active="stats" onNavigate={onNavigate} />
    </div>
  )
}

// ─── NOTIFICATIONS SETTINGS ──────────────────────────────────────────────────

export function NotificationsSettingsScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore();
  const [testSent, setTestSent] = useState(false);
  const selectedLang = store.settings?.roastLanguage || 'hinglish';
  const selectedFreq = store.settings?.roastFrequency || 'savage';

  const [toggles, setToggles] = useState({
    reminder: (store.settings as any).reminder ?? true,
    streakRisk: (store.settings as any).streakRisk ?? true,
    distractionRoasts: (store.settings as any).distractionRoasts ?? true,
    idleRoasts: (store.settings as any).idleRoasts ?? true,
    complimentsEnabled: (store.settings as any).complimentsEnabled ?? true,
    squadActivity: (store.settings as any).squadActivity ?? false,
    challengeNew: (store.settings as any).challengeNew ?? true,
    xpMilestone: (store.settings as any).xpMilestone ?? true,
    dailyRecap: (store.settings as any).dailyRecap ?? false,
    weeklyReport: (store.settings as any).weeklyReport ?? true,
    marketing: (store.settings as any).marketing ?? false,
  });

  const toggle = (key: keyof typeof toggles) => {
    setToggles((prev) => {
      const newVal = !prev[key];
      store.updateSettings(key, newVal);
      return { ...prev, [key]: newVal };
    });
  };

  const handleTestNotification = () => {
    triggerTestRoast(selectedLang);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3500);
  };

  const Toggle = ({ k }: { k: keyof typeof toggles }) => (
    <button onClick={() => toggle(k)} style={{ width: 42, height: 24, borderRadius: 12, background: toggles[k] ? theme.accent : '#1A1A1A', border: 'none', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s ease' }}>
      <div style={{ position: 'absolute', top: 3, left: toggles[k] ? 20 : 3, width: 18, height: 18, borderRadius: 9, background: toggles[k] ? theme.bg : '#444', transition: 'left 0.2s ease' }} />
    </button>
  );

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <SH title="NOTIFICATIONS & ROASTS" subtitle="Stay locked in, disciplined & entertained" onBack={() => onNavigate('settings')} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingInline: 'clamp(16px, 4vw, 24px)', paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        
        {/* Language Selection Card */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 11, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
            ROAST & NOTIFICATION LANGUAGE
          </div>
          <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 16, padding: 12, display: 'flex', gap: 8 }}>
            <button
              onClick={() => store.setRoastLanguage('hinglish')}
              className="interactive-btn"
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: 12,
                background: selectedLang === 'hinglish' ? `rgba(${theme.accentRgb},0.12)` : '#111',
                border: `1.5px solid ${selectedLang === 'hinglish' ? theme.accent : '#1E1E1E'}`,
                color: selectedLang === 'hinglish' ? theme.accent : '#888',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, textTransform: 'uppercase' }}>
                HINGLISH 🇮🇳
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: selectedLang === 'hinglish' ? '#A3E635' : '#666', marginTop: 2 }}>
                Default (Savage Indian Humor)
              </div>
            </button>

            <button
              onClick={() => store.setRoastLanguage('english')}
              className="interactive-btn"
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: 12,
                background: selectedLang === 'english' ? 'rgba(96,165,250,0.12)' : '#111',
                border: `1.5px solid ${selectedLang === 'english' ? '#60A5FA' : '#1E1E1E'}`,
                color: selectedLang === 'english' ? '#60A5FA' : '#888',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, textTransform: 'uppercase' }}>
                ENGLISH 🌐
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: selectedLang === 'english' ? '#93C5FD' : '#666', marginTop: 2 }}>
                International GigaChad Tone
              </div>
            </button>
          </div>
        </div>

        {/* Roast Frequency Selector */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 11, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
            FOCUS ROASTING FREQUENCY
          </div>
          <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 16, padding: 10, display: 'flex', gap: 6 }}>
            {[
              { id: 'savage' as const, label: 'SAVAGE', sub: 'Every 5m', color: '#FF3B30' },
              { id: 'balanced' as const, label: 'BALANCED', sub: 'Every 10m', color: theme.accent },
              { id: 'chill' as const, label: 'CHILL', sub: 'Every 15m', color: '#60A5FA' },
              { id: 'off' as const, label: 'OFF', sub: 'Muted', color: '#777' },
            ].map((f) => {
              const active = selectedFreq === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => store.setRoastFrequency(f.id)}
                  className="interactive-btn"
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: 10,
                    background: active ? `${f.color}18` : '#111',
                    border: `1px solid ${active ? f.color : '#1A1A1A'}`,
                    color: active ? f.color : '#777',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, textTransform: 'uppercase' }}>{f.label}</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 9.5, color: active ? f.color : '#555', marginTop: 1 }}>{f.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Test Roast Button */}
        <div style={{ marginBottom: 14 }}>
          <button
            onClick={handleTestNotification}
            className="interactive-btn"
            style={{
              width: '100%',
              height: 44,
              borderRadius: 12,
              background: testSent ? `rgba(${theme.accentRgb},0.15)` : `rgba(${theme.accentRgb},0.08)`,
              border: `1px solid ${testSent ? theme.accent : `rgba(${theme.accentRgb},0.3)`}`,
              color: theme.accent,
              fontFamily: "'Barlow Condensed'",
              fontWeight: 800,
              fontSize: 15,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <IconFlame size={16} color={theme.accent} glow />
            <span>{testSent ? '✓ ROAST NOTIFICATION DISPATCHED!' : '⚡ TEST SAVAGE ROAST NOTIFICATION'}</span>
          </button>
        </div>

        {/* Anti-Distraction & In-Session Alerts */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
            ANTI-DISTRACTION & ROASTS
          </div>
          <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 14, overflow: 'hidden' }}>
            {[
              { key: 'distractionRoasts' as const, label: 'Distraction Attempt Roasts', desc: 'Instant savage roast when trying to open shielded apps' },
              { key: 'idleRoasts' as const, label: 'Idle Doomscroll Reminders', desc: 'Savage nudge when scrolling for hours without focusing' },
              { key: 'complimentsEnabled' as const, label: 'GigaChad Victory Compliments', desc: 'Motivational praise when completing focus sessions' },
            ].map((item, i, arr) => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderBottom: i < arr.length - 1 ? '1px solid #0E0E0E' : 'none' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, color: '#D0D0D0' }}>{item.label}</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87', marginTop: 1 }}>{item.desc}</div>
                </div>
                <Toggle k={item.key} />
              </div>
            ))}
          </div>
        </div>

        {/* Standard Scheduled Notifications */}
        {[
          {
            label: 'Focus Reminders',
            items: [
              { key: 'reminder' as const, label: 'Daily focus reminder', desc: 'A gentle nudge to lock in today', time: '8:00 PM' },
              { key: 'streakRisk' as const, label: 'Streak at risk', desc: 'Alert when you haven\'t focused today', time: 'Auto' },
            ],
          },
          {
            label: 'Social & Squads',
            items: [
              { key: 'squadActivity' as const, label: 'Squad activity', desc: 'When squadmates start a session', time: null },
            ],
          },
          {
            label: 'Achievements',
            items: [
              { key: 'challengeNew' as const, label: 'New challenges available', desc: 'Daily & weekly challenge drops', time: null },
              { key: 'xpMilestone' as const, label: 'XP milestones', desc: 'Level ups and rank changes', time: null },
            ],
          },
          {
            label: 'Reports',
            items: [
              { key: 'dailyRecap' as const, label: 'Daily recap', desc: 'Your day\'s focus summary', time: '10:00 PM' },
              { key: 'weeklyReport' as const, label: 'Weekly report', desc: 'Every Monday morning', time: 'Mon 9AM' },
            ],
          },
          {
            label: 'Other',
            items: [
              { key: 'marketing' as const, label: 'Updates & announcements', desc: 'App news and feature releases', time: null },
            ],
          },
        ].map((section) => (
          <div key={section.label} style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>{section.label}</div>
            <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 14, overflow: 'hidden' }}>
              {section.items.map((item, i, arr) => (
                <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderBottom: i < arr.length - 1 ? '1px solid #0E0E0E' : 'none' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, color: '#D0D0D0' }}>{item.label}</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87', marginTop: 1 }}>{item.desc}</div>
                    {item.time && toggles[item.key] && (
                      <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: theme.accent, marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <IconClock size={11} color={theme.accent} /> {item.time}
                      </div>
                    )}
                  </div>
                  <Toggle k={item.key} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="settings" onNavigate={onNavigate} />
    </div>
  );
}
