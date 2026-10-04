import { useAppStore } from '../store/useAppStore'

// ─── Theme Definitions ─────────────────────────────────────────────────────────
// Each theme defines a background, accent color, and RGB triplet for rgba() usage

export interface ThemeColors {
  bg: string
  accent: string
  /** comma-separated RGB triplet for use in rgba(), e.g. '200, 255, 0' */
  accentRgb: string
}

export const THEME_MAP: Record<string, ThemeColors> = {
  default: { bg: '#080808', accent: '#C8FF00', accentRgb: '200, 255, 0' },
  ocean:   { bg: '#060C1A', accent: '#60A5FA', accentRgb: '96, 165, 250' },
  purple:  { bg: '#08060E', accent: '#BF7FFF', accentRgb: '191, 127, 255' },
  ember:   { bg: '#0C0604', accent: '#FF6B2B', accentRgb: '255, 107, 43' },
  matrix:  { bg: '#040F04', accent: '#00FF41', accentRgb: '0, 255, 65' },
  gold:    { bg: '#0C0900', accent: '#FFB800', accentRgb: '255, 184, 0' },
}

const DEFAULT_THEME = THEME_MAP['default']

/** Returns the resolved theme colors for the currently active theme */
export function useTheme(): ThemeColors {
  const activeTheme = useAppStore((s) => s.activeTheme)
  return THEME_MAP[activeTheme] || DEFAULT_THEME
}

/** Get theme colors by ID (non-hook version for use outside components) */
export function getThemeColors(themeId: string): ThemeColors {
  return THEME_MAP[themeId] || DEFAULT_THEME
}
