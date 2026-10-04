import { useState, useEffect } from 'react'
import { useTheme } from '../utils/theme'
import type { Screen } from '../types'
import { BottomNav } from './HomeScreen'
import { useAppStore } from '../store/useAppStore'
import {
  IconFlame,
  IconBolt,
  IconTarget,
  IconTrophy,
  IconMedal,
  IconSnowflake,
  IconGift,
  IconCopy,
  IconShare,
  IconUsers,
  IconShield,
  IconSword,
  IconCrown,
  IconMessage,
  IconLink,
  IconDiamond,
  IconCheck,
  IconTimer,
  getMascotComponent
} from '../components/Icons'
import { shareToWhatsApp, shareContent } from '../utils/nativeShare'

interface Props { onNavigate: (screen: Screen) => void }

function SH({ title, subtitle, onBack }: { title: string; subtitle?: string; onBack?: () => void }) {
  const theme = useTheme()
  return (
    <div style={{ padding: 'max(14px, env(safe-area-inset-top, 14px)) clamp(16px, 4vw, 24px) 0', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
      {onBack && (
        <button
          onClick={onBack}
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
      )}
      <div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 'clamp(26px, 3.8vh, 32px)', color: '#F5F5F5', textTransform: 'uppercase', letterSpacing: '-0.3px', lineHeight: 1 }}>{title}</div>
        {subtitle && <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  )
}

export function ScrollntProBadge() {
  const theme = useTheme()
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        background: `linear-gradient(135deg, rgba(191,127,255,0.22), rgba(${theme.accentRgb},0.18))`,
        border: '1px solid rgba(191,127,255,0.5)',
        boxShadow: '0 0 10px rgba(191,127,255,0.25)',
        borderRadius: 6,
        padding: '1px 5px',
        verticalAlign: 'middle',
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 10, lineHeight: 1 }}>👑</span>
      <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 10.5, letterSpacing: '0.04em', lineHeight: 1 }}>
        <span style={{ color: '#BF7FFF' }}>SCROLLN'T </span>
        <span style={{ color: theme.accent }}>PRO</span>
      </span>
    </span>
  )
}

const STATUS_COLORS: Record<string, string> = { online: '#C8FF00', focusing: '#FFB800', offline: '#7E7E87' }
const STATUS_LABELS: Record<string, string> = { online: 'Online', focusing: 'Focusing', offline: 'Offline' }

export function SquadDashboardScreen({ onNavigate }: Props) {
  const store = useAppStore()
  const theme = useTheme()
  const [copied, setCopied] = useState(false)
  const [squadName, setSquadName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [tab, setTab] = useState<'create' | 'join'>('create')
  const [rewardToast, setRewardToast] = useState<string | null>(null)

  // Live auto-polling to keep squad members, presence, and XP in sync
  useEffect(() => {
    if (store.squadCode && (typeof navigator === 'undefined' || navigator.onLine)) {
      store.fetchSquadData().catch(() => {})
    }
    const interval = setInterval(() => {
      if (store.squadCode && (typeof navigator === 'undefined' || navigator.onLine)) {
        store.fetchSquadData().catch(() => {})
      }
    }, 6000)
    return () => clearInterval(interval)
  }, [store.squadCode])

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(store.squadCode || '').catch(() => {})
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleJoin = async (codeToJoin: string) => {
    if (!codeToJoin.trim()) return
    setLoading(true)
    try {
      const success = await store.joinSquad(codeToJoin)
      if (success) {
        setShowJoinModal(false)
        setRewardToast('🎉 SQUAD JOINED! +200 XP BONUS CLAIMED')
        setTimeout(() => setRewardToast(null), 3000)
      } else {
        setRewardToast('⚠️ INVALID SQUAD CODE. PLEASE CHECK AND TRY AGAIN.')
        setTimeout(() => setRewardToast(null), 3500)
      }
    } catch (e) {
      setRewardToast('⚠️ CONNECTION ERROR. TRY AGAIN.')
      setTimeout(() => setRewardToast(null), 3500)
    } finally {
      setLoading(false)
    }
  }

  if (!store.squadCode) {
    return (
      <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#080808', overflow: 'hidden' }}>
        <SH title="SQUAD" subtitle="Lock in together with your crew" onBack={() => onNavigate('home')} />
        
        {rewardToast && (
          <div className="animate-scale-bounce" style={{ margin: '8px clamp(16px, 4vw, 24px) 0', background: `rgba(${theme.accentRgb},0.15)`, border: `1px solid ${theme.accent}`, borderRadius: 12, padding: '10px 14px', color: theme.accent, fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, textAlign: 'center', letterSpacing: '0.04em' }}>
            {rewardToast}
          </div>
        )}

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '12px clamp(16px, 4vw, 24px)', justifyContent: 'center' }}>
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ marginBottom: 8 }}><IconUsers size={48} color="#60A5FA" glow /></div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 'clamp(24px, 3.5vh, 28px)', color: '#F5F5F5', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
              JOIN THE SQUAD GRIND
            </div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#7E7E87', marginTop: 3, maxWidth: 280, marginInline: 'auto', lineHeight: 1.4 }}>
              Build streak multipliers together. Anyone who scrolls breaks the squad's streak.
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', background: '#0D0D0D', border: '1px solid #1A1A1A', borderRadius: 12, padding: 3, gap: 4, marginBottom: 14 }}>
            <button
              onClick={() => setTab('create')}
              style={{
                flex: 1,
                height: 38,
                borderRadius: 10,
                background: tab === 'create' ? theme.accent : 'transparent',
                border: 'none',
                color: tab === 'create' ? '#080808' : '#7E7E87',
                fontFamily: "'Barlow Condensed'",
                fontWeight: 800,
                fontSize: 14,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              ➕ CREATE SQUAD
            </button>
            <button
              onClick={() => setTab('join')}
              style={{
                flex: 1,
                height: 38,
                borderRadius: 10,
                background: tab === 'join' ? '#60A5FA' : 'transparent',
                border: 'none',
                color: tab === 'join' ? '#080808' : '#7E7E87',
                fontFamily: "'Barlow Condensed'",
                fontWeight: 800,
                fontSize: 14,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              🔑 JOIN WITH CODE
            </button>
          </div>

          {/* Tab Content */}
          {tab === 'create' ? (
            <div style={{ background: '#0D0D0D', border: '1px solid #1A1A1A', borderRadius: 18, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: '#D0D0D0', textTransform: 'uppercase' }}>
                Create New Squad
              </div>
              <input
                type="text"
                placeholder="Squad Name (e.g. Sigma Grinders)"
                value={squadName}
                onChange={(e) => setSquadName(e.target.value)}
                style={{
                  width: '100%',
                  height: 44,
                  paddingInline: 12,
                  borderRadius: 10,
                  background: '#141414',
                  border: '1px solid #242424',
                  color: '#F5F5F5',
                  fontFamily: "'DM Sans'",
                  fontSize: 14,
                  outline: 'none',
                }}
              />
              <button
                onClick={async () => {
                  if (!squadName.trim()) return
                  setLoading(true)
                  try {
                    const code = await store.createSquad(squadName)
                    if (!code) {
                      setRewardToast('⚠️ COULD NOT CREATE SQUAD. PLEASE RETRY.')
                      setTimeout(() => setRewardToast(null), 3500)
                    }
                  } catch (e) {
                    setRewardToast('⚠️ NETWORK ERROR. PLEASE RETRY.')
                    setTimeout(() => setRewardToast(null), 3500)
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading || !squadName.trim()}
                style={{
                  width: '100%',
                  height: 46,
                  borderRadius: 12,
                  background: squadName.trim() ? theme.accent : '#222',
                  border: 'none',
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 900,
                  fontSize: 17,
                  color: squadName.trim() ? '#080808' : '#555',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  cursor: squadName.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                {loading ? 'CREATING...' : '🔥 CREATE SQUAD'}
              </button>
            </div>
          ) : (
            <div style={{ background: '#0D0D0D', border: '1px solid #1A1A1A', borderRadius: 18, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: '#60A5FA', textTransform: 'uppercase' }}>
                  Enter Friend's Squad Code
                </div>
                <div style={{ background: 'rgba(191,127,255,0.15)', border: '1px solid rgba(191,127,255,0.3)', borderRadius: 6, padding: '2px 7px', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 10.5, color: '#BF7FFF' }}>
                  +200 XP BONUS 🎁
                </div>
              </div>
              <input
                type="text"
                placeholder="e.g. 30K0LX"
                maxLength={8}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  height: 46,
                  paddingInline: 12,
                  borderRadius: 10,
                  background: '#141414',
                  border: '1.5px solid #242424',
                  color: theme.accent,
                  fontFamily: "'JetBrains Mono'",
                  fontSize: 20,
                  fontWeight: 700,
                  textAlign: 'center',
                  letterSpacing: '0.18em',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => handleJoin(joinCode)}
                disabled={loading || !joinCode.trim()}
                style={{
                  width: '100%',
                  height: 46,
                  borderRadius: 12,
                  background: joinCode.trim() ? '#60A5FA' : '#222',
                  border: 'none',
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 900,
                  fontSize: 17,
                  color: joinCode.trim() ? '#080808' : '#555',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  cursor: joinCode.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                {loading ? 'JOINING...' : '⚡ JOIN & CLAIM +200 XP'}
              </button>
            </div>
          )}
        </div>
        <BottomNav active="home" onNavigate={onNavigate} />
      </div>
    )
  }

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#080808', overflow: 'hidden' }}>
      {/* Pinned Top Bar */}
      <div style={{ padding: 'max(14px, env(safe-area-inset-top, 14px)) clamp(16px, 4vw, 24px) 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => onNavigate('home')}
            className="interactive-btn"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#0E0E0E',
              border: '1px solid #1E1E1E',
              color: '#C8FF00',
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
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 'clamp(24px, 3.5vh, 30px)', color: '#F5F5F5', textTransform: 'uppercase', letterSpacing: '-0.3px', lineHeight: 1 }}>
              SQUAD
            </div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginTop: 2 }}>
              {store.squadName || `${store.squadCode} Squad`}
            </div>
          </div>
        </div>

        {/* Join/Switch or Leave buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setShowJoinModal(true)}
            className="interactive-btn"
            style={{
              background: 'rgba(96,165,250,0.1)',
              border: '1px solid rgba(96,165,250,0.25)',
              borderRadius: 8,
              padding: '5px 8px',
              fontFamily: "'Barlow Condensed'",
              fontWeight: 800,
              fontSize: 11,
              color: '#60A5FA',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
            }}
          >
            🔑 JOIN CODE
          </button>
          <button
            onClick={() => setShowLeaveModal(true)}
            className="interactive-btn"
            style={{
              background: 'rgba(255,59,48,0.1)',
              border: '1px solid rgba(255,59,48,0.2)',
              borderRadius: 8,
              padding: '5px 8px',
              fontFamily: "'Barlow Condensed'",
              fontWeight: 800,
              fontSize: 11,
              color: '#FF3B30',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
            }}
          >
            LEAVE
          </button>
        </div>
      </div>

      {rewardToast && (
        <div className="animate-scale-bounce" style={{ margin: '8px clamp(16px, 4vw, 24px) 0', background: 'rgba(200,255,0,0.15)', border: '1px solid #C8FF00', borderRadius: 12, padding: '8px 12px', color: '#C8FF00', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, textAlign: 'center', letterSpacing: '0.04em', flexShrink: 0 }}>
          {rewardToast}
        </div>
      )}

      {/* Main Scrollable Center: Banner + Code + Members */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingBlock: 6 }}>
        {/* Squad streak banner */}
        <div style={{ background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.2)', borderRadius: 16, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 'clamp(28px, 4vh, 34px)', color: '#FFB800', letterSpacing: '-0.5px', lineHeight: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconFlame size={24} color="#FFB800" /> {store.currentStreak}
            </div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginTop: 2 }}>Squad streak days</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 18, color: '#BF7FFF' }}>
              {((store.squadMembers && store.squadMembers.length > 0)
                ? store.squadMembers.reduce((sum: number, m: any) => {
                    const memberXP = (m.id === store.userId || (!store.userId && m.isMe)) ? store.totalXP : (m.totalXP || 0);
                    return sum + memberXP;
                  }, 0)
                : store.totalXP).toLocaleString()} XP
            </div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87' }}>squad total</div>
          </div>
        </div>

        {/* Squad code & Share */}
        <div style={{ background: '#0A0A0A', border: '1px solid #161616', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 9.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 1 }}>Squad Code</div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 18, color: theme.accent, letterSpacing: '0.12em' }}>{store.squadCode || '------'}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={handleCopy}
              className="interactive-btn"
              style={{ height: 30, paddingInline: 10, borderRadius: 8, background: copied ? `rgba(${theme.accentRgb},0.2)` : '#141414', border: `1px solid ${copied ? theme.accent : '#242424'}`, fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 12, color: copied ? theme.accent : '#888', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', transition: 'all 0.15s ease', display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              {copied ? '✓ COPIED!' : <><IconCopy size={11} color="#888" /> COPY</>}
            </button>
            <button
              onClick={() => onNavigate('invite-friends')}
              className="interactive-btn"
              style={{ height: 30, paddingInline: 10, borderRadius: 8, background: '#60A5FA', border: 'none', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 12, color: '#080808', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <IconShare size={11} color="#080808" /> INVITE
            </button>
          </div>
        </div>

        {/* Members List */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
            MEMBERS · {Math.max(1, store.squadMembers?.length ?? 0)}/6
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {((store.squadMembers?.length ?? 0) > 0 ? store.squadMembers : [{ id: store.userId, displayName: store.userName, userName: store.userName, totalXP: store.totalXP, currentStreak: store.currentStreak, isOnline: true }]).map((m: any, i: number) => {
              const isMe = m.id === store.userId || (!store.userId && i === 0);
              const displayName = isMe ? (store.userName || m.displayName || m.userName || 'Anonymous') : (m.displayName || m.userName || m.id?.slice(0,5) || 'Squad Member');
              const xp = isMe ? store.totalXP : (m.totalXP || 0);
              const streak = isMe ? store.currentStreak : (m.currentStreak || 0);
              
              const now = Date.now();
              const lastSeen = m.lastSeenAt ? new Date(m.lastSeenAt).getTime() : 0;
              const isOnline = isMe ? true : (m.isOnline !== undefined ? m.isOnline : (now - lastSeen < 180000));
              const isFocusing = isMe ? (store.focusMode === 'squad') : (m.isFocusing || m.status === 'focusing');
              const status = isFocusing ? 'focusing' : (isOnline ? 'online' : 'offline');
              const isPro = isMe ? store.isSubscribed : (m.isSubscribed || m.premiumUnlocked);

              return (
              <div key={i} style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: isMe ? `rgba(${theme.accentRgb},0.1)` : '#111', border: `1.5px solid ${isMe ? `rgba(${theme.accentRgb},0.3)` : '#1A1A1A'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {getMascotComponent(isMe ? (store.activeSkin || 'moai') : (m.skin || 'moai'), 26)}
                  </div>
                  <div style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: STATUS_COLORS[status] || '#7E7E87', border: '2px solid #080808' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                      <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, color: '#D0D0D0', textTransform: 'uppercase', letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {displayName}{isMe && ' (You)'}
                      </span>
                      {isPro && <ScrollntProBadge />}
                    </div>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 13, color: '#BF7FFF', flexShrink: 0 }}>{xp.toLocaleString()} XP</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 2, alignItems: 'center' }}>
                    <span style={{ fontFamily: "'DM Sans'", fontSize: 10, color: STATUS_COLORS[status] || '#7E7E87', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      {status === 'focusing' && <IconTimer size={10} color="#FFB800" />}
                      {STATUS_LABELS[status] || 'Offline'}
                    </span>
                    <span style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                      <IconFlame size={10} color="#FFB800" /> {streak}d streak
                    </span>
                  </div>
                </div>
              </div>
              )
            })}
            {/* Add member slot */}
            <button onClick={() => onNavigate('invite-friends')} className="interactive-btn" style={{ background: 'none', border: '1px dashed #1A1A1A', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', width: '100%' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#0A0A0A', border: '1px dashed #1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#7E7E87', flexShrink: 0 }}>+</div>
              <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.04em' }}>INVITE A FRIEND (+200 XP)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Production Quick nav row */}
      <div style={{ padding: '4px clamp(16px, 4vw, 24px) 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, flexShrink: 0 }}>
        {[
          { id: 'squad-leaderboard' as Screen, icon: <IconTrophy size={16} color="#FFB800" glow />, label: 'Board' },
          { id: 'squad-goals' as Screen, icon: <IconTarget size={16} color="#FFB800" glow />, label: 'Goals' },
          { id: 'streak-freeze' as Screen, icon: <IconSnowflake size={16} color="#60A5FA" glow />, label: 'Freeze' },
          { id: 'invite-friends' as Screen, icon: <IconUsers size={16} color="#C8FF00" glow />, label: 'Invite' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="interactive-btn"
            style={{ background: '#0A0A0A', border: '1px solid #161616', borderRadius: 10, padding: '6px 4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
          >
            {item.icon}
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 11, color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Start session CTA */}
      <div style={{ padding: '6px clamp(16px, 4vw, 24px) 4px', flexShrink: 0 }}>
        <button onClick={() => { store.setFocusMode('squad'); onNavigate('focus') }} className="interactive-btn" style={{ width: '100%', height: 'clamp(42px, 5.5vh, 48px)', borderRadius: 14, background: theme.accent, border: 'none', fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 18, color: '#080808', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          START SQUAD SESSION <IconUsers size={18} color="#080808" />
        </button>
      </div>

      {/* Join Squad Modal */}
      {showJoinModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="animate-scale-bounce" style={{ width: '100%', maxWidth: 340, background: '#0D0D0D', border: '1.5px solid rgba(96,165,250,0.3)', borderRadius: 24, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ marginBottom: 8 }}><IconUsers size={48} color="#60A5FA" glow /></div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 26, color: '#F5F5F5', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
              JOIN SQUAD WITH CODE
            </div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: '#7E7E87', marginTop: 6, marginBottom: 16, lineHeight: 1.5 }}>
              Enter your friend's 6-digit squad code to switch squads and claim <span style={{ color: '#BF7FFF', fontWeight: 700 }}>+200 XP bonus</span>!
            </div>
            <input
              type="text"
              placeholder="e.g. 30K0LX"
              maxLength={8}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              style={{
                width: '100%',
                height: 52,
                paddingInline: 14,
                borderRadius: 12,
                background: '#141414',
                border: '1.5px solid #242424',
                color: theme.accent,
                fontFamily: "'JetBrains Mono'",
                fontSize: 22,
                fontWeight: 700,
                textAlign: 'center',
                letterSpacing: '0.2em',
                outline: 'none',
                marginBottom: 16,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
              <button
                onClick={() => handleJoin(joinCode)}
                disabled={loading || !joinCode.trim()}
                style={{ width: '100%', height: 50, borderRadius: 14, background: joinCode.trim() ? '#60A5FA' : '#222', border: 'none', fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 18, color: joinCode.trim() ? '#080808' : '#555', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: joinCode.trim() ? 'pointer' : 'not-allowed' }}
              >
                {loading ? 'JOINING...' : '🚀 JOIN SQUAD'}
              </button>
              <button
                onClick={() => setShowJoinModal(false)}
                style={{ width: '100%', height: 44, borderRadius: 12, background: 'transparent', border: '1px solid #222', fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 15, color: '#7E7E87', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Squad Confirmation Modal */}
      {showLeaveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="animate-scale-bounce" style={{ width: '100%', maxWidth: 340, background: '#0D0D0D', border: '1.5px solid rgba(255,59,48,0.3)', borderRadius: 24, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>🚪</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 26, color: '#FF3B30', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
              LEAVE SQUAD?
            </div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: '#7E7E87', marginTop: 6, marginBottom: 20, lineHeight: 1.5 }}>
              You will disconnect from <span style={{ color: '#F5F5F5', fontWeight: 700 }}>{store.squadName || 'your squad'}</span>. You can rejoin anytime with a code.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
              <button
                onClick={() => {
                  store.leaveSquad()
                  setShowLeaveModal(false)
                }}
                style={{ width: '100%', height: 48, borderRadius: 14, background: 'rgba(255,59,48,0.15)', border: '1px solid rgba(255,59,48,0.3)', fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 17, color: '#FF3B30', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}
              >
                CONFIRM LEAVE
              </button>
              <button
                onClick={() => setShowLeaveModal(false)}
                style={{ width: '100%', height: 44, borderRadius: 12, background: 'transparent', border: '1px solid #222', fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 15, color: '#7E7E87', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                STAY IN SQUAD
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  )
}

export function SquadLeaderboardScreen({ onNavigate }: Props) {
  const store = useAppStore()
  const theme = useTheme()
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week')

  // Live polling for leaderboard updates
  useEffect(() => {
    if (store.squadCode && (typeof navigator === 'undefined' || navigator.onLine)) {
      store.fetchSquadData().catch(() => {})
    }
    const interval = setInterval(() => {
      if (store.squadCode && (typeof navigator === 'undefined' || navigator.onLine)) {
        store.fetchSquadData().catch(() => {})
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [store.squadCode])

  const rawMembers = (store.squadMembers?.length ?? 0) > 0 
    ? store.squadMembers 
    : [{ id: store.userId, displayName: store.userName, userName: store.userName, totalXP: store.totalXP, currentStreak: store.currentStreak, isSubscribed: store.isSubscribed }]

  const leaderboard = [...rawMembers]
    .sort((a, b) => ((b.id === store.userId ? store.totalXP : b.totalXP) || 0) - ((a.id === store.userId ? store.totalXP : a.totalXP) || 0))
    .map((m, i) => {
      const isMe = m.id === store.userId;
      const displayName = isMe ? (store.userName || 'Anonymous') : (m.displayName || m.userName || m.id?.slice(0,5) || 'Squad Member');
      const xp = isMe ? store.totalXP : (m.totalXP || 0);
      const isPro = isMe ? store.isSubscribed : (m.isSubscribed || m.premiumUnlocked);
      return {
        ...m,
        name: displayName,
        initials: displayName.charAt(0).toUpperCase(),
        xp,
        isPro,
        streak: isMe ? store.currentStreak : (m.currentStreak || 0),
        sessions: isMe ? store.completedSessions : (m.sessions || 0),
        rank: i + 1,
        badge: i === 0 ? <IconCrown size={22} color="#FFD700" /> : i === 1 ? <IconSword size={20} color="#C0C0C0" /> : i === 2 ? <IconShield size={20} color="#CD7F32" /> : null,
        color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#7E7E87',
      }
    })

  if (leaderboard.length === 0) {
    return (
      <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#080808', overflow: 'hidden' }}>
        <SH title="LEADERBOARD" subtitle="No squad active" onBack={() => onNavigate('squad-dashboard')} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7E7E87' }}>
          No squad members yet
        </div>
        <BottomNav active="home" onNavigate={onNavigate} />
      </div>
    )
  }

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#080808', overflow: 'hidden' }}>
      <SH title="LEADERBOARD" subtitle={`${store.squadName || 'Squad'} · Live`} onBack={() => onNavigate('squad-dashboard')} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', gap: 12, paddingInline: 'clamp(16px, 4vw, 24px)', paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {/* Period tabs */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {(['week', 'month', 'all'] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} style={{ height: 32, paddingInline: 14, borderRadius: 8, border: `1px solid ${period === p ? theme.accent : '#1A1A1A'}`, background: period === p ? `rgba(${theme.accentRgb},0.1)` : '#0A0A0A', color: period === p ? theme.accent : '#7E7E87', fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.15s ease' }}>
              {p === 'all' ? 'All Time' : `This ${p.charAt(0).toUpperCase() + p.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8, height: 130, flexShrink: 0, marginTop: 4 }}>
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map((m, i) => {
            if (!m) return <div key={i} style={{ flex: 1 }} />
            const heights = [92, 118, 76]
            const h = heights[i]
            const isFirst = i === 1
            return (
              <div key={m.rank} className="animate-fade-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div className={isFirst ? 'animate-scale-bounce' : ''} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 26 }}>{m.badge}</div>
                <div
                  style={{
                    width: '100%',
                    height: h,
                    background: isFirst ? 'linear-gradient(180deg, rgba(255,184,0,0.18) 0%, rgba(255,184,0,0.04) 100%)' : '#0A0A0A',
                    border: `1.5px solid ${isFirst ? 'rgba(255,184,0,0.45)' : '#141414'}`,
                    borderRadius: '14px 14px 0 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    boxShadow: isFirst ? '0 0 20px rgba(255,184,0,0.15)' : 'none',
                  }}
                >
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: isFirst ? 18 : 15, color: m.color, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 2 }}>
                    {m.name.slice(0, 6)}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: isFirst ? '#FFB800' : '#555', fontWeight: isFirst ? 700 : 400 }}>{m.xp.toLocaleString()}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Full list */}
        <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 18, overflow: 'hidden' }}>
          {leaderboard.map((m, i) => {
            const isMe = m.id === store.userId || m.name === store.userName || (leaderboard.length === 1);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: isMe ? `rgba(${theme.accentRgb},0.04)` : 'none', borderBottom: i < leaderboard.length - 1 ? '1px solid #0E0E0E' : 'none', borderLeft: isMe ? `2px solid ${theme.accent}` : '2px solid transparent' }}>
                <div style={{ width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 20, color: m.color }}>{m.badge || `#${m.rank}`}</div>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: isMe ? `rgba(${theme.accentRgb},0.1)` : '#111', border: `1.5px solid ${isMe ? `rgba(${theme.accentRgb},0.3)` : '#1A1A1A'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 18, color: isMe ? theme.accent : '#555', flexShrink: 0 }}>{m.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 17, color: isMe ? '#C8FF00' : '#D0D0D0', textTransform: 'uppercase', letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.name} {isMe && '(You)'}
                    </span>
                    {m.isPro && <ScrollntProBadge />}
                  </div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', display: 'flex', alignItems: 'center', gap: 4 }}><IconFlame size={12} color="#FFB800" /> {m.streak}d · {m.sessions} sessions</div>
                </div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 18, color: '#BF7FFF', flexShrink: 0 }}>{m.xp.toLocaleString()}</div>
              </div>
            )
          })}
        </div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  )
}

// ─── SQUAD GOALS ─────────────────────────────────────────────────────────────

export function SquadGoalsScreen({ onNavigate }: Props) {
  const store = useAppStore()
  const theme = useTheme()

  const members = store.squadMembers ?? []
  const hasLocalMember = members.some((m: any) => m.userId === store.userId)
  const memberXPSum = members.reduce((sum: number, m: any) => sum + (m.userId === store.userId ? store.totalXP : (m.totalXP || 0)), 0)
  const memberStreakSum = members.reduce((sum: number, m: any) => sum + (m.userId === store.userId ? store.currentStreak : (m.currentStreak || 0)), 0)
  
  const totalSquadXP = members.length > 0 ? (hasLocalMember ? memberXPSum : memberXPSum + store.totalXP) : store.totalXP
  const totalSquadStreak = members.length > 0 ? (hasLocalMember ? memberStreakSum : memberStreakSum + store.currentStreak) : store.currentStreak
  const squadMemberCount = Math.max(1, members.length)

  const squadGoals = [
    {
      icon: <IconTarget size={20} color="#C8FF00" />,
      title: 'Squad Focus Target',
      current: Math.round(totalSquadXP / 10),
      target: squadMemberCount * 150,
      unit: 'mins',
      color: '#C8FF00',
    },
    {
      icon: <IconFlame size={20} color="#FFB800" />,
      title: 'Collective Streak Bonus',
      current: totalSquadStreak,
      target: squadMemberCount * 3,
      unit: 'days',
      color: '#FFB800',
    },
    {
      icon: <IconBolt size={20} color="#BF7FFF" />,
      title: '1,000 XP Challenge',
      current: totalSquadXP,
      target: 1000,
      unit: 'XP',
      color: '#BF7FFF',
    },
  ]
  const allDone = squadGoals.length > 0 && squadGoals.every((g) => g.current >= g.target)
  const isWeeklyClaimed = (store.challenges ?? []).some((c: any) => c.id === 'squad-weekly-reward' && (c.completed || c.done))

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <SH title="SQUAD GOALS" subtitle="Weekly collective targets" onBack={() => onNavigate('squad-dashboard')} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', gap: 12, paddingInline: 'clamp(16px, 4vw, 24px)', paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {/* Week reward */}
        <div style={{ background: allDone ? `rgba(${theme.accentRgb},0.06)` : '#0A0A0A', border: `1px solid ${allDone ? `rgba(${theme.accentRgb},0.25)` : '#161616'}`, borderRadius: 18, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 12, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 2 }}>WEEKLY SQUAD REWARD</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 28, color: allDone ? theme.accent : '#555', display: 'flex', alignItems: 'center', gap: 8 }}><IconMedal size={26} color={allDone ? theme.accent : '#555'} /> 2,500 XP</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginTop: 2 }}>{isWeeklyClaimed ? 'Reward claimed for this week!' : allDone ? 'Unlocked! Claim now.' : `${Math.max(1, 7 - (new Date().getDay() || 7))} days remaining`}</div>
          </div>
          {allDone && !isWeeklyClaimed && (
            <button
              onClick={() => {
                store.claimChallenge('squad-weekly-reward', 2500)
                onNavigate('success-challenge')
              }}
              style={{ height: 40, paddingInline: 16, borderRadius: 12, background: theme.accent, border: 'none', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: '#080808', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              CLAIM
            </button>
          )}
          {allDone && isWeeklyClaimed && (
            <div style={{ height: 36, paddingInline: 12, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid #222', display: 'flex', alignItems: 'center', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, color: '#7E7E87', letterSpacing: '0.08em' }}>
              CLAIMED ✓
            </div>
          )}
        </div>

        {/* Goals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {squadGoals.map((g, i) => {
            const pct = Math.min(100, (g.current / g.target) * 100)
            const done = g.current >= g.target
            return (
              <div key={i} style={{ background: '#0A0A0A', border: `1px solid ${done ? g.color + '30' : '#161616'}`, borderRadius: 20, padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 13, background: '#111', border: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{done ? <IconCheck size={20} color="#34D399" /> : g.icon}</div>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: done ? g.color : '#D0D0D0', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{g.title}</span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 14, color: done ? g.color : '#555', flexShrink: 0 }}>{g.current}/{g.target} {g.unit}</span>
                </div>
                <div style={{ height: 8, background: '#141414', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: done ? g.color : `${g.color}60`, borderRadius: 4, boxShadow: done ? `0 0 8px ${g.color}50` : 'none', transition: 'width 0.4s ease' }} />
                </div>
                {/* Member contribution bars */}
                <div style={{ marginTop: 10, display: 'flex', gap: 4 }}>
                  {(store.squadMembers ?? []).slice(0, 4).map((_: any, mi: number) => (
                    <div key={mi} style={{ flex: 1, height: 3, borderRadius: 2, background: mi < Math.floor(g.current) ? g.color + '80' : '#0E0E0E' }} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Squad goals summary */}
        <div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 11, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>SQUAD PROGRESS</div>
          <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: '#7E7E87' }}>{squadGoals.filter(g => g.current >= g.target).length} / {squadGoals.length} goals completed</span>
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 15, color: '#BF7FFF' }}>+{totalSquadXP.toLocaleString()} XP total</span>
          </div>
        </div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  )
}

// ─── INVITE FRIENDS ──────────────────────────────────────────────────────────

export function InviteFriendsScreen({ onNavigate }: Props) {
  const store = useAppStore()
  const theme = useTheme()
  const [copiedType, setCopiedType] = useState<'code' | 'link' | null>(null)
  const code = store.squadCode || '------'

  const shareText = `Join my focus squad on Scrolln't! 🗿🔥\n\nUse my Squad Code: *${code}* to join my squad and get +200 XP bonus!\n\nDownload app: https://scrollnt.app/join/${code}`

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {})
    }
    setCopiedType('code')
    setTimeout(() => setCopiedType(null), 2000)
  }

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://scrollnt.app/join/${code}`).catch(() => {})
    }
    setCopiedType('link')
    setTimeout(() => setCopiedType(null), 2000)
  }

  const handleWhatsApp = () => {
    shareToWhatsApp(shareText)
  }

  const handleMoreShare = () => {
    shareContent({
      title: "Join my Scrolln't Focus Squad",
      text: shareText,
      url: `https://scrollnt.app/join/${code}`,
    })
  }

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, overflow: 'hidden' }}>
      <SH title="INVITE FRIENDS" subtitle="Squad battles are better with crew" onBack={() => onNavigate('squad-dashboard')} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', gap: 14, paddingInline: 'clamp(16px, 4vw, 24px)', paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {/* Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, textAlign: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
            {getMascotComponent('moai', 44)}
            <IconUsers size={36} color="#60A5FA" glow />
            {getMascotComponent('moai', 44)}
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 24, color: '#F5F5F5', textTransform: 'uppercase', letterSpacing: '-0.3px', marginBottom: 4 }}>
            INVITE CREW · EARN XP
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: '#7E7E87', lineHeight: 1.5, maxWidth: 280 }}>
            Invite friends to your squad. Anyone who quits breaks the whole squad's streak.
          </div>
        </div>

        {/* Squad code card */}
        <div style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 20, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>YOUR SQUAD CODE</div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 38, color: theme.accent, letterSpacing: '0.18em', filter: `drop-shadow(0 0 16px rgba(${theme.accentRgb},0.3))` }}>
              {code}
            </div>
          </div>
          <button
            onClick={handleCopyCode}
            className="interactive-btn"
            style={{ width: '100%', height: 48, borderRadius: 14, background: copiedType === 'code' ? `rgba(${theme.accentRgb},0.15)` : '#141414', border: `1px solid ${copiedType === 'code' ? `rgba(${theme.accentRgb},0.4)` : '#242424'}`, fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: copiedType === 'code' ? theme.accent : '#A0A0A0', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {copiedType === 'code' ? '✓ CODE COPIED!' : <><IconCopy size={16} color="#888" /> COPY CODE</>}
          </button>
        </div>

        {/* Share options */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 11, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>SHARE VIA</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleWhatsApp}
              className="interactive-btn"
              style={{ flex: 1, height: 72, borderRadius: 16, background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}
            >
              <IconMessage size={24} color="#25D366" />
              <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, color: '#25D366', textTransform: 'uppercase', letterSpacing: '0.06em' }}>WHATSAPP</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="interactive-btn"
              style={{ flex: 1, height: 72, borderRadius: 16, background: copiedType === 'link' ? `rgba(${theme.accentRgb},0.1)` : '#0A0A0A', border: `1px solid ${copiedType === 'link' ? theme.accent : '#1A1A1A'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}
            >
              <IconLink size={24} color={copiedType === 'link' ? '#C8FF00' : '#888'} />
              <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, color: copiedType === 'link' ? theme.accent : '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {copiedType === 'link' ? 'COPIED!' : 'COPY LINK'}
              </span>
            </button>

            <button
              onClick={handleMoreShare}
              className="interactive-btn"
              style={{ flex: 1, height: 72, borderRadius: 16, background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}
            >
              <IconShare size={24} color="#60A5FA" />
              <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>MORE APPS</span>
            </button>
          </div>
        </div>

        {/* Referral bonus */}
        <div style={{ background: 'rgba(191,127,255,0.08)', border: '1px solid rgba(191,127,255,0.25)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <IconGift size={28} color="#BF7FFF" glow />
          <div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 17, color: '#BF7FFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              +200 XP FOR EACH FRIEND WHO JOINS
            </div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#8E8E98', marginTop: 2, lineHeight: 1.4 }}>
              When your friend enters your code <span style={{ color: '#C8FF00', fontWeight: 700 }}>{code}</span> in their app, both of you instantly get +200 XP bonus!
            </div>
          </div>
        </div>

        {/* Members status summary */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 11, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
            SQUAD CREW · {Math.max(1, store.squadMembers?.length ?? 0)}/6 SLOTS FILLED
          </div>
          <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: '#7E7E87' }}>
              {6 - Math.max(1, store.squadMembers?.length ?? 0)} slots open for new warriors
            </span>
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: '#60A5FA' }}>
              ACTIVE 🟢
            </span>
          </div>
        </div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  )
}

// ─── STREAK FREEZE ───────────────────────────────────────────────────────────

export function StreakFreezeScreen({ onNavigate }: Props) {
  const store = useAppStore()
  const freezesOwned = store.streakFreezes
  const [used, setUsed] = useState(false)

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#080808', overflow: 'hidden' }}>
      <SH title="STREAK FREEZE" subtitle="Miss a day without losing your streak" onBack={() => onNavigate('squad-dashboard')} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', gap: 14, paddingInline: 'clamp(16px, 4vw, 24px)', paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {/* Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, textAlign: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <IconSnowflake size={72} color="#60A5FA" glow />
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 48, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '-0.5px', lineHeight: 0.9, marginBottom: 12, filter: 'drop-shadow(0 0 12px rgba(96,165,250,0.2))' }}>
            FREEZE
            <br />
            YOUR STREAK
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 14, color: '#7E7E87', lineHeight: 1.6, maxWidth: 260 }}>
            Use a Streak Freeze to protect your streak when life gets in the way. {store.currentStreak > 0 ? `Your ${store.currentStreak}-day streak stays alive.` : 'Your focus streak stays protected.'}
          </div>
        </div>

        {/* Current streak at risk */}
        <div style={{ background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.2)', borderRadius: 18, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconFlame size={32} color="#FFB800" />
            <div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 28, color: '#FFB800', lineHeight: 1 }}>{store.currentStreak}-Day Streak</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#7E7E87', marginTop: 2 }}>Worth protecting</div>
            </div>
          </div>
          {!used ? (
            <button onClick={async () => {
              if (freezesOwned <= 0 && !store.isSubscribed) {
                onNavigate('premium-upgrade')
                return
              }
              const ok = await store.useStreakFreeze()
              if (ok) setUsed(true)
            }} style={{ height: 40, paddingInline: 16, borderRadius: 12, background: '#60A5FA', border: 'none', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: '#080808', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.06em' }}>USE FREEZE</button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: 10, padding: '6px 12px' }}>
              <IconSnowflake size={14} color="#60A5FA" />
              <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>FROZEN</span>
            </div>
          )}
        </div>

        {/* Inventory */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 11, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>YOUR FREEZES</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 64, borderRadius: 16, background: i < freezesOwned ? 'rgba(96,165,250,0.1)' : '#0A0A0A', border: `1px solid ${i < freezesOwned ? 'rgba(96,165,250,0.3)' : '#141414'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i < freezesOwned ? 1 : 0.3 }}>
                {i < freezesOwned ? <IconSnowflake size={24} color="#60A5FA" /> : <div style={{ width: 16, height: 16, borderRadius: 4, border: '1px dashed #333' }} />}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: '#7E7E87', textAlign: 'center', marginBottom: 16 }}>
            {store.isSubscribed ? (
              <span style={{ color: '#60A5FA', fontWeight: 700 }}>∞ Unlimited Freezes (Pro Active)</span>
            ) : (
              <>You have <span style={{ color: '#60A5FA', fontWeight: 700 }}>{freezesOwned} freeze{freezesOwned !== 1 ? 's' : ''}</span> remaining</>
            )}
          </div>

          {/* Get more */}
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 11, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>GET MORE</div>
          {[
            { label: 'Earn via challenges', detail: 'Complete weekly missions', action: 'VIEW', icon: <IconTarget size={24} color="#FFB800" />, free: true },
            { label: 'Streak Freeze Shield', detail: 'Protected with Pro access', action: 'UNLOCK', icon: <IconSnowflake size={24} color="#60A5FA" />, free: false },
            { label: '∞ Freezes — Pro', detail: 'Never lose a streak again', action: 'PRO', icon: <IconCrown size={24} color="#FFB800" />, free: false },
          ].map((item, i) => (
            <div key={i} style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 16, color: '#D0D0D0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87' }}>{item.detail}</div>
              </div>
              <button
                onClick={() => {
                  if (item.action === 'VIEW') onNavigate('weekly-missions')
                  else onNavigate('premium-upgrade')
                }}
                style={{ height: 34, paddingInline: 12, borderRadius: 10, background: item.free ? '#0E0E0E' : '#C8FF00', border: item.free ? '1px solid #242424' : 'none', fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, color: item.free ? '#888' : '#080808', textTransform: 'uppercase', cursor: 'pointer', flexShrink: 0 }}
              >
                {item.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  )
}

// ─── SHARE CARDS ─────────────────────────────────────────────────────────────

const getCardDesigns = (store: any) => [
  {
    id: 'streak',
    label: 'Streak Card',
    preview: (
      <div style={{ width: '100%', aspectRatio: '4/5', borderRadius: 20, background: '#0A0A0A', border: '1px solid #1E1E1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, rgba(255,184,0,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <IconFlame size={40} color="#FFB800" glow />
        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 52, color: '#FFB800', lineHeight: 1 }}>{store.currentStreak}</div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DAY STREAK</div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, color: '#C8FF00', letterSpacing: '0.04em', textTransform: 'uppercase' }}>@{store.userName || 'User'}</div>
        <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>SCROLLN'T {getMascotComponent('moai', 14)}</div>
      </div>
    ),
  },
  {
    id: 'xp',
    label: 'XP Card',
    preview: (
      <div style={{ width: '100%', aspectRatio: '4/5', borderRadius: 20, background: '#0A0A0A', border: '1px solid rgba(191,127,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, rgba(191,127,255,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <IconBolt size={40} color="#BF7FFF" glow />
        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 44, color: '#BF7FFF', lineHeight: 1 }}>{store.totalXP.toLocaleString()}</div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TOTAL XP · LVL {store.level}</div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, color: '#BF7FFF', letterSpacing: '0.04em', textTransform: 'uppercase' }}>@{store.userName || 'User'}</div>
        <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>SCROLLN'T {getMascotComponent('moai', 14)}</div>
      </div>
    ),
  },
  {
    id: 'session',
    label: 'Session Card',
    preview: (
      <div style={{ width: '100%', aspectRatio: '4/5', borderRadius: 20, background: '#0A0A0A', border: '1px solid rgba(200,255,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, rgba(200,255,0,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        {getMascotComponent(store.activeSkin || 'moai', 40)}
        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 44, color: '#C8FF00', lineHeight: 1 }}>{store.sessions?.[0]?.durationMinutes || store.durationMinutes}m</div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SESSION COMPLETE</div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, color: '#C8FF00', letterSpacing: '0.04em', textTransform: 'uppercase' }}>@{store.userName || 'User'}</div>
        <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>SCROLLN'T {getMascotComponent('moai', 14)}</div>
      </div>
    ),
  },
]

export function ShareCardsScreen({ onNavigate }: Props) {
  const store = useAppStore()
  const [selected, setSelected] = useState('streak')
  const [copied, setCopied] = useState(false)

  const cardDesigns = getCardDesigns(store)
  const card = cardDesigns.find((c) => c.id === selected) || cardDesigns[0]

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Check out my focus stats on Scrolln't! 🗿 Streak: ${store.currentStreak}d | XP: ${store.totalXP.toLocaleString()}`).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#080808', overflow: 'hidden' }}>
      <SH title="SHARE CARDS" subtitle="Flex your stats on socials" onBack={() => onNavigate('home')} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', gap: 12, paddingInline: 'clamp(16px, 4vw, 24px)', paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {/* Card type selector */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {cardDesigns.map((c) => (
            <button key={c.id} onClick={() => setSelected(c.id)} style={{ flex: 1, height: 32, borderRadius: 8, border: `1px solid ${selected === c.id ? '#C8FF00' : '#1A1A1A'}`, background: selected === c.id ? 'rgba(200,255,0,0.1)' : '#0A0A0A', color: selected === c.id ? '#C8FF00' : '#7E7E87', fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.15s ease' }}>
              {c.label.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Card preview */}
        <div style={{ maxWidth: 300, width: '100%', margin: '0 auto', flexShrink: 0 }}>
          {card.preview}
        </div>

        {/* Share actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => {
              shareContent({
                title: "Scrolln't Focus",
                text: `Locked in with a ${store.currentStreak}-day streak and ${store.totalXP.toLocaleString()} XP on Scrolln't! 🗿🔥`,
                url: 'https://scrollnt.app',
              })
            }}
            style={{ width: '100%', height: 52, borderRadius: 16, background: '#C8FF00', border: 'none', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 18, color: '#080808', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <IconShare size={20} color="#080808" /> SHARE TO STORY
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleCopy}
              style={{ flex: 1, height: 44, borderRadius: 12, background: '#0E0E0E', border: '1px solid #1E1E1E', fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 15, color: copied ? '#C8FF00' : '#888', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <IconCopy size={16} color={copied ? '#C8FF00' : '#888'} /> {copied ? 'COPIED!' : 'COPY STATS'}
            </button>
          </div>
        </div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  )
}

// ─── SHARE ACHIEVEMENT ───────────────────────────────────────────────────────

export function ShareAchievementScreen({ onNavigate }: Props) {
  const store = useAppStore()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`I just unlocked Diamond Mind on Scrolln't with a ${store.currentStreak || 30}-day streak! 🗿🔥`).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#080808', overflow: 'hidden' }}>
      <SH title="SHARE" subtitle="Show the world you locked in" onBack={() => onNavigate('milestones')} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', gap: 12, paddingInline: 'clamp(16px, 4vw, 24px)', paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {/* Achievement card preview */}
        <div style={{ background: '#0A0A0A', border: '1px solid rgba(200,255,0,0.2)', borderRadius: 24, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(200,255,0,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <IconDiamond size={54} color="#60A5FA" glow />
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 30, color: '#C8FF00', textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'center', lineHeight: 1 }}>DIAMOND MIND</div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: '#7E7E87', textAlign: 'center' }}>Achieved a {store.bestStreak || store.currentStreak || 30}-day focus streak</div>
          <div style={{ width: '100%', height: 1, background: '#141414' }} />
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { label: 'Streak', val: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{store.currentStreak}d <IconFlame size={14} color="#FFB800" /></span> },
              { label: 'XP', val: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{store.totalXP.toLocaleString()} <IconBolt size={14} color="#BF7FFF" /></span> },
              { label: 'Level', val: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{store.level} {getMascotComponent(store.activeSkin || 'moai', 16)}</span> },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 18, color: '#F5F5F5' }}>{s.val}</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 12, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 4 }}>SCROLLN'T · STOP SCROLLING. START LIVING.</div>
        </div>

        {/* Caption */}
        <div style={{ background: '#0A0A0A', border: '1px solid #141414', borderRadius: 14, padding: '12px 14px', flexShrink: 0 }}>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#7E7E87', lineHeight: 1.6 }}>
            "{store.currentStreak || store.bestStreak || 1} days locked in. No excuses. Join me on Scrolln't — stop doomscrolling, build real focus."
          </div>
        </div>

        {/* Share buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => {
              shareContent({
                title: "Scrolln't Achievement",
                text: `I just unlocked Diamond Mind on Scrolln't with a ${store.currentStreak || 30}-day streak! 🗿🔥`,
                url: 'https://scrollnt.app',
              })
            }}
            style={{ width: '100%', height: 52, borderRadius: 16, background: '#C8FF00', border: 'none', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 18, color: '#080808', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <IconShare size={20} color="#080808" /> SHARE ACHIEVEMENT
          </button>
          <button
            onClick={handleCopy}
            style={{ width: '100%', height: 44, borderRadius: 12, background: '#0E0E0E', border: '1px solid #1E1E1E', fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 15, color: copied ? '#C8FF00' : '#888', textTransform: 'uppercase', letterSpacing: '0.07em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <IconCopy size={16} color={copied ? '#C8FF00' : '#888'} /> {copied ? 'COPIED TO CLIPBOARD!' : 'COPY TEXT'}
          </button>
        </div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  )
}
