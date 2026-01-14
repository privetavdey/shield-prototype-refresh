import { COLORS, SPACING, BORDER_RADIUS, OPACITY } from './config';

export const cardStyle = {
  background: `linear-gradient(to bottom, ${COLORS.GRADIENT_START}, ${COLORS.GRADIENT_END})`,
  borderRadius: BORDER_RADIUS.lg,
  padding: SPACING.xl,
} as const;

export const linkItemStyle = {
  backgroundColor: COLORS.OVERLAY_PRIMARY,
  borderRadius: BORDER_RADIUS.full,
  padding: `${SPACING.md} ${SPACING.xl}`,
  border: `1px solid ${COLORS.BORDER_SECONDARY}`,
} as const;

export const listItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: SPACING.xl,
  padding: `${SPACING.md} 0`,
} as const;

export const buttonStyle = {
  background: `linear-gradient(to bottom, ${COLORS.GRADIENT_CARD_START}, ${COLORS.GRADIENT_CARD_END})`,
  borderRadius: BORDER_RADIUS.md,
  padding: SPACING.lg,
  border: 'none',
  cursor: 'pointer',
} as const;

export const activeTabStyle = {
  backgroundColor: COLORS.OVERLAY_ACTIVE,
  borderRadius: BORDER_RADIUS.full,
} as const;

export const inactiveTabStyle = {
  backgroundColor: 'transparent',
  borderRadius: BORDER_RADIUS.full,
  opacity: OPACITY.MEDIUM,
} as const;

