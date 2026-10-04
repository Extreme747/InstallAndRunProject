import { useState } from 'react'

const COLORS = [
  { token: '--color-lime', hex: '#C8FF00', label: 'Lime', role: 'Primary CTA · Active states · Success' },
  { token: '--color-bg', hex: '#080808', label: 'Background', role: 'Page & screen background', light: true },
  { token: '--color-surface', hex: '#0E0E0E', label: 'Surface', role: 'Cards · Sheets', light: true },
  { token: '--color-surface-2', hex: '#161616', label: 'Surface 2', role: 'Nested cards', light: true },
  { token: '--color-border', hex: '#1E1E1E', label: 'Border', role: 'Hairlines · Dividers', light: true },
  { token: '--color-red', hex: '#FF3B30', label: 'Danger', role: 'Give up · Errors · Aborted' },
  { token: '--color-amber', hex: '#FFB800', label: 'Streak', role: 'Streak count · Warnings' },
  { token: '--color-purple', hex: '#BF7FFF', label: 'XP', role: 'Level progress · Experience' },
  { token: '--color-blue', hex: '#60A5FA', label: 'Info', role: 'Tooltips · Informational' },
  { token: '--color-text', hex: '#F5F5F5', label: 'Text', role: 'Primary text' },
  { token: '--color-muted', hex: '#888888', label: 'Muted', role: 'Secondary text · Captions' },
  { token: '--color-ghost', hex: '#333333', label: 'Ghost', role: 'Disabled · Placeholder' },
]

const TYPE_SCALE = [
  {
    name: 'Display XL',
    font: 'Barlow Condensed 900',
    size: '72px / -1.5px',
    sample: "SCROLLN'T",
    style: {
      fontFamily: "'Barlow Condensed'",
      fontWeight: 900,
      fontSize: 64,
      color: '#F5F5F5',
      letterSpacing: '-1.5px',
      lineHeight: 0.9,
      textTransform: 'uppercase',
    } as React.CSSProperties,
  },
  {
    name: 'Display L',
    font: 'Barlow Condensed 900',
    size: '52px / -0.5px',
    sample: 'LOCKED IN.',
    style: {
      fontFamily: "'Barlow Condensed'",
      fontWeight: 900,
      fontSize: 48,
      color: '#F5F5F5',
      letterSpacing: '-0.5px',
      lineHeight: 0.92,
      textTransform: 'uppercase',
    } as React.CSSProperties,
  },
  {
    name: 'Heading',
    font: 'Barlow Condensed 700',
    size: '28px / 0.02em',
    sample: 'YOUR STATS',
    style: {
      fontFamily: "'Barlow Condensed'",
      fontWeight: 700,
      fontSize: 26,
      color: '#F5F5F5',
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
    } as React.CSSProperties,
  },
  {
    name: 'Label',
    font: 'Barlow Condensed 700',
    size: '13px / 0.12em',
    sample: 'FOCUS MODE ACTIVE',
    style: {
      fontFamily: "'Barlow Condensed'",
      fontWeight: 700,
      fontSize: 12,
      color: '#555',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
    } as React.CSSProperties,
  },
  {
    name: 'Body',
    font: 'DM Sans 400',
    size: '15px / 1.6',
    sample: 'Stop scrolling. Start living. Build streaks. Beat the scroll.',
    style: {
      fontFamily: "'DM Sans'",
      fontWeight: 400,
      fontSize: 15,
      color: 'rgba(245,245,245,0.55)',
      lineHeight: 1.6,
    } as React.CSSProperties,
  },
  {
    name: 'Body Semibold',
    font: 'DM Sans 600',
    size: '14px / 1.5',
    sample: 'Instagram & TikTok blocked during session.',
    style: {
      fontFamily: "'DM Sans'",
      fontWeight: 600,
      fontSize: 14,
      color: '#D0D0D0',
    } as React.CSSProperties,
  },
  {
    name: 'Timer',
    font: 'JetBrains Mono 800',
    size: '80px / -4px',
    sample: '28:43',
    style: {
      fontFamily: "'JetBrains Mono'",
      fontWeight: 800,
      fontSize: 72,
      color: '#C8FF00',
      letterSpacing: '-4px',
      lineHeight: 1,
      filter: 'drop-shadow(0 0 16px rgba(200,255,0,0.3))',
    } as React.CSSProperties,
  },
  {
    name: 'Mono Label',
    font: 'JetBrains Mono 500',
    size: '12px / 0.1em',
    sample: 'SESSION_ACTIVE',
    style: {
      fontFamily: "'JetBrains Mono'",
      fontWeight: 500,
      fontSize: 12,
      color: '#444',
      letterSpacing: '0.1em',
    } as React.CSSProperties,
  },
]

const SPACING = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64]

const RADII = [
  { name: 'sm', value: '8px', usage: 'Badge · Chip' },
  { name: 'md', value: '12px', usage: 'Input · Tag' },
  { name: 'lg', value: '16px', usage: 'Card' },
  { name: 'xl', value: '18px', usage: 'Button CTA' },
  { name: '2xl', value: '24px', usage: 'Large card' },
  { name: 'pill', value: '999px', usage: 'Badge · Toggle' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div
        style={{
          fontFamily: "'Barlow Condensed'",
          fontWeight: 700,
          fontSize: 11,
          color: '#333',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          marginBottom: 16,
          paddingBottom: 8,
          borderBottom: '1px solid #111',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

export default function DesignSystemScreen() {
  const [activeToggle, setActiveToggle] = useState(true)

  return (
    <div
      style={{
        background: '#040404',
        minHeight: '100%',
        color: '#F5F5F5',
      }}
    >
      {/* DS Header */}
      <div
        style={{
          borderBottom: '1px solid #111',
          padding: '40px 48px 32px',
          background: '#040404',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 36 }}>🗿</span>
              <div
                style={{
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 900,
                  fontSize: 42,
                  color: '#C8FF00',
                  letterSpacing: '-0.5px',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                }}
              >
                SCROLLN'T
              </div>
            </div>
            <div
              style={{
                fontFamily: "'DM Sans'",
                fontSize: 14,
                color: '#333',
                letterSpacing: '0.04em',
              }}
            >
              Design Language v1.0 — Dark · Bold · Gen Z
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Barlow Condensed', 'DM Sans', 'JetBrains Mono'].map((f) => (
              <div
                key={f}
                style={{
                  background: '#0A0A0A',
                  border: '1px solid #181818',
                  borderRadius: 8,
                  padding: '5px 10px',
                  fontFamily: f,
                  fontSize: 12,
                  color: '#555',
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0,
          maxWidth: 1200,
        }}
      >
        {/* Left column */}
        <div
          style={{
            padding: '40px 48px',
            borderRight: '1px solid #111',
          }}
        >
          {/* Colors */}
          <Section title="Color System">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {COLORS.map((c) => (
                <div
                  key={c.hex}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#080808',
                    border: '1px solid #111',
                    borderRadius: 10,
                    padding: '8px 10px',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      background: c.hex,
                      flexShrink: 0,
                      border: c.light ? '1px solid #1E1E1E' : 'none',
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Barlow Condensed'",
                        fontWeight: 700,
                        fontSize: 13,
                        color: '#888',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {c.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono'",
                        fontSize: 10,
                        color: '#333',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {c.hex}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Sans'",
                        fontSize: 10,
                        color: '#2A2A2A',
                        lineHeight: 1.3,
                        marginTop: 1,
                      }}
                    >
                      {c.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Spacing */}
          <Section title="Spacing Scale">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SPACING.map((s) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono'",
                      fontSize: 11,
                      color: '#333',
                      width: 30,
                      textAlign: 'right',
                      flexShrink: 0,
                    }}
                  >
                    {s}
                  </div>
                  <div
                    style={{
                      width: s * 2,
                      height: 6,
                      borderRadius: 3,
                      background: s === 16 ? '#C8FF00' : '#1A1A1A',
                      border: s === 16 ? 'none' : '1px solid #111',
                      transition: 'width 0.2s ease',
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "'DM Sans'",
                      fontSize: 10,
                      color: '#2A2A2A',
                    }}
                  >
                    {s}px
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Border radii */}
          <Section title="Border Radius">
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {RADII.map((r) => (
                <div key={r.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: r.value,
                      background: '#0E0E0E',
                      border: '1px solid #1E1E1E',
                    }}
                  />
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: '#555', textAlign: 'center' }}>
                    {r.value}
                  </div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 9, color: '#2A2A2A', textAlign: 'center' }}>
                    {r.usage}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Iconography */}
          <Section title="Iconography">
            <div
              style={{
                background: '#080808',
                border: '1px solid #111',
                borderRadius: 14,
                padding: 20,
              }}
            >
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: '#444', lineHeight: 1.7, marginBottom: 16 }}>
                <strong style={{ color: '#666' }}>Style:</strong> Stroke-based, 1.6px strokeWidth, rounded linecap, 22×22px standard size.<br />
                <strong style={{ color: '#666' }}>Color:</strong> Inherits text color (currentColor).<br />
                <strong style={{ color: '#666' }}>States:</strong> Default #3A3A3A · Active #C8FF00 · Hover #666.
              </div>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                {[
                  {
                    label: 'Home',
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M3 9.5L11 3l8 6.5V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" stroke="#C8FF00" strokeWidth="1.6" fill="none" />
                        <path d="M8 20v-7h6v7" stroke="#C8FF00" strokeWidth="1.6" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Focus',
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="#C8FF00" strokeWidth="1.6" />
                        <circle cx="11" cy="11" r="3" stroke="#C8FF00" strokeWidth="1.6" />
                        <path d="M11 3V1M11 21v-2M3 11H1M21 11h-2" stroke="#C8FF00" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Stats',
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <rect x="3" y="12" width="4" height="8" rx="1" stroke="#C8FF00" strokeWidth="1.6" />
                        <rect x="9" y="7" width="4" height="13" rx="1" stroke="#C8FF00" strokeWidth="1.6" />
                        <rect x="15" y="3" width="4" height="17" rx="1" stroke="#C8FF00" strokeWidth="1.6" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Settings',
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <circle cx="11" cy="11" r="3" stroke="#C8FF00" strokeWidth="1.6" />
                        <path d="M19.4 14.8a1 1 0 0 0 .2 1.1l.1.1a1.2 1.2 0 0 1-1.7 1.7l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V18.5a1.2 1.2 0 0 1-2.4 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.2 1.2 0 0 1-1.7-1.7l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H9.5a1.2 1.2 0 0 1 0-2.4h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1.2 1.2 0 0 1 1.7-1.7l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V5.5a1.2 1.2 0 0 1 2.4 0v.1a1 1 0 0 0 .6.9h.1a1 1 0 0 0 1.1-.2l.1-.1a1.2 1.2 0 0 1 1.7 1.7l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6h.1a1.2 1.2 0 0 1 0 2.4h-.1a1 1 0 0 0-.9.6Z" stroke="#C8FF00" strokeWidth="1.6" fill="none" />
                      </svg>
                    ),
                  },
                ].map((icon) => (
                  <div key={icon.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    {icon.icon}
                    <span style={{ fontFamily: "'DM Sans'", fontSize: 9, color: '#333', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {icon.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>

        {/* Right column */}
        <div style={{ padding: '40px 48px' }}>
          {/* Typography */}
          <Section title="Typography">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {TYPE_SCALE.map((t, i) => (
                <div
                  key={t.name}
                  style={{
                    padding: '16px 0',
                    borderBottom: i < TYPE_SCALE.length - 1 ? '1px solid #0E0E0E' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 600, fontSize: 11, color: '#333', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                      {t.name}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: '#1E1E1E' }}>
                      {t.font} · {t.size}
                    </span>
                  </div>
                  <div style={t.style}>{t.sample}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* Components */}
          <Section title="Component Library">

            {/* Buttons */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#2A2A2A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Buttons</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button style={{ height: 44, paddingInline: 20, borderRadius: 14, background: '#C8FF00', border: 'none', fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, color: '#080808', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}>
                  Primary
                </button>
                <button style={{ height: 44, paddingInline: 20, borderRadius: 14, background: '#0E0E0E', border: '1px solid #242424', fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 16, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}>
                  Secondary
                </button>
                <button style={{ height: 44, paddingInline: 20, borderRadius: 14, background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 16, color: '#FF3B30', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}>
                  Danger
                </button>
                <button style={{ height: 44, paddingInline: 20, borderRadius: 14, background: 'none', border: 'none', fontFamily: "'DM Sans'", fontWeight: 500, fontSize: 13, color: '#444', cursor: 'pointer' }}>
                  Ghost link
                </button>
              </div>
            </div>

            {/* Badges */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#2A2A2A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Badges & Tags</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                {[
                  { text: '🔥 7 streak', bg: 'rgba(255,184,0,0.1)', border: 'rgba(255,184,0,0.25)', color: '#FFB800' },
                  { text: '⚡ 1,250 XP', bg: 'rgba(191,127,255,0.1)', border: 'rgba(191,127,255,0.25)', color: '#BF7FFF' },
                  { text: '✅ ENABLED', bg: 'rgba(200,255,0,0.08)', border: 'rgba(200,255,0,0.2)', color: '#C8FF00' },
                  { text: '🔒 BLOCKED', bg: 'rgba(255,59,48,0.1)', border: 'rgba(255,59,48,0.2)', color: '#FF3B30' },
                  { text: '⚡ NEW RECORD', bg: 'rgba(200,255,0,0.08)', border: 'rgba(200,255,0,0.2)', color: '#C8FF00' },
                ].map((b) => (
                  <div key={b.text} style={{ display: 'inline-flex', alignItems: 'center', background: b.bg, border: `1px solid ${b.border}`, borderRadius: 8, padding: '4px 10px' }}>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 13, color: b.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggle */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#2A2A2A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Toggle</div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <button
                  onClick={() => setActiveToggle((v) => !v)}
                  style={{ width: 46, height: 26, borderRadius: 13, background: activeToggle ? '#C8FF00' : '#1A1A1A', border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 0.2s ease' }}
                >
                  <div style={{ position: 'absolute', top: 3, left: activeToggle ? 23 : 3, width: 20, height: 20, borderRadius: 10, background: activeToggle ? '#080808' : '#444', transition: 'left 0.2s ease' }} />
                </button>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: '#555' }}>
                  {activeToggle ? 'On' : 'Off'}
                </span>
                <div style={{ width: 46, height: 26, borderRadius: 13, background: '#1A1A1A', border: 'none', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', top: 3, left: 3, width: 20, height: 20, borderRadius: 10, background: '#444' }} />
                </div>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: '#333' }}>Off</span>
              </div>
            </div>

            {/* Timer display */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#2A2A2A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Timer Display</div>
              <div style={{ background: '#080808', border: '1px solid #111', borderRadius: 16, padding: '20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 56, color: '#C8FF00', letterSpacing: '-3px', lineHeight: 1, filter: 'drop-shadow(0 0 16px rgba(200,255,0,0.25))' }}>
                  28:43
                </div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#333', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  FOCUS MODE
                </div>
              </div>
            </div>

            {/* Card */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#2A2A2A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Cards</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: '#080808', border: '1px solid #111', borderRadius: 16, padding: '14px' }}>
                  <span style={{ fontSize: 22 }}>🔥</span>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 32, color: '#FFB800', marginTop: 4 }}>7</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#333', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>Current Streak</div>
                </div>
                <div style={{ background: '#080808', border: '1px solid #111', borderRadius: 16, padding: '14px' }}>
                  <span style={{ fontSize: 22 }}>⚡</span>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 32, color: '#BF7FFF', marginTop: 4 }}>1,250</div>
                  <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#333', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>Total XP</div>
                </div>
              </div>
            </div>

            {/* Duration chip */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#2A2A2A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Duration Chips</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['10m', '25m', '30m', '45m', '60m'].map((d, i) => (
                  <div key={d} style={{ height: 34, paddingInline: 14, borderRadius: 9, border: `1px solid ${i === 2 ? '#C8FF00' : '#1E1E1E'}`, background: i === 2 ? 'rgba(200,255,0,0.1)' : '#0A0A0A', color: i === 2 ? '#C8FF00' : '#444', fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#2A2A2A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Progress Bar (XP)</div>
              <div style={{ background: '#0A0A0A', border: '1px solid #111', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 14, color: '#BF7FFF' }}>LVL 5</span>
                <div style={{ flex: 1, height: 4, background: '#1A1A1A', borderRadius: 2 }}>
                  <div style={{ width: '62%', height: '100%', background: 'linear-gradient(90deg, #BF7FFF, #C8FF00)', borderRadius: 2 }} />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: '#333' }}>1,250 / 2,000</span>
              </div>
            </div>

            {/* Bottom nav */}
            <div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: '#2A2A2A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Bottom Navigation</div>
              <div style={{ background: '#080808', border: '1px solid #111', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ display: 'flex', borderTop: '1px solid #141414' }}>
                  {[
                    { label: 'Home', active: true },
                    { label: 'Focus', active: false },
                    { label: 'Stats', active: false },
                    { label: 'Settings', active: false },
                  ].map((item) => (
                    <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 8px', position: 'relative', color: item.active ? '#C8FF00' : '#2A2A2A' }}>
                      {item.active && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, background: '#C8FF00', borderRadius: 1 }} />}
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'currentColor', opacity: 0.3, marginBottom: 4 }} />
                      <span style={{ fontFamily: "'DM Sans'", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Motion */}
          <Section title="Motion & Animation">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: 'fade-up', desc: 'Screen entry · Content blocks', timing: '0.5s ease-out' },
                { name: 'scale-bounce', desc: 'Emoji hero · Modal appear', timing: '0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' },
                { name: 'pulse-glow', desc: 'Primary CTA · Session active', timing: '2.4s ease-in-out ∞' },
                { name: 'float', desc: 'Mascot · Hero emoji', timing: '3.5s ease-in-out ∞' },
                { name: 'animate-spin', desc: 'Loading spinner', timing: '1.2s linear ∞' },
              ].map((m) => (
                <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #0A0A0A', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: '#C8FF00', marginBottom: 2 }}>
                      .{m.name}
                    </div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: '#333' }}>{m.desc}</div>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: '#2A2A2A', textAlign: 'right', flexShrink: 0 }}>
                    {m.timing}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
