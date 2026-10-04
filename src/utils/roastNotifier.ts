import { getNotificationRoast, RoastLanguage } from '../data/moaiRoasts'
import { useAppStore } from '../store/useAppStore'

let focusIntervalId: any = null
let lastAttemptNotificationTime = 0

/**
 * Send an immediate savage Moai roast / compliment notification via native bridge
 */
export function sendRoastNotification(
  attemptedAppName?: string,
  type: 'attempt' | 'mid_session' | 'idle' | 'victory' | 'failed' = 'attempt',
  explicitLang?: RoastLanguage
) {
  const store = useAppStore.getState()
  const lang: RoastLanguage = explicitLang || store.settings?.roastLanguage || 'hinglish'

  // Check if specific notification type is enabled in settings
  if (type === 'attempt' && store.settings?.distractionRoasts === false) return
  if (type === 'idle' && store.settings?.idleRoasts === false) return
  if (type === 'mid_session' && store.settings?.roastFrequency === 'off') return

  // Debounce attempt notifications to prevent spamming notification tray (45s cooldown)
  if (type === 'attempt') {
    const now = Date.now()
    if (now - lastAttemptNotificationTime < 45000) return
    lastAttemptNotificationTime = now
  }

  const { title, body } = getNotificationRoast(attemptedAppName, lang, type)

  // 1. Post to native React Native notification engine
  if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'SHOW_NOTIFICATION',
        title,
        body,
        data: { category: type, lang }
      })
    )
  }

  // 2. Web Notification fallback
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/assets/moai-logo.png',
        badge: '/assets/moai-logo.png',
        tag: 'scrollnt-roast',
      })
    } catch (e) {}
  }
}

/**
 * Start periodic savage focus reminder roasts during an active session
 * Schedules key milestone checkpoints without spamming
 */
export function startFocusRoastInterval(sessionDurationMinutes: number = 25) {
  stopFocusRoastInterval()
  const store = useAppStore.getState()
  const freq = store.settings?.roastFrequency || 'savage'
  const lang = store.settings?.roastLanguage || 'hinglish'

  if (freq === 'off') return

  // 1. Schedule background notifications: 1 halfway checkpoint + 1 completion alert
  if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
    const scheduledList: Array<{ title: string; body: string; delaySeconds: number }> = []
    const totalMinutes = sessionDurationMinutes || 25

    // Halfway milestone notification (only for sessions >= 25 mins)
    if (totalMinutes >= 25) {
      const halfwayMinutes = Math.round(totalMinutes / 2)
      const halfwayRoast = getNotificationRoast(undefined, lang, 'mid_session')
      scheduledList.push({
        title: "🗿 Halfway Focus Check — Stay Locked In!",
        body: halfwayRoast.body || "You're halfway through! Keep that discipline unbroken.",
        delaySeconds: halfwayMinutes * 60
      })
    }

    // Completion notification
    const victoryRoast = getNotificationRoast(undefined, lang, 'victory')
    scheduledList.push({
      title: "👑 Session Complete! +XP Earned",
      body: victoryRoast.body || "Focus session completed. Great discipline today!",
      delaySeconds: totalMinutes * 60
    })

    if (scheduledList.length > 0) {
      (window as any).ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'SCHEDULE_SESSION_NOTIFICATIONS',
          notifications: scheduledList
        })
      )
    }
  }
}

/**
 * Stop periodic focus roasts & cancel scheduled session notifications
 */
export function stopFocusRoastInterval() {
  if (focusIntervalId) {
    clearInterval(focusIntervalId)
    focusIntervalId = null
  }

  if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'CANCEL_SESSION_NOTIFICATIONS'
      })
    )
  }
}

/**
 * Trigger an instant test savage roast notification for verification in Settings
 */
export function triggerTestRoast(explicitLang?: RoastLanguage) {
  const store = useAppStore.getState()
  const lang: RoastLanguage = explicitLang || store.settings?.roastLanguage || 'hinglish'
  sendRoastNotification('Instagram', 'attempt', lang)
}

/**
 * Schedule smart idle doomscroll reminder when app goes to background
 */
export function scheduleIdleNudge(delaySeconds: number = 7200) {
  const store = useAppStore.getState()
  if (store.settings?.idleRoasts === false) return

  const lang: RoastLanguage = store.settings?.roastLanguage || 'hinglish'
  const { title, body } = getNotificationRoast(undefined, lang, 'idle')

  if (typeof window !== 'undefined' && (window as any).ReactNativeWebView?.postMessage) {
    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'SCHEDULE_IDLE_NUDGE',
        title,
        body,
        delaySeconds
      })
    )
  }
}
