import { motion } from 'framer-motion'
import { useTheme } from '../utils/theme'
import { useAppStore } from '../store/useAppStore'
import DynamicMoai from './DynamicMoai'
import { IconAlert, IconFlag, IconFlame, IconLock, IconSkull } from './Icons'
import type { Screen } from '../types'

interface ModalProps {
  streak: number
  auraScore: number
  remainingTime: string
  onStay: () => void
  onConfirm: () => void
}

export default function GiveUpConfirmationModal({
  streak,
  auraScore,
  remainingTime,
  onStay,
  onConfirm,
}: ModalProps) {
  const theme = useTheme()
  const projectedAura = Math.max(0, auraScore - Math.floor(auraScore * 0.5))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onStay}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'grid',
        placeItems: 'center',
        padding: 20,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <motion.section
        initial={{ opacity: 0, scale: 0.9, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ type: 'spring', stiffness: 310, damping: 26 }}
        onClick={(event) => event.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 370,
          padding: 20,
          border: '1px solid rgba(255,59,48,0.3)',
          borderRadius: 24,
          background:
            'radial-gradient(circle at 50% 0%, rgba(255,59,48,0.13), transparent 35%), #0D0D11',
          boxShadow: '0 28px 90px rgba(255,59,48,0.19), inset 0 1px 0 rgba(255,255,255,0.035)',
          color: '#F5F5F5',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: '16%',
            right: '16%',
            height: 2,
            background: 'linear-gradient(90deg, transparent, #FF6259, transparent)',
            boxShadow: '0 0 14px rgba(255,59,48,0.75)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 8px',
              border: '1px solid rgba(255,59,48,0.2)',
              borderRadius: 8,
              background: 'rgba(255,59,48,0.065)',
              color: '#FF6259',
              fontFamily: "'JetBrains Mono'",
              fontSize: 7,
              fontWeight: 900,
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
            }}
          >
            <IconAlert size={11} />
            Exit protocol
          </div>
          <button
            type="button"
            onClick={onStay}
            className="interactive-btn"
            aria-label="Close give up confirmation"
            style={{
              width: 31,
              height: 31,
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 9,
              background: '#151519',
              color: '#777780',
              display: 'grid',
              placeItems: 'center',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '82px 1fr',
            alignItems: 'center',
            gap: 14,
            marginTop: 16,
          }}
        >
          <div
            style={{
              width: 82,
              height: 82,
              border: '1px solid rgba(255,59,48,0.23)',
              borderRadius: 22,
              background: 'radial-gradient(circle, rgba(255,59,48,0.13), transparent 68%)',
              display: 'grid',
              placeItems: 'center',
              position: 'relative',
            }}
          >
            <DynamicMoai size={48} state="blocked_rage" interactive={false} />
            <span style={{ position: 'absolute', top: -7, right: -6 }}>
              <IconSkull size={24} />
            </span>
          </div>
          <div>
            <div
              style={{
                color: '#FF6259',
                fontFamily: "'Barlow Condensed'",
                fontSize: 29,
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
              }}
            >
              Trade the streak for an impulse?
            </div>
            <div style={{ marginTop: 7, color: '#71717A', fontSize: 9, lineHeight: 1.5 }}>
              This session will be recorded as failed. The consequences apply immediately.
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginTop: 17,
            padding: '10px 12px',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
            background: '#09090C',
          }}
        >
          <div>
            <div
              style={{
                color: '#5E5E67',
                fontFamily: "'JetBrains Mono'",
                fontSize: 6,
                fontWeight: 800,
                letterSpacing: '0.11em',
                textTransform: 'uppercase',
              }}
            >
              Discipline still on the clock
            </div>
            <div
              style={{
                marginTop: 4,
                color: theme.accent,
                fontFamily: "'JetBrains Mono'",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: '-0.04em',
              }}
            >
              {remainingTime}
            </div>
          </div>
          <IconLock size={22} />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 7,
            marginTop: 9,
          }}
        >
          {[
            {
              label: 'Streak',
              before: `${streak}d`,
              after: '0d',
              icon: <IconFlame size={13} />,
            },
            {
              label: 'Aura',
              before: auraScore,
              after: projectedAura,
              icon: <IconSkull size={13} />,
            },
            {
              label: 'Session',
              before: 'Active',
              after: 'Failed',
              icon: <IconFlag size={13} />,
            },
          ].map((impact) => (
            <div
              key={impact.label}
              style={{
                padding: '10px 7px',
                border: '1px solid rgba(255,59,48,0.12)',
                borderRadius: 11,
                background: 'rgba(255,59,48,0.035)',
                textAlign: 'center',
              }}
            >
              <div style={{ color: '#FF6259' }}>{impact.icon}</div>
              <div
                style={{
                  marginTop: 5,
                  fontFamily: "'Barlow Condensed'",
                  fontSize: 14,
                  fontWeight: 900,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ color: '#8A8A92' }}>{impact.before}</span>
                <span style={{ margin: '0 4px', color: '#484850' }}>→</span>
                <span style={{ color: '#FF6259' }}>{impact.after}</span>
              </div>
              <div
                style={{
                  marginTop: 3,
                  color: '#575760',
                  fontFamily: "'JetBrains Mono'",
                  fontSize: 6,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {impact.label}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onStay}
          className="interactive-btn"
          style={{
            width: '100%',
            height: 52,
            marginTop: 14,
            border: 0,
            borderRadius: 15,
            background: theme.accent,
            boxShadow: `0 0 24px rgba(${theme.accentRgb},0.18)`,
            color: '#080808',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontFamily: "'Barlow Condensed'",
            fontSize: 17,
            fontWeight: 900,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          <IconLock size={16} />
          Stay locked in
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="interactive-btn"
          style={{
            width: '100%',
            height: 44,
            marginTop: 8,
            border: '1px solid rgba(255,59,48,0.2)',
            borderRadius: 12,
            background: 'rgba(255,59,48,0.055)',
            color: '#C65E58',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            fontFamily: "'Barlow Condensed'",
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          <IconFlag size={14} />
          Confirm give up
        </button>
        <div
          style={{
            marginTop: 9,
            color: '#4C4C54',
            fontFamily: "'JetBrains Mono'",
            fontSize: 6,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          Failed-session changes cannot be undone
        </div>
      </motion.section>
    </motion.div>
  )
}

export function GiveUpModalPreviewScreen({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void
}) {
  const store = useAppStore()
  return (
    <div
      style={{
        height: '100dvh',
        background: '#080808',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 45%, rgba(200,255,0,0.07), transparent 35%)',
        }}
      />
      <GiveUpConfirmationModal
        streak={store.currentStreak}
        auraScore={store.auraScore}
        remainingTime="18:42"
        onStay={() => onNavigate('focus')}
        onConfirm={() => onNavigate('error')}
      />
    </div>
  )
}
