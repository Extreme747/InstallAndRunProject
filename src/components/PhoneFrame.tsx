import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  screenName?: string
}

export default function PhoneFrame({ children, screenName }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      {screenName && (
        <div
          style={{
            fontFamily: "'JetBrains Mono'",
            fontSize: 11,
            fontWeight: 500,
            color: '#444',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {screenName}
        </div>
      )}

      {/* Android phone shell — Pixel 8 proportions */}
      <div
        style={{
          width: 393,
          height: 851,
          borderRadius: 44,
          border: '1.5px solid #222',
          backgroundColor: '#080808',
          position: 'relative',
          overflow: 'hidden',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.04), 0 48px 140px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)',
          flexShrink: 0,
        }}
      >
        {/* Android status bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            zIndex: 50,
            pointerEvents: 'none',
          }}
        >
          {/* Time — left side */}
          <span
            style={{
              fontFamily: "'DM Sans'",
              fontSize: 14,
              fontWeight: 600,
              color: '#F5F5F5',
              letterSpacing: '-0.01em',
            }}
          >
            9:41
          </span>

          {/* Punch-hole camera — center */}
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#000',
              border: '1px solid #1A1A1A',
            }}
          />

          {/* Icons — right side */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {/* Signal */}
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
              <rect x="0" y="4" width="2.5" height="7" rx="0.8" fill="#F5F5F5" />
              <rect x="4" y="2.5" width="2.5" height="8.5" rx="0.8" fill="#F5F5F5" />
              <rect x="8" y="1" width="2.5" height="10" rx="0.8" fill="#F5F5F5" />
              <rect x="12" y="0" width="2.5" height="11" rx="0.8" fill="#F5F5F5" />
            </svg>
            {/* WiFi */}
            <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
              <circle cx="7" cy="9.5" r="1.5" fill="#F5F5F5" />
              <path d="M3.2 6.2A5.2 5.2 0 0 1 10.8 6.2" stroke="#F5F5F5" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M0.5 3.5A9.5 9.5 0 0 1 13.5 3.5" stroke="#F5F5F5" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {/* Battery */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <div
                style={{
                  width: 22,
                  height: 11,
                  borderRadius: 3,
                  border: '1.5px solid rgba(245,245,245,0.4)',
                  padding: '1.5px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div style={{ width: '78%', height: '100%', borderRadius: 1, backgroundColor: '#F5F5F5' }} />
              </div>
              <div style={{ width: 1.5, height: 4.5, borderRadius: 1, backgroundColor: 'rgba(245,245,245,0.35)' }} />
            </div>
          </div>
        </div>

        {/* Screen content area — starts below status bar */}
        <div
          className="scrollbar-hide"
          style={{
            position: 'absolute',
            top: 52,
            left: 0,
            right: 0,
            bottom: 0,
            overflowY: 'auto',
            backgroundColor: '#080808',
          }}
        >
          {children}
        </div>

        {/* Android gesture bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(245,245,245,0.18)',
            zIndex: 60,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}
