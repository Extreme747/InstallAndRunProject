import { useState, useMemo, useEffect } from 'react'
import { useTheme } from '../utils/theme'
import type { Screen } from '../types'
import { useAppStore } from '../store/useAppStore'
import { BottomNav } from './HomeScreen'
import {
  IconShield,
  IconFlame,
  IconSearch,
  IconEmpty,
  IconPlus,
  IconCamera,
  IconPlay,
  IconGhost,
  IconTwitter,
  IconAndroid,
  IconMessage,
  IconGlobe,
  IconFilm,
  IconGamepad,
  IconPhone,
  IconBolt,
  IconClock,
} from '../components/Icons'

interface Props {
  onNavigate: (screen: Screen) => void
}

export interface AppOption {
  id: string
  name: string
  packageName: string
  category: 'Social' | 'Video' | 'Gaming' | 'Browser' | 'Custom'
  emoji?: string
  icon?: React.ReactNode
}

export function getAppIcon(pkg: string, size = 20): React.ReactNode {
  switch (pkg) {
    case 'com.instagram.android':
      return <IconCamera size={size} color="#BF7FFF" />
    case 'com.google.android.youtube':
      return <IconPlay size={size} color="#FF3B30" />
    case 'com.snapchat.android':
      return <IconGhost size={size} color="#FFB800" />
    case 'com.twitter.android':
      return <IconTwitter size={size} color="#60A5FA" />
    case 'com.reddit.frontpage':
      return <IconAndroid size={size} color="#FF6B2B" />
    case 'com.facebook.katana':
    case 'com.instagram.barcelona':
    case 'org.telegram.messenger':
    case 'com.whatsapp':
    case 'com.pinterest':
      return <IconMessage size={size} color="#34D399" />
    case 'com.netflix.mediaclient':
    case 'com.amazon.avod.thirdpartyclient':
    case 'in.startv.hotstar':
    case 'tv.twitch.android.app':
    case 'com.jio.media.ondemand':
      return <IconFilm size={size} color="#FF3B30" />
    case 'com.pubg.imobile':
    case 'com.dts.freefireth':
    case 'com.activision.callofduty.shooter':
    case 'com.supercell.clashofclans':
    case 'com.roblox.client':
    case 'com.miHoYo.GenshinImpact':
    case 'com.king.candycrushsaga':
      return <IconGamepad size={size} color="#C8FF00" />
    case 'com.android.chrome':
    case 'com.brave.browser':
      return <IconGlobe size={size} color="#60A5FA" />
    default:
      return <IconPhone size={size} color="#7E7E87" />
  }
}

export const APP_METADATA: Record<string, { name: string; icon?: string; category: 'Social' | 'Video' | 'Gaming' | 'Browser' }> = {
  'com.instagram.android': { name: 'Instagram', category: 'Social' },
  'com.google.android.youtube': { name: 'YouTube', category: 'Video' },
  'com.snapchat.android': { name: 'Snapchat', category: 'Social' },
  'com.twitter.android': { name: 'Twitter / X', category: 'Social' },
  'com.reddit.frontpage': { name: 'Reddit', category: 'Social' },
  'com.facebook.katana': { name: 'Facebook', category: 'Social' },
  'com.instagram.barcelona': { name: 'Threads', category: 'Social' },
  'org.telegram.messenger': { name: 'Telegram', category: 'Social' },
  'com.whatsapp': { name: 'WhatsApp', category: 'Social' },
  'com.pinterest': { name: 'Pinterest', category: 'Social' },

  'com.netflix.mediaclient': { name: 'Netflix', category: 'Video' },
  'com.amazon.avod.thirdpartyclient': { name: 'Prime Video', category: 'Video' },
  'in.startv.hotstar': { name: 'Disney+ Hotstar', category: 'Video' },
  'tv.twitch.android.app': { name: 'Twitch', category: 'Video' },
  'com.jio.media.ondemand': { name: 'JioCinema', category: 'Video' },

  'com.pubg.imobile': { name: 'BGMI / PUBG', category: 'Gaming' },
  'com.dts.freefireth': { name: 'Free Fire', category: 'Gaming' },
  'com.activision.callofduty.shooter': { name: 'Call of Duty: Mobile', category: 'Gaming' },
  'com.supercell.clashofclans': { name: 'Clash of Clans', category: 'Gaming' },
  'com.roblox.client': { name: 'Roblox', category: 'Gaming' },
  'com.miHoYo.GenshinImpact': { name: 'Genshin Impact', category: 'Gaming' },
  'com.king.candycrushsaga': { name: 'Candy Crush', category: 'Gaming' },

  'com.android.chrome': { name: 'Google Chrome', category: 'Browser' },
  'com.brave.browser': { name: 'Brave Browser', category: 'Browser' },
  'com.android.vending': { name: 'Google Play Store', category: 'Browser' },
  'com.android.settings': { name: 'Settings', category: 'Browser' },
  'com.google.android.gm': { name: 'Gmail', category: 'Social' },
  'com.google.android.apps.maps': { name: 'Google Maps', category: 'Browser' },
  'com.google.android.apps.tachyon': { name: 'Google Meet', category: 'Social' },
  'com.google.android.apps.photos': { name: 'Google Photos', category: 'Social' },
}

export function formatAppName(pkg: string): { name: string; icon: React.ReactNode } {
  if (APP_METADATA[pkg]) {
    return { name: APP_METADATA[pkg].name, icon: getAppIcon(pkg) }
  }
  const clean = pkg.split('.').pop() || pkg
  const name = clean.charAt(0).toUpperCase() + clean.slice(1)
  return { name, icon: <IconPhone size={20} color="#7E7E87" /> }
}

export const AUTO_SHIELD_PACKAGES = [
  'com.instagram.android',
  'com.google.android.youtube',
  'com.snapchat.android',
  'com.twitter.android',
  'com.reddit.frontpage',
  'com.pubg.imobile',
  'com.dts.freefireth',
  'com.netflix.mediaclient'
]

export default function BlockedAppsScreen({ onNavigate }: Props) {
  const store = useAppStore()
  const theme = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Social' | 'Video' | 'Gaming' | 'Browser'>('All')
  const [customPackage, setCustomPackage] = useState('')
  const [showCustomModal, setShowCustomModal] = useState(false)

  const blockedApps = store.blockedApps || []
  const installedApps = store.installedApps || []

  const blockReels = Boolean(store.settings?.blockInstagramReels)
  const blockShorts = Boolean(store.settings?.blockYoutubeShorts)
  const appLimits = store.appLimits || []
  const totalQuotaMinutes = appLimits.reduce((total, limit) => total + limit.dailyLimitMinutes, 0)
  const lockedQuotaCount = store.exhaustedLimits?.length || 0

  const handleToggleReels = () => {
    store.setSelectiveFeedBlocking(!blockReels, blockShorts)
  }

  const handleToggleShorts = () => {
    store.setSelectiveFeedBlocking(blockReels, !blockShorts)
  }

  useEffect(() => {
    store.fetchInstalledApps()
  }, [])

  const availableApps: AppOption[] = useMemo(() => {
    const list: AppOption[] = installedApps.map(inst => {
      const meta = APP_METADATA[inst.packageName]
      return {
        id: inst.packageName,
        name: inst.appName || meta?.name || inst.packageName,
        packageName: inst.packageName,
        category: meta?.category || (inst.isSystem ? 'Browser' : 'Social'),
        icon: getAppIcon(inst.packageName, 22),
      }
    })

    // H8 FIX: Include any custom shielded packages that are not in installedApps
    const installedPkgs = new Set(installedApps.map(i => i.packageName))
    const customList: AppOption[] = blockedApps
      .filter(pkg => !installedPkgs.has(pkg))
      .map(pkg => {
        const meta = APP_METADATA[pkg]
        const fallbackName = pkg.split('.').pop() || pkg
        const capitalized = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1)
        return {
          id: pkg,
          name: meta?.name || capitalized,
          packageName: pkg,
          category: meta?.category || 'Custom',
          icon: getAppIcon(pkg, 22),
        }
      })

    return [...list, ...customList]
  }, [installedApps, blockedApps])

  const toggleApp = (pkg: string) => {
    let next: string[]
    if (blockedApps.includes(pkg)) {
      next = blockedApps.filter(p => p !== pkg)
    } else {
      next = [...blockedApps, pkg]
    }
    store.setBlockedApps(next)
  }

  const handleAutoShield = () => {
    if (installedApps.length > 0) {
      const installedPkgs = installedApps.map(i => i.packageName)
      const matched = AUTO_SHIELD_PACKAGES.filter(p => installedPkgs.includes(p))
      const toShield = matched.length > 0 ? matched : installedApps.filter(i => !i.isSystem).slice(0, 5).map(i => i.packageName)
      const combined = Array.from(new Set([...blockedApps, ...toShield]))
      store.setBlockedApps(combined)
    }
  }

  const handleClearAll = () => {
    store.setBlockedApps([])
  }

  const handleAddCustom = () => {
    const trimmed = customPackage.trim().toLowerCase()
    if (trimmed && !blockedApps.includes(trimmed)) {
      store.setBlockedApps([...blockedApps, trimmed])
      setCustomPackage('')
      setShowCustomModal(false)
    }
  }

  const filteredApps = useMemo(() => {
    return availableApps.filter(app => {
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.packageName.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [availableApps, searchQuery, selectedCategory])

  return (
    <div
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        width: '100%',
        maxWidth: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: theme.bg,
        overflow: 'hidden',
        overflowX: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: 'max(14px, env(safe-area-inset-top, 14px)) clamp(16px, 4vw, 24px) 4px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button
          onClick={() => onNavigate('home')}
          className="interactive-btn"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#0E0E0E',
            border: '1px solid #1E1E1E',
            color: theme.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 17,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <div>
          <div
            style={{
              fontFamily: "'Barlow Condensed'",
              fontWeight: 900,
              fontSize: 'clamp(24px, 3.5vh, 30px)',
              color: '#F5F5F5',
              textTransform: 'uppercase',
              letterSpacing: '-0.3px',
              lineHeight: 1,
            }}
          >
            SHIELDED APPS
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginTop: 1 }}>
            Select apps to block during focus sessions
          </div>
        </div>
      </div>

      {/* Main scrollable body */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          paddingInline: 'clamp(16px, 4vw, 24px)',
          paddingTop: 4,
          paddingBottom: 'clamp(70px, 10vh, 100px)',
        }}
      >
        {/* Counter & Action Banner */}
        <div
          style={{
            background: '#0D0D0D',
            border: '1px solid #1A1A1A',
            borderRadius: 14,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 20, color: theme.accent, lineHeight: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconShield size={15} color="#C8FF00" glow />
              <span>{blockedApps.length} APPS SHIELDED</span>
            </div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87', marginTop: 2 }}>
              Blocked instantly when timer starts
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={handleAutoShield}
              className="interactive-btn animate-pulse-glow"
              style={{
                background: `rgba(${theme.accentRgb},0.12)`,
                border: `1.5px solid ${theme.accent}`,
                borderRadius: 8,
                padding: '5px 12px',
                fontFamily: "'Barlow Condensed'",
                fontWeight: 800,
                fontSize: 12,
                color: theme.accent,
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: `0 0 16px rgba(${theme.accentRgb},0.25)`,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <IconFlame size={14} color="#C8FF00" />
              <span>AUTO-SHIELD</span>
            </button>
            {blockedApps.length > 0 && (
              <button
                onClick={handleClearAll}
                className="interactive-btn"
                style={{
                  background: '#141414',
                  border: '1px solid #222',
                  borderRadius: 8,
                  padding: '5px 8px',
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 700,
                  fontSize: 11,
                  color: '#888',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Daily App Limits Navigation Banner */}
        <button
          type="button"
          onClick={() => onNavigate('app-limits')}
          className="interactive-btn"
          style={{
            width: '100%',
            background: `linear-gradient(135deg, rgba(${theme.accentRgb},0.1) 0%, #101014 68%)`,
            border: `1px solid rgba(${theme.accentRgb},0.26)`,
            borderRadius: 16,
            padding: '12px 13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 10,
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.035), 0 12px 30px rgba(0,0,0,0.18)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -30,
              right: 30,
              width: 110,
              height: 110,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(${theme.accentRgb},0.13), transparent 68%)`,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0, position: 'relative' }}>
            <div
              style={{
                width: 38,
                height: 38,
                border: `1px solid rgba(${theme.accentRgb},0.22)`,
                borderRadius: 11,
                background: `rgba(${theme.accentRgb},0.08)`,
                color: theme.accent,
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <IconClock size={19} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span
                  style={{
                    color: '#F5F5F5',
                    fontFamily: "'Barlow Condensed'",
                    fontWeight: 900,
                    fontSize: 15,
                    letterSpacing: '0.025em',
                    textTransform: 'uppercase',
                  }}
                >
                  Daily app limits
                </span>
                <span
                  style={{
                    padding: '2px 5px',
                    borderRadius: 4,
                    background: theme.accent,
                    color: '#080808',
                    fontFamily: "'JetBrains Mono'",
                    fontSize: 7,
                    fontWeight: 900,
                    letterSpacing: '0.07em',
                  }}
                >
                  QUOTAS
                </span>
              </div>
              <div
                style={{
                  marginTop: 3,
                  color: '#696972',
                  fontFamily: "'DM Sans'",
                  fontSize: 9,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {appLimits.length
                  ? `${appLimits.length} apps · ${totalQuotaMinutes}m budget · ${lockedQuotaCount} locked`
                  : 'Set daily doomscroll caps before the apps set them for you'}
              </div>
            </div>
          </div>
          <span
            style={{
              width: 28,
              height: 28,
              border: `1px solid rgba(${theme.accentRgb},0.18)`,
              borderRadius: 8,
              background: `rgba(${theme.accentRgb},0.06)`,
              color: theme.accent,
              display: 'grid',
              placeItems: 'center',
              fontSize: 15,
              fontWeight: 900,
              position: 'relative',
              flexShrink: 0,
            }}
          >
            ›
          </span>
        </button>

        {/* Selective Feed Blocker (Beta) */}
        <div
          style={{
            background:
              blockReels || blockShorts
                ? `linear-gradient(135deg, rgba(${theme.accentRgb},0.075) 0%, #101014 62%)`
                : '#101014',
            border: `1px solid ${
              blockReels || blockShorts
                ? `rgba(${theme.accentRgb},0.36)`
                : 'rgba(255,255,255,0.075)'
            }`,
            borderRadius: 16,
            padding: 13,
            marginBottom: 10,
            transition: 'border-color 0.2s ease, background 0.2s ease',
            boxShadow:
              blockReels || blockShorts
                ? `0 0 28px rgba(${theme.accentRgb},0.055)`
                : 'none',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 11 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
              <div
                style={{
                  width: 35,
                  height: 35,
                  border: `1px solid rgba(${theme.accentRgb},0.2)`,
                  borderRadius: 10,
                  background: `rgba(${theme.accentRgb},0.075)`,
                  color: theme.accent,
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <IconBolt size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 15, color: '#F5F5F5', letterSpacing: '0.025em', textTransform: 'uppercase' }}>
                    Selective feed blocker
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 7, fontWeight: 900, background: theme.accent, color: '#080808', padding: '2px 5px', borderRadius: 4, letterSpacing: '0.07em' }}>
                    BETA
                  </span>
                </div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 9, color: '#6D6D76', marginTop: 3, lineHeight: 1.35 }}>
                  Kill infinite feeds. Keep useful messages and lectures.
                </div>
              </div>
            </div>

            <span
              style={{
                padding: '4px 7px',
                border: `1px solid ${
                  blockReels || blockShorts
                    ? `rgba(${theme.accentRgb}, 0.3)`
                    : 'rgba(255,255,255,0.07)'
                }`,
                borderRadius: 7,
                background:
                  blockReels || blockShorts
                    ? `rgba(${theme.accentRgb}, 0.08)`
                    : '#151519',
                color: blockReels || blockShorts ? theme.accent : '#55555E',
                fontFamily: "'JetBrains Mono'",
                fontSize: 7,
                fontWeight: 900,
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
              }}
            >
              {blockReels || blockShorts
                ? `${Number(blockReels) + Number(blockShorts)} ACTIVE`
                : 'STANDBY'}
            </span>
          </div>

          {/* 2 Feed Toggles */}
          <div style={{ display: 'grid', gap: 7 }}>
            {/* Instagram Reels Toggle */}
            <button
              type="button"
              onClick={handleToggleReels}
              aria-pressed={blockReels}
              className="interactive-btn"
              style={{
                width: '100%',
                background: blockReels ? 'rgba(191,127,255,0.055)' : '#0B0B0E',
                border: blockReels
                  ? '1px solid rgba(191,127,255,0.2)'
                  : '1px solid #1C1C22',
                borderRadius: 12,
                padding: '9px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    background: 'rgba(191,127,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconCamera size={16} color="#BF7FFF" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13.5, color: '#F5F5F5' }}>
                    Block Instagram Reels
                  </div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 8.5, color: '#66666F', marginTop: 2 }}>
                    DMs and search stay open · Reels get kicked back
                  </div>
                </div>
              </div>

              <span
                style={{
                  width: 44,
                  height: 25,
                  padding: 3,
                  border: blockReels
                    ? `1px solid rgba(${theme.accentRgb},0.42)`
                    : '1px solid #2A2A30',
                  borderRadius: 14,
                  background: blockReels
                    ? `rgba(${theme.accentRgb},0.17)`
                    : '#18181C',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    display: 'block',
                    width: 17,
                    height: 17,
                    borderRadius: '50%',
                    background: blockReels ? theme.accent : '#505058',
                    boxShadow: blockReels
                      ? `0 0 9px rgba(${theme.accentRgb},0.5)`
                      : 'none',
                    transform: blockReels ? 'translateX(19px)' : 'translateX(0)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </span>
            </button>

            {/* YouTube Shorts Toggle */}
            <button
              type="button"
              onClick={handleToggleShorts}
              aria-pressed={blockShorts}
              className="interactive-btn"
              style={{
                width: '100%',
                background: blockShorts ? 'rgba(255,59,48,0.045)' : '#0B0B0E',
                border: blockShorts
                  ? '1px solid rgba(255,59,48,0.17)'
                  : '1px solid #1C1C22',
                borderRadius: 12,
                padding: '9px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    background: 'rgba(255,59,48,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconPlay size={16} color="#FF3B30" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13.5, color: '#F5F5F5' }}>
                    Block YouTube Shorts
                  </div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 8.5, color: '#66666F', marginTop: 2 }}>
                    Long lectures stay open · Shorts get kicked back
                  </div>
                </div>
              </div>

              <span
                style={{
                  width: 44,
                  height: 25,
                  padding: 3,
                  border: blockShorts
                    ? `1px solid rgba(${theme.accentRgb},0.42)`
                    : '1px solid #2A2A30',
                  borderRadius: 14,
                  background: blockShorts
                    ? `rgba(${theme.accentRgb},0.17)`
                    : '#18181C',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    display: 'block',
                    width: 17,
                    height: 17,
                    borderRadius: '50%',
                    background: blockShorts ? theme.accent : '#505058',
                    boxShadow: blockShorts
                      ? `0 0 9px rgba(${theme.accentRgb},0.5)`
                      : 'none',
                    transform: blockShorts ? 'translateX(19px)' : 'translateX(0)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              background: '#0E0E0E',
              border: '1px solid #1E1E1E',
              borderRadius: 12,
              padding: '0 12px',
              height: 38,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <IconSearch size={15} color="#7E7E87" />
            <input
              type="text"
              placeholder="Search installed apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                fontFamily: "'DM Sans'",
                fontSize: 13,
                color: '#F5F5F5',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#666', fontSize: 13, cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            overflowY: 'hidden',
            marginBottom: 8,
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            boxSizing: 'border-box',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x',
            overscrollBehaviorX: 'contain',
            scrollbarWidth: 'none',
          }}
        >
          {(['All', 'Social', 'Video', 'Gaming', 'Browser'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="interactive-btn"
              style={{
                height: 28,
                paddingInline: 12,
                borderRadius: 8,
                background: selectedCategory === cat ? `rgba(${theme.accentRgb},0.15)` : '#0A0A0A',
                border: `1px solid ${selectedCategory === cat ? theme.accent : '#1A1A1A'}`,
                color: selectedCategory === cat ? theme.accent : '#555',
                fontFamily: "'Barlow Condensed'",
                fontWeight: 800,
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* App List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filteredApps.length === 0 && (
            <div style={{ padding: '24px 16px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <IconEmpty size={32} color="#555" />
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 18, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {installedApps.length === 0 ? 'No User Apps Found on Device' : 'No Apps Match Filter'}
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', maxWidth: 240, lineHeight: 1.4 }}>
                {installedApps.length === 0
                  ? 'Install apps from Play Store, or tap below to manually shield a package name.'
                  : 'Try searching for a different app name.'}
              </div>
            </div>
          )}

        {filteredApps.map((app) => {
          const isBlocked = blockedApps.includes(app.packageName)
          return (
            <div
              key={app.id}
              onClick={() => toggleApp(app.packageName)}
              className="interactive-btn glass-card-hover"
              style={{
                background: isBlocked ? `rgba(${theme.accentRgb},0.04)` : '#0A0A0A',
                border: `1px solid ${isBlocked ? `rgba(${theme.accentRgb},0.3)` : '#141414'}`,
                borderRadius: 16,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: '#111',
                    border: '1px solid #1A1A1A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {app.icon || getAppIcon(app.packageName, 22)}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed'",
                      fontWeight: 800,
                      fontSize: 18,
                      color: isBlocked ? '#F5F5F5' : '#888',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {app.name}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: '#7E7E87' }}>
                    {app.packageName}
                  </div>
                </div>
              </div>

              {/* Toggle switch */}
              <div
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  background: isBlocked ? theme.accent : '#1A1A1A',
                  position: 'relative',
                  transition: 'background 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: isBlocked ? 23 : 3,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: isBlocked ? '#080808' : '#444',
                    transition: 'left 0.2s ease',
                  }}
                />
              </div>
            </div>
          )
        })}
        </div>

        {/* Add Custom App Card */}
        <button
          onClick={() => setShowCustomModal(true)}
          style={{
            background: 'none',
            border: '1.5px dashed #222',
            borderRadius: 16,
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: 'pointer',
            marginTop: 4,
          }}
        >
          <IconPlus size={16} color="#C8FF00" />
          <span
            style={{
              fontFamily: "'Barlow Condensed'",
              fontWeight: 800,
              fontSize: 16,
              color: theme.accent,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            ADD CUSTOM APP PACKAGE
          </span>
        </button>
      </div>

      {/* Custom App Modal */}
      {showCustomModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            className="animate-scale-bounce"
            style={{
              width: '100%',
              maxWidth: 340,
              background: '#0E0E0E',
              border: '1.5px solid #222',
              borderRadius: 22,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 24, color: '#F5F5F5', textTransform: 'uppercase', marginBottom: 4 }}>
              ADD CUSTOM APP
            </div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#7E7E87', marginBottom: 16 }}>
              Enter the Android package name to shield (e.g. com.king.candycrushsaga)
            </div>

            <input
              type="text"
              placeholder="com.package.name"
              value={customPackage}
              onChange={(e) => setCustomPackage(e.target.value)}
              style={{
                width: '100%',
                height: 46,
                background: '#141414',
                border: '1.5px solid #262626',
                borderRadius: 12,
                padding: '0 14px',
                fontFamily: "'JetBrains Mono'",
                fontSize: 14,
                color: theme.accent,
                outline: 'none',
                marginBottom: 16,
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowCustomModal(false)}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 12,
                  background: '#1A1A1A',
                  border: 'none',
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 800,
                  fontSize: 16,
                  color: '#888',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                CANCEL
              </button>
              <button
                onClick={handleAddCustom}
                className="interactive-btn"
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 12,
                  background: theme.accent,
                  border: 'none',
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 800,
                  fontSize: 16,
                  color: '#080808',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <span>ADD APP</span>
                <IconShield size={16} color="#080808" />
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  )
}
