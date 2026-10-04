import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../utils/theme'
import type { AppLimit, Screen } from '../types'
import { useAppStore } from '../store/useAppStore'
import { BottomNav } from './HomeScreen'
import { getAppIcon } from './BlockedAppsScreen'
import {
  IconBolt,
  IconCheck,
  IconClock,
  IconLock,
  IconPlus,
  IconShield,
  IconSkull,
  IconSparkles,
} from '../components/Icons'

interface Props {
  onNavigate: (screen: Screen) => void
}

const POPULAR_APPS = [
  { packageName: 'com.instagram.android', appName: 'Instagram' },
  { packageName: 'com.google.android.youtube', appName: 'YouTube' },
  { packageName: 'com.snapchat.android', appName: 'Snapchat' },
  { packageName: 'com.twitter.android', appName: 'Twitter / X' },
  { packageName: 'com.reddit.frontpage', appName: 'Reddit' },
  { packageName: 'com.facebook.katana', appName: 'Facebook' },
  { packageName: 'com.netflix.mediaclient', appName: 'Netflix' },
]

const LIMIT_PRESETS = [15, 30, 45, 60, 90]

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

function getUsageState(minutesUsed: number, limitMinutes: number, forcedLocked: boolean) {
  const percentage = Math.min(100, Math.round((minutesUsed / limitMinutes) * 100))
  const isLocked = forcedLocked || minutesUsed >= limitMinutes
  const isWarning = !isLocked && percentage >= 80

  return {
    percentage,
    isLocked,
    isWarning,
    status: isLocked ? 'Locked' : isWarning ? 'Near limit' : 'On track',
    color: isLocked ? '#FF6259' : isWarning ? '#FFB800' : null,
  }
}

export default function AppLimitsScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const appLimits = useAppStore((state) => state.appLimits) || []
  const todayUsage = useAppStore((state) => state.todayUsage) || {}
  const exhaustedLimits = useAppStore((state) => state.exhaustedLimits) || []
  const setAppLimit = useAppStore((state) => state.setAppLimit)
  const removeAppLimit = useAppStore((state) => state.removeAppLimit)
  const fetchTodayUsage = useAppStore((state) => state.fetchTodayUsage)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPkg, setSelectedPkg] = useState(POPULAR_APPS[0].packageName)
  const [selectedName, setSelectedName] = useState(POPULAR_APPS[0].appName)
  const [limitMinutes, setLimitMinutes] = useState(30)
  const [strictMode, setStrictMode] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchTodayUsage()
  }, [fetchTodayUsage])

  const totalLimitMinutes = appLimits.reduce((total, limit) => total + limit.dailyLimitMinutes, 0)
  const totalUsedMinutes = appLimits.reduce(
    (total, limit) => total + Math.floor((todayUsage[limit.packageName] || 0) / 60),
    0,
  )
  const totalPercentage = Math.min(
    100,
    totalLimitMinutes > 0 ? Math.round((totalUsedMinutes / totalLimitMinutes) * 100) : 0,
  )
  const remainingMinutes = Math.max(0, totalLimitMinutes - totalUsedMinutes)

  const openAddModal = () => {
    const unusedApp =
      POPULAR_APPS.find(
        (app) => !appLimits.some((limit) => limit.packageName === app.packageName),
      ) || POPULAR_APPS[0]
    setSelectedPkg(unusedApp.packageName)
    setSelectedName(unusedApp.appName)
    setLimitMinutes(30)
    setStrictMode(false)
    setModalOpen(true)
  }

  const openEditModal = (limit: AppLimit) => {
    setSelectedPkg(limit.packageName)
    setSelectedName(limit.appName)
    setLimitMinutes(limit.dailyLimitMinutes)
    setStrictMode(Boolean(limit.strictMode))
    setModalOpen(true)
  }

  const handleSaveLimit = () => {
    setAppLimit({
      packageName: selectedPkg,
      appName: selectedName,
      dailyLimitMinutes: limitMinutes,
      strictMode,
    })
    setModalOpen(false)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchTodayUsage()
    window.setTimeout(() => setIsRefreshing(false), 650)
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
            onClick={() => onNavigate('blocked-apps')}
            className="interactive-btn"
            aria-label="Back to blocked apps"
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
              Dopamine budget
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
              App Limits
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
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
          Add
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
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 50px rgba(0,0,0,0.22)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -28,
              right: -16,
              color: `rgba(${theme.accentRgb}, 0.08)`,
              transform: 'rotate(-8deg)',
            }}
          >
            <IconShield size={120} />
          </div>

          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 14,
              }}
            >
              <div>
                <div
                  style={{
                    color: theme.accent,
                    fontFamily: "'JetBrains Mono'",
                    fontSize: 8,
                    fontWeight: 800,
                    letterSpacing: '0.13em',
                    textTransform: 'uppercase',
                  }}
                >
                  Today's allowance
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 7,
                    marginTop: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed'",
                      fontSize: 'clamp(42px, 7vh, 56px)',
                      fontWeight: 900,
                      lineHeight: 0.9,
                      letterSpacing: '-0.025em',
                    }}
                  >
                    {remainingMinutes}
                  </span>
                  <span
                    style={{
                      color: '#777780',
                      fontFamily: "'Barlow Condensed'",
                      fontSize: 15,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    min left
                  </span>
                </div>
                <div style={{ marginTop: 7, color: '#74747D', fontSize: 10 }}>
                  {totalUsedMinutes} of {totalLimitMinutes} minutes consumed
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 66,
                  height: 66,
                  borderRadius: '50%',
                  background: `conic-gradient(${theme.accent} ${totalPercentage * 3.6}deg, #242429 0deg)`,
                  boxShadow: `0 0 28px rgba(${theme.accentRgb}, 0.12)`,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    background: '#101013',
                    color: theme.accent,
                    fontFamily: "'Barlow Condensed'",
                    fontSize: 17,
                    fontWeight: 900,
                  }}
                >
                  {totalPercentage}%
                </div>
              </div>
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
                { value: appLimits.length, label: 'Tracked', icon: <IconShield size={13} /> },
                { value: exhaustedLimits.length, label: 'Locked', icon: <IconLock size={13} /> },
                {
                  value: appLimits.filter((limit) => limit.strictMode).length,
                  label: 'Strict',
                  icon: <IconBolt size={13} />,
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
              Daily quotas
            </div>
            <div style={{ marginTop: 2, color: '#56565F', fontSize: 10 }}>
              Auto-reset at midnight
            </div>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="interactive-btn"
            disabled={isRefreshing}
            style={{
              height: 29,
              padding: '0 10px',
              border: `1px solid rgba(${theme.accentRgb}, 0.18)`,
              borderRadius: 8,
              background: `rgba(${theme.accentRgb}, 0.05)`,
              color: theme.accent,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontFamily: "'JetBrains Mono'",
              fontSize: 7,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              opacity: isRefreshing ? 0.55 : 1,
            }}
          >
            <span
              className={isRefreshing ? 'animate-spin' : undefined}
              style={{ display: 'inline-flex' }}
            >
              <IconSparkles size={11} />
            </span>
            {isRefreshing ? 'Syncing' : 'Sync usage'}
          </button>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          {appLimits.map((limit, index) => {
            const minutesUsed = Math.floor((todayUsage[limit.packageName] || 0) / 60)
            const usageState = getUsageState(
              minutesUsed,
              limit.dailyLimitMinutes,
              exhaustedLimits.includes(limit.packageName),
            )
            const statusColor = usageState.color || theme.accent

            return (
              <motion.article
                key={limit.packageName}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                style={{
                  padding: 15,
                  border: `1px solid ${
                    usageState.isLocked
                      ? 'rgba(255,98,89,0.4)'
                      : usageState.isWarning
                        ? 'rgba(255,184,0,0.32)'
                        : 'rgba(255,255,255,0.075)'
                  }`,
                  borderRadius: 17,
                  background: usageState.isLocked
                    ? 'linear-gradient(135deg, rgba(255,59,48,0.075), #111114 58%)'
                    : '#111114',
                  boxShadow: usageState.isLocked ? '0 0 28px rgba(255,59,48,0.06)' : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {usageState.isLocked && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      width: 3,
                      background: '#FF6259',
                      boxShadow: '0 0 14px #FF6259',
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 12,
                        background: '#19191D',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {getAppIcon(limit.packageName, 23)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          overflow: 'hidden',
                          color: '#F2F2F3',
                          fontFamily: "'Barlow Condensed'",
                          fontSize: 18,
                          fontWeight: 800,
                          lineHeight: 1,
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {limit.appName}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          marginTop: 5,
                          color: limit.strictMode ? '#FF6259' : '#62626B',
                          fontFamily: "'JetBrains Mono'",
                          fontSize: 7,
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {limit.strictMode ? <IconLock size={10} /> : <IconClock size={10} />}
                        {limit.strictMode ? 'Strict quota' : 'Standard quota'}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '5px 7px',
                      border: `1px solid ${statusColor}33`,
                      borderRadius: 7,
                      background: `${statusColor}12`,
                      color: statusColor,
                      fontFamily: "'JetBrains Mono'",
                      fontSize: 7,
                      fontWeight: 900,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {usageState.isLocked ? (
                      <IconSkull size={11} />
                    ) : (
                      <IconCheck size={11} />
                    )}
                    {usageState.status}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginTop: 15,
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: statusColor,
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 31,
                        fontWeight: 900,
                        lineHeight: 0.9,
                      }}
                    >
                      {minutesUsed}
                    </span>
                    <span
                      style={{
                        marginLeft: 4,
                        color: '#6D6D76',
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      / {limit.dailyLimitMinutes} min
                    </span>
                  </div>
                  <div
                    style={{
                      color: '#5E5E67',
                      fontFamily: "'JetBrains Mono'",
                      fontSize: 8,
                      fontWeight: 700,
                    }}
                  >
                    {Math.max(0, limit.dailyLimitMinutes - minutesUsed)}m remaining
                  </div>
                </div>

                <div
                  style={{
                    height: 6,
                    marginTop: 10,
                    borderRadius: 8,
                    background: '#08080A',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${usageState.percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      borderRadius: 8,
                      background: statusColor,
                      boxShadow: `0 0 12px ${statusColor}66`,
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginTop: 13,
                    paddingTop: 11,
                    borderTop: '1px solid rgba(255,255,255,0.055)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 4, minWidth: 0 }}>
                    {[15, 30, 45, 60].map((minutes) => {
                      const selected = limit.dailyLimitMinutes === minutes
                      return (
                        <button
                          type="button"
                          key={minutes}
                          onClick={() =>
                            setAppLimit({ ...limit, dailyLimitMinutes: minutes })
                          }
                          className="interactive-btn"
                          style={{
                            height: 27,
                            minWidth: 36,
                            padding: '0 7px',
                            border: selected
                              ? `1px solid rgba(${theme.accentRgb}, 0.32)`
                              : '1px solid #24242A',
                            borderRadius: 7,
                            background: selected
                              ? `rgba(${theme.accentRgb}, 0.1)`
                              : '#17171B',
                            color: selected ? theme.accent : '#676770',
                            fontFamily: "'JetBrains Mono'",
                            fontSize: 7,
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          {minutes}m
                        </button>
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => openEditModal(limit)}
                    className="interactive-btn"
                    style={{
                      height: 27,
                      padding: '0 9px',
                      border: '1px solid #27272D',
                      borderRadius: 7,
                      background: '#19191D',
                      color: '#A2A2A9',
                      fontFamily: "'Barlow Condensed'",
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                    }}
                  >
                    EDIT
                  </button>
                </div>
              </motion.article>
            )
          })}
        </div>

        {appLimits.length === 0 && (
          <div
            style={{
              display: 'grid',
              justifyItems: 'center',
              gap: 9,
              padding: '36px 20px',
              border: '1px dashed rgba(255,255,255,0.1)',
              borderRadius: 17,
              background: '#0D0D10',
              textAlign: 'center',
            }}
          >
            <IconClock size={30} />
            <div
              style={{
                fontFamily: "'Barlow Condensed'",
                fontSize: 18,
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              No quotas configured
            </div>
            <div style={{ maxWidth: 240, color: '#66666F', fontSize: 10, lineHeight: 1.5 }}>
              Add a distracting app and decide how much attention it gets each day.
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={openAddModal}
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
          Add another quota
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
            <strong style={{ color: '#A9A9AF', fontWeight: 700 }}>Savage lock:</strong> hitting
            100% blocks the app until midnight. The budget resets tomorrow, not when willpower
            disappears.
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
                    Attention control
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
                    Set the daily budget
                  </div>
                  <div style={{ marginTop: 5, color: '#696972', fontSize: 10 }}>
                    Pick an app, set the allowance, and let the shield enforce it.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close limit editor"
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

              <div style={{ marginTop: 21 }}>
                <div
                  style={{
                    marginBottom: 8,
                    color: '#777780',
                    fontFamily: "'JetBrains Mono'",
                    fontSize: 8,
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Select app
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
                  {POPULAR_APPS.map((app) => {
                    const selected = selectedPkg === app.packageName
                    return (
                      <button
                        type="button"
                        key={app.packageName}
                        onClick={() => {
                          setSelectedPkg(app.packageName)
                          setSelectedName(app.appName)
                          const existingLimit = appLimits.find(
                            (limit) => limit.packageName === app.packageName,
                          )
                          if (existingLimit) {
                            setLimitMinutes(existingLimit.dailyLimitMinutes)
                            setStrictMode(Boolean(existingLimit.strictMode))
                          }
                        }}
                        className="interactive-btn"
                        style={{
                          minHeight: 66,
                          padding: '9px 5px',
                          border: selected
                            ? `1px solid rgba(${theme.accentRgb}, 0.48)`
                            : '1px solid #25252B',
                          borderRadius: 12,
                          background: selected ? `rgba(${theme.accentRgb}, 0.1)` : '#0D0D10',
                          color: selected ? theme.accent : '#85858D',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          fontFamily: "'DM Sans'",
                          fontSize: 9,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {getAppIcon(app.packageName, 21)}
                        <span
                          style={{
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {app.appName}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div
                style={{
                  marginTop: 18,
                  padding: 15,
                  border: `1px solid rgba(${theme.accentRgb}, 0.18)`,
                  borderRadius: 14,
                  background: `rgba(${theme.accentRgb}, 0.035)`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: '#777780',
                        fontFamily: "'JetBrains Mono'",
                        fontSize: 8,
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Daily allowance
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 5,
                        marginTop: 5,
                      }}
                    >
                      <span
                        style={{
                          color: theme.accent,
                          fontFamily: "'Barlow Condensed'",
                          fontSize: 36,
                          fontWeight: 900,
                          lineHeight: 0.9,
                        }}
                      >
                        {limitMinutes}
                      </span>
                      <span
                        style={{
                          color: '#777780',
                          fontFamily: "'Barlow Condensed'",
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        min / day
                      </span>
                    </div>
                  </div>
                  <IconClock size={28} />
                </div>

                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={limitMinutes}
                  aria-label="Daily allowed minutes"
                  onChange={(event) => setLimitMinutes(Number(event.target.value))}
                  style={{
                    width: '100%',
                    marginTop: 16,
                    accentColor: theme.accent,
                    cursor: 'pointer',
                  }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5, marginTop: 10 }}>
                  {LIMIT_PRESETS.map((minutes) => {
                    const selected = limitMinutes === minutes
                    return (
                      <button
                        type="button"
                        key={minutes}
                        onClick={() => setLimitMinutes(minutes)}
                        className="interactive-btn"
                        style={{
                          height: 34,
                          border: selected
                            ? `1px solid rgba(${theme.accentRgb}, 0.48)`
                            : '1px solid #29292F',
                          borderRadius: 9,
                          background: selected ? theme.accent : '#111114',
                          color: selected ? '#080808' : '#686871',
                          fontFamily: "'JetBrains Mono'",
                          fontSize: 8,
                          fontWeight: 900,
                          cursor: 'pointer',
                        }}
                      >
                        {minutes}m
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
                  marginTop: 14,
                  padding: 13,
                  border: strictMode
                    ? '1px solid rgba(255,59,48,0.24)'
                    : '1px solid rgba(255,255,255,0.065)',
                  borderRadius: 13,
                  background: strictMode ? 'rgba(255,59,48,0.055)' : '#0D0D10',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: strictMode ? 'rgba(255,59,48,0.12)' : '#18181C',
                      color: strictMode ? '#FF6259' : '#66666F',
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
                      Strict quota
                    </div>
                    <div style={{ marginTop: 2, color: '#5D5D66', fontSize: 9 }}>
                      Hard block after the allowance is spent
                    </div>
                  </div>
                </div>
                <Toggle
                  checked={strictMode}
                  onChange={() => setStrictMode(!strictMode)}
                  accent="#FF6259"
                  accentRgb="255, 98, 89"
                  label="Toggle strict quota"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.5fr', gap: 9, marginTop: 20 }}>
                {appLimits.some((limit) => limit.packageName === selectedPkg) ? (
                  <button
                    type="button"
                    onClick={() => {
                      removeAppLimit(selectedPkg)
                      setModalOpen(false)
                    }}
                    className="interactive-btn"
                    style={{
                      height: 48,
                      border: '1px solid rgba(255,59,48,0.18)',
                      borderRadius: 12,
                      background: 'rgba(255,59,48,0.06)',
                      color: '#C75852',
                      fontFamily: "'Barlow Condensed'",
                      fontSize: 13,
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                ) : (
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
                )}
                <button
                  type="button"
                  onClick={handleSaveLimit}
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
                  Set quota
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
