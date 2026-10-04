# 🗿 Scrolln't — Frontend Screens & Design System

> **The Savage Dopamine Detox & Focus App for Android**  
> Pure React 19 + TypeScript + Vite + Tailwind CSS + Zustand. Ready for Figma import, AI agents, and browser customization.

---

## 🚀 Quick Start (Preview in Browser)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Visit `http://localhost:8443` (or the port printed in your terminal).

---

## 🎨 Design System & Theme Tokens

- **Background**: Pitch Black (`#080808` / `#0D0D11`)
- **Accent**: Cyber Neon Lime (`#C8FF00`)
- **Card Surfaces**: Deep Charcoal (`#121217` / `#16161D`)
- **Borders**: Subtly glowing dark lines (`rgba(255,255,255,0.08)` / `rgba(200,255,0,0.2)`)
- **Typography**:
  - Headers & Numbers: `'Barlow Condensed'` (Bold, Condensed, Cyberpunk)
  - Body & Microcopy: `'DM Sans'` (Clean, Modern, Legible)
- **Design System Screen**: Switch to `'design-system'` in `src/App.tsx` or run `npm run dev` to inspect all design components, buttons, inputs, pills, and badges interactively.

---

## 📱 Complete Screens Directory (`src/screens/`)

### 1. Core Focus & Interception
| Screen File | Description |
|---|---|
| `HomeScreen.tsx` | Main dashboard, duration selector (15–120m), solo/squad mode, 1-tap lock-in |
| `FocusScreen.tsx` | Realtime countdown timer, motivational roasts, give-up confirmation, audio controls |
| `BlockedAppsScreen.tsx` | App shield list, search filter, category tabs, **Selective Reels & Shorts Blocker** |
| `BlockOverlayScreen.tsx` | Interception overlay screen with savage Moai roasts and exit barriers |

### 2. Auto-Schedules & Daily Quotas (Pillar 1)
| Screen File | Description |
|---|---|
| `SchedulesScreen.tsx` | Scheduled focus routines, 7-day repeat selector, cross-midnight lockdown |
| `AppLimitsScreen.tsx` | Daily app time quotas (15m, 30m, 45m, 60m), real-time usage meters |

### 3. Social & Gamification
| Screen File | Description |
|---|---|
| `SocialScreens.tsx` | Squad dashboard, squad leaderboards, friend invites, streak freeze store |
| `ChallengesScreen.tsx` | Daily quests, weekly missions, and focus milestone claiming |
| `AchievementsScreen.tsx` | Milestones badges, XP levels, and Aura progress gauge |

### 4. Customization & Pro
| Screen File | Description |
|---|---|
| `CustomizationScreens.tsx` | Cyberpunk theme store, Moai mascot skins, sound packs |
| `PremiumScreens.tsx` | Scrolln't Pro paywall, subscription tier comparison, restore purchase |

### 5. Deep Analytics & Reports
| Screen File | Description |
|---|---|
| `StatsScreen.tsx` | High-level metrics, current streak, focus time history |
| `AnalyticsScreens.tsx` | 52-week GitHub-style heatmap, calendar breakdown, distraction reports |
| `ReportScreens.tsx` | Daily recap card, weekly letter-grade scorecard, PDF export |

### 6. Onboarding & States
| Screen File | Description |
|---|---|
| `DesignSystemScreen.tsx` | Interactive UI component library & Figma tokens explorer |
| `OnboardingScreen.tsx` | 3-step setup carousel, avatar selection, name input |
| `PermissionScreen.tsx` | Step-by-step prominent disclosure for Usage, Overlay & Accessibility |
| `StateScreens.tsx` | Success celebratory screen, session abort error screen |
| `ExtendedStateScreens.tsx` | Empty squad, empty challenges, network error states |
| `SplashScreen.tsx` | Neon glowing Moai app launch animation |
| `PrivacyPolicyScreen.tsx` | In-app Play Store privacy policy documentation |

---

## 🛠️ Architecture

- `src/App.tsx`: Main web router with state-driven navigation across all 22+ screens.
- `src/store/useAppStore.ts`: Global Zustand state management with local persistence.
- `src/utils/theme.ts`: Multi-theme engine (Cyberpunk Default, Blood Moon, Hyper Violet, Matrix, etc.).
- `src/components/Icons.tsx`: Complete vector SVG cyberpunk icon library.
- `src/data/moaiRoasts.ts`: Savage bilingual roast dialogue database (Hinglish & English).

---

## 🤝 For Figma & Design AI Agents

All tokens are defined in:
- `figma-tokens.json`
- `.figma/make/site.json`
- `src/index.css`
- `src/utils/theme.ts`

Feel free to customize, create new screen variations, or link Figma design frames directly!
