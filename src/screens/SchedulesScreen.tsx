import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../utils/theme'
import type { FocusRoutine, Screen } from '../types'
import { isRoutineActive, useAppStore } from '../store/useAppStore'
import { BottomNav } from './HomeScreen'
import {
  IconBolt,
  IconCalendar,
  IconClock,
  IconLock,
  IconPlus,
  IconShield,
  IconSparkles,
} from '../components/Icons'

interface Props {
  onNavigate: (screen: Screen) => void
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDurationMinutes(startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  const start = startHour * 60 + startMinute
  const end = endHour * 60 + endMinute
  return end > start ? end - start : 24 * 60 - start + end
}

function getDurationLabel(startTime: string, endTime: string) {
  const duration = getDurationMinutes(startTime, endTime)
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  if (!hours) return `${minutes} min`
  if (!minutes) return `${hours} hr`
  return `${hours} hr ${minutes} min`
}

function getRepeatLabel(days: number[]) {
  if (days.length === 7) return 'Every day'
  if (days.length === 5 && [1, 2, 3, 4, 5].every((day) => days.includes(day))) return 'Weekdays'
  if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends'
  return days.map((day) => DAY_NAMES[day]).join(', ')
}

function Toggle({
  checked,
  onChange,
  accent,
  accentRgb,
  label,
}: {
  checked: boolean
  onChange: () => void
  accent: string
  accentRgb: string
  label: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={checked}
      onClick={onChange}
      className="interactive-btn"
      style={{
        width: 48,
        height: 27,
        padding: 3,
        border: checked ? `1px solid rgba(${accentRgb}, 0.5)` : '1px solid #29292F',
        borderRadius: 20,
        background: checked ? `rgba(${accentRgb}, 0.18)` : '#151519',
        boxShadow: checked ? `0 0 18px rgba(${accentRgb}, 0.12)` : 'none',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          display: 'block',
          width: 19,
          height: 19,
          borderRadius: '50%',
          background: checked ? accent : '#4A4A52',
          boxShadow: checked ? `0 0 10px rgba(${accentRgb}, 0.55)` : 'none',
          transform: checked ? 'translateX(21px)' : 'translateX(0)',
          transition: 'transform 0.2s ease, background 0.2s ease',
        }}
      />
    </button>
  )
}

export default function SchedulesScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const routines = useAppStore((state) => state.routines) || []
  const activeRoutineId = useAppStore((state) => state.activeRoutineId)
  const addRoutine = useAppStore((state) => state.addRoutine)
  const updateRoutine = useAppStore((state) => state.updateRoutine)
  const deleteRoutine = useAppStore((state) => state.deleteRoutine)
  const toggleRoutine = useAppStore((state) => state.toggleRoutine)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formName, setFormName] = useState('')
  const [formStart, setFormStart] = useState('22:00')
  const [formEnd, setFormEnd] = useState('06:00')
  const [formDays, setFormDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [formStrict, setFormStrict] = useState(false)

  const enabledRoutines = routines.filter((routine) => routine.enabled)
  const activeRoutine = routines.find(
    (routine) => routine.id === activeRoutineId || isRoutineActive(routine),
  )
  const weeklyMinutes = enabledRoutines.reduce(
    (total, routine) =>
      total + getDurationMinutes(routine.startTime, routine.endTime) * routine.days.length,
    0,
  )
  const weeklyHours = Math.round(weeklyMinutes / 60)

  const openCreateModal = () => {
    setEditingId(null)
    setFormName('Deep Work Protocol')
    setFormStart('09:00')
    setFormEnd('12:00')
    setFormDays([1, 2, 3, 4, 5])
    setFormStrict(false)
    setModalOpen(true)
  }

  const openEditModal = (routine: FocusRoutine) => {
    setEditingId(routine.id)
    setFormName(routine.name)
    setFormStart(routine.startTime)
    setFormEnd(routine.endTime)
    setFormDays(routine.days || [0, 1, 2, 3, 4, 5, 6])
    setFormStrict(Boolean(routine.strictMode))
    setModalOpen(true)
  }

  const handleSaveRoutine = () => {
    const routine = {
      name: formName.trim() || 'Focus Routine',
      startTime: formStart,
      endTime: formEnd,
      days: formDays,
      strictMode: formStrict,
    }

    if (editingId) {
      updateRoutine(editingId, routine)
    } else {
      addRoutine({ ...routine, enabled: true })
    }
    setModalOpen(false)
  }

  const toggleDaySelection = (dayIndex: number) => {
    if (formDays.includes(dayIndex)) {
      if (formDays.length > 1) {
        setFormDays(formDays.filter((day) => day !== dayIndex))
      }
      return
    }
    setFormDays([...formDays, dayIndex].sort((a, b) => a - b))
  }

  return (
    <div
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: theme.bg,
        color: '#F5F5F5',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -130,
          right: -120,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${theme.accentRgb}, 0.13) 0%, transparent 68%)`,
          pointerEvents: 'none',
        }}
      />

      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: 'max(14px, env(safe-area-inset-top, 14px)) clamp(16px, 4vw, 24px) 8px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="interactive-btn"
            aria-label="Back to home"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: '1px solid #202025',
              background: '#0E0E11',
              color: theme.accent,
              display: 'grid',
              placeItems: 'center',
              fontSize: 17,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            ←
          </button>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: '#7E7E87',
                fontFamily: "'JetBrains Mono'",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              Automation deck
            </div>
            <div
              style={{
                fontFamily: "'Barlow Condensed'",
                fontSize: 'clamp(25px, 3.5vh, 31px)',
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
              }}
            >
              Focus Routines
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="interactive-btn"
          style={{
            height: 36,
            padding: '0 13px',
            border: 0,
            borderRadius: 10,
            background: theme.accent,
            boxShadow: `0 0 20px rgba(${theme.accentRgb}, 0.2)`,
            color: '#080808',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: "'Barlow Condensed'",
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <IconPlus size={13} />
          New
        </button>
      </header>

      <main
        className="screen-scrollable"
        style={{
          padding: '12px clamp(16px, 4vw, 24px) 24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: 18,
            border: `1px solid rgba(${theme.accentRgb}, 0.22)`,
            borderRadius: 20,
            background: `linear-gradient(145deg, rgba(${theme.accentRgb}, 0.11), rgba(15, 15, 18, 0.94) 56%)`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 50px rgba(0,0,0,0.22)`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -30,
              right: -18,
              color: `rgba(${theme.accentRgb}, 0.08)`,
              transform: 'rotate(-8deg)',
            }}
          >
            <IconClock size={116} />
          </div>

          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '5px 9px',
                border: `1px solid rgba(${theme.accentRgb}, 0.25)`,
                borderRadius: 8,
                background: `rgba(${theme.accentRgb}, 0.08)`,
                color: theme.accent,
                fontFamily: "'JetBrains Mono'",
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              <span
                className={activeRoutine ? 'animate-pulse' : undefined}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: activeRoutine ? theme.accent : '#55555F',
                  boxShadow: activeRoutine ? `0 0 9px ${theme.accent}` : 'none',
                }}
              />
              {activeRoutine ? 'Lock protocol live' : 'Automation armed'}
            </div>

            <div
              style={{
                marginTop: 15,
                maxWidth: 270,
                fontFamily: "'Barlow Condensed'",
                fontSize: 'clamp(30px, 5vh, 43px)',
                fontWeight: 900,
                lineHeight: 0.92,
                letterSpacing: '-0.025em',
                textTransform: 'uppercase',
              }}
            >
              {activeRoutine ? activeRoutine.name : 'Lock in. On time.'}
            </div>
            <div
              style={{
                marginTop: 9,
                maxWidth: 300,
                color: '#85858E',
                fontSize: 11,
                lineHeight: 1.55,
              }}
            >
              {activeRoutine
                ? `Distractions stay blocked until ${activeRoutine.endTime}. No taps required.`
                : 'Your focus shield activates automatically. Set the hours once and let discipline run on autopilot.'}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
                marginTop: 18,
              }}
            >
              {[
                { value: enabledRoutines.length, label: 'Armed', icon: <IconShield size={13} /> },
                { value: `${weeklyHours}h`, label: 'Weekly', icon: <IconCalendar size={13} /> },
                {
                  value: routines.filter((routine) => routine.strictMode).length,
                  label: 'Strict',
                  icon: <IconLock size={13} />,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    minWidth: 0,
                    padding: '10px 9px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 11,
                    background: 'rgba(0,0,0,0.2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: theme.accent }}>
                    {stat.icon}
                    <span
                      style={{
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 20,
                        fontWeight: 900,
                        lineHeight: 1,
                      }}
                    >
                      {stat.value}
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      color: '#606069',
                      fontFamily: "'JetBrains Mono'",
                      fontSize: 7,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            margin: '24px 2px 10px',
          }}
        >
          <div>
            <div
              style={{
                color: '#F5F5F5',
                fontFamily: "'Barlow Condensed'",
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              Your protocols
            </div>
            <div style={{ marginTop: 2, color: '#56565F', fontSize: 10 }}>
              {enabledRoutines.length} of {routines.length} routines armed
            </div>
          </div>
          <div
            style={{
              color: theme.accent,
              fontFamily: "'JetBrains Mono'",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Local time
          </div>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          {routines.map((routine, index) => {
            const isLive = isRoutineActive(routine)
            const isOvernight = routine.endTime <= routine.startTime

            return (
              <motion.article
                key={routine.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                style={{
                  padding: 15,
                  border: isLive
                    ? `1px solid rgba(${theme.accentRgb}, 0.55)`
                    : '1px solid rgba(255,255,255,0.075)',
                  borderRadius: 17,
                  background: isLive
                    ? `linear-gradient(135deg, rgba(${theme.accentRgb}, 0.09), #111114 58%)`
                    : '#111114',
                  boxShadow: isLive ? `0 0 28px rgba(${theme.accentRgb}, 0.08)` : 'none',
                  opacity: routine.enabled ? 1 : 0.52,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {isLive && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      width: 3,
                      background: theme.accent,
                      boxShadow: `0 0 14px ${theme.accent}`,
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                      <span
                        style={{
                          color: '#F2F2F3',
                          fontFamily: "'Barlow Condensed'",
                          fontSize: 18,
                          fontWeight: 800,
                          lineHeight: 1,
                        }}
                      >
                        {routine.name}
                      </span>
                      {isLive && (
                        <span
                          style={{
                            padding: '3px 6px',
                            borderRadius: 5,
                            background: theme.accent,
                            color: '#080808',
                            fontFamily: "'JetBrains Mono'",
                            fontSize: 7,
                            fontWeight: 900,
                            letterSpacing: '0.08em',
                          }}
                        >
                          LIVE
                        </span>
                      )}
                      {routine.strictMode && (
                        <span
                          style={{
                            padding: '3px 6px',
                            border: '1px solid rgba(255,59,48,0.28)',
                            borderRadius: 5,
                            background: 'rgba(255,59,48,0.09)',
                            color: '#FF6259',
                            fontFamily: "'JetBrains Mono'",
                            fontSize: 7,
                            fontWeight: 900,
                            letterSpacing: '0.08em',
                          }}
                        >
                          STRICT
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        flexWrap: 'wrap',
                        gap: 7,
                        marginTop: 9,
                      }}
                    >
                      <span
                        style={{
                          color: routine.enabled ? theme.accent : '#73737C',
                          fontFamily: "'Barlow Condensed'",
                          fontSize: 27,
                          fontWeight: 900,
                          letterSpacing: '0.015em',
                          lineHeight: 1,
                        }}
                      >
                        {routine.startTime}
                      </span>
                      <span style={{ color: '#484850', fontSize: 13 }}>→</span>
                      <span
                        style={{
                          color: '#D5D5D8',
                          fontFamily: "'Barlow Condensed'",
                          fontSize: 27,
                          fontWeight: 900,
                          letterSpacing: '0.015em',
                          lineHeight: 1,
                        }}
                      >
                        {routine.endTime}
                      </span>
                    </div>
                  </div>

                  <Toggle
                    checked={routine.enabled}
                    onChange={() => toggleRoutine(routine.id)}
                    accent={theme.accent}
                    accentRgb={theme.accentRgb}
                    label={`${routine.enabled ? 'Disable' : 'Enable'} ${routine.name}`}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginTop: 13,
                  }}
                >
                  <div style={{ display: 'flex', gap: 4 }}>
                    {DAY_LABELS.map((day, dayIndex) => {
                      const selected = routine.days.includes(dayIndex)
                      return (
                        <span
                          key={`${routine.id}-${dayIndex}`}
                          style={{
                            width: 23,
                            height: 23,
                            border: selected
                              ? `1px solid rgba(${theme.accentRgb}, 0.25)`
                              : '1px solid transparent',
                            borderRadius: 7,
                            background: selected ? `rgba(${theme.accentRgb}, 0.1)` : '#18181C',
                            color: selected ? theme.accent : '#45454D',
                            display: 'grid',
                            placeItems: 'center',
                            fontFamily: "'JetBrains Mono'",
                            fontSize: 7,
                            fontWeight: 800,
                          }}
                        >
                          {day}
                        </span>
                      )
                    })}
                  </div>
                  <span
                    style={{
                      color: '#62626B',
                      fontFamily: "'JetBrains Mono'",
                      fontSize: 7,
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {getDurationLabel(routine.startTime, routine.endTime)}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    marginTop: 13,
                    paddingTop: 11,
                    borderTop: '1px solid rgba(255,255,255,0.055)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      minWidth: 0,
                      color: '#606069',
                      fontSize: 9,
                    }}
                  >
                    {isOvernight ? <IconBolt size={12} /> : <IconCalendar size={12} />}
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {getRepeatLabel(routine.days)}
                      {isOvernight ? ' · Overnight' : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <button
                      type="button"
                      onClick={() => openEditModal(routine)}
                      className="interactive-btn"
                      style={{
                        height: 29,
                        padding: '0 10px',
                        border: '1px solid #25252B',
                        borderRadius: 8,
                        background: '#17171B',
                        color: '#ACACB2',
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                      }}
                    >
                      EDIT
                    </button>
                    {routines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteRoutine(routine.id)}
                        className="interactive-btn"
                        aria-label={`Delete ${routine.name}`}
                        style={{
                          width: 29,
                          height: 29,
                          border: '1px solid rgba(255,59,48,0.15)',
                          borderRadius: 8,
                          background: 'rgba(255,59,48,0.05)',
                          color: '#A94B47',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 14,
                          cursor: 'pointer',
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="interactive-btn"
          style={{
            width: '100%',
            minHeight: 67,
            marginTop: 10,
            border: `1px dashed rgba(${theme.accentRgb}, 0.26)`,
            borderRadius: 16,
            background: `rgba(${theme.accentRgb}, 0.025)`,
            color: theme.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: "'Barlow Condensed'",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          <IconPlus size={14} />
          Build another protocol
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 9,
            marginTop: 12,
            padding: 13,
            border: '1px solid rgba(255,255,255,0.055)',
            borderRadius: 14,
            background: '#0D0D10',
          }}
        >
          <IconSparkles size={16} />
          <div style={{ color: '#6D6D76', fontSize: 10, lineHeight: 1.55 }}>
            <strong style={{ color: '#A9A9AF', fontWeight: 700 }}>Pro move:</strong> use an
            overnight strict routine to kill bedtime doomscrolling before it starts.
          </div>
        </div>
      </main>

      <BottomNav active="home" onNavigate={onNavigate} />

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 120,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.78)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              onClick={(event) => event.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 520,
                maxHeight: '92dvh',
                padding: '10px 20px max(20px, env(safe-area-inset-bottom, 20px))',
                border: `1px solid rgba(${theme.accentRgb}, 0.24)`,
                borderBottom: 0,
                borderRadius: '24px 24px 0 0',
                background: '#121216',
                boxShadow: '0 -30px 80px rgba(0,0,0,0.55)',
                overflowY: 'auto',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 38,
                  height: 3,
                  margin: '0 auto 17px',
                  borderRadius: 10,
                  background: '#33333A',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div
                    style={{
                      color: theme.accent,
                      fontFamily: "'JetBrains Mono'",
                      fontSize: 8,
                      fontWeight: 800,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {editingId ? 'Modify protocol' : 'New automation'}
                  </div>
                  <div
                    style={{
                      marginTop: 3,
                      fontFamily: "'Barlow Condensed'",
                      fontSize: 27,
                      fontWeight: 900,
                      lineHeight: 1,
                      textTransform: 'uppercase',
                    }}
                  >
                    {editingId ? 'Tune your routine' : 'Program your focus'}
                  </div>
                  <div style={{ marginTop: 5, color: '#696972', fontSize: 10 }}>
                    The shield activates automatically on selected days.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close routine editor"
                  className="interactive-btn"
                  style={{
                    width: 34,
                    height: 34,
                    border: '1px solid #28282E',
                    borderRadius: 10,
                    background: '#19191D',
                    color: '#8A8A92',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 17,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'grid', gap: 15, marginTop: 21 }}>
                <label style={{ display: 'grid', gap: 7 }}>
                  <span
                    style={{
                      color: '#777780',
                      fontFamily: "'JetBrains Mono'",
                      fontSize: 8,
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Protocol name
                  </span>
                  <input
                    type="text"
                    value={formName}
                    onChange={(event) => setFormName(event.target.value)}
                    placeholder="e.g. Exam Study Mode"
                    style={{
                      width: '100%',
                      height: 46,
                      padding: '0 14px',
                      border: '1px solid #28282E',
                      borderRadius: 12,
                      outline: 0,
                      boxSizing: 'border-box',
                      background: '#0B0B0E',
                      color: '#F5F5F5',
                      fontFamily: "'DM Sans'",
                      fontSize: 13,
                      fontWeight: 600,
                      userSelect: 'text',
                    }}
                  />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'Start time', value: formStart, setter: setFormStart },
                    { label: 'End time', value: formEnd, setter: setFormEnd },
                  ].map((field) => (
                    <label key={field.label} style={{ display: 'grid', gap: 7 }}>
                      <span
                        style={{
                          color: '#777780',
                          fontFamily: "'JetBrains Mono'",
                          fontSize: 8,
                          fontWeight: 800,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {field.label}
                      </span>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="time"
                          value={field.value}
                          onChange={(event) => field.setter(event.target.value)}
                          style={{
                            width: '100%',
                            height: 53,
                            padding: '0 12px',
                            border: `1px solid rgba(${theme.accentRgb}, 0.2)`,
                            borderRadius: 12,
                            outline: 0,
                            boxSizing: 'border-box',
                            background: `rgba(${theme.accentRgb}, 0.045)`,
                            color: theme.accent,
                            fontFamily: "'Barlow Condensed'",
                            fontSize: 20,
                            fontWeight: 900,
                            colorScheme: 'dark',
                          }}
                        />
                      </div>
                    </label>
                  ))}
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        color: '#777780',
                        fontFamily: "'JetBrains Mono'",
                        fontSize: 8,
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Repeat cycle
                    </span>
                    <span style={{ color: '#55555E', fontSize: 9 }}>{getRepeatLabel(formDays)}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
                    {DAY_NAMES.map((day, dayIndex) => {
                      const selected = formDays.includes(dayIndex)
                      return (
                        <button
                          type="button"
                          key={day}
                          onClick={() => toggleDaySelection(dayIndex)}
                          className="interactive-btn"
                          style={{
                            height: 40,
                            border: selected
                              ? `1px solid rgba(${theme.accentRgb}, 0.48)`
                              : '1px solid #25252B',
                            borderRadius: 10,
                            background: selected ? theme.accent : '#0D0D10',
                            color: selected ? '#080808' : '#606069',
                            fontFamily: "'JetBrains Mono'",
                            fontSize: 8,
                            fontWeight: 900,
                            cursor: 'pointer',
                          }}
                        >
                          {day.slice(0, 2).toUpperCase()}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 14,
                    padding: 13,
                    border: formStrict
                      ? '1px solid rgba(255,59,48,0.24)'
                      : '1px solid rgba(255,255,255,0.065)',
                    borderRadius: 13,
                    background: formStrict ? 'rgba(255,59,48,0.055)' : '#0D0D10',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: formStrict ? 'rgba(255,59,48,0.12)' : '#18181C',
                        color: formStrict ? '#FF6259' : '#66666F',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <IconLock size={17} />
                    </div>
                    <div>
                      <div
                        style={{
                          color: '#E4E4E6',
                          fontFamily: "'Barlow Condensed'",
                          fontSize: 14,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                        }}
                      >
                        Strict lockdown
                      </div>
                      <div style={{ marginTop: 2, color: '#5D5D66', fontSize: 9 }}>
                        Cannot be disabled during active hours
                      </div>
                    </div>
                  </div>
                  <Toggle
                    checked={formStrict}
                    onChange={() => setFormStrict(!formStrict)}
                    accent="#FF6259"
                    accentRgb="255, 98, 89"
                    label="Toggle strict lockdown"
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    color: '#66666F',
                    fontFamily: "'JetBrains Mono'",
                    fontSize: 8,
                  }}
                >
                  <IconClock size={13} />
                  {getDurationLabel(formStart, formEnd)} session
                  {formEnd <= formStart ? ' · crosses midnight' : ''}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.5fr', gap: 9, marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="interactive-btn"
                  style={{
                    height: 48,
                    border: '1px solid #29292F',
                    borderRadius: 12,
                    background: '#19191D',
                    color: '#A0A0A7',
                    fontFamily: "'Barlow Condensed'",
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveRoutine}
                  className="interactive-btn"
                  style={{
                    height: 48,
                    border: 0,
                    borderRadius: 12,
                    background: theme.accent,
                    boxShadow: `0 0 24px rgba(${theme.accentRgb}, 0.18)`,
                    color: '#080808',
                    fontFamily: "'Barlow Condensed'",
                    fontSize: 14,
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  {editingId ? 'Save protocol' : 'Arm protocol'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
