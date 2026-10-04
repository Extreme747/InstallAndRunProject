import { syncUserState } from '../api'
import { useAppStore } from '../store/useAppStore'

export interface Entitlements {
  isPremium: boolean
  unlockedThemes: string[]
  unlockedSkins: string[]
  xpBoost: number
}

const DEFAULT_ENTITLEMENTS: Entitlements = {
  isPremium: false,
  unlockedThemes: ['default'],
  unlockedSkins: ['Moai'],
  xpBoost: 1,
}

let currentEntitlements: Entitlements = { ...DEFAULT_ENTITLEMENTS }

export async function initPlayBilling(): Promise<Entitlements> {
  try {
    const handleStatusSync = (detail: any) => {
      if (detail?.isSubscribed) {
        currentEntitlements.isPremium = true
        currentEntitlements.xpBoost = 2
        useAppStore.getState().setIsSubscribed(true)
        localStorage.setItem('@scrollnt_play_entitlements', JSON.stringify(currentEntitlements))
      } else if (detail && detail.isSubscribed === false) {
        currentEntitlements.isPremium = false
        currentEntitlements.xpBoost = 1
        useAppStore.getState().setIsSubscribed(false)
        localStorage.setItem('@scrollnt_play_entitlements', JSON.stringify(currentEntitlements))
      }
    }

    if (typeof window !== 'undefined') {
      ;(window as any).__onSubscriptionStatusSynced = handleStatusSync
      window.addEventListener('subscriptionStatusSynced', (e: any) => {
        handleStatusSync(e?.detail || {})
      })
    }

    const isSubscribed = useAppStore.getState().isSubscribed
    if (isSubscribed) {
      currentEntitlements.isPremium = true
      currentEntitlements.xpBoost = 2
    } else {
      const saved = localStorage.getItem('@scrollnt_play_entitlements')
      if (saved) {
        currentEntitlements = JSON.parse(saved)
        if (currentEntitlements.isPremium) {
          useAppStore.getState().setIsSubscribed(true)
        }
      }
    }
  } catch (e) {
    console.warn('Billing initialization error:', e)
  }
  return currentEntitlements
}

export async function buySubscription(planId: 'monthly' | 'quarterly' | 'yearly'): Promise<{ success: boolean; message: string }> {
  const sku =
    planId === 'yearly'
      ? 'scrollnt_pro_yearly'
      : planId === 'quarterly'
      ? 'scrollnt_pro_quarterly'
      : 'scrollnt_pro_monthly'
  console.log(`[Google Play Billing] Launching purchase for SKU: ${sku}`)

  // Check if running in React Native WebView
  if (typeof window === 'undefined' || !(window as any).ReactNativeWebView?.postMessage) {
    return { success: false, message: 'Google Play Billing is only available on Android device.' }
  }

  return new Promise((resolve) => {
    let handled = false

    const handleResult = async (detail: any) => {
      if (handled) return
      handled = true
      cleanup()

      if (detail && detail.success) {
        currentEntitlements.isPremium = true
        currentEntitlements.xpBoost = 2
        localStorage.setItem('@scrollnt_play_entitlements', JSON.stringify(currentEntitlements))
        useAppStore.getState().setIsSubscribed(true)

        const userId = useAppStore.getState().userId || 'local-user'
        await syncUserState({ userId, premiumUnlocked: true, isSubscribed: true }).catch(() => {})

        resolve({
          success: true,
          message: detail.message || "SCROLLN'T PRO ACTIVATED! 👑 Enjoy 2x XP, unlimited freezes & deep analytics.",
        })
      } else {
        const fallbackMsg = detail?.cancelled ? 'Purchase cancelled by user' : 'Purchase not completed'
        resolve({
          success: false,
          message: detail?.message || fallbackMsg,
        })
      }
    }

    const onCustomEvent = (e: any) => {
      handleResult(e?.detail || {})
    }

    const cleanup = () => {
      window.removeEventListener('subscriptionResult', onCustomEvent as any)
      try {
        delete (window as any).__onSubscriptionResult
      } catch (e) {
        ;(window as any).__onSubscriptionResult = undefined
      }
      clearTimeout(timeoutId)
    }

    // Register both direct method AND event listener
    ;(window as any).__onSubscriptionResult = handleResult
    window.addEventListener('subscriptionResult', onCustomEvent as any)

    // Send request to native React Native bridge
    ;(window as any).ReactNativeWebView.postMessage(
      JSON.stringify({ type: 'BUY_SUBSCRIPTION', planId, sku })
    )

    // Safety timeout: 45 seconds (allows user sufficient time to interact with Google Play)
    const timeoutId = setTimeout(() => {
      if (!handled) {
        handled = true
        cleanup()
        resolve({ success: false, message: 'Google Play response timed out. Please try again.' })
      }
    }, 45 * 1000)
  })
}

export async function restorePurchases(): Promise<{ success: boolean; message: string }> {
  console.log('[Google Play Billing] Requesting restore purchases from Google Play...')

  if (typeof window === 'undefined' || !(window as any).ReactNativeWebView?.postMessage) {
    return { success: false, message: 'Restore is only available on Android device.' }
  }

  return new Promise((resolve) => {
    let handled = false

    const handleResult = async (detail: any) => {
      if (handled) return
      handled = true
      cleanup()

      if (detail && detail.success) {
        currentEntitlements.isPremium = true
        currentEntitlements.xpBoost = 2
        localStorage.setItem('@scrollnt_play_entitlements', JSON.stringify(currentEntitlements))
        useAppStore.getState().setIsSubscribed(true)

        const userId = useAppStore.getState().userId || 'local-user'
        await syncUserState({ userId, premiumUnlocked: true, isSubscribed: true }).catch(() => {})

        resolve({
          success: true,
          message: detail.message || 'Purchases successfully restored from Google Play! 🚀',
        })
      } else {
        resolve({
          success: false,
          message: detail?.message || 'No active subscriptions found on this Google Account.',
        })
      }
    }

    const onCustomEvent = (e: any) => {
      handleResult(e?.detail || {})
    }

    const cleanup = () => {
      window.removeEventListener('restoreResult', onCustomEvent as any)
      try {
        delete (window as any).__onRestoreResult
      } catch (e) {
        ;(window as any).__onRestoreResult = undefined
      }
      clearTimeout(timeoutId)
    }

    ;(window as any).__onRestoreResult = handleResult
    window.addEventListener('restoreResult', onCustomEvent as any)

    // Send restore request to native React Native bridge
    ;(window as any).ReactNativeWebView.postMessage(
      JSON.stringify({ type: 'RESTORE_PURCHASES' })
    )

    const timeoutId = setTimeout(() => {
      if (!handled) {
        handled = true
        cleanup()
        resolve({ success: false, message: 'Restore request timed out. Please try again.' })
      }
    }, 20 * 1000)
  })
}

export function getEntitlements(): Entitlements {
  return currentEntitlements
}
