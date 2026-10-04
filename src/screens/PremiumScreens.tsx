import { useState } from 'react'
import { useTheme } from '../utils/theme'
import type { Screen } from '../types'
import { BottomNav } from './HomeScreen'
import { buySubscription, restorePurchases } from '../utils/billingService'
import { openExternalUrl } from '../utils/nativeShare'
import { useAppStore } from '../store/useAppStore'
import {
  IconCrown,
  IconSnowflake,
  IconPalette,
  IconChart,
  IconUsers,
  IconDocument,
  IconBolt,
  IconLocked,
} from '../components/Icons'

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
        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 'clamp(24px, 3.5vh, 30px)', color: '#F5F5F5', textTransform: 'uppercase', letterSpacing: '-0.3px', lineHeight: 1 }}>{title}</div>
        {subtitle && <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#7E7E87', marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  )
}

// ─── PREMIUM UPGRADE ─────────────────────────────────────────────────────────

const PRO_FEATURES = [
  { icon: <IconBolt size={18} color="#C8FF00" />, label: '2x XP Multiplier', desc: 'Double XP on all completed focus sessions' },
  { icon: <IconSnowflake size={18} color="#60A5FA" />, label: 'Unlimited Streak Freezes', desc: 'Zero penalty & permanent streak protection' },
  { icon: <IconCrown size={18} color="#FFB800" />, label: '👑 SCROLLN\'T PRO Badge', desc: 'Exclusive status in Squad & Leaderboard' },
  { icon: <IconPalette size={18} color="#BF7FFF" />, label: 'All Themes & Rare Moai Skins', desc: 'Gold, Cyber, Inferno, AMOLED themes' },
  { icon: <IconChart size={18} color="#C8FF00" />, label: 'Export PDF Reports & Summaries', desc: 'Weekly performance audit & structured exports' },
  { icon: <IconUsers size={18} color="#60A5FA" />, label: 'Unlimited Squads', desc: 'Join or host unlimited squads' },
]

const PLANS = [
  { id: 'monthly', label: 'MONTHLY', price: '₹99', sub: '/month', badge: null, summary: '₹99/mo' },
  { id: 'quarterly', label: 'QUARTERLY', price: '₹249', sub: '/3 mo', badge: 'POPULAR · ₹83/MO', summary: '₹249/3mo' },
  { id: 'yearly', label: 'YEARLY', price: '₹699', sub: '/year', badge: 'BEST VALUE · ₹58/MO', summary: '₹699/yr' },
]

export function PremiumUpgradeScreen({ onNavigate }: Props) {
  const theme = useTheme()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly' | 'yearly'>('quarterly')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const setIsSubscribed = useAppStore((s) => s.setIsSubscribed)

  const handlePurchase = async () => {
    if (loading) return
    setLoading(true)
    try {
      const result = await buySubscription(selectedPlan)
      if (result.success) {
        setIsSubscribed(true)
        setToastMessage(result.message)
        setTimeout(() => {
          setToastMessage(null)
          onNavigate('home')
        }, 2000)
      } else {
        setToastMessage(result.message)
        setTimeout(() => setToastMessage(null), 4000)
      }
    } catch (e: any) {
      setToastMessage(e?.message || 'Failed to complete purchase.')
      setTimeout(() => setToastMessage(null), 4000)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async () => {
    if (loading) return
    setLoading(true)
    try {
      const result = await restorePurchases()
      if (result.success) {
        setIsSubscribed(true)
        setToastMessage('Purchases restored successfully! 🚀')
        setTimeout(() => {
          setToastMessage(null)
          onNavigate('home')
        }, 2000)
      } else {
        setToastMessage(result.message)
        setTimeout(() => setToastMessage(null), 4000)
      }
    } catch (e: any) {
      setToastMessage(e?.message || 'Failed to restore purchases.')
      setTimeout(() => setToastMessage(null), 4000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#080808', position: 'relative', overflow: 'hidden' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            right: 20,
            background: theme.accent,
            color: '#080808',
            padding: '10px 14px',
            borderRadius: 10,
            fontFamily: "'Barlow Condensed'",
            fontWeight: 800,
            fontSize: 15,
            textAlign: 'center',
            zIndex: 100,
            boxShadow: `0 4px 20px rgba(${theme.accentRgb},0.4)`,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Background gradient */}
      <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, rgba(191,127,255,0.08) 0%, rgba(${theme.accentRgb},0.04) 50%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingTop: 'max(14px, env(safe-area-inset-top, 14px))', paddingBottom: 'clamp(70px, 10vh, 100px)', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ position: 'relative', textAlign: 'center', flexShrink: 0 }}>
          <button
            onClick={() => onNavigate('settings')}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#0D0D0D',
              border: '1px solid #1A1A1A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#888',
              fontFamily: "'JetBrains Mono'",
              fontSize: 16,
            }}
          >
            ←
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
            <IconCrown size={38} color="#FFB800" glow />
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 'clamp(32px, 5vh, 40px)', letterSpacing: '-0.5px', lineHeight: 0.9, marginBottom: 4 }}>
            <span style={{ color: '#BF7FFF' }}>SCROLLN'T</span>{' '}
            <span style={{ color: theme.accent }}>PRO</span>
          </div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 12.5, color: '#7E7E87', lineHeight: 1.4 }}>
            Lock in harder. Earn more. Zero excuses.
          </div>
        </div>

        {/* Plan selector */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {PLANS.map((p) => {
            const isSelected = selectedPlan === p.id
            return (
              <button key={p.id} onClick={() => setSelectedPlan(p.id as any)} className="interactive-btn" style={{ flex: 1, borderRadius: 14, background: isSelected ? `rgba(${theme.accentRgb},0.06)` : '#0A0A0A', border: `1.5px solid ${isSelected ? theme.accent : '#1E1E1E'}`, padding: '10px 8px', cursor: 'pointer', textAlign: 'center', position: 'relative', transition: 'all 0.2s ease' }}>
                {p.badge && (
                  <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', background: theme.accent, borderRadius: 6, padding: '1px 8px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 9.5, color: '#080808', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.badge}</span>
                  </div>
                )}
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 11, color: isSelected ? '#888' : '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{p.label}</div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 24, color: isSelected ? theme.accent : '#555', letterSpacing: '-0.5px', lineHeight: 1 }}>{p.price}</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: isSelected ? '#555' : '#7E7E87' }}>{p.sub}</div>
              </button>
            )
          })}
        </div>

        {/* Features list */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: '#0A0A0A', border: '1px solid #141414', borderRadius: 14, overflow: 'hidden' }}>
            {PRO_FEATURES.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderBottom: i < PRO_FEATURES.length - 1 ? '1px solid #0E0E0E' : 'none' }}>
                <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: '#D0D0D0' }}>{f.label}</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87' }}>{f.desc}</div>
                </div>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: `rgba(${theme.accentRgb},0.12)`, border: `1px solid rgba(${theme.accentRgb},0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 9, color: theme.accent }}>✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="interactive-btn animate-pulse-glow"
            style={{ width: '100%', height: 'clamp(44px, 5.8vh, 50px)', borderRadius: 14, background: `linear-gradient(135deg, #BF7FFF 0%, ${theme.accent} 100%)`, border: 'none', fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 18, color: '#080808', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            {loading ? (
              'PROCESSING...'
            ) : (
              <>
                <IconCrown size={16} color="#080808" />
                <span>GET PRO · {selectedPlan === 'yearly' ? '₹699/yr' : selectedPlan === 'quarterly' ? '₹249/3mo' : '₹99/mo'}</span>
              </>
            )}
          </button>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#7E7E87', textAlign: 'center', marginTop: 4 }}>Cancel anytime via Google Play. No dark patterns.</div>
          
          {/* Restore Purchases */}
          <button
            onClick={handleRestore}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans'", fontSize: 11, color: '#BF7FFF', textDecoration: 'underline', marginTop: 2 }}
          >
            Restore Purchases →
          </button>
        </div>
      </div>

      <BottomNav active="settings" onNavigate={onNavigate} />
    </div>
  )
}

// ─── SUBSCRIPTION MANAGEMENT ─────────────────────────────────────────────────

export function SubscriptionManagementScreen({ onNavigate }: Props) {
  const store = useAppStore()
  const theme = useTheme()
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [restoring, setRestoring] = useState(false)

  const handleRestore = async () => {
    if (restoring) return
    setRestoring(true)
    try {
      const result = await restorePurchases()
      if (result.success) {
        store.setIsSubscribed(true)
      }
      setToastMessage(result.message)
      setTimeout(() => setToastMessage(null), 4000)
    } catch (e: any) {
      setToastMessage(e?.message || 'Failed to restore purchases.')
      setTimeout(() => setToastMessage(null), 4000)
    } finally {
      setRestoring(false)
    }
  }

  const PRO_PERKS = [
    { icon: <IconBolt size={18} color="#BF7FFF" />, title: '2x XP Multiplier', desc: 'Double leveling speed on every session' },
    { icon: <IconSnowflake size={18} color="#60A5FA" />, title: 'Unlimited Streak Freezes', desc: 'Never lose a streak to emergencies' },
    { icon: <IconPalette size={18} color="#BF7FFF" />, title: 'All Themes & Skins', desc: 'Unlocked access to Matrix, Gold, Cyber & Robot skins' },
    { icon: <IconChart size={18} color="#C8FF00" />, title: 'Deep Analytics & Heatmaps', desc: '52-week focus grids & distraction trends' },
    { icon: <IconUsers size={18} color="#60A5FA" />, title: 'Unlimited Squad Access', desc: 'Host & join unlimited focus squads' },
    { icon: <IconDocument size={18} color="#C8FF00" />, title: 'Weekly Reports & PDF Export', desc: 'Shareable weekly productivity breakdowns' },
  ]

  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: theme.bg, position: 'relative', overflow: 'hidden' }}>
      {toastMessage && (
        <div style={{ position: 'absolute', top: 20, left: 20, right: 20, background: theme.accent, color: '#080808', padding: '10px 14px', borderRadius: 10, fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, textAlign: 'center', zIndex: 100, boxShadow: `0 0 20px rgba(${theme.accentRgb},0.4)` }}>
          {toastMessage}
        </div>
      )}

      <SH title="SUBSCRIPTION" subtitle="Your Pro membership status" onBack={() => onNavigate('settings')} />

      {/* Main scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', paddingInline: 'clamp(16px, 4vw, 24px)', gap: 8, paddingTop: 6, paddingBottom: 'clamp(70px, 10vh, 100px)' }}>
        {/* Active plan card */}
        <div style={{ background: store.isSubscribed ? `linear-gradient(135deg, rgba(${theme.accentRgb},0.08) 0%, rgba(191,127,255,0.08) 100%)` : 'rgba(255,255,255,0.02)', border: `1px solid ${store.isSubscribed ? `rgba(${theme.accentRgb},0.3)` : '#222'}`, borderRadius: 16, padding: '14px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: store.isSubscribed ? `radial-gradient(circle, rgba(${theme.accentRgb},0.15) 0%, transparent 70%)` : 'none', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Current Plan</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <IconCrown size={18} color="#FFB800" glow={store.isSubscribed} />
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 22, color: store.isSubscribed ? theme.accent : '#888', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{store.isSubscribed ? 'PRO ACCESS' : 'FREE PLAN'}</div>
              </div>
            </div>
            <div style={{ background: store.isSubscribed ? `rgba(${theme.accentRgb},0.15)` : 'rgba(255,255,255,0.05)', border: `1px solid ${store.isSubscribed ? `rgba(${theme.accentRgb},0.4)` : '#333'}`, borderRadius: 8, padding: '4px 10px' }}>
              <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 11, color: store.isSubscribed ? theme.accent : '#666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{store.isSubscribed ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 9.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, color: store.isSubscribed ? theme.accent : '#888' }}>{store.isSubscribed ? 'All Features Unlocked' : 'Standard Tier'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 9.5, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Billing Platform</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, color: '#D0D0D0' }}>Google Play Store</div>
            </div>
          </div>
        </div>

        {/* Unlocked Perks Section */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 11, color: '#7E7E87', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
            {store.isSubscribed ? 'YOUR ACTIVE PRO PERKS' : 'AVAILABLE WITH PRO'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PRO_PERKS.map((perk, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0A0A0A', border: '1px solid #141414', borderRadius: 12, padding: '8px 12px' }}>
                <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {perk.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 14, color: store.isSubscribed ? '#F5F5F5' : '#888', textTransform: 'uppercase' }}>{perk.title}</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 10.5, color: '#7E7E87' }}>{perk.desc}</div>
                </div>
                <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 11, color: store.isSubscribed ? theme.accent : '#7E7E87', display: 'flex', alignItems: 'center', gap: 3 }}>
                  {store.isSubscribed ? (
                    '✓ ACTIVE'
                  ) : (
                    <>
                      <IconLocked size={12} color="#7E7E87" /> LOCKED
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
          {store.isSubscribed ? (
            <button
              onClick={() => openExternalUrl('https://play.google.com/store/account/subscriptions')}
              className="interactive-btn"
              style={{ width: '100%', height: 44, borderRadius: 12, background: '#111', border: '1px solid #222', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 15, color: '#D0D0D0', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}
            >
              MANAGE ON GOOGLE PLAY ↗
            </button>
          ) : (
            <button onClick={() => onNavigate('premium-upgrade')} className="interactive-btn" style={{ width: '100%', height: 46, borderRadius: 14, background: theme.accent, border: 'none', fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 17, color: '#080808', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <IconCrown size={16} color="#080808" />
              <span>UPGRADE TO PRO (SAVE 44%)</span>
            </button>
          )}
          <button onClick={handleRestore} disabled={restoring} className="interactive-btn" style={{ width: '100%', height: 38, borderRadius: 10, background: 'none', border: '1px solid #1A1A1A', fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 13, color: restoring ? '#555' : '#BF7FFF', textTransform: 'uppercase', letterSpacing: '0.07em', cursor: restoring ? 'not-allowed' : 'pointer' }}>
            {restoring ? 'CHECKING GOOGLE PLAY...' : 'RESTORE PURCHASES'}
          </button>
        </div>
      </div>

      <BottomNav active="settings" onNavigate={onNavigate} />
    </div>
  )
}

export function PremiumLockedScreen({ onNavigate }: Props) {
  const theme = useTheme()
  return (
    <div style={{ height: '100dvh', maxHeight: '100dvh', display: 'flex', flexDirection: 'column', background: theme.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(2px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', zIndex: 10 }}>
        <button onClick={() => { if (typeof window !== 'undefined' && (window as any).__handleBack) { (window as any).__handleBack() } else { onNavigate('home') } }} style={{ position: 'absolute', top: 'max(14px, env(safe-area-inset-top, 14px))', left: 20, background: 'none', border: 'none', color: '#888', fontSize: 16, fontFamily: "'Barlow Condensed'", cursor: 'pointer', textTransform: 'uppercase' }}>← Back</button>
        <div style={{ width: 68, height: 68, borderRadius: 20, background: 'rgba(191,127,255,0.1)', border: '1.5px solid rgba(191,127,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <IconLocked size={34} color="#BF7FFF" glow />
        </div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 'clamp(32px, 5vh, 42px)', textTransform: 'uppercase', letterSpacing: '-0.5px', lineHeight: 0.9, marginBottom: 16 }}>
          <span style={{ color: '#BF7FFF' }}>PRO</span>
          <br />
          <span style={{ color: '#F5F5F5' }}>FEATURE</span>
        </div>
        <button onClick={() => onNavigate('premium-upgrade')} className="interactive-btn" style={{ width: '100%', maxWidth: 280, height: 48, borderRadius: 15, background: `linear-gradient(135deg, #BF7FFF 0%, ${theme.accent} 100%)`, border: 'none', fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 19, color: '#080808', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <IconCrown size={16} color="#080808" />
          <span>GET PRO</span>
        </button>
      </div>
    </div>
  )
}
