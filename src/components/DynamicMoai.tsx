import { useState, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMascotComponent } from './Icons'
import { useTheme } from '../utils/theme'
import { useAppStore } from '../store/useAppStore'

export type MoaiState = 'idle' | 'focusing' | 'blocked_rage' | 'victory' | 'zen'

interface DynamicMoaiProps {
  size?: number
  state?: MoaiState
  interactive?: boolean
  skin?: string
  style?: CSSProperties
  className?: string
}

const TAP_QUOTES = [
  "Still scrolling? Go grind! 🗿",
  "Lock in or stay broke. ⚡",
  "Discipline = Freedom. 🔥",
  "Cheap dopamine is for the weak. 🛡️",
  "Focus now, flex later. 👑",
  "Your future self is watching. 👀",
  "One session at a time. 🚀",
  "Moai respects pure focus. 🗿",
]

export default function DynamicMoai({
  size = 56,
  state = 'idle',
  interactive = true,
  skin,
  style,
  className = '',
}: DynamicMoaiProps) {
  const theme = useTheme()
  const activeSkin = useAppStore((s) => s.activeSkin)
  const currentSkin = skin || activeSkin || 'moai'
  
  const [isTapped, setIsTapped] = useState(false)
  const [bubbleText, setBubbleText] = useState<string | null>(null)

  const handleTap = () => {
    if (!interactive) return
    setIsTapped(true)
    const randomQuote = TAP_QUOTES[Math.floor(Math.random() * TAP_QUOTES.length)]
    setBubbleText(randomQuote)

    setTimeout(() => setIsTapped(false), 400)
    setTimeout(() => setBubbleText(null), 2800)
  }

  // Aura & effects based on state
  let glowColor = 'transparent'
  let animationClass = ''

  if (state === 'focusing') {
    glowColor = `rgba(${theme.accentRgb}, 0.5)`
    animationClass = 'animate-breathe-aura'
  } else if (state === 'blocked_rage') {
    glowColor = 'rgba(255, 59, 48, 0.75)'
    animationClass = 'animate-glitch animate-laser-eyes'
  } else if (state === 'victory') {
    glowColor = 'rgba(255, 184, 0, 0.65)'
    animationClass = 'animate-pop-spring'
  } else if (state === 'idle') {
    animationClass = 'animate-float-subtle'
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none',
        ...style,
      }}
      onClick={handleTap}
      className={`${animationClass} ${className}`}
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {bubbleText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -size * 0.75, scale: 1 }}
            exit={{ opacity: 0, y: -size * 0.9, scale: 0.8 }}
            transition={{ type: 'spring', damping: 15, stiffness: 260 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              zIndex: 30,
              background: '#0E0E0E',
              border: `1px solid ${state === 'blocked_rage' ? '#FF3B30' : theme.accent}`,
              borderRadius: 14,
              padding: '6px 12px',
              boxShadow: `0 8px 24px rgba(0,0,0,0.8), 0 0 12px ${state === 'blocked_rage' ? 'rgba(255,59,48,0.3)' : `rgba(${theme.accentRgb},0.3)`}`,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                fontFamily: "'Barlow Condensed'",
                fontWeight: 800,
                fontSize: 13,
                color: state === 'blocked_rage' ? '#FF3B30' : theme.accent,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}
            >
              {bubbleText}
            </div>
            {/* Bubble arrow */}
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: `5px solid ${state === 'blocked_rage' ? '#FF3B30' : theme.accent}`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Laser eye beams when blocked */}
      {state === 'blocked_rage' && (
        <div
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,59,48,0.35) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      {/* Main Mascot Icon with motion wobble */}
      <motion.div
        animate={
          isTapped
            ? { scale: [1, 1.25, 0.95, 1.05, 1], rotate: [0, -12, 10, -5, 0] }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.35 }}
        style={{
          filter: glowColor !== 'transparent' ? `drop-shadow(0 0 ${size * 0.25}px ${glowColor})` : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {getMascotComponent(currentSkin, size)}
      </motion.div>
    </div>
  )
}
