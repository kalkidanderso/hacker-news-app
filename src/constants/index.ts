export const API_BASE = 'https://hacker-news.firebaseio.com/v0';
export const STORY_FETCH_LIMIT = 20;
export const DEBOUNCE_DELAY = 300;

export const COLORS = {
  background: '#0f0f13',
  surface: '#1a1a24',
  surfaceElevated: '#222233',
  border: '#2a2a3d',
  accent: '#ff6640',
  accentMuted: '#ff664020',
  text: '#f0f0f5',
  textSecondary: '#888899',
  textMuted: '#555566',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  white: '#ffffff',
  skeletonBase: '#1e1e2e',
  skeletonHighlight: '#2a2a3d',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
} as const;

export const RADIUS = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 9999,
} as const;
