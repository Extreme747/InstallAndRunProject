import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconBolt } from './Icons'
import { useTheme } from '../utils/theme'

interface XPFloatingRewardProps {
  xp: number
  show: boolean
  onComplete?: () => void
}

export default function XPFloatingReward({ xp, show, onComplete }: XPFloatingRewardProps) {
  const theme = useTheme()
  const [visible, setVisible] = useState(show)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        onComplete?.()
      }, 1600)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.6 }}
          animate={{ opacity: 1, y: -45, scale: 1.15 }}
          exit={{ opacity: 0, y: -75, scale: 0.8 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 120,
            background: 'linear-gradient(135deg, rgba(191,127,255,0.95) 0%, rgba(200,255,0,0.95) 100%)',
            color: '#080808',
            padding: '8px 18px',
            borderRadius: 20,
            fontFamily: "'Barlow Condensed'",
            fontWeight: 900,
            fontSize: 20,
            letterSpacing: '0.04em',
            boxShadow: `0 8px 30px rgba(0,0,0,0.7), 0 0 25px rgba(${theme.accentRgb},0.6)`,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            pointerEvents: 'none',
          }}
        >
          <IconBolt size={18} color="#080808" />
          <span>+{xp} XP</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
