import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { FocusRoutine, AppLimit } from '../types'
import { 
  createSession, 
  syncUserState,
  registerUser,
  fetchSettings,
  updateSettings as apiUpdateSettings,
  fetchSquadData as apiFetchSquadData,
  fetchChallenges as apiFetchChallenges,
  joinSquad as apiJoinSquad,
  createSquad as apiCreateSquad,
  useStreakFreeze as apiUseStreakFreeze,
  updateChallengeProgress,
  sendHeartbeat,
  setFocusStatus
} from '../api'

export const DEFAULT_ROUTINES: FocusRoutine[] = [
  {
    id: 'routine-night',
    name: '🌙 Night Owl Lockdown',
    enabled: false,
    startTime: '23:00',
    endTime: '07:00',
    days: [0, 1, 2, 3, 4, 5, 6], // Every day
    strictMode: true,
  },
  {
    id: 'routine-study',
    name: '📚 Deep Study Hours',
    enabled: false,
    startTime: '14:00',
    endTime: '18:00',
    days: [1, 2, 3, 4, 5], // Mon to Fri
    strictMode: false,
  },
]

export const DEFAULT_APP_LIMITS: AppLimit[] = [
  {
    packageName: 'com.instagram.android',
    appName: 'Instagram',
    dailyLimitMinutes: 30,
    strictMode: false,
  },
  {
    packageName: 'com.google.android.youtube',
    appName: 'YouTube',
    dailyLimitMinutes: 45,
    strictMode: false,
  },
]

export function isRoutineActive(routine: FocusRoutine, now = new Date()): boolean {
  if (!routine || !routine.enabled) return false

  const currentDay = now.getDay() // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const [startH, startM] = (routine.startTime || '00:00').split(':').map(Number)
  const [endH, endM] = (routine.endTime || '00:00').split(':').map(Number)
  const startMinutes = (startH || 0) * 60 + (startM || 0)
  const endMinutes = (endH || 0) * 60 + (endM || 0)

  // Case 1: Same day routine (e.g. 14:00 to 18:00)
  if (startMinutes <= endMinutes) {
    if (!routine.days.includes(currentDay)) return false
    return currentMinutes >= startMinutes && currentMinutes < endMinutes
  }

  // Case 2: Crosses midnight (e.g. 23:00 to 07:00)
  const prevDay = (currentDay + 6) % 7
  if (routine.days.includes(currentDay) && currentMinutes >= startMinutes) {
    return true
  }
  if (routine.days.includes(prevDay) && currentMinutes < endMinutes) {
    return true
  }
  return false
}

// Safe UUID generator compatible with all Android WebView versions (including API < 33)
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID()
    } catch (e) {}
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Local calendar date string YYYY-MM-DD (immune to UTC timezone offsets)
export function getLocalDateKey(d: Date = new Date()): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Core Plan formula: XP required for Level N = 100 × N^1.5
export function computeLevel(totalXP: number): number {
  let level = 1
  while (100 * Math.pow(level, 1.5) <= totalXP) {
    level++
  }
  return level
}

// XP to reach next level
export function xpForLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.5))
}

export interface SessionRecord {
  id: string
  date: string
  durationMinutes: number
  completed: boolean
  mode: 'solo' | 'squad'
  attemptedApps: string[]
}

export interface AppState {
  userId: string
  blockedApps: string[]
  squadCode: string | null
  squadName: string | null
  squadMembers: any[]
  challenges: any[]
  claimedChallenges: string[]
  settings: {
    soundEffects: boolean
    achievementPopups: boolean
    pushNotifications: boolean
    hardcoreMode: boolean
    reminder: boolean
    streakRisk: boolean
    squadActivity: boolean
    challengeNew: boolean
    xpMilestone: boolean
    dailyRecap: boolean
    weeklyReport: boolean
    marketing: boolean
    roastLanguage: 'hinglish' | 'english'
    roastFrequency: 'savage' | 'balanced' | 'chill' | 'off'
    distractionRoasts: boolean
    idleRoasts: boolean
    complimentsEnabled: boolean
    blockInstagramReels?: boolean
    blockYoutubeShorts?: boolean
  }
  streakFreezes: number
  isInitialized: boolean

  currentStreak: number
  bestStreak: number
  totalXP: number
  level: number
  auraScore: number
  totalMinutesFocused: number
  distractionCount: number
  durationMinutes: number
  hasSeenOnboarding: boolean
  isSubscribed: boolean
  activeTheme: string
  activeSkin: string
  activeSoundPack: string
  sessions: SessionRecord[]

  completedSessions: number
  focusMode: 'solo' | 'squad'
  userName: string
  avatarEmoji: string
  permissions: {
    usage: boolean
    overlay: boolean
    accessibility: boolean
  }
  installedApps: Array<{ appName: string; packageName: string; isSystem?: boolean }>
  claimedSquadReferrals: string[]
  routines: FocusRoutine[]
  activeRoutineId: string | null
  appLimits: AppLimit[]
  todayUsage: Record<string, number>
  exhaustedLimits: string[]

  // Routines Actions
  addRoutine: (routine: Omit<FocusRoutine, 'id'>) => void
  updateRoutine: (id: string, updates: Partial<FocusRoutine>) => void
  deleteRoutine: (id: string) => void
  toggleRoutine: (id: string) => void
  checkActiveRoutines: () => boolean

  // App Limits Actions
  setAppLimit: (limit: AppLimit) => void
  removeAppLimit: (packageName: string) => void
  fetchTodayUsage: () => void
  checkAppLimitsExhaustion: () => void

  // Actions
  initUser: () => Promise<void>
  fetchInstalledApps: () => void
  setUserName: (name: string) => void
  setAvatarEmoji: (emoji: string) => void
  setRoastLanguage: (lang: 'hinglish' | 'english') => void
  setRoastFrequency: (freq: 'savage' | 'balanced' | 'chill' | 'off') => void
  setSelectiveFeedBlocking: (reels: boolean, shorts: boolean) => void
  updateSettings: (key: string, value: any) => void
  setBlockedApps: (apps: string[]) => void
  joinSquad: (code: string) => Promise<boolean>
  leaveSquad: () => void
  createSquad: (name: string) => Promise<string | null>
  fetchSquadData: () => Promise<void>
  fetchChallenges: () => Promise<void>
  useStreakFreeze: () => Promise<boolean>
  claimChallenge: (challengeId: string, xpReward: number) => void
  setPermissions: (perms: Partial<{ usage: boolean; overlay: boolean; accessibility: boolean }>) => void
  checkPermissions: () => void
  openPermission: (type: 'usage' | 'overlay' | 'accessibility' | 'details') => void
  openAppDetails: () => void
  setBlockingActive: (active: boolean, sessionEndTime?: number) => void
  sendFocusHeartbeat: (isFocusing: boolean, durationMinutes?: number) => void

  setDurationMinutes: (mins: number) => void
  setDuration: (mins: number) => void
  setFocusMode: (mode: 'solo' | 'squad') => void
  setHasSeenOnboarding: (seen: boolean) => void
  setIsSubscribed: (sub: boolean) => void
  addCompletedSession: (durationMinutes: number, mode?: 'solo' | 'squad', attemptedApps?: string[]) => void
  addFailedSession: (attemptedApp: string) => void
  recordBlockedAttempt: (attemptedApp: string) => void
  applyAuraPenalty: (amount: number) => void
  equipTheme: (themeId: string) => void
  equipSkin: (skinId: string) => void
  equipSoundPack: (soundId: string) => void
  resetData: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userId: '',
      blockedApps: [
        'com.instagram.android',
        'com.google.android.youtube',
        'com.snapchat.android',
        'com.twitter.android',
        'com.reddit.frontpage',
      ],
      squadCode: null,
      squadName: null,
      squadMembers: [],
      challenges: [],
      claimedChallenges: [],
      settings: {
        soundEffects: true,
        achievementPopups: true,
        pushNotifications: true,
        hardcoreMode: false,
        reminder: true,
        streakRisk: true,
        squadActivity: true,
        challengeNew: true,
        xpMilestone: true,
        dailyRecap: true,
        weeklyReport: true,
        marketing: false,
        roastLanguage: 'hinglish' as const,
        roastFrequency: 'savage' as const,
        distractionRoasts: true,
        idleRoasts: true,
        complimentsEnabled: true,
        blockInstagramReels: false,
        blockYoutubeShorts: false,
      },
      streakFreezes: 0,
      isInitialized: false,

      currentStreak: 0,
      bestStreak: 0,
      totalXP: 0,
      level: 1,
      auraScore: 100,
      totalMinutesFocused: 0,
      distractionCount: 0,
      durationMinutes: 25,
      hasSeenOnboarding: false,
      isSubscribed: false,
      activeTheme: 'default',
      activeSkin: 'moai',
      activeSoundPack: 'none',
      sessions: [],
      completedSessions: 0,
      focusMode: 'solo' as const,
      userName: 'Anonymous',
      avatarEmoji: '🗿',
      permissions: {
        usage: false,
        overlay: false,
        accessibility: false,
      },
      installedApps: [],
      claimedSquadReferrals: [],
      routines: DEFAULT_ROUTINES,
      activeRoutineId: null,
      appLimits: DEFAULT_APP_LIMITS,
      todayUsage: {},
      exhaustedLimits: [],

      fetchInstalledApps: () => {
        if (typeof window !== 'undefined') {
          const parseList = (raw: any) => {
            if (Array.isArray(raw)) return raw;
            if (typeof raw === 'string') {
              try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
              } catch (e) {}
            }
            return null;
          };

          const existing = parseList((window as any).__SCROLLNT_INSTALLED_APPS__);
          if (existing && existing.length > 0) {
            set({ installedApps: existing });
            return;
          }

          const handleAppsLoaded = () => {
            const list = parseList((window as any).__SCROLLNT_INSTALLED_APPS__);
            if (list) set({ installedApps: list });
            window.removeEventListener('installedAppsLoaded', handleAppsLoaded);
          };
          window.addEventListener('installedAppsLoaded', handleAppsLoaded, { once: true });

          (window as any).__onInstalledAppsLoaded = (data: any) => {
            const list = parseList(data);
            if (list) set({ installedApps: list });
          };

          if ((window as any).ReactNativeWebView?.postMessage) {
            (window as any).ReactNativeWebView.postMessage(JSON.stringify({ type: 'GET_INSTALLED_APPS' }));
          }
        }
      },

      setUserName: (name: string) => {
        const trimmed = name.trim() || 'Anonymous'
        set({ userName: trimmed })
        const state = get()
        if (state.userId) {
          syncUserState({
            id: state.userId,
            userId: state.userId,
            displayName: trimmed,
            userName: trimmed,
          }).catch(() => {})
        }
      },

      setAvatarEmoji: (emoji: string) => {
        set({ avatarEmoji: emoji })
        const state = get()
        if (state.userId) {
          syncUserState({
            id: state.userId,
            userId: state.userId,
            mascot: emoji,
          }).catch(() => {})
        }
      },

      setPermissions: (perms) =>
        set((state) => ({
          permissions: { ...state.permissions, ...perms },
        })),

      checkPermissions: () => {
        if (typeof window !== 'undefined') {
          if ((window as any).ReactNativeWebView?.postMessage) {
            (window as any).ReactNativeWebView.postMessage(JSON.stringify({ type: 'CHECK_PERMISSIONS' }));
          }
          const nativePerms = (window as any).__SCROLLNT_PERMISSIONS__;
          if (nativePerms) {
            set((state) => ({
              permissions: { ...state.permissions, ...nativePerms },
            }));
          }
        }
      },

      openPermission: (type: 'usage' | 'overlay' | 'accessibility' | 'details') => {
        if (typeof window !== 'undefined') {
          if ((window as any).ReactNativeWebView?.postMessage) {
            (window as any).ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'OPEN_PERMISSION', permission: type })
            );
          }
        }
      },

      openAppDetails: () => {
        if (typeof window !== 'undefined') {
          if ((window as any).ReactNativeWebView?.postMessage) {
            (window as any).ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'OPEN_PERMISSION', permission: 'details' })
            );
          }
        }
      },

      setBlockingActive: (active: boolean, sessionEndTime?: number) => {
        if (typeof window !== 'undefined') {
          if ((window as any).ReactNativeWebView?.postMessage) {
            (window as any).ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'SET_BLOCKING_ACTIVE', active, sessionEndTime: sessionEndTime ?? 0 })
            );
          }
        }
      },

      setBlockedApps: (apps: string[]) => {
        set({ blockedApps: apps })
        if (typeof window !== 'undefined') {
          if ((window as any).ReactNativeWebView?.postMessage) {
            (window as any).ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'SET_BLOCKED_APPS', apps })
            );
          }
        }
      },

      addRoutine: (routineData) => {
        const newRoutine: FocusRoutine = {
          ...routineData,
          id: 'routine-' + generateUUID(),
        }
        set((s) => ({ routines: [...(s.routines || []), newRoutine] }))
        get().checkActiveRoutines()
      },

      updateRoutine: (id, updates) => {
        set((s) => ({
          routines: (s.routines || []).map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }))
        get().checkActiveRoutines()
      },

      deleteRoutine: (id) => {
        set((s) => ({
          routines: (s.routines || []).filter((r) => r.id !== id),
        }))
        get().checkActiveRoutines()
      },

      toggleRoutine: (id) => {
        set((s) => ({
          routines: (s.routines || []).map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
        }))
        get().checkActiveRoutines()
      },

      checkActiveRoutines: () => {
        const state = get()
        const routines = state.routines || []
        const activeRoutine = routines.find((r) => isRoutineActive(r))

        if (activeRoutine) {
          if (state.activeRoutineId !== activeRoutine.id) {
            set({ activeRoutineId: activeRoutine.id })
            
            // Calculate target end timestamp for native service
            const [endH, endM] = (activeRoutine.endTime || '00:00').split(':').map(Number)
            const target = new Date()
            target.setHours(endH || 0, endM || 0, 0, 0)
            if (target.getTime() <= Date.now()) {
              target.setDate(target.getDate() + 1)
            }
            
            // Sync blocked apps if routine has specific apps, or use global blockedApps
            const appsToBlock = (activeRoutine.blockedApps && activeRoutine.blockedApps.length > 0)
              ? activeRoutine.blockedApps
              : state.blockedApps
            
            get().setBlockedApps(appsToBlock)
            get().setBlockingActive(true, target.getTime())
          }
          return true
        } else {
          if (state.activeRoutineId) {
            set({ activeRoutineId: null })
            
            // Check if there is an active manual focus session before unblocking
            let hasManualSession = false
            try {
              hasManualSession = Boolean(localStorage.getItem('@scrollnt_active_focus_session'))
            } catch (e) {}
            
            if (!hasManualSession) {
              get().setBlockingActive(false, 0)
              get().setBlockedApps(state.blockedApps)
            }
          }
          return false
        }
      },

      setAppLimit: (limit: AppLimit) => {
        set((s) => {
          const current = s.appLimits || []
          const existingIdx = current.findIndex((l) => l.packageName === limit.packageName)
          let updated: AppLimit[]
          if (existingIdx >= 0) {
            updated = [...current]
            updated[existingIdx] = limit
          } else {
            updated = [...current, limit]
          }
          return { appLimits: updated }
        })
        get().checkAppLimitsExhaustion()
      },

      removeAppLimit: (packageName: string) => {
        set((s) => ({
          appLimits: (s.appLimits || []).filter((l) => l.packageName !== packageName),
          exhaustedLimits: (s.exhaustedLimits || []).filter((p) => p !== packageName),
        }))
      },

      fetchTodayUsage: () => {
        if (typeof window !== 'undefined') {
          const current = (window as any).__SCROLLNT_TODAY_USAGE__
          if (current && typeof current === 'object') {
            set({ todayUsage: current })
            get().checkAppLimitsExhaustion()
          }
          if ((window as any).ReactNativeWebView?.postMessage) {
            (window as any).ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'GET_TODAY_USAGE' })
            );
          }
        }
      },

      checkAppLimitsExhaustion: () => {
        const state = get()
        const limits = state.appLimits || []
        const usage = state.todayUsage || {}
        const newlyExhausted: string[] = []

        limits.forEach((limit) => {
          const secondsUsed = usage[limit.packageName] || 0
          const minutesUsed = Math.floor(secondsUsed / 60)
          if (minutesUsed >= limit.dailyLimitMinutes) {
            newlyExhausted.push(limit.packageName)
          }
        })

        const previousExhausted = state.exhaustedLimits || []
        const hasChanged = newlyExhausted.length !== previousExhausted.length ||
          newlyExhausted.some((p) => !previousExhausted.includes(p))

        if (hasChanged) {
          set({ exhaustedLimits: newlyExhausted })

          // Merge exhausted apps into blocked apps
          const currentBlocked = state.blockedApps || []
          const mergedBlocked = Array.from(new Set([...currentBlocked, ...newlyExhausted]))
          if (mergedBlocked.length !== currentBlocked.length) {
            get().setBlockedApps(mergedBlocked)
          }

          // If a new app just reached its daily quota, dispatch heads-up notification
          const freshExhausted = newlyExhausted.filter((p) => !previousExhausted.includes(p))
          if (freshExhausted.length > 0 && typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
            freshExhausted.forEach((pkg) => {
              const lim = limits.find((l) => l.packageName === pkg)
              const appName = lim?.appName || 'App'
              const lang = state.settings?.roastLanguage || 'hinglish'
              const title = lang === 'english'
                ? `🗿 ${appName} Daily Limit Exhausted!`
                : `🗿 ${appName} Ka Daily Quota Khatam!`
              const body = lang === 'english'
                ? `You reached your ${lim?.dailyLimitMinutes || 30}m limit for today. Put the phone down!`
                : `Aaj ka ${lim?.dailyLimitMinutes || 30} min limit poora ho gaya. Ab ye app band rahega!`

              ;(window as any).ReactNativeWebView.postMessage(
                JSON.stringify({
                  type: 'SHOW_NOTIFICATION',
                  title,
                  body,
                  data: { packageName: pkg },
                })
              );
            })
          }
        }
      },

      initUser: async () => {
        const state = get()
        let uid = state.userId
        if (!uid) {
          uid = generateUUID()
          set({ userId: uid })
        }
        try {
          if (!state.isInitialized) {
            await registerUser(uid, state.userName)
          }
        } catch (e) {
          console.error('initUser registration error:', e)
        } finally {
          set({ isInitialized: true })
        }
        
        // Fetch remaining data asynchronously with safe error handling
        get().fetchSquadData().catch(() => {})
        get().fetchChallenges().catch(() => {})
        
        // Sync persisted blocked apps to native blocker on app launch
        const currentBlocked = get().blockedApps
        if (currentBlocked && currentBlocked.length > 0) {
          get().setBlockedApps(currentBlocked)
        }

        // Sync persisted roast language to native blocker on app launch
        const currentRoastLang = get().settings?.roastLanguage || 'hinglish'
        if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
          (window as any).ReactNativeWebView.postMessage(
            JSON.stringify({ type: 'SET_ROAST_LANGUAGE', lang: currentRoastLang })
          )
        }

        // Sync selective Reels & Shorts blocker on app launch
        const reelsBlocked = Boolean(get().settings?.blockInstagramReels)
        const shortsBlocked = Boolean(get().settings?.blockYoutubeShorts)
        if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
          (window as any).ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'SET_SELECTIVE_FEED_BLOCKING',
              reels: reelsBlocked,
              shorts: shortsBlocked,
            })
          )
        }
        
        // Fetch settings if available
        fetchSettings(uid).then(res => {
          if (res && res.settings) {
            set((s) => ({ settings: { ...s.settings, ...res.settings } }))
          }
        }).catch(() => {})

        // Setup background heartbeat to keep presence & stats live
        const sendPing = () => {
          const cur = get()
          if (cur.userId) {
            sendHeartbeat({
              userId: cur.userId,
              totalXP: cur.totalXP,
              currentStreak: cur.currentStreak,
              isSubscribed: cur.isSubscribed,
            }).catch(() => {})
          }
        }
        sendPing()
        if (typeof window !== 'undefined') {
          if ((window as any).__scrollnt_heartbeat_timer) {
            clearInterval((window as any).__scrollnt_heartbeat_timer)
          }
          (window as any).__scrollnt_heartbeat_timer = setInterval(sendPing, 25000)

          // Routine monitor: evaluate on launch and every 30 seconds
          get().checkActiveRoutines()
          if ((window as any).__scrollnt_routine_timer) {
            clearInterval((window as any).__scrollnt_routine_timer)
          }
          (window as any).__scrollnt_routine_timer = setInterval(() => {
            get().checkActiveRoutines()
          }, 30000)

          // App usage stats monitor: fetch on launch and listen for bridge updates
          get().fetchTodayUsage()
          window.addEventListener('todayUsageLoaded', (e: any) => {
            const detail = e.detail || (window as any).__SCROLLNT_TODAY_USAGE__
            if (detail && typeof detail === 'object') {
              set({ todayUsage: detail })
              get().checkAppLimitsExhaustion()
            }
          })
          ;(window as any).__onTodayUsageLoaded = (detail: any) => {
            if (detail && typeof detail === 'object') {
              set({ todayUsage: detail })
              get().checkAppLimitsExhaustion()
            }
          }

          window.addEventListener('appResumed', () => {
            get().checkActiveRoutines()
            get().fetchTodayUsage()
          })
        }
      },

      sendFocusHeartbeat: (isFocusing: boolean, durationMinutes?: number) => {
        const state = get()
        if (state.userId) {
          setFocusStatus(state.userId, isFocusing, state.squadCode || undefined, durationMinutes).catch(() => {})
        }
      },

      setRoastLanguage: (lang: 'hinglish' | 'english') => {
        set((state) => {
          const newSettings = { ...state.settings, roastLanguage: lang }
          if (state.userId) {
            apiUpdateSettings(state.userId, newSettings).catch(() => {})
          }
          return { settings: newSettings }
        })
        if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
          (window as any).ReactNativeWebView.postMessage(
            JSON.stringify({ type: 'SET_ROAST_LANGUAGE', lang })
          )
        }
      },

      setRoastFrequency: (freq: 'savage' | 'balanced' | 'chill' | 'off') => {
        set((state) => {
          const newSettings = { ...state.settings, roastFrequency: freq }
          if (state.userId) {
            apiUpdateSettings(state.userId, newSettings).catch(() => {})
          }
          return { settings: newSettings }
        })
      },

      setSelectiveFeedBlocking: (reels: boolean, shorts: boolean) => {
        set((state) => {
          const newSettings = {
            ...state.settings,
            blockInstagramReels: reels,
            blockYoutubeShorts: shorts,
          }
          if (state.userId) {
            apiUpdateSettings(state.userId, newSettings).catch(() => {})
          }
          return { settings: newSettings }
        })
        if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
          (window as any).ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'SET_SELECTIVE_FEED_BLOCKING',
              reels,
              shorts,
            })
          )
        }
      },

      updateSettings: (key: string, value: any) => {
        set((state) => {
          const newSettings = { ...state.settings, [key]: value }
          if (state.userId) {
            apiUpdateSettings(state.userId, newSettings).catch(() => {})
          }
          return { settings: newSettings }
        })
        if (key === 'roastLanguage' && typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
          (window as any).ReactNativeWebView.postMessage(
            JSON.stringify({ type: 'SET_ROAST_LANGUAGE', lang: value })
          )
        }
        if ((key === 'blockInstagramReels' || key === 'blockYoutubeShorts') && typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
          const currentSettings = get().settings
          ;(window as any).ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'SET_SELECTIVE_FEED_BLOCKING',
              reels: key === 'blockInstagramReels' ? Boolean(value) : Boolean(currentSettings?.blockInstagramReels),
              shorts: key === 'blockYoutubeShorts' ? Boolean(value) : Boolean(currentSettings?.blockYoutubeShorts),
            })
          )
        }
      },

      joinSquad: async (code: string) => {
        const cleanCode = (code || '').trim().toUpperCase()
        if (!cleanCode) return false
        const uid = get().userId
        if (!uid) return false

        try {
          const res = await apiJoinSquad(cleanCode, uid)

          if (res && !res.error) {
            const claimed = get().claimedSquadReferrals || []
            const alreadyClaimed = claimed.includes(cleanCode)

            let newXP = get().totalXP || 0
            let newLevel = get().level || 1

            // Only award the +200 XP referral bonus once per verified squad code!
            if (!alreadyClaimed) {
              const bonusXP = 200
              newXP += bonusXP
              newLevel = computeLevel(newXP)

              // Immediately sync +200 XP to backend
              syncUserState({
                userId: uid,
                totalXP: newXP,
                level: newLevel,
                currentStreak: get().currentStreak,
                isSubscribed: get().isSubscribed,
              }).catch(() => {})
            }

            const updatedClaimed = alreadyClaimed ? claimed : [...claimed, cleanCode]

            set({
              squadCode: cleanCode,
              squadName: res.name || `${cleanCode} Squad`,
              totalXP: newXP,
              level: newLevel,
              claimedSquadReferrals: updatedClaimed,
            })
            await get().fetchSquadData().catch(() => {})
            return true
          } else {
            return false
          }
        } catch (e) {
          console.error('joinSquad error:', e)
          return false
        }
      },

      leaveSquad: () => {
        set({
          squadCode: null,
          squadName: null,
          squadMembers: [],
        })
      },

      createSquad: async (name: string) => {
        const uid = get().userId
        if (!uid) return null
        try {
          const res = await apiCreateSquad(uid, name)
          const code = res?.code || res?.squadCode
          if (res && code && !res.error) {
            set({ squadCode: code, squadName: res.name })
            await get().fetchSquadData().catch(() => {})
            return code
          }
        } catch (e) {
          console.error('createSquad error:', e)
        }
        return null
      },

      fetchSquadData: async () => {
        const code = get().squadCode
        if (!code) return
        try {
          const res = await apiFetchSquadData(code)
          if (res && !res.error) {
            set({
              squadName: res.name || get().squadName,
              squadMembers: res.members || [],
            })
          }
        } catch (e) {
          console.error('fetchSquadData error:', e)
        }
      },

      fetchChallenges: async () => {
        try {
          const res = await apiFetchChallenges()
          const challengeList = Array.isArray(res) ? res : res?.challenges
          if (Array.isArray(challengeList)) {
            const claimed = get().claimedChallenges || []
            const merged = challengeList.map((c: any) => ({
              ...c,
              completed: claimed.includes(c.id) || Boolean(c.completed),
              done: claimed.includes(c.id) || Boolean(c.done),
            }))
            set({ challenges: merged })
          }
        } catch (e) {
          console.error('fetchChallenges error:', e)
        }
      },

      useStreakFreeze: async () => {
        const state = get()
        if (state.isSubscribed) {
          return true // Pro users have unlimited streak freezes
        }
        if (state.streakFreezes > 0) {
          const res = await apiUseStreakFreeze(state.userId)
          if (res && (res.success || res.id) && !res.error) {
            set((s) => ({ streakFreezes: s.streakFreezes - 1 }))
            return true
          }
        }
        return false
      },

      setDurationMinutes: (mins: number) => set({ durationMinutes: mins }),
      setDuration: (mins: number) => set({ durationMinutes: mins }),
      setFocusMode: (mode: 'solo' | 'squad') => set({ focusMode: mode }),
      setHasSeenOnboarding: (seen: boolean) => set({ hasSeenOnboarding: seen }),
      setIsSubscribed: (sub: boolean) => set({ isSubscribed: sub }),

      claimChallenge: (challengeId: string, xpReward: number) => {
        const state = get()
        const claimed = state.claimedChallenges || []
        if (claimed.includes(challengeId)) {
          return // Already claimed — prevent double claiming
        }
        const updatedClaimed = [...claimed, challengeId]
        const newTotalXP = state.totalXP + xpReward
        const newLevel = computeLevel(newTotalXP)
        const existing = state.challenges.find(c => c.id === challengeId)
        const newChallenges = existing
          ? state.challenges.map(c => 
              c.id === challengeId ? { ...c, completed: true, done: true } : c
            )
          : [...state.challenges, { id: challengeId, completed: true, done: true }]
        set({ totalXP: newTotalXP, level: newLevel, challenges: newChallenges, claimedChallenges: updatedClaimed })
        // Mark challenge as completed on backend
        updateChallengeProgress(challengeId, state.userId, 100, true).catch(() => {})
        syncUserState({ userId: state.userId, totalXP: newTotalXP, level: newLevel }).catch(() => {})
      },

      addCompletedSession: (durationMinutes: number, mode?: 'solo' | 'squad') => {
        const state = get()
        const effectiveMode = mode || state.focusMode || 'solo'
        
        // Only increment streak once per calendar day (using local date)
        const todayKey = getLocalDateKey()
        const alreadyFocusedToday = state.sessions.some(
          (s: SessionRecord) => s.completed && getLocalDateKey(new Date(s.date)) === todayKey
        )
        
        // Check if user missed days (streak decay & freeze consumption)
        let baseStreak = state.currentStreak
        let newFreezes = state.streakFreezes
        if (!alreadyFocusedToday && state.sessions.length > 0) {
          const lastCompleted = state.sessions.find((s: SessionRecord) => s.completed)
          if (lastCompleted) {
            const lastDate = new Date(lastCompleted.date)
            lastDate.setHours(0, 0, 0, 0)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const diffDays = Math.round((today.getTime() - lastDate.getTime()) / 86400000)
            if (diffDays > 1) {
              const missedDays = diffDays - 1
              if (state.isSubscribed) {
                // Pro users have unlimited streak immunity
              } else if (state.streakFreezes >= missedDays) {
                // Consume 1 freeze per missed day
                newFreezes = state.streakFreezes - missedDays
                for (let i = 0; i < missedDays; i++) {
                  apiUseStreakFreeze(state.userId).catch(() => {})
                }
              } else {
                // Not enough streak freezes to protect all missed days
                baseStreak = 0
                newFreezes = 0
              }
            }
          }
        }
        
        const newStreak = alreadyFocusedToday ? baseStreak : baseStreak + 1
        const newBestStreak = Math.max(state.bestStreak, newStreak)
        // Core Plan: XP = Minutes × 10 × (1 + 0.1 × StreakDays), 2x boost if Pro
        const baseXP = Math.round(durationMinutes * 10 * (1 + 0.1 * Math.min(newStreak, 30)))
        const xpEarned = state.isSubscribed ? baseXP * 2 : baseXP
        const newTotalXP = state.totalXP + xpEarned
        // Core Plan: Level N where 100 × N^1.5 ≤ totalXP
        const newLevel = computeLevel(newTotalXP)
        const newTotalMinutes = state.totalMinutesFocused + durationMinutes
        const newAura = Math.min(1000, state.auraScore + 25)

        const newSession: SessionRecord = {
          id: String(Date.now()),
          date: new Date().toISOString(),
          durationMinutes,
          completed: true,
          mode: effectiveMode,
          attemptedApps: [],
        }

        set({
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          streakFreezes: newFreezes,
          totalXP: newTotalXP,
          level: newLevel,
          auraScore: newAura,
          totalMinutesFocused: newTotalMinutes,
          completedSessions: state.completedSessions + 1,
          sessions: [newSession, ...state.sessions],
        })

        // Sync with live Railway backend API
        createSession({
          ...newSession,
          userId: state.userId,
          xpEarned,
          auraChange: 25,
        }).catch(() => {})
        syncUserState({
          userId: state.userId,
          streak: newStreak,
          totalXP: newTotalXP,
          level: newLevel,
          auraScore: newAura,
          totalMinutes: newTotalMinutes,
        }).catch(() => {})
      },

      addFailedSession: (attemptedApp: string) => {
        const state = get()
        const isActualApp = Boolean(attemptedApp && attemptedApp !== 'Focus Session' && attemptedApp !== 'App')
        const newDistractions = isActualApp ? state.distractionCount + 1 : state.distractionCount
        // Core Plan: Penalty = 50% Aura deduction
        const auraPenalty = Math.floor(state.auraScore * 0.5)
        const newAura = Math.max(0, state.auraScore - auraPenalty)

        // Check if user already completed a successful session today
        const todayKey = getLocalDateKey()
        const alreadyFocusedToday = state.sessions.some(
          (s: SessionRecord) => s.completed && getLocalDateKey(new Date(s.date)) === todayKey
        )

        // Streak Freeze protection: Pro gets unlimited, Free consumes freeze
        let newStreak = 0
        let newFreezes = state.streakFreezes
        if (alreadyFocusedToday) {
          // If session was completed today, streak is already secured for today
          newStreak = state.currentStreak
        } else if (state.isSubscribed) {
          newStreak = state.currentStreak // Unlimited protection for Pro
        } else if (state.streakFreezes > 0) {
          newStreak = state.currentStreak
          newFreezes = state.streakFreezes - 1
          apiUseStreakFreeze(state.userId).catch(() => {})
        }

        const newSession: SessionRecord = {
          id: String(Date.now()),
          date: new Date().toISOString(),
          durationMinutes: 0,
          completed: false,
          mode: 'solo',
          attemptedApps: isActualApp ? [attemptedApp] : [],
        }

        set({
          currentStreak: newStreak,
          streakFreezes: newFreezes,
          distractionCount: newDistractions,
          auraScore: newAura,
          sessions: [newSession, ...state.sessions],
        })

        // Sync with live Railway backend API
        createSession({
          ...newSession,
          userId: state.userId,
          xpEarned: 0,
          auraChange: -auraPenalty,
        }).catch(() => {})
        syncUserState({
          userId: state.userId,
          streak: newStreak,
          distractionCount: newDistractions,
          auraScore: newAura,
        }).catch(() => {})
      },

      recordBlockedAttempt: (attemptedApp: string) => {
        const state = get()
        if (!attemptedApp || attemptedApp === 'Focus Session') return
        // H1 FIX: Only increment distraction counter, do NOT create fake session records
        set({
          distractionCount: state.distractionCount + 1,
        })
      },

      applyAuraPenalty: (amount: number) => {
        const state = get()
        const safeAmount = Math.max(0, Math.round(amount))
        const newAura = Math.max(0, state.auraScore - safeAmount)
        set({ auraScore: newAura })
        syncUserState({
          userId: state.userId,
          auraScore: newAura,
        }).catch(() => {})
      },

      equipTheme: (themeId: string) => set({ activeTheme: themeId }),
      equipSkin: (skinId: string) => set({ activeSkin: skinId }),
      equipSoundPack: (soundId: string) => set({ activeSoundPack: soundId }),

      resetData: () => {
        const newUid = generateUUID()
        set({
          currentStreak: 0,
          bestStreak: 0,
          totalXP: 0,
          level: 1,
          auraScore: 100,
          totalMinutesFocused: 0,
          distractionCount: 0,
          durationMinutes: 25,
          hasSeenOnboarding: false,
          isSubscribed: false,
          activeTheme: 'default',
          activeSkin: 'moai',
          activeSoundPack: 'none',
          sessions: [],
          completedSessions: 0,
          focusMode: 'solo' as const,
          userId: newUid,
          blockedApps: [],
          squadCode: null,
          squadName: null,
          squadMembers: [],
          challenges: [],
          claimedChallenges: [],
          claimedSquadReferrals: [],
          userName: 'Anonymous',
          avatarEmoji: '🗿',
          settings: {
            soundEffects: true,
            achievementPopups: true,
            pushNotifications: true,
            hardcoreMode: false,
            reminder: true,
            streakRisk: true,
            squadActivity: true,
            challengeNew: true,
            xpMilestone: true,
            dailyRecap: true,
            weeklyReport: true,
            marketing: false,
            roastLanguage: 'hinglish' as const,
            roastFrequency: 'savage' as const,
            distractionRoasts: true,
            idleRoasts: true,
            complimentsEnabled: true,
          },
          streakFreezes: 0,
          isInitialized: false,
          permissions: {
            usage: false,
            overlay: false,
            accessibility: false,
          },
          routines: DEFAULT_ROUTINES,
          activeRoutineId: null,
          appLimits: DEFAULT_APP_LIMITS,
          todayUsage: {},
          exhaustedLimits: [],
        });
        registerUser(newUid, 'Anonymous').catch(() => {});
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('@scrollnt_play_entitlements');
            localStorage.removeItem('@scrollnt_active_focus_session');
          } catch (e) {}
          if ((window as any).ReactNativeWebView?.postMessage) {
            (window as any).ReactNativeWebView.postMessage(JSON.stringify({ type: 'SET_BLOCKED_APPS', apps: [] }));
            (window as any).ReactNativeWebView.postMessage(JSON.stringify({ type: 'SET_BLOCKING_ACTIVE', active: false, sessionEndTime: 0 }));
            (window as any).ReactNativeWebView.postMessage(JSON.stringify({ type: 'SET_KEEP_SCREEN_ON', enabled: false }));
          }
        }
      },
    }),
    {
      name: 'scrollnt-app-storage',
      storage: createJSONStorage(() => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('__storage_test__', '1')
            window.localStorage.removeItem('__storage_test__')
            return window.localStorage
          }
        } catch (e) {}
        try {
          if (typeof window !== 'undefined' && window.sessionStorage) {
            return window.sessionStorage
          }
        } catch (e) {}
        const memoryStorage: Storage = {
          length: 0,
          clear: () => {},
          getItem: () => null,
          key: () => null,
          removeItem: () => {},
          setItem: () => {},
        }
        return memoryStorage
      }),
    }
  )
)
