import React from 'react'
import FluentEmoji from './FluentEmoji'

export interface IconProps {
  size?: number
  className?: string
  style?: React.CSSProperties
  glow?: boolean
  color?: string
}

function createIcon(emojiName: string, defaultGlowColor?: string) {
  return function Icon({ size = 20, style, className = '', glow }: IconProps) {
    const glowStyle: React.CSSProperties = glow && defaultGlowColor ? {
      filter: `drop-shadow(0 0 10px ${defaultGlowColor})`
    } : {}

    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, ...glowStyle, ...style }}>
        <FluentEmoji name={emojiName} size={size} className={className} />
      </span>
    )
  }
}

export const IconFlame = createIcon('fire', 'rgba(255, 184, 0, 0.55)')
export const IconBolt = createIcon('lightning', 'rgba(191, 127, 255, 0.65)')
export const IconTarget = createIcon('target', 'rgba(255, 184, 0, 0.55)')
export const IconUsers = createIcon('people', 'rgba(96, 165, 250, 0.55)')
export const IconPalette = createIcon('palette', 'rgba(191, 127, 255, 0.55)')
export const IconChart = createIcon('chart', 'rgba(200, 255, 0, 0.55)')
export const IconLock = createIcon('lock', 'rgba(255, 59, 48, 0.55)')
export const IconLocked = createIcon('lock', 'rgba(255, 59, 48, 0.55)')
export const IconUnlock = createIcon('unlock', 'rgba(200, 255, 0, 0.55)')
export const IconShield = createIcon('shield', 'rgba(200, 255, 0, 0.55)')
export const IconWarning = createIcon('warning', 'rgba(255, 184, 0, 0.55)')
export const IconAlert = createIcon('warning', 'rgba(255, 59, 48, 0.55)')
export const IconTrophy = createIcon('trophy', 'rgba(255, 184, 0, 0.65)')
export const IconCrown = createIcon('crown', 'rgba(255, 184, 0, 0.65)')
export const IconSkull = createIcon('skull', 'rgba(255, 59, 48, 0.65)')
export const IconDiamond = createIcon('diamond', 'rgba(96, 165, 250, 0.65)')
export const IconSwords = createIcon('swords', 'rgba(200, 255, 0, 0.55)')
export const IconSword = createIcon('swords', 'rgba(200, 255, 0, 0.55)')
export const IconIce = createIcon('ice', 'rgba(96, 165, 250, 0.65)')
export const IconSnowflake = createIcon('ice', 'rgba(96, 165, 250, 0.65)')
export const IconStopwatch = createIcon('stopwatch', 'rgba(200, 255, 0, 0.55)')
export const IconTimer = createIcon('stopwatch', 'rgba(200, 255, 0, 0.55)')
export const IconClock = createIcon('stopwatch', 'rgba(200, 255, 0, 0.55)')
export const IconHourglass = createIcon('hourglass', 'rgba(255, 184, 0, 0.55)')
export const IconSparkles = createIcon('sparkles', 'rgba(200, 255, 0, 0.55)')
export const IconSparkle = createIcon('sparkles', 'rgba(200, 255, 0, 0.55)')
export const IconCheck = createIcon('check', 'rgba(200, 255, 0, 0.55)')
export const IconCross = createIcon('cross', 'rgba(255, 59, 48, 0.55)')
export const IconDice = createIcon('dice')
export const IconFilm = createIcon('clapper', 'rgba(255, 184, 0, 0.55)')
export const IconMovie = createIcon('movie', 'rgba(255, 184, 0, 0.55)')
export const IconClapper = createIcon('clapper', 'rgba(255, 184, 0, 0.55)')
export const IconGamepad = createIcon('pistol', 'rgba(200, 255, 0, 0.55)')
export const IconPistol = createIcon('pistol')
export const IconPhone = createIcon('phone', 'rgba(96, 165, 250, 0.55)')
export const IconMobile = createIcon('phone')
export const IconBlocked = createIcon('no_phone', 'rgba(255, 59, 48, 0.65)')
export const IconNoPhone = createIcon('no_phone', 'rgba(255, 59, 48, 0.65)')
export const IconMuscle = createIcon('gorilla')
export const IconGorilla = createIcon('gorilla')
export const IconCalendar = createIcon('calendar', 'rgba(200, 255, 0, 0.55)')
export const IconGift = createIcon('gift', 'rgba(255, 184, 0, 0.55)')
export const IconMoon = createIcon('moon', 'rgba(191, 127, 255, 0.55)')
export const IconMusic = createIcon('music', 'rgba(191, 127, 255, 0.55)')
export const IconMute = createIcon('mute')
export const IconRain = createIcon('rain', 'rgba(96, 165, 250, 0.55)')
export const IconCity = createIcon('city', 'rgba(191, 127, 255, 0.55)')
export const IconBrain = createIcon('brain', 'rgba(191, 127, 255, 0.55)')
export const IconSpace = createIcon('rocket', 'rgba(255, 184, 0, 0.55)')
export const IconRocket = createIcon('rocket', 'rgba(255, 184, 0, 0.55)')
export const IconHeadphones = createIcon('headphones', 'rgba(200, 255, 0, 0.55)')
export const IconPlus = createIcon('cross')
export const IconShare = createIcon('outbox', 'rgba(200, 255, 0, 0.55)')
export const IconOutbox = createIcon('outbox')
export const IconMedal = createIcon('medal', 'rgba(255, 184, 0, 0.55)')
export const IconFlag = createIcon('flag')
export const IconSelfie = createIcon('camera')
export const IconCamera = createIcon('camera')
export const IconWindow = createIcon('phone')
export const IconDocument = createIcon('scroll')
export const IconScroll = createIcon('scroll')
export const IconAndroid = createIcon('robot', 'rgba(200, 255, 0, 0.55)')
export const IconRobot = createIcon('robot', 'rgba(200, 255, 0, 0.55)')
export const IconEdit = createIcon('pencil')
export const IconPencil = createIcon('pencil')
export const IconBell = createIcon('bell', 'rgba(255, 184, 0, 0.55)')
export const IconCopy = createIcon('clipboard')
export const IconClipboard = createIcon('clipboard')
export const IconSave = createIcon('save')
export const IconMessage = createIcon('speech', 'rgba(96, 165, 250, 0.55)')
export const IconSpeech = createIcon('speech')
export const IconLink = createIcon('thread')
export const IconInsight = createIcon('bulb', 'rgba(255, 184, 0, 0.55)')
export const IconBulb = createIcon('bulb', 'rgba(255, 184, 0, 0.55)')
export const IconHeatmap = createIcon('calendar', 'rgba(200, 255, 0, 0.55)')
export const IconStar = createIcon('star', 'rgba(255, 184, 0, 0.55)')
export const IconPopcorn = createIcon('popcorn')
export const IconCandy = createIcon('candy')
export const IconBrick = createIcon('brick')
export const IconGlobe = createIcon('globe')
export const IconPin = createIcon('pin')
export const IconPlane = createIcon('plane')
export const IconBird = createIcon('bird')
export const IconBlueBook = createIcon('blue_book')
export const IconSatellite = createIcon('satellite')
export const IconHundred = createIcon('hundred', 'rgba(255, 59, 48, 0.55)')
export const IconButterfly = createIcon('butterfly')
export const IconSeed = createIcon('seedling', 'rgba(200, 255, 0, 0.55)')
export const IconSeedling = createIcon('seedling', 'rgba(200, 255, 0, 0.55)')
export const IconSearch = createIcon('bulb')
export const IconEmpty = createIcon('ghost')
export const IconPlay = createIcon('play', 'rgba(200, 255, 0, 0.55)')
export const IconGhost = createIcon('ghost', 'rgba(191, 127, 255, 0.55)')
export const IconTwitter = createIcon('bird')
export const IconLion = createIcon('lion')
export const IconWolf = createIcon('wolf')
export const IconNinja = createIcon('ninja')
export const IconSteamFace = createIcon('steam_face')
export const IconCallMe = createIcon('call_me')

export function getMascotComponent(skin: string = 'default', size: number = 44) {
  const s = (skin || 'default').toLowerCase()
  if (s === 'cactus') {
    return <FluentEmoji name="cactus" size={size} />
  }
  if (s === 'stone') {
    return <FluentEmoji name="stone" size={size} />
  }
  if (s === 'robot') {
    return <FluentEmoji name="robot" size={size} />
  }
  if (s === 'ghost') {
    return <FluentEmoji name="ghost" size={size} />
  }
  if (s === 'skull') {
    return <FluentEmoji name="skull" size={size} />
  }
  if (s === 'gold') {
    return (
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <FluentEmoji name="moai" size={size} style={{ filter: 'drop-shadow(0 0 12px rgba(255, 184, 0, 0.7))' }} />
        <span style={{ position: 'absolute', top: -size * 0.25, right: -size * 0.15 }}>
          <FluentEmoji name="crown" size={size * 0.55} />
        </span>
      </span>
    )
  }
  if (s === 'flame') {
    return (
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <FluentEmoji name="moai" size={size} style={{ filter: 'drop-shadow(0 0 12px rgba(255, 59, 48, 0.7))' }} />
        <span style={{ position: 'absolute', top: -size * 0.2, right: -size * 0.15 }}>
          <FluentEmoji name="fire" size={size * 0.55} />
        </span>
      </span>
    )
  }
  if (s === 'cyber') {
    return (
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <FluentEmoji name="moai" size={size} style={{ filter: 'drop-shadow(0 0 14px rgba(200, 255, 0, 0.7))' }} />
        <span style={{ position: 'absolute', top: -size * 0.2, right: -size * 0.15 }}>
          <FluentEmoji name="lightning" size={size * 0.55} />
        </span>
      </span>
    )
  }
  return <FluentEmoji name="moai" size={size} />
}
