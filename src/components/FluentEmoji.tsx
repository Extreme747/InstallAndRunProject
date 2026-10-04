import React from 'react'

export const UNICODE_TO_FLUENT: Record<string, string> = {
  '🗿': 'moai',
  '🔥': 'fire',
  '⚡': 'lightning',
  '👑': 'crown',
  '🏆': 'trophy',
  '💀': 'skull',
  '🤖': 'robot',
  '👻': 'ghost',
  '🌵': 'cactus',
  '🪨': 'stone',
  '🧊': 'ice',
  '🛡️': 'shield',
  '🛡': 'shield',
  '🎯': 'target',
  '🔒': 'lock',
  '🔓': 'unlock',
  '💎': 'diamond',
  '⚔️': 'swords',
  '⚔': 'swords',
  '📊': 'chart',
  '📅': 'calendar',
  '⏱️': 'stopwatch',
  '⏱': 'stopwatch',
  '⏳': 'hourglass',
  '🎨': 'palette',
  '🎵': 'music',
  '🎧': 'headphones',
  '📱': 'phone',
  '✨': 'sparkles',
  '✅': 'check',
  '❌': 'cross',
  '⚠️': 'warning',
  '🎲': 'dice',
  '🦁': 'lion',
  '🌙': 'moon',
  '💯': 'hundred',
  '🦋': 'butterfly',
  '🌱': 'seedling',
  '🧠': 'brain',
  '📜': 'scroll',
  '💡': 'bulb',
  '📵': 'no_phone',
  '🔇': 'mute',
  '🌧️': 'rain',
  '🌧': 'rain',
  '🚀': 'rocket',
  '🦍': 'gorilla',
  '🐺': 'wolf',
  '🥷': 'ninja',
  '😤': 'steam_face',
  '🤙': 'call_me',
  '🎁': 'gift',
  '👥': 'people',
  '📤': 'outbox',
  '💾': 'save',
  '📋': 'clipboard',
  '✏️': 'pencil',
  '✏': 'pencil',
  '📸': 'camera',
  '▶️': 'play',
  '▶': 'play',
  '🐦': 'bird',
  '📘': 'blue_book',
  '💬': 'speech',
  '🎬': 'clapper',
  '🍿': 'popcorn',
  '🌟': 'star',
  '🧱': 'brick',
  '🍬': 'candy',
  '🌐': 'globe',
  '📌': 'pin',
  '✈️': 'plane',
  '✈': 'plane',
  '🧵': 'thread',
  '🟣': 'purple_circle',
  '🎥': 'movie',
  '🎖️': 'medal',
  '🎖': 'medal',
  '🔫': 'pistol',
  '📡': 'satellite',
  '🔔': 'bell',
  '🏙️': 'city',
  '🌆': 'city',
  '🏳️': 'flag',
  '🏳': 'flag',
  '❄️': 'ice',
  '❄': 'ice'
}

export interface FluentEmojiProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name?: string
  char?: string
  size?: number | string
  className?: string
  style?: React.CSSProperties
}

export function getEmojiSrc(nameOrChar: string): string | null {
  if (!nameOrChar) return null
  const trimmed = nameOrChar.trim()
  const key = UNICODE_TO_FLUENT[trimmed] || trimmed.toLowerCase()
  // Check known keys
  const validKeys = Object.values(UNICODE_TO_FLUENT)
  if (validKeys.includes(key)) {
    return `./emojis/${key}.png`
  }
  return null
}

export default function FluentEmoji({
  name,
  char,
  size = 24,
  className = '',
  style = {},
  alt = 'emoji',
  ...props
}: FluentEmojiProps) {
  const query = char || name || 'moai'
  const src = getEmojiSrc(query)

  if (!src) {
    return <span style={{ fontSize: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, ...style }} className={className}>{char || name}</span>
  }

  const dimension = typeof size === 'number' ? `${size}px` : size

  return (
    <img
      src={src}
      alt={alt}
      width={typeof size === 'number' ? size : undefined}
      height={typeof size === 'number' ? size : undefined}
      loading="eager"
      decoding="async"
      className={`fluent-3d-emoji ${className}`}
      style={{
        width: dimension,
        height: dimension,
        display: 'inline-block',
        verticalAlign: 'middle',
        objectFit: 'contain',
        flexShrink: 0,
        pointerEvents: 'none',
        userSelect: 'none',
        ...style,
      }}
      onError={(e) => {
        // Fallback to text emoji if image fails
        const target = e.currentTarget
        const parent = target.parentElement
        if (parent && char) {
          const span = document.createElement('span')
          span.textContent = char
          span.style.fontSize = typeof size === 'number' ? `${size}px` : size
          span.style.lineHeight = '1'
          parent.replaceChild(span, target)
        }
      }}
      {...props}
    />
  )
}
