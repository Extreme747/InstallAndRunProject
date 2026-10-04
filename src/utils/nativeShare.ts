// Native Bridge & Sharing Utilities for Scrolln't

export function openExternalUrl(url: string): void {
  if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'OPEN_URL',
        url,
      })
    );
  } else if (typeof window !== 'undefined') {
    window.open(url, '_blank');
  }
}

export function shareToWhatsApp(text: string): void {
  const waUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
  const webWaUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

  if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'OPEN_URL',
        url: waUrl,
      })
    );
  } else if (typeof window !== 'undefined') {
    window.open(webWaUrl, '_blank');
  }
}

export async function shareContent(options: {
  title?: string;
  text: string;
  url?: string;
}): Promise<boolean> {
  const { title = "Scrolln't", text, url } = options;

  if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
    (window as any).ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'NATIVE_SHARE',
        title,
        message: text,
        url,
      })
    );
    return true;
  }

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch {
      // User cancelled or share failed, fallback to copy
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url ? `${text} ${url}` : text);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}
