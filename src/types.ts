export type Screen =
  // Existing
  | 'design-system'
  | 'splash'
  | 'onboarding-1'
  | 'onboarding-2'
  | 'onboarding-3'
  | 'home'
  | 'focus'
  | 'focus-give-up-modal'
  | 'stats'
  | 'settings'
  | 'permission-usage'
  | 'permission-overlay'
  | 'permission-accessibility'
  | 'permissions-hub'
  | 'blocked-apps'
  | 'block-overlay'
  | 'friction-pause'
  | 'emergency-unlock'
  | 'empty-state'
  | 'loading'
  | 'success'
  | 'error'
  // Challenges & Missions
  | 'daily-challenges'
  | 'weekly-missions'
  | 'focus-challenges'
  // Achievements & XP
  | 'milestones'
  | 'xp-dashboard'
  | 'aura-progress'
  // Social & Squads
  | 'squad-dashboard'
  | 'squad-leaderboard'
  | 'squad-goals'
  | 'invite-friends'
  | 'streak-freeze'
  | 'share-cards'
  | 'share-achievement'
  // Customization
  | 'theme-store'
  | 'mascot-customization'
  | 'moai-skins'
  | 'sound-packs'
  // Premium
  | 'premium-upgrade'
  | 'subscription-management'
  | 'premium-locked'
  // Analytics
  | 'deep-analytics'
  | 'heatmap'
  | 'calendar-view'
  | 'focus-insights'
  | 'distraction-report'
  | 'session-history'
  // Reports & Notifications
  | 'notifications-settings'
  | 'widgets-preview'
  | 'daily-recap'
  | 'weekly-report'
  // Extended States
  | 'empty-challenges'
  | 'empty-squad'
  | 'loading-squad'
  | 'success-challenge'
  | 'success-milestone'
  | 'error-network'
  | 'privacy-policy'
  // Focus Routines / Schedules
  | 'schedules'
  // Daily App Quotas & Limits
  | 'app-limits'

export interface AppLimit {
  packageName: string
  appName: string
  dailyLimitMinutes: number
  strictMode?: boolean
}

export interface FocusRoutine {
  id: string
  name: string
  enabled: boolean
  startTime: string // "HH:mm" e.g. "23:00"
  endTime: string   // "HH:mm" e.g. "07:00"
  days: number[]    // [0, 1, 2, 3, 4, 5, 6] where 0 = Sun, 1 = Mon ...
  blockedApps?: string[] // optional custom apps, or defaults to store.blockedApps
  strictMode?: boolean
}

export interface ScreenEntry {
  id: Screen
  name: string
}

export interface ScreenGroup {
  label: string
  items: ScreenEntry[]
}

export const SCREEN_GROUPS: ScreenGroup[] = [
  {
    label: 'Foundation',
    items: [{ id: 'design-system', name: 'Design System' }],
  },
  {
    label: 'Onboarding',
    items: [
      { id: 'splash', name: 'Splash Screen' },
      { id: 'onboarding-1', name: 'Onboarding — 1' },
      { id: 'onboarding-2', name: 'Onboarding — 2' },
      { id: 'onboarding-3', name: 'Onboarding — 3' },
    ],
  },
  {
    label: 'Core',
    items: [
      { id: 'home', name: 'Home' },
      { id: 'focus', name: 'Focus Session' },
      { id: 'stats', name: 'Stats' },
      { id: 'settings', name: 'Settings' },
      { id: 'blocked-apps', name: 'Blocked Apps' },
      { id: 'schedules', name: 'Focus Schedules' },
      { id: 'app-limits', name: 'App Limits' },
    ],
  },
  {
    label: 'Permissions',
    items: [
      { id: 'permissions-hub', name: 'Permissions Hub' },
      { id: 'permission-usage', name: 'Usage Access' },
      { id: 'permission-overlay', name: 'Draw Over Apps' },
      { id: 'permission-accessibility', name: 'Accessibility' },
    ],
  },
  {
    label: 'Challenges',
    items: [
      { id: 'daily-challenges', name: 'Daily Challenges' },
      { id: 'weekly-missions', name: 'Weekly Missions' },
      { id: 'focus-challenges', name: 'Focus Challenges' },
    ],
  },
  {
    label: 'Achievements & XP',
    items: [
      { id: 'milestones', name: 'Milestones' },
      { id: 'xp-dashboard', name: 'XP & Aura Dashboard' },
      { id: 'aura-progress', name: 'Aura Progress' },
    ],
  },
  {
    label: 'Squads & Social',
    items: [
      { id: 'squad-dashboard', name: 'Squad Dashboard' },
      { id: 'squad-leaderboard', name: 'Squad Leaderboard' },
      { id: 'squad-goals', name: 'Squad Goals' },
      { id: 'invite-friends', name: 'Invite Friends' },
      { id: 'streak-freeze', name: 'Streak Freeze' },
      { id: 'share-cards', name: 'Share Cards' },
      { id: 'share-achievement', name: 'Share Achievement' },
    ],
  },
  {
    label: 'Customization',
    items: [
      { id: 'theme-store', name: 'Theme Store' },
      { id: 'mascot-customization', name: 'Mascot Customization' },
      { id: 'moai-skins', name: 'Moai Skins' },
      { id: 'sound-packs', name: 'Sound Packs' },
    ],
  },
  {
    label: 'Premium',
    items: [
      { id: 'premium-upgrade', name: 'Premium Upgrade' },
      { id: 'subscription-management', name: 'Subscription' },
      { id: 'premium-locked', name: 'Premium Locked' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { id: 'deep-analytics', name: 'Deep Analytics' },
      { id: 'heatmap', name: 'Heatmap' },
      { id: 'calendar-view', name: 'Calendar View' },
      { id: 'focus-insights', name: 'Focus Insights' },
      { id: 'distraction-report', name: 'Distraction Report' },
      { id: 'session-history', name: 'Session History' },
    ],
  },
  {
    label: 'Reports & Widgets',
    items: [
      { id: 'daily-recap', name: 'Daily Recap' },
      { id: 'weekly-report', name: 'Weekly Report' },
      { id: 'widgets-preview', name: 'Widgets Preview' },
      { id: 'notifications-settings', name: 'Notifications' },
    ],
  },
  {
    label: 'States',
    items: [
      { id: 'block-overlay', name: 'App Block Overlay' },
      { id: 'focus-give-up-modal', name: 'Focus Give Up Modal' },
      { id: 'friction-pause', name: 'Mindful Friction Pause' },
      { id: 'emergency-unlock', name: 'Emergency Unlock Protocol' },
      { id: 'empty-state', name: 'Empty — No Sessions' },
      { id: 'empty-challenges', name: 'Empty — Challenges' },
      { id: 'empty-squad', name: 'Empty — Squad' },
      { id: 'loading', name: 'Loading — Default' },
      { id: 'loading-squad', name: 'Loading — Squad' },
      { id: 'success', name: 'Success — Session' },
      { id: 'success-challenge', name: 'Success — Challenge' },
      { id: 'success-milestone', name: 'Success — Milestone' },
      { id: 'error', name: 'Error — Aborted' },
      { id: 'error-network', name: 'Error — Network' },
    ],
  },
  {
    label: 'Legal',
    items: [{ id: 'privacy-policy', name: 'Privacy Policy' }],
  },
]
