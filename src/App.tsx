import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Screen } from './types'
import { useAppStore } from './store/useAppStore'
import { getThemeColors } from './utils/theme'
import SplashScreen from './screens/SplashScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import HomeScreen from './screens/HomeScreen'
import FocusScreen from './screens/FocusScreen'
import StatsScreen from './screens/StatsScreen'
import SettingsScreen from './screens/SettingsScreen'
import PermissionScreen, { PermissionsHubScreen } from './screens/PermissionScreen'
import BlockedAppsScreen from './screens/BlockedAppsScreen'
import BlockOverlayScreen from './screens/BlockOverlayScreen'
import DesignSystemScreen from './screens/DesignSystemScreen'
import {
  EmptyStateScreen,
  LoadingScreen,
  SuccessScreen,
  ErrorScreen,
} from './screens/StateScreens'
import {
  DailyChallengesScreen,
  WeeklyMissionsScreen,
  FocusChallengesScreen,
} from './screens/ChallengesScreen'
import {
  MilestonesScreen,
  XpDashboardScreen,
  AuraProgressScreen,
} from './screens/AchievementsScreen'
import {
  SquadDashboardScreen,
  SquadLeaderboardScreen,
  SquadGoalsScreen,
  InviteFriendsScreen,
  StreakFreezeScreen,
  ShareCardsScreen,
  ShareAchievementScreen,
} from './screens/SocialScreens'
import {
  ThemeStoreScreen,
  MascotCustomizationScreen,
  MoaiSkinsScreen,
  SoundPacksScreen,
} from './screens/CustomizationScreens'
import {
  PremiumUpgradeScreen,
  SubscriptionManagementScreen,
  PremiumLockedScreen,
} from './screens/PremiumScreens'
import {
  DeepAnalyticsScreen,
  HeatmapScreen,
  CalendarViewScreen,
  FocusInsightsScreen,
  DistractionReportScreen,
  SessionHistoryScreen,
} from './screens/AnalyticsScreens'
import {
  DailyRecapScreen,
  WeeklyReportScreen,
  NotificationsSettingsScreen,
} from './screens/ReportScreens'
import {
  EmptyChallengesScreen,
  EmptySquadScreen,
  LoadingSquadScreen,
  SuccessChallengeScreen,
  SuccessMilestoneScreen,
  ErrorNetworkScreen,
} from './screens/ExtendedStateScreens'
import { stopFocusRoastInterval } from './utils/roastNotifier'
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen'
import SchedulesScreen from './screens/SchedulesScreen'
import AppLimitsScreen from './screens/AppLimitsScreen'
import ScreenNavigator from './components/ScreenNavigator'
import FrictionPauseScreen from './screens/FrictionPauseScreen'
import EmergencyUnlockScreen from './screens/EmergencyUnlockScreen'
import WidgetsPreviewScreen from './screens/WidgetsPreviewScreen'
import { GiveUpModalPreviewScreen } from './components/GiveUpConfirmationModal'

function checkActiveFocusSession(navigate: (s: Screen) => void, hasSeenOnboarding: boolean) {
  if (!hasSeenOnboarding) {
    navigate('onboarding-1')
    return
  }
  try {
    const savedFocusRaw = localStorage.getItem('@scrollnt_active_focus_session')
    if (savedFocusRaw) {
      const s = JSON.parse(savedFocusRaw)
      if (s.targetEndTime) {
        if (Date.now() >= s.targetEndTime) {
          localStorage.removeItem('@scrollnt_active_focus_session')
          useAppStore.getState().setBlockingActive(false, 0)
          useAppStore.getState().sendFocusHeartbeat(false)
          try {
            stopFocusRoastInterval()
            if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
              (window as any).ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'SET_KEEP_SCREEN_ON', enabled: false })
              )
            }
          } catch (e) {}
          useAppStore.getState().addCompletedSession(s.durationMinutes || 25)
          navigate('success')
          return
        } else {
          navigate('focus')
          return
        }
      }
    }
  } catch (e) {}
  navigate('home')
}

function renderScreen(
  screen: Screen,
  navigate: (s: Screen) => void,
  hasSeenOnboarding: boolean,
  frictionAppName: string,
) {
  switch (screen) {
    case 'splash':
      return <SplashScreen onNext={() => checkActiveFocusSession(navigate, hasSeenOnboarding)} />
    case 'onboarding-1':
      return <OnboardingScreen slide={1} onNext={() => navigate('onboarding-2')} onSkip={() => navigate('onboarding-3')} />
    case 'onboarding-2':
      return <OnboardingScreen slide={2} onNext={() => navigate('onboarding-3')} onSkip={() => navigate('onboarding-3')} />
    case 'onboarding-3':
      return <OnboardingScreen slide={3} onNext={() => navigate('permissions-hub')} />
    case 'permissions-hub':
      return <PermissionsHubScreen onNavigate={navigate} />
    case 'blocked-apps':
      return <BlockedAppsScreen onNavigate={navigate} />
    case 'home':
      return <HomeScreen onNavigate={navigate} />
    case 'focus':
      return <FocusScreen onNavigate={navigate} />
    case 'focus-give-up-modal':
      return <GiveUpModalPreviewScreen onNavigate={navigate} />
    case 'stats':
      return <StatsScreen onNavigate={navigate} />
    case 'settings':
      return <SettingsScreen onNavigate={navigate} />
    case 'permission-usage':
      return <PermissionScreen type="usage" onNavigate={navigate} />
    case 'permission-overlay':
      return <PermissionScreen type="overlay" onNavigate={navigate} />
    case 'permission-accessibility':
      return <PermissionScreen type="accessibility" onNavigate={navigate} />
    case 'block-overlay':
      return <BlockOverlayScreen onNavigate={navigate} appName={(useAppStore.getState().blockedApps ?? [])[0] ?? 'App'} />
    case 'friction-pause':
      return <FrictionPauseScreen onNavigate={navigate} appName={frictionAppName} />
    case 'emergency-unlock':
      return <EmergencyUnlockScreen onNavigate={navigate} />
    case 'empty-state':
      return <EmptyStateScreen onNavigate={navigate} />
    case 'loading':
      return <LoadingScreen />
    case 'success':
      return <SuccessScreen onNavigate={navigate} />
    case 'error':
      return <ErrorScreen onNavigate={navigate} />
    // Challenges
    case 'daily-challenges':
      return <DailyChallengesScreen onNavigate={navigate} />
    case 'weekly-missions':
      return <WeeklyMissionsScreen onNavigate={navigate} />
    case 'focus-challenges':
      return <FocusChallengesScreen onNavigate={navigate} />
    // Achievements & XP
    case 'milestones':
      return <MilestonesScreen onNavigate={navigate} />
    case 'xp-dashboard':
      return <XpDashboardScreen onNavigate={navigate} />
    case 'aura-progress':
      return <AuraProgressScreen onNavigate={navigate} />
    // Squads & Social
    case 'squad-dashboard':
      return <SquadDashboardScreen onNavigate={navigate} />
    case 'squad-leaderboard':
      return <SquadLeaderboardScreen onNavigate={navigate} />
    case 'squad-goals':
      return <SquadGoalsScreen onNavigate={navigate} />
    case 'invite-friends':
      return <InviteFriendsScreen onNavigate={navigate} />
    case 'streak-freeze':
      return <StreakFreezeScreen onNavigate={navigate} />
    case 'share-cards':
      return <ShareCardsScreen onNavigate={navigate} />
    case 'share-achievement':
      return <ShareAchievementScreen onNavigate={navigate} />
    // Customization
    case 'theme-store':
      return <ThemeStoreScreen onNavigate={navigate} />
    case 'mascot-customization':
      return <MascotCustomizationScreen onNavigate={navigate} />
    case 'moai-skins':
      return <MoaiSkinsScreen onNavigate={navigate} />
    case 'sound-packs':
      return <SoundPacksScreen onNavigate={navigate} />
    // Premium
    case 'premium-upgrade':
      return <PremiumUpgradeScreen onNavigate={navigate} />
    case 'subscription-management':
      return <SubscriptionManagementScreen onNavigate={navigate} />
    case 'premium-locked':
      return <PremiumLockedScreen onNavigate={navigate} />
    // Analytics
    case 'deep-analytics':
      return <DeepAnalyticsScreen onNavigate={navigate} />
    case 'heatmap':
      return <HeatmapScreen onNavigate={navigate} />
    case 'calendar-view':
      return <CalendarViewScreen onNavigate={navigate} />
    case 'focus-insights':
      return <FocusInsightsScreen onNavigate={navigate} />
    case 'distraction-report':
      return <DistractionReportScreen onNavigate={navigate} />
    case 'session-history':
      return <SessionHistoryScreen onNavigate={navigate} />
    // Reports & Widgets
    case 'daily-recap':
      return <DailyRecapScreen onNavigate={navigate} />
    case 'weekly-report':
      return <WeeklyReportScreen onNavigate={navigate} />
    case 'widgets-preview':
      return <WidgetsPreviewScreen onNavigate={navigate} />
    case 'notifications-settings':
      return <NotificationsSettingsScreen onNavigate={navigate} />
    // Extended States
    case 'empty-challenges':
      return <EmptyChallengesScreen onNavigate={navigate} />
    case 'empty-squad':
      return <EmptySquadScreen onNavigate={navigate} />
    case 'loading-squad':
      return <LoadingSquadScreen onNavigate={navigate} />
    case 'success-challenge':
      return <SuccessChallengeScreen onNavigate={navigate} />
    case 'success-milestone':
      return <SuccessMilestoneScreen onNavigate={navigate} />
    case 'error-network':
      return <ErrorNetworkScreen onNavigate={navigate} />
    case 'privacy-policy':
      return <PrivacyPolicyScreen onNavigate={navigate} />
    case 'schedules':
      return <SchedulesScreen onNavigate={navigate} />
    case 'app-limits':
      return <AppLimitsScreen onNavigate={navigate} />
    case 'design-system':
      return <DesignSystemScreen />
    default:
      return <HomeScreen onNavigate={navigate} />
  }
}

export default function App() {
  const hasSeenOnboarding = useAppStore((s) => s.hasSeenOnboarding)
  const activeTheme = useAppStore((s) => s.activeTheme)
  const [historyStack, setHistoryStack] = useState<Screen[]>(['splash'])
  const [frictionAppName, setFrictionAppName] = useState('com.instagram.android')
  const currentScreen = historyStack[historyStack.length - 1]

  // ─── Inject CSS custom properties for active theme ─────────────────────────
  useEffect(() => {
    const t = getThemeColors(activeTheme)
    const root = document.documentElement
    root.style.setProperty('--theme-bg', t.bg)
    root.style.setProperty('--theme-accent', t.accent)
    root.style.setProperty('--theme-accent-rgb', t.accentRgb)
  }, [activeTheme])

  useEffect(() => {
    // Register user on backend on first mount and check initial permissions
    useAppStore.getState().initUser()
    useAppStore.getState().checkPermissions()

    const handlePermissionsUpdated = (e: any) => {
      const perms = e?.detail || (window as any).__SCROLLNT_PERMISSIONS__
      if (perms) {
        useAppStore.getState().setPermissions(perms)
      }
    }

    const handleFocus = () => {
      useAppStore.getState().checkPermissions()
    }

    ;(window as any).__onPermissionsUpdated = (perms: any) => {
      if (perms) {
        useAppStore.getState().setPermissions(perms)
      }
    }

    window.addEventListener('permissionsUpdated', handlePermissionsUpdated)
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleFocus)

    return () => {
      window.removeEventListener('permissionsUpdated', handlePermissionsUpdated)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleFocus)
      delete (window as any).__onPermissionsUpdated
    }
  }, [])

  useEffect(() => {
    // Initial state to allow popping
    window.history.replaceState({ idx: 0 }, '')
    ;(window as any).__currentScreen = currentScreen;

    const popHistory = () => {
      setHistoryStack((prev) => {
        const last = prev[prev.length - 1];
        if (last === 'focus') {
          // If in focus session, trigger confirmation rather than silent abandon
          window.dispatchEvent(new CustomEvent('focusBackAttempt'));
          return prev;
        }
        if (prev.length > 1) {
          const next = prev.slice(0, -1);
          ;(window as any).__currentScreen = next[next.length - 1];
          return next;
        }
        if (last === 'home') {
          if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
            (window as any).ReactNativeWebView.postMessage(JSON.stringify({ type: 'EXIT_APP' }));
          }
        } else if (last && last !== 'splash' && last !== 'onboarding-1') {
          ;(window as any).__currentScreen = 'home';
          return ['home']
        }
        return prev
      })
    }

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault()
      popHistory()
    }

    ;(window as any).__handleBack = popHistory
    window.addEventListener('popstate', handlePopState)
    return () => {
      delete (window as any).__handleBack
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const navigate = (screen: Screen) => {
    if (screen === 'home') {
      window.history.replaceState({ idx: 0 }, '')
      setHistoryStack(['home'])
      ;(window as any).__currentScreen = 'home'
      return
    }
    window.history.pushState({ idx: historyStack.length }, '')
    setHistoryStack((prev) => [...prev, screen])
    ;(window as any).__currentScreen = screen
  }

  useEffect(() => {
    const openNativeScreen = (screen: Screen) => {
      window.history.pushState({ idx: Date.now() }, '')
      setHistoryStack((previous) =>
        previous[previous.length - 1] === screen ? previous : [...previous, screen],
      )
      ;(window as any).__currentScreen = screen
    }

    const showFrictionPause = (payload: unknown) => {
      const detail =
        typeof payload === 'string'
          ? { packageName: payload }
          : ((payload as { detail?: { packageName?: string; appName?: string } })?.detail ||
              (payload as { packageName?: string; appName?: string }))
      const attemptedApp = detail?.packageName || detail?.appName || 'com.instagram.android'
      setFrictionAppName(attemptedApp)
      openNativeScreen('friction-pause')
    }

    const handleFrictionEvent = (event: Event) => {
      showFrictionPause(event as CustomEvent)
    }

    const showEmergencyUnlock = () => {
      openNativeScreen('emergency-unlock')
    }

    const handleEmergencyEvent = () => {
      showEmergencyUnlock()
    }

    const startFromWidget = (payload: unknown) => {
      const detail =
        (payload as { detail?: { durationMinutes?: number } })?.detail ||
        (payload as { durationMinutes?: number })
      if (typeof detail?.durationMinutes === 'number') {
        useAppStore.getState().setDurationMinutes(detail.durationMinutes)
      }
      const state = useAppStore.getState()
      if (!state.hasSeenOnboarding) {
        openNativeScreen('onboarding-1')
        return
      }
      openNativeScreen(state.blockedApps?.length ? 'focus' : 'blocked-apps')
    }

    const handleWidgetEvent = (event: Event) => {
      startFromWidget(event as CustomEvent)
    }

    ;(window as any).__onFrictionAppDetected = showFrictionPause
    ;(window as any).__onEmergencyUnlockRequested = showEmergencyUnlock
    ;(window as any).__onWidgetQuickStart = startFromWidget
    window.addEventListener('frictionAppDetected', handleFrictionEvent)
    window.addEventListener('mindfulPauseRequested', handleFrictionEvent)
    window.addEventListener('emergencyUnlockRequested', handleEmergencyEvent)
    window.addEventListener('widgetQuickStart', handleWidgetEvent)

    const initialFrictionApp = (window as any).__SCROLLNT_FRICTION_APP__
    const initialWidgetAction = (window as any).__SCROLLNT_WIDGET_ACTION__
    if (initialFrictionApp) {
      showFrictionPause(initialFrictionApp)
      delete (window as any).__SCROLLNT_FRICTION_APP__
    } else if ((window as any).__SCROLLNT_EMERGENCY_UNLOCK__) {
      showEmergencyUnlock()
      delete (window as any).__SCROLLNT_EMERGENCY_UNLOCK__
    } else if (initialWidgetAction) {
      startFromWidget(initialWidgetAction)
      delete (window as any).__SCROLLNT_WIDGET_ACTION__
    }

    return () => {
      delete (window as any).__onFrictionAppDetected
      delete (window as any).__onEmergencyUnlockRequested
      delete (window as any).__onWidgetQuickStart
      window.removeEventListener('frictionAppDetected', handleFrictionEvent)
      window.removeEventListener('mindfulPauseRequested', handleFrictionEvent)
      window.removeEventListener('emergencyUnlockRequested', handleEmergencyEvent)
      window.removeEventListener('widgetQuickStart', handleWidgetEvent)
    }
  }, [])

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        maxHeight: '100dvh',
        background: 'var(--theme-bg, #080808)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          style={{ flex: 1, height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          {renderScreen(currentScreen, navigate, hasSeenOnboarding, frictionAppName)}
        </motion.div>
      </AnimatePresence>
      <ScreenNavigator currentScreen={currentScreen} onNavigate={navigate} />
    </div>
  )
}
