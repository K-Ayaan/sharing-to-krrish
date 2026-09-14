import { TextStyle } from 'react-native';

const color = {
  primary: '#2E7CF6',
  primaryPressed: '#1D5FD1',
  primaryTint: '#E8F0FE',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F5F6F8',
  border: '#E5E7EB',
  textPrimary: '#0F172A',
  textSecondary: '#666666',
  success: '#16A34A',
  successTint: '#E7F8EC',
  warning: '#D97706',
  danger: '#DC2626',
  dangerTint: '#FDECEC',
  warningTint: '#FEF3E2',
  // Modal scrim — textPrimary at 40%. Added for BottomSheet; not in design-tokens.md.
  scrim: 'rgba(15, 23, 42, 0.4)',
} as const;

// Decorative only — never reuse these as status colors.
const pillarTint = {
  vandhan: { icon: '#22C55E', tint: '#E9F9EE' },
  livestock: { icon: '#F43F5E', tint: '#FDE7EA' },
  lpg: { icon: '#0EA5E9', tint: '#E5F6FD' },
  notices: { icon: '#8B5CF6', tint: '#F1EAFE' },
} as const;

// System font (San Francisco on iOS) — no custom font linking.
const type = {
  largeTitle: { fontSize: 28, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '700' },
  headline: { fontSize: 17, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  caption: { fontSize: 13, fontWeight: '400' },
} as const satisfies Record<string, TextStyle>;

const space = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 40,
} as const;

const radius = {
  field: 10,
  card: 16,
  pill: 999,
} as const;

export const theme = { color, pillarTint, type, space, radius } as const;

export type Theme = typeof theme;
export type ColorToken = keyof typeof color;
export type PillarToken = keyof typeof pillarTint;
export type TypeToken = keyof typeof type;
export type SpaceToken = keyof typeof space;
export type RadiusToken = keyof typeof radius;

export default theme;
