export const COLORS = {
  BACKGROUND_PRIMARY: '#090707',
  BACKGROUND_APP: 'rgba(186, 186, 186, 1)',
  BACKGROUND_SECONDARY: 'rgba(11, 6, 5, 0.8)',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_WHITE: '#FFFFFF',
  TEXT_SECONDARY: 'rgba(255, 255, 255, 0.5)',
  TEXT_TERTIARY: 'rgba(255, 255, 255, 0.32)',
  TEXT_QUATERNARY: 'rgba(255, 255, 255, 0.88)',
  TEXT_SUCCESS: '#13bc80',
  BORDER_PRIMARY: 'rgba(255, 255, 255, 0.1)',
  BORDER_SECONDARY: 'rgba(255, 255, 255, 0.04)',
  OVERLAY_PRIMARY: 'rgba(255, 255, 255, 0.08)',
  OVERLAY_SECONDARY: 'rgba(255, 255, 255, 0.04)',
  OVERLAY_ACTIVE: 'rgba(255, 255, 255, 0.2)',
  GRADIENT_START: 'rgba(255, 255, 255, 0)',
  GRADIENT_END: 'rgba(255, 255, 255, 0.08)',
  GRADIENT_CARD_START: 'rgba(255, 255, 255, 0.08)',
  GRADIENT_CARD_END: 'rgba(255, 255, 255, 0.04)',
} as const;

export const OPACITY = {
  FULL: 1,
  HIGH: 0.88,
  MEDIUM: 0.5,
  HALF: 0.4,
  LOW: 0.32,
  MINIMAL: 0.1,
} as const;

export const SPACING = {
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  '4xl': '32px',
  '5xl': '40px',
  '6xl': '48px',
  '7xl': '64px',
} as const;

export const BORDER_RADIUS = {
  sm: '8px',
  md: '16px',
  lg: '24px',
  full: '999px',
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    mono: "'ABC Diatype Mono', monospace",
    sans: "'Innovator Grotesk', sans-serif",
  },
  fontSize: {
    xs: '11px',
    sm: '13px',
    md: '15px',
    lg: '40px',
  },
  fontWeight: {
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1,
    normal: 1.35,
    relaxed: 1.4,
  },
  letterSpacing: {
    tight: '-0.8px',
    normal: '0.13px',
    wide: '0.15px',
    wider: '0.39px',
    widest: '0.66px',
    uppercase: '1px',
    button: '3px',
  },
} as const;

