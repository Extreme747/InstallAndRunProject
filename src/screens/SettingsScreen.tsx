import { useEffect, useState } from 'react'
import type { Screen } from '../types'
import { BottomNav } from './HomeScreen'
import { useAppStore } from '../store/useAppStore'
import { IconEdit, IconDice, IconCrown, IconShield, IconClock, IconBell, IconPhone, getMascotComponent } from '../components/Icons'
import { useTheme } from '../utils/theme'

interface Props {
  onNavigate: (screen: Screen) => void
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  const theme = useTheme()
  return (
    <button
      onClick={onChange}
      style={{
        width: 46,
        height: 26,
        borderRadius: 13,
        background: checked ? theme.accent : '#1A1A1A',
        border: 'none',
        position: 'relative',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background 0.2s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 23 : 3,
          width: 20,
          height: 20,
          borderRadius: 10,
          background: checked ? '#080808' : '#444',
          transition: 'left 0.2s ease',
        }}
      />
    </button>
  )
}

function PermissionRow({
  label,
  description,
  enabled,
  onNavigate,
  screen,
}: {
  label: string
  description: string
  enabled: boolean
  onNavigate: (s: Screen) => void
  screen: Screen
}) {
  const theme = useTheme()
  return (
    <button
      onClick={() => onNavigate(screen)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'DM Sans'",
            fontSize: 14,
            fontWeight: 600,
            color: '#D0D0D0',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "'DM Sans'",
            fontSize: 12,
            color: '#444',
            marginTop: 2,
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: enabled ? `rgba(${theme.accentRgb},0.08)` : 'rgba(255,59,48,0.08)',
          border: `1px solid ${enabled ? `rgba(${theme.accentRgb},0.2)` : 'rgba(255,59,48,0.2)'}`,
          borderRadius: 8,
          padding: '3px 8px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: enabled ? theme.accent : '#FF3B30',
          }}
        />
        <span
          style={{
            fontFamily: "'Barlow Condensed'",
            fontWeight: 700,
            fontSize: 12,
            color: enabled ? theme.accent : '#FF3B30',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {enabled ? 'ON' : 'OFF'}
        </span>
      </div>
    </button>
  )
}

export default function SettingsScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const store = useAppStore()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editName, setEditName] = useState(store.userName || 'Anonymous')
  const [editAvatar, setEditAvatar] = useState(store.activeSkin || store.avatarEmoji || 'moai')
  const [copiedId, setCopiedId] = useState(false)
  const [isRolling, setIsRolling] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const AVATARS = ['moai', 'cactus', 'stone', 'robot', 'ghost', 'skull', 'gold', 'flame', 'cyber']
  const RANDOM_NAMES = ['FocusMaster', 'LockInGod', 'MoaiWarrior', 'SigmaGrind', 'DopamineDemon', 'ZenMaster', 'ApexStoic', 'FocusBeast']

  useEffect(() => {
    store.checkPermissions()
    const interval = setInterval(() => {
      store.checkPermissions()
    }, 1000)

    const handleFocus = () => store.checkPermissions()
    window.addEventListener('focus', handleFocus)
    window.addEventListener('permissionsUpdated', handleFocus)
    document.addEventListener('visibilitychange', handleFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('permissionsUpdated', handleFocus)
      document.removeEventListener('visibilitychange', handleFocus)
    }
  }, [])

  const handleCopyId = () => {
    if (navigator.clipboard && store.userId) {
      navigator.clipboard.writeText(store.userId).catch(() => {})
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    }
  }

  const handleSaveProfile = () => {
    const finalName = editName.trim() || 'Anonymous'
    store.setUserName(finalName)
    store.setAvatarEmoji(editAvatar)
    if (store.equipSkin) {
      store.equipSkin(editAvatar)
    }
    setIsEditingProfile(false)
  }

  const sectionLabel = (text: string) => (
    <div
      style={{
        fontFamily: "'Barlow Condensed'",
        fontWeight: 700,
        fontSize: 11,
        color: '#7E7E87',
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        padding: '16px 0 4px',
      }}
    >
      {text}
    </div>
  )

  const divider = (
    <div style={{ height: 1, background: '#0E0E0E' }} />
  )

  return (
    <div
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: theme.bg,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: 'max(14px, env(safe-area-inset-top, 14px)) clamp(16px, 4vw, 24px) 6px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
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
          SETTINGS
        </div>
      </div>

      {/* Main scrollable body */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingInline: 'clamp(16px, 4vw, 24px)',
          paddingTop: 6,
          paddingBottom: 'clamp(70px, 10vh, 100px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Profile card */}
        <div
          style={{
            background: '#0A0A0A',
            border: '1px solid #161616',
            borderRadius: 16,
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 8,
          }}
        >
          {/* Avatar */}
          <div
            onClick={() => { setEditName(store.userName); setEditAvatar(store.activeSkin || store.avatarEmoji || 'moai'); setIsEditingProfile(true); }}
            className="interactive-btn"
            style={{
              width: 54,
              height: 54,
              borderRadius: 18,
              background: `rgba(${theme.accentRgb},0.08)`,
              border: `1.5px solid rgba(${theme.accentRgb},0.3)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            {getMascotComponent(store.activeSkin || store.avatarEmoji || 'moai', 44)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 800,
                  fontSize: 20,
                  color: '#F5F5F5',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {store.userName || 'Anonymous'}
              </div>
              <button
                onClick={() => { setEditName(store.userName); setEditAvatar(store.activeSkin || store.avatarEmoji || 'moai'); setIsEditingProfile(true); }}
                className="interactive-btn"
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.accent,
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <IconEdit size={12} color={theme.accent} /> EDIT
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span
                onClick={handleCopyId}
                style={{
                  fontFamily: "'JetBrains Mono'",
                  fontSize: 10,
                  color: copiedId ? theme.accent : '#555',
                  cursor: 'pointer',
                }}
              >
                {copiedId ? '✓ COPIED!' : `ID: #${store.userId ? store.userId.slice(0, 8) : 'anon'}`}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 6,
              }}
            >
              <div style={{ flex: 1, height: 4, background: '#1A1A1A', borderRadius: 2 }}>
                <div
                  style={{
                    width: `${Math.min(100, Math.max(5, Math.round(((store.totalXP - (store.level <= 1 ? 0 : Math.round(100 * Math.pow(store.level - 1, 1.5)))) / Math.max(1, Math.round(100 * Math.pow(store.level, 1.5)) - (store.level <= 1 ? 0 : Math.round(100 * Math.pow(store.level - 1, 1.5))))) * 100)))}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, #BF7FFF 0%, ${theme.accent} 100%)`,
                    borderRadius: 2,
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 700,
                  fontSize: 13,
                  color: '#BF7FFF',
                  letterSpacing: '0.04em',
                  flexShrink: 0,
                }}
              >
                {`LVL ${store.level} · ${store.totalXP.toLocaleString()} XP`}
              </span>
            </div>
          </div>
        </div>

      {/* Edit Profile Modal Dialog */}
      {isEditingProfile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
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
              background: '#0D0D0D',
              border: '1.5px solid #222',
              borderRadius: 24,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
            }}
          >
            {/* Live selected Avatar */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                background: `rgba(${theme.accentRgb},0.1)`,
                border: `2px solid ${theme.accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              {getMascotComponent(editAvatar, 52)}
            </div>

            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 24, color: '#F5F5F5', textTransform: 'uppercase' }}>
              EDIT WARRIOR PROFILE
            </div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#7E7E87', marginBottom: 16 }}>
              No login required · 100% anonymous
            </div>

            {/* Avatar Row */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', maxWidth: '100%', paddingBottom: 10, marginBottom: 12 }}>
              {AVATARS.map((skin) => {
                const FREE_SKINS = ['moai', 'cactus', 'stone']
                const isProSkin = !FREE_SKINS.includes(skin)
                const isLocked = isProSkin && !store.isSubscribed
                return (
                <button
                  key={skin}
                  onClick={() => {
                    if (isLocked) {
                      setIsEditingProfile(false)
                      onNavigate('premium-upgrade')
                    } else {
                      setEditAvatar(skin)
                    }
                  }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: editAvatar === skin ? `rgba(${theme.accentRgb},0.15)` : '#141414',
                    border: `1.5px solid ${editAvatar === skin ? theme.accent : '#222'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    opacity: isLocked ? 0.4 : 1,
                    position: 'relative' as const,
                  }}
                >
                  {getMascotComponent(skin, 36)}
                  {isLocked && <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: 10 }}>🔒</span>}
                </button>
                )
              })}
            </div>

            {/* Name Input & Dice */}
            <div style={{ width: '100%', display: 'flex', gap: 8, marginBottom: 20 }}>
              <input
                type="text"
                maxLength={20}
                placeholder="e.g. FocusMaster"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{
                  flex: 1,
                  height: 46,
                  background: '#141414',
                  border: '1.5px solid #262626',
                  borderRadius: 12,
                  padding: '0 14px',
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 800,
                  fontSize: 18,
                  color: theme.accent,
                  outline: 'none',
                }}
              />
              <button
                onClick={() => {
                  setIsRolling(true)
                  const random = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)]
                  setEditName(random)
                  setTimeout(() => setIsRolling(false), 450)
                }}
                className={`interactive-btn ${isRolling ? 'animate-dice-roll' : ''}`}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: '#1A1A1A',
                  border: '1px solid #333',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconDice size={18} color={theme.accent} />
              </button>
            </div>

            {/* Actions */}
            <div style={{ width: '100%', display: 'flex', gap: 10 }}>
              <button
                onClick={() => setIsEditingProfile(false)}
                style={{
                  flex: 1,
                  height: 46,
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
                onClick={handleSaveProfile}
                className="interactive-btn"
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 12,
                  background: theme.accent,
                  border: 'none',
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 800,
                  fontSize: 16,
                  color: '#080808',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                SAVE PROFILE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GO PRO / MANAGE banner */}
      <div>
        <button
          onClick={() => onNavigate(store.isSubscribed ? 'subscription-management' : 'premium-upgrade')}
          style={{ width: '100%', background: store.isSubscribed ? `rgba(${theme.accentRgb},0.06)` : 'rgba(191,127,255,0.08)', border: `1px solid ${store.isSubscribed ? `rgba(${theme.accentRgb},0.25)` : 'rgba(191,127,255,0.25)'}`, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconCrown size={22} color="#FFB800" glow />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 18, color: store.isSubscribed ? theme.accent : '#BF7FFF', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>{store.isSubscribed ? 'PRO ACTIVE' : 'GO PRO'}</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginTop: 2 }}>{store.isSubscribed ? '2x XP · Analytics · Unlimited Freezes' : 'Unlock all themes, skins, analytics & more'}</div>
            </div>
          </div>
          <div style={{ background: store.isSubscribed ? theme.accent : `linear-gradient(135deg, #BF7FFF, ${theme.accent})`, borderRadius: 10, padding: '5px 12px' }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, color: '#080808', textTransform: 'uppercase' }}>{store.isSubscribed ? 'MANAGE ›' : '₹699/yr'}</span>
          </div>
        </button>
      </div>

      {/* Roasting Language Quick Toggle Card */}
      <div>
        <div
          style={{
            background: '#0A0A0A',
            border: '1px solid #161616',
            borderRadius: 16,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: '#F5F5F5', textTransform: 'uppercase' }}>
              ROAST & NOTIFICATION LANGUAGE
            </div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginTop: 1 }}>
              {store.settings?.roastLanguage === 'english' ? 'English (International)' : 'Hinglish (Indian Savage)'} · {store.settings?.roastFrequency?.toUpperCase() || 'SAVAGE'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => store.setRoastLanguage('hinglish')}
              className="interactive-btn"
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                background: store.settings?.roastLanguage !== 'english' ? `rgba(${theme.accentRgb},0.15)` : '#141414',
                border: `1px solid ${store.settings?.roastLanguage !== 'english' ? theme.accent : '#222'}`,
                color: store.settings?.roastLanguage !== 'english' ? theme.accent : '#888',
                fontFamily: "'Barlow Condensed'",
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              🇮🇳 HINGLISH
            </button>
            <button
              onClick={() => store.setRoastLanguage('english')}
              className="interactive-btn"
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                background: store.settings?.roastLanguage === 'english' ? 'rgba(96,165,250,0.15)' : '#141414',
                border: `1px solid ${store.settings?.roastLanguage === 'english' ? '#60A5FA' : '#222'}`,
                color: store.settings?.roastLanguage === 'english' ? '#60A5FA' : '#888',
                fontFamily: "'Barlow Condensed'",
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              🌐 ENGLISH
            </button>
          </div>
        </div>
      </div>

      {/* App section */}
      <div>
        {sectionLabel('App')}
        <div
          style={{
            background: '#0A0A0A',
            border: '1px solid #161616',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          {[
            { label: 'Sound Effects', value: store.settings.soundEffects, toggle: () => store.updateSettings('soundEffects', !store.settings.soundEffects) },
            { label: 'Achievement Pop-ups', value: store.settings.achievementPopups, toggle: () => store.updateSettings('achievementPopups', !store.settings.achievementPopups) },
            { label: 'Push Notifications', value: store.settings.pushNotifications, toggle: () => store.updateSettings('pushNotifications', !store.settings.pushNotifications) },
            { label: 'Hardcore Mode', value: store.settings.hardcoreMode, toggle: () => store.updateSettings('hardcoreMode', !store.settings.hardcoreMode), note: 'No pausing. No mercy.' },
          ].map((item, i, arr) => (
            <div key={item.label}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 16px',
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'DM Sans'",
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#D0D0D0',
                    }}
                  >
                    {item.label}
                  </div>
                  {item.note && (
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#444', marginTop: 1 }}>
                      {item.note}
                    </div>
                  )}
                </div>
                <Toggle checked={item.value} onChange={item.toggle} />
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: '#0E0E0E', marginInline: 16 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Quick links section */}
      <div>
        {sectionLabel('Shields & More')}
        <div style={{ background: '#0A0A0A', border: '1px solid #161616', borderRadius: 16, overflow: 'hidden' }}>
          {([
            { icon: <IconShield size={16} color={theme.accent} />, label: 'Shielded Apps (Customize)', screen: 'blocked-apps' as Screen, badge: `${store.blockedApps?.length || 0} apps` },
            { icon: <span style={{ fontSize: 16 }}>⏳</span>, label: 'Daily App Limits (Quotas)', screen: 'app-limits' as Screen, badge: `${store.appLimits?.length || 0} apps` },
            { icon: <IconClock size={16} color={theme.accent} />, label: 'Focus Routines (Auto-Lock)', screen: 'schedules' as Screen, badge: `${store.routines?.filter(r => r.enabled).length || 0} active` },
            { icon: <IconBell size={16} color="#FFB800" />, label: 'Notification Settings', screen: 'notifications-settings' as Screen },
            { icon: <IconPhone size={16} color="#60A5FA" />, label: 'Widgets Preview', screen: 'widgets-preview' as Screen },
          ]).map((item, i, arr) => (
            <div key={item.label}>
              <button
                onClick={() => onNavigate(item.screen)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {item.icon}
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 600, color: '#D0D0D0' }}>{item.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {item.badge && (
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 12, color: theme.accent, background: `rgba(${theme.accentRgb},0.1)`, padding: '2px 8px', borderRadius: 6 }}>
                      {item.badge}
                    </span>
                  )}
                  <span style={{ color: '#7E7E87', fontSize: 16 }}>›</span>
                </div>
              </button>
              {i < arr.length - 1 && <div style={{ height: 1, background: '#0E0E0E' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Permissions section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {sectionLabel('Android Shields & Permissions')}
          <button
            onClick={() => onNavigate('permissions-hub')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Barlow Condensed'",
              fontWeight: 700,
              fontSize: 13,
              color: theme.accent,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '16px 0 4px',
            }}
          >
            SETUP HUB →
          </button>
        </div>
        <div
          style={{
            background: '#0A0A0A',
            border: '1px solid #161616',
            borderRadius: 16,
            padding: '0 16px',
          }}
        >
          <PermissionRow
            label="Usage Access"
            description="Required to detect & block apps"
            enabled={Boolean(store.permissions.usage)}
            onNavigate={onNavigate}
            screen="permission-usage"
          />
          {divider}
          <PermissionRow
            label="Draw Over Apps"
            description="Required to show block overlay"
            enabled={Boolean(store.permissions.overlay)}
            onNavigate={onNavigate}
            screen="permission-overlay"
          />
          {divider}
          <PermissionRow
            label="Accessibility Service"
            description="Strict mode: instant app termination"
            enabled={Boolean(store.permissions.accessibility)}
            onNavigate={onNavigate}
            screen="permission-accessibility"
          />
        </div>
      </div>

      {/* About section */}
      <div>
        {sectionLabel('About')}
        <div
          style={{
            background: '#0A0A0A',
            border: '1px solid #161616',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          {[
            {
              label: 'Privacy Policy',
              value: 'Read Policy ›',
              action: () => {
                onNavigate('privacy-policy')
              }
            },
            { label: 'Reset Tutorial', value: 'Tap to reset', action: () => { store.setHasSeenOnboarding(false); onNavigate('onboarding-1'); } },
            { label: 'Version', value: '1.0.0', action: null },
          ].map((item, i, arr) => (
            <div key={item.label}>
              <button
                onClick={item.action || undefined}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: item.action ? 'pointer' : 'default',
                  textAlign: 'left'
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans'",
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#888',
                  }}
                >
                  {item.label}
                </span>
                {item.value && (
                  <span
                    style={{
                      fontFamily: "'DM Sans'",
                      fontSize: 12,
                      color: item.action ? theme.accent : '#7E7E87',
                    }}
                  >
                    {item.value}
                  </span>
                )}
              </button>
              {i < arr.length - 1 && <div style={{ height: 1, background: '#0E0E0E', marginInline: 16 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div style={{ marginTop: 4, marginBottom: 12 }}>
        <button
          onClick={() => setShowResetConfirm(true)}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 14,
            background: 'rgba(255,59,48,0.06)',
            border: '1px solid rgba(255,59,48,0.15)',
            fontFamily: "'Barlow Condensed'",
            fontWeight: 700,
            fontSize: 16,
            color: '#FF3B30',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            cursor: 'pointer',
          }}
        >
          Reset Everything
        </button>
      </div>

      {showResetConfirm && (
        <div
          onClick={() => setShowResetConfirm(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-scale-bounce"
            style={{
              background: '#0D0D0D',
              border: '1px solid rgba(255,59,48,0.3)',
              borderRadius: 20,
              padding: '24px 20px',
              maxWidth: 360,
              width: '100%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 25px rgba(255,59,48,0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,59,48,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                ⚠️
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 19, color: '#F5F5F5', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  RESET ALL DATA?
                </div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87' }}>
                  Permanent Action · Cannot be undone
                </div>
              </div>
            </div>

            <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: '#A0A0A0', lineHeight: 1.45, marginBottom: 20 }}>
              This will permanently wipe all your focus streaks, earned XP, aura score, and session logs. Are you sure you want to start fresh?
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowResetConfirm(false)}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 12,
                  background: '#1A1A1A',
                  border: '1px solid #282828',
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#888',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false)
                  store.resetData()
                  onNavigate('home')
                }}
                style={{
                  flex: 1.2,
                  height: 44,
                  borderRadius: 12,
                  background: '#FF3B30',
                  border: 'none',
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 900,
                  fontSize: 15,
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                }}
              >
                YES, RESET
              </button>
            </div>
          </div>
        </div>
      )}

      </div>

      <BottomNav active="settings" onNavigate={onNavigate} />
    </div>
  )
}
