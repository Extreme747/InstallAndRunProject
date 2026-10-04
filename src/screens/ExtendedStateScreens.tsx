import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { Screen } from '../types'
import { useTheme } from '../utils/theme'
import { useAppStore } from '../store/useAppStore'
import { BottomNav } from './HomeScreen'
import DynamicMoai from '../components/DynamicMoai'
import {
  IconBolt,
  IconCheck,
  IconGlobe,
  IconPlus,
  IconShare,
  IconSparkle,
  IconTarget,
  IconTrophy,
  IconUsers,
  IconWarning,
} from '../components/Icons'

interface Props {
  onNavigate: (screen: Screen) => void
}

function Frame({
  children,
  tone = 'accent',
  bottomNav,
}: {
  children: ReactNode
  tone?: 'accent' | 'gold' | 'blue' | 'danger'
  bottomNav?: ReactNode
}) {
  const theme = useTheme()
  const rgb =
    tone === 'gold'
      ? '255,184,0'
      : tone === 'blue'
        ? '96,165,250'
        : tone === 'danger'
          ? '255,59,48'
          : theme.accentRgb

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
          inset: 0,
          background: `radial-gradient(circle at 50% 37%, rgba(${rgb},0.11), transparent 34%), radial-gradient(circle at 50% 110%, rgba(${rgb},0.05), transparent 42%)`,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.18,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(circle at center, black, transparent 74%)',
          pointerEvents: 'none',
        }}
      />
      <main
        className="screen-scrollable"
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'max(26px, env(safe-area-inset-top, 26px)) 22px max(22px, env(safe-area-inset-bottom, 22px))',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        {children}
      </main>
      {bottomNav}
    </div>
  )
}

function Eyebrow({
  icon,
  label,
  color,
  rgb,
}: {
  icon: ReactNode
  label: string
  color: string
  rgb: string
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 8px',
        border: `1px solid rgba(${rgb},0.23)`,
        borderRadius: 8,
        background: `rgba(${rgb},0.065)`,
        color,
        fontFamily: "'JetBrains Mono'",
        fontSize: 7,
        fontWeight: 900,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}
    >
      {icon}
      {label}
    </div>
  )
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: ReactNode
  onClick: () => void
}) {
  const theme = useTheme()
  return (
    <button
      type="button"
      onClick={onClick}
      className="interactive-btn"
      style={{
        width: '100%',
        height: 50,
        border: 0,
        borderRadius: 14,
        background: theme.accent,
        boxShadow: `0 0 24px rgba(${theme.accentRgb},0.16)`,
        color: '#080808',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        fontFamily: "'Barlow Condensed'",
        fontSize: 15,
        fontWeight: 900,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="interactive-btn"
      style={{
        width: '100%',
        height: 43,
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        background: '#0D0D10',
        color: '#777780',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        fontFamily: "'Barlow Condensed'",
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

export function EmptyChallengesScreen({ onNavigate }: Props) {
  const theme = useTheme()
  return (
    <Frame
      tone="gold"
      bottomNav={<BottomNav active="home" onNavigate={onNavigate} />}
    >
      <Eyebrow icon={<IconTarget size={11} />} label="Quest board offline" color="#FFB800" rgb="255,184,0" />
      <div
        style={{
          width: 155,
          height: 155,
          marginTop: 24,
          border: '1px solid rgba(255,184,0,0.2)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,184,0,0.12), transparent 67%)',
          display: 'grid',
          placeItems: 'center',
          position: 'relative',
        }}
      >
        <IconTarget size={58} />
        <span
          style={{
            position: 'absolute',
            right: 15,
            bottom: 22,
            width: 30,
            height: 30,
            borderRadius: 10,
            background: theme.accent,
            color: '#080808',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <IconBolt size={15} />
        </span>
      </div>
      <div style={{ marginTop: 21, fontFamily: "'Barlow Condensed'", fontSize: 38, fontWeight: 900, lineHeight: 0.92, textTransform: 'uppercase' }}>
        Earn your first quest.
      </div>
      <div style={{ maxWidth: 290, marginTop: 10, color: '#707079', fontSize: 10, lineHeight: 1.6 }}>
        Challenges calibrate after your first completed focus session. Give the system something real to measure.
      </div>
      <div style={{ width: '100%', maxWidth: 340, marginTop: 20 }}>
        <PrimaryButton onClick={() => onNavigate('home')}>
          <IconTarget size={15} />
          Start qualifying session
        </PrimaryButton>
      </div>
    </Frame>
  )
}

export function EmptySquadScreen({ onNavigate }: Props) {
  const store = useAppStore()
  return (
    <Frame
      tone="blue"
      bottomNav={<BottomNav active="home" onNavigate={onNavigate} />}
    >
      <Eyebrow icon={<IconUsers size={11} />} label="Squad channel empty" color="#60A5FA" rgb="96,165,250" />
      <motion.div
        initial={{ opacity: 0, scale: 0.84 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: 162,
          height: 162,
          marginTop: 24,
          border: '1px solid rgba(96,165,250,0.2)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96,165,250,0.12), transparent 68%)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <DynamicMoai size={67} state="idle" skin={store.activeSkin} interactive />
      </motion.div>
      <div style={{ marginTop: 21, fontFamily: "'Barlow Condensed'", fontSize: 38, fontWeight: 900, lineHeight: 0.92, textTransform: 'uppercase' }}>
        Grind hits harder together.
      </div>
      <div style={{ maxWidth: 295, marginTop: 10, color: '#707079', fontSize: 10, lineHeight: 1.6 }}>
        Create a squad, invite the serious ones, and turn focus into a live leaderboard.
      </div>
      <div style={{ width: '100%', maxWidth: 340, display: 'grid', gap: 8, marginTop: 20 }}>
        <PrimaryButton onClick={() => onNavigate('squad-dashboard')}>
          <IconPlus size={15} />
          Create squad
        </PrimaryButton>
        <SecondaryButton onClick={() => onNavigate('squad-dashboard')}>
          Join with a code
        </SecondaryButton>
      </div>
    </Frame>
  )
}

export function LoadingSquadScreen({ onNavigate }: Props) {
  const theme = useTheme()
  return (
    <Frame
      tone="blue"
      bottomNav={<BottomNav active="home" onNavigate={onNavigate} />}
    >
      <div
        style={{
          position: 'relative',
          width: 130,
          height: 130,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div
          className="animate-spin"
          style={{
            position: 'absolute',
            inset: 0,
            border: '3px solid rgba(96,165,250,0.08)',
            borderTopColor: '#60A5FA',
            borderRadius: '50%',
            boxShadow: '0 0 24px rgba(96,165,250,0.09)',
          }}
        />
        <IconUsers size={45} />
      </div>
      <div
        style={{
          marginTop: 19,
          color: '#60A5FA',
          fontFamily: "'JetBrains Mono'",
          fontSize: 8,
          fontWeight: 900,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        Opening squad channel
      </div>
      <div style={{ marginTop: 7, fontFamily: "'Barlow Condensed'", fontSize: 28, fontWeight: 900, textTransform: 'uppercase' }}>
        Syncing the leaderboard
      </div>
      <div style={{ marginTop: 5, color: '#606069', fontSize: 9 }}>
        Pulling live focus status and squad totals.
      </div>

      <div style={{ width: '100%', maxWidth: 340, display: 'grid', gap: 7, marginTop: 25 }}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: 10,
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 12,
              background: '#0D0D10',
            }}
          >
            <div className="animate-shimmer" style={{ width: 35, height: 35, borderRadius: 11 }} />
            <div style={{ flex: 1 }}>
              <div className="animate-shimmer" style={{ width: `${72 - index * 8}%`, height: 8, borderRadius: 5 }} />
              <div className="animate-shimmer" style={{ width: '38%', height: 6, marginTop: 7, borderRadius: 5, opacity: 0.55 }} />
            </div>
            <div className="animate-shimmer" style={{ width: 34, height: 17, borderRadius: 6 }} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, color: theme.accent, fontFamily: "'JetBrains Mono'", fontSize: 7 }}>
        ENCRYPTED SQUAD SYNC
      </div>
    </Frame>
  )
}

export function SuccessChallengeScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  const levelBase = store.level <= 1 ? 0 : Math.round(100 * Math.pow(store.level - 1, 1.5))
  const nextLevel = Math.round(100 * Math.pow(store.level, 1.5))
  const progress = Math.min(100, Math.max(5, ((store.totalXP - levelBase) / Math.max(1, nextLevel - levelBase)) * 100))

  return (
    <Frame tone="accent">
      <Eyebrow icon={<IconCheck size={11} />} label="Quest verified" color={theme.accent} rgb={theme.accentRgb} />
      <div
        style={{
          width: 164,
          height: 164,
          marginTop: 23,
          border: `1px solid rgba(${theme.accentRgb},0.24)`,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${theme.accentRgb},0.14), transparent 68%)`,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <IconTrophy size={65} />
      </div>
      <div style={{ marginTop: 18, color: theme.accent, fontFamily: "'Barlow Condensed'", fontSize: 52, fontWeight: 900, lineHeight: 0.86 }}>
        +100 XP
      </div>
      <div style={{ marginTop: 10, fontFamily: "'Barlow Condensed'", fontSize: 32, fontWeight: 900, textTransform: 'uppercase' }}>
        Challenge cleared.
      </div>
      <div style={{ marginTop: 6, color: '#686871', fontSize: 10 }}>
        Level {store.level} progress updated.
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 340,
          marginTop: 18,
          padding: 12,
          border: '1px solid rgba(191,127,255,0.14)',
          borderRadius: 12,
          background: 'rgba(191,127,255,0.045)',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8C729E', fontFamily: "'JetBrains Mono'", fontSize: 7 }}>
          <span>LEVEL {store.level}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 5, marginTop: 8, borderRadius: 5, background: '#202025', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', borderRadius: 5, background: '#BF7FFF' }} />
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 340, display: 'grid', gap: 8, marginTop: 14 }}>
        <PrimaryButton onClick={() => onNavigate('daily-challenges')}>
          View challenge board
        </PrimaryButton>
        <SecondaryButton onClick={() => onNavigate('share-cards')}>
          <IconShare size={14} />
          Share the win
        </SecondaryButton>
      </div>
    </Frame>
  )
}

export function SuccessMilestoneScreen({ onNavigate }: Props) {
  const store = useAppStore()
  return (
    <Frame tone="gold">
      <Eyebrow icon={<IconTrophy size={11} />} label="Milestone unlocked" color="#FFB800" rgb="255,184,0" />
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        style={{
          width: 172,
          height: 172,
          marginTop: 24,
          border: '1px solid rgba(255,184,0,0.26)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,184,0,0.16), transparent 68%)',
          boxShadow: '0 0 48px rgba(255,184,0,0.08)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <IconTrophy size={74} />
      </motion.div>
      <div style={{ marginTop: 20, color: '#FFB800', fontFamily: "'Barlow Condensed'", fontSize: 21, fontWeight: 900, textTransform: 'uppercase' }}>
        Level {store.level} reached
      </div>
      <div style={{ marginTop: 6, fontFamily: "'Barlow Condensed'", fontSize: 36, fontWeight: 900, lineHeight: 0.92, textTransform: 'uppercase' }}>
        Your discipline evolved.
      </div>
      <div style={{ maxWidth: 295, marginTop: 9, color: '#707079', fontSize: 10, lineHeight: 1.55 }}>
        {store.totalXP.toLocaleString()} total XP and a {store.currentStreak}-day streak pushed you into the next tier.
      </div>

      <div style={{ width: '100%', maxWidth: 340, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7, marginTop: 20 }}>
        {[
          { label: 'Level', value: store.level, color: '#BF7FFF', icon: <IconBolt size={13} /> },
          { label: 'XP', value: store.totalXP.toLocaleString(), color: '#FFB800', icon: <IconTrophy size={13} /> },
          { label: 'Aura', value: store.auraScore, color: '#C8FF00', icon: <IconSparkle size={13} /> },
        ].map((metric) => (
          <div key={metric.label} style={{ padding: '10px 6px', border: `1px solid ${metric.color}20`, borderRadius: 12, background: `${metric.color}0B` }}>
            <div style={{ color: metric.color }}>{metric.icon}</div>
            <div style={{ marginTop: 4, fontFamily: "'Barlow Condensed'", fontSize: 18, fontWeight: 900 }}>{metric.value}</div>
            <div style={{ marginTop: 2, color: '#595962', fontFamily: "'JetBrains Mono'", fontSize: 6, textTransform: 'uppercase' }}>{metric.label}</div>
          </div>
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: 340, display: 'grid', gap: 8, marginTop: 14 }}>
        <PrimaryButton onClick={() => onNavigate('milestones')}>
          View milestones
        </PrimaryButton>
        <SecondaryButton onClick={() => onNavigate('share-achievement')}>
          <IconShare size={14} />
          Share achievement
        </SecondaryButton>
      </div>
    </Frame>
  )
}

export function ErrorNetworkScreen({ onNavigate }: Props) {
  const theme = useTheme()
  return (
    <Frame tone="danger">
      <Eyebrow icon={<IconWarning size={11} />} label="Cloud link interrupted" color="#FF6259" rgb="255,59,48" />
      <div
        style={{
          width: 154,
          height: 154,
          marginTop: 24,
          border: '1px solid rgba(255,59,48,0.2)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,59,48,0.11), transparent 68%)',
          display: 'grid',
          placeItems: 'center',
          position: 'relative',
        }}
      >
        <IconGlobe size={60} />
        <span
          style={{
            position: 'absolute',
            right: 15,
            bottom: 18,
            width: 31,
            height: 31,
            borderRadius: 10,
            background: '#FF6259',
            color: '#140505',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <IconWarning size={15} />
        </span>
      </div>
      <div style={{ marginTop: 21, fontFamily: "'Barlow Condensed'", fontSize: 39, fontWeight: 900, lineHeight: 0.9, textTransform: 'uppercase' }}>
        Offline, not powerless.
      </div>
      <div style={{ maxWidth: 295, marginTop: 10, color: '#707079', fontSize: 10, lineHeight: 1.6 }}>
        Squads and leaderboards are waiting for a connection. Your timer, local stats, and blocker still work.
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 340,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 7,
          marginTop: 19,
        }}
      >
        {[
          { label: 'Focus timer', active: true },
          { label: 'Local stats', active: true },
          { label: 'Squad sync', active: false },
          { label: 'Leaderboards', active: false },
        ].map((feature) => (
          <div
            key={feature.label}
            style={{
              padding: '9px 10px',
              border: `1px solid ${feature.active ? `rgba(${theme.accentRgb},0.12)` : 'rgba(255,59,48,0.11)'}`,
              borderRadius: 10,
              background: feature.active ? `rgba(${theme.accentRgb},0.035)` : 'rgba(255,59,48,0.025)',
              color: feature.active ? '#8D8D95' : '#73514F',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 8,
              textAlign: 'left',
            }}
          >
            <IconCheck size={11} />
            {feature.label}
          </div>
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: 340, display: 'grid', gap: 8, marginTop: 15 }}>
        <PrimaryButton onClick={() => onNavigate('home')}>
          Retry connection
        </PrimaryButton>
        <SecondaryButton onClick={() => onNavigate('home')}>
          Focus offline
        </SecondaryButton>
      </div>
    </Frame>
  )
}
