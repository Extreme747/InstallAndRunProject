import { useState } from 'react'
import { useTheme } from '../utils/theme'
import { useAppStore } from '../store/useAppStore'
import { IconSelfie, IconBlocked, IconDice, IconRocket, IconLock, getMascotComponent } from '../components/Icons'

interface Props {
  slide: 1 | 2 | 3
  onNext?: () => void
  onSkip?: () => void
}

const AVATAR_OPTIONS = ['moai', 'flame', 'cyber', 'gold', 'skull', 'robot', 'ghost', 'cactus', 'stone']

const RANDOM_NAMES = [
  'Founder100',
  'LockInGod',
  'MoaiWarrior',
  'SigmaGrind',
  'DopamineDemon',
  'ZenMaster',
  'ApexStoic',
  'FocusBeast',
  'NoScrollKing',
  'Grindset100'
]

const SLIDES = [
  {
    hero: <IconSelfie size={56} color="#BF7FFF" glow />,
    emojiLabel: 'Phone with arrow',
    heading: "WELCOME TO\nSCROLLN'T",
    body: "Lock away distractions and claim your focus streak. Simple as that.",
    cta: 'Next →',
    note: null,
  },
  {
    hero: <IconBlocked size={56} color="#FF3B30" glow />,
    emojiLabel: 'Blocked hand',
    heading: "SAVAGE\nBLOCKING",
    body: "Open a doomscroll app? You get ejected instantly. No mercy, no bypass.",
    cta: 'Next →',
    note: null,
  },
  {
    hero: <IconRocket size={56} color="#C8FF00" glow />,
    emojiLabel: 'Rocket',
    heading: "CHOOSE YOUR\nIDENTITY",
    body: "Pick an avatar and enter your warrior name. You'll need it for streaks and leaderboards.",
    cta: 'ENTER THE ARENA →',
    note: 'No login required · 100% anonymous',
  },
]

export default function OnboardingScreen({ slide, onNext, onSkip }: Props) {
  const theme = useTheme()
  const data = SLIDES[slide - 1]
  const totalSlides = SLIDES.length
  const store = useAppStore()
  
  const [nameInput, setNameInput] = useState(store.userName && store.userName !== 'Anonymous' ? store.userName : 'Founder100')
  const [selectedAvatar, setSelectedAvatar] = useState(store.avatarEmoji || 'moai')
  const [isRolling, setIsRolling] = useState(false)

  const handleRandomName = () => {
    setIsRolling(true)
    const random = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)]
    setNameInput(random)
    setTimeout(() => setIsRolling(false), 450)
  }

  const handleFinish = () => {
    const finalName = nameInput.trim() || 'Founder100'
    store.setUserName(finalName)
    store.setAvatarEmoji(selectedAvatar)
    store.setHasSeenOnboarding(true)
    if (onNext) onNext()
  }

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
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${theme.accentRgb},0.06) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Skip */}
      {slide < 3 && (
        <button
          onClick={onSkip || onNext}
          style={{
            position: 'absolute',
            top: 'max(20px, env(safe-area-inset-top, 24px))',
            right: 20,
            zIndex: 10,
            fontFamily: "'DM Sans'",
            fontSize: 14,
            fontWeight: 600,
            color: '#7E7E87',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            letterSpacing: '0.03em',
          }}
        >
          Skip
        </button>
      )}

      {/* Hero visual */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: slide === 3 ? '24px 24px 8px' : '36px 32px 16px',
        }}
      >
        {slide !== 3 ? (
          <>
            {/* Hero card for Slide 1 & 2 */}
            <div
              className="animate-scale-bounce"
              style={{
                width: 150,
                height: 150,
                borderRadius: 40,
                background: '#0E0E0E',
                border: '1px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 36,
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              }}
              aria-label={data.emojiLabel}
            >
              {data.hero}
            </div>

            {/* Heading */}
            <div
              className="animate-fade-up"
              style={{
                fontFamily: "'Barlow Condensed'",
                fontWeight: 900,
                fontSize: 52,
                color: '#F5F5F5',
                letterSpacing: '-0.5px',
                textTransform: 'uppercase',
                lineHeight: 0.92,
                textAlign: 'center',
                whiteSpace: 'pre-line',
                marginBottom: 16,
              }}
            >
              {data.heading}
            </div>

            {/* Body */}
            <div
              className="animate-fade-up-delay-1"
              style={{
                fontFamily: "'DM Sans'",
                fontSize: 15,
                fontWeight: 400,
                color: 'rgba(245,245,245,0.5)',
                lineHeight: 1.6,
                textAlign: 'center',
                maxWidth: 280,
              }}
            >
              {data.body}
            </div>
          </>
        ) : (
          /* Profile & Nickname setup for Slide 3 */
          <div style={{ width: '100%', maxWidth: 330, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Live selected Avatar Badge */}
            <div
              className="animate-scale-bounce"
              style={{
                width: 90,
                height: 90,
                borderRadius: 28,
                background: `rgba(${theme.accentRgb},0.08)`,
                border: `2px solid ${theme.accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                boxShadow: `0 0 30px rgba(${theme.accentRgb},0.2)`,
              }}
            >
              {getMascotComponent(selectedAvatar, 52)}
            </div>

            <div
              style={{
                fontFamily: "'Barlow Condensed'",
                fontWeight: 900,
                fontSize: 38,
                color: '#F5F5F5',
                textTransform: 'uppercase',
                letterSpacing: '-0.3px',
                textAlign: 'center',
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              YOUR WARRIOR NAME
            </div>

            <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: '#7E7E87', textAlign: 'center', marginBottom: 20 }}>
              Visible to your squad & leaderboards
            </div>

            {/* Avatar Row Picker */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', maxWidth: '100%', paddingBottom: 12, marginBottom: 12 }}>
              {AVATAR_OPTIONS.map((skin) => (
                <button
                  key={skin}
                  onClick={() => setSelectedAvatar(skin)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: selectedAvatar === skin ? `rgba(${theme.accentRgb},0.15)` : '#0E0E0E',
                    border: `1.5px solid ${selectedAvatar === skin ? theme.accent : '#1A1A1A'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                    padding: 0,
                  }}
                >
                  {getMascotComponent(skin, 36)}
                </button>
              ))}
            </div>

            {/* Name Input Box with Randomizer button */}
            <div style={{ width: '100%', display: 'flex', gap: 8, marginBottom: 14 }}>
              <input
                type="text"
                maxLength={20}
                placeholder="e.g. Founder100"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                style={{
                  flex: 1,
                  height: 50,
                  background: '#0E0E0E',
                  border: '1.5px solid #222',
                  borderRadius: 14,
                  padding: '0 16px',
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 800,
                  fontSize: 20,
                  color: theme.accent,
                  letterSpacing: '0.04em',
                  outline: 'none',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                }}
              />
              <button
                onClick={handleRandomName}
                title="Randomize name"
                className={`interactive-btn ${isRolling ? 'animate-dice-roll' : ''}`}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: '#141414',
                  border: '1px solid #262626',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconDice size={18} color={theme.accent} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div style={{ padding: '0 24px max(24px, env(safe-area-inset-bottom, 24px))', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* CTA button */}
        <button
          onClick={slide === 3 ? handleFinish : onNext}
          className="animate-fade-up-delay-2 interactive-btn"
          style={{
            width: '100%',
            height: 56,
            borderRadius: 18,
            background: theme.accent,
            border: 'none',
            fontFamily: "'Barlow Condensed'",
            fontWeight: 800,
            fontSize: 20,
            color: '#080808',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {slide === 3 ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              CLAIM IDENTITY <IconRocket size={18} color="#080808" />
            </span>
          ) : (
            data.cta
          )}
        </button>

        {/* Note */}
        {data.note && (
          <div
            className="animate-fade-up-delay-3"
            style={{
              fontFamily: "'DM Sans'",
              fontSize: 12,
              color: '#7E7E87',
              textAlign: 'center',
              lineHeight: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <IconLock size={12} color="#7E7E87" /> {data.note}
          </div>
        )}

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 4 }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i + 1 === slide ? 28 : 7,
                height: 7,
                borderRadius: 4,
                background: i + 1 === slide ? theme.accent : '#1E1E1E',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
