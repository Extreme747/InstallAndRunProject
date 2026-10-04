import { useEffect } from 'react'
import { useTheme } from '../utils/theme'
import FluentEmoji from '../components/FluentEmoji'

export default function SplashScreen({ onNext }: { onNext?: () => void }) {
  const theme = useTheme()
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext?.()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onNext])

  return (
    <div
      onClick={onNext}
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.bg,
        position: 'relative',
        overflow: 'hidden',
        padding: '0 32px',
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          width: 340,
          height: 340,
          borderRadius: '50%',
          background:
            `radial-gradient(circle, rgba(${theme.accentRgb},0.12) 0%, rgba(${theme.accentRgb},0.03) 50%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* 3D Windows Moai */}
      <div
        className="animate-float"
        style={{
          lineHeight: 1,
          filter: `drop-shadow(0 0 32px rgba(${theme.accentRgb},0.25))`,
          marginBottom: 24,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <FluentEmoji name="moai" size={108} />
      </div>

      {/* Wordmark */}
      <div
        className="animate-fade-up"
        style={{
          fontFamily: "'Barlow Condensed'",
          fontWeight: 900,
          fontSize: 72,
          color: theme.accent,
          letterSpacing: '-1.5px',
          textTransform: 'uppercase',
          lineHeight: 0.88,
          position: 'relative',
          zIndex: 1,
        }}
      >
        SCROLLN'T
      </div>

      {/* Tagline */}
      <div
        className="animate-fade-up-delay-1"
        style={{
          fontFamily: "'DM Sans'",
          fontSize: 15,
          fontWeight: 400,
          color: 'rgba(245,245,245,0.4)',
          letterSpacing: '0.04em',
          marginTop: 14,
          position: 'relative',
          zIndex: 1,
        }}
      >
        Stop scrolling. Start living.
      </div>

      {/* Progress dots */}
      <div
        className="animate-fade-up-delay-2"
        style={{
          position: 'absolute',
          bottom: 40,
          display: 'flex',
          gap: 7,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: i === 0 ? 28 : 7,
              height: 7,
              borderRadius: 4,
              background: i === 0 ? theme.accent : '#232323',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
