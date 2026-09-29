import { TextStyle } from 'react-native';

// Source: design/design-tokens.md. Every value here is a direct transcription of that file —
// change the token there first, then mirror it here. No screen may use a raw hex value or magic
// number; everything goes through `theme`.

const color = {
  primary: '#1E3A2C',
  primaryPressed: '#162E22',
  primaryTint: '#DCEDDD',
  primarySoft: '#EAF3EA',
  onPrimary: '#FFFFFF',

  // Screens sit on a faintly green canvas; cards are white on top of it.
  background: '#F5F8F4',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF2ED',
  border: '#E3EAE4',
  borderStrong: '#C9D6CB',

  textPrimary: '#16241B',
  textSecondary: '#5B6B60',
  textTertiary: '#8A968D',
  textOnDark: '#FFFFFF',

  accentSun: '#F2B84E',
  required: '#C0392B',
  scrim: 'rgba(22, 36, 27, 0.45)',

  status: {
    verifiedFg: '#2E7D4F',
    verifiedBg: '#E3F3E6',
    pendingFg: '#B8791E',
    pendingBg: '#FBF0DC',
    rejectedFg: '#C0392B',
    rejectedBg: '#FBE6E3',
    // In-progress / out-for-delivery states shown in blue across records.png and lpg-page.png.
    progressFg: '#2E5AA8',
    progressBg: '#E4EBFB',
    neutralFg: '#5B6B60',
    neutralBg: '#EEF2ED',
  },

  alert: {
    fg: '#C0392B',
    bg: '#FBE6E3',
    border: '#F2C4BE',
  },
} as const;

// Decorative pillar identity — icons and tag backgrounds only, never reused as status color.
const pillarTint = {
  vandhan: { icon: '#2E7D4F', tint: '#E3F3E6', card: '#EEF7EE', border: '#D5E9D6' },
  livestock: { icon: '#8B4A2B', tint: '#F7E3D3', card: '#FCF1E9', border: '#F1DCCB' },
  lpg: {
    icon: '#2E5AA8',
    tint: '#E4EBFB',
    card: '#EEF3FD',
    border: '#D8E2F7',
    // LPG is the one pillar whose screens use blue as their primary action color instead of the
    // app-wide dark green — this is what's actually in lpg-page.png / lpg-registration.png.
    primary: '#2450A8',
    primaryPressed: '#1B3F86',
    canvas: '#F3F6FC',
  },
  // Amber/gold — its own family, distinct from Livestock's terracotta.
  microfinance: { icon: '#8F6400', tint: '#FBEFC6', card: '#FEF8E4', border: '#F2E1A9' },
} as const;

// Flat-vector Nagaland landscape used in headers and onboarding (see LandscapeHeader).
const illustration = {
  green: { back: '#DDEBDC', mid: '#C4DAC3', front: '#A9C7A8', tree: '#7FA67F', treeDark: '#5E8A61' },
  blue: { back: '#E4ECFB', mid: '#D3DFF7', front: '#BFD0F2', tree: '#9DB5E6', treeDark: '#7F9BD6' },
  peach: { back: '#F7E7DA', mid: '#F1D9C6', front: '#E8C7AE', tree: '#C99D7D', treeDark: '#A97A5A' },
  purple: { back: '#EEE8F8', mid: '#E0D6F2', front: '#CDBDE9', tree: '#A994D6', treeDark: '#8C74C4' },
  gold: { back: '#FBF1D2', mid: '#F5E3AC', front: '#ECD284', tree: '#CFAE52', treeDark: '#AD8B30' },
  sun: '#F6D08A',
  bird: '#8FA98F',
  house: '#FBF7F1',
  roof: '#C48A62',
} as const;

// Soft backgrounds for livestock species cards (livestock-page.png). Decorative only.
const speciesTint = {
  cow: { bg: '#F6E6DA', fg: '#8B5A3C' },
  goat: { bg: '#E4EFE2', fg: '#5E8A61' },
  buffalo: { bg: '#E3E8EF', fg: '#4F5B6E' },
  pig: { bg: '#F4E4E2', fg: '#A06A64' },
  chicken: { bg: '#E6EFE3', fg: '#5E8A61' },
  duck: { bg: '#E8E6F2', fg: '#6E6A8C' },
} as const;

// Produce thumbnail backgrounds (vandhan-page.png) until real photos come from the backend.
const produceTint = {
  warm: { bg: '#F6EBDD', fg: '#8B5A3C' },
  green: { bg: '#E6F1E4', fg: '#4E7F50' },
  gold: { bg: '#FBF0D6', fg: '#A87A1F' },
} as const;

// Poppins for headings (flagged substitution — no font file was supplied; this is the closest
// widely-available match to the rounded terminals shown in the mockups). System font for body.
// Sized against the mockups at a 390dp-wide phone: "Welcome!" ≈ 32, screen titles ≈ 24,
// card titles ≈ 17, body ≈ 14.
const type = {
  display: { fontSize: 30, lineHeight: 38, fontFamily: 'Poppins_700Bold' },
  largeTitle: { fontSize: 26, lineHeight: 34, fontFamily: 'Poppins_700Bold' },
  title: { fontSize: 20, lineHeight: 28, fontFamily: 'Poppins_600SemiBold' },
  headline: { fontSize: 16, lineHeight: 22, fontFamily: 'Poppins_600SemiBold' },
  body: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  bodyStrong: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  captionStrong: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
  label: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  figure: { fontSize: 16, lineHeight: 22, fontWeight: '700', fontVariant: ['tabular-nums'] },
} as const satisfies Record<string, TextStyle>;

const space = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

const radius = {
  small: 10,
  field: 14,
  tile: 16,
  card: 20,
  sheet: 24,
  pill: 999,
} as const;

const size = {
  touch: 44,
  button: 50,
  field: 50,
  iconTile: 44,
  iconSmall: 15,
  icon: 18,
  iconLarge: 22,
  screenPadding: 18,
} as const;

const elevation = {
  card: {
    shadowColor: '#1E3A2C',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  raised: {
    shadowColor: '#1E3A2C',
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  sheet: {
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  tabBar: {
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
} as const;

const motion = {
  fast: 120,
  base: 180,
  settle: 260,
} as const;

export const theme = {
  color,
  pillarTint,
  illustration,
  speciesTint,
  produceTint,
  type,
  space,
  radius,
  size,
  elevation,
  motion,
} as const;

export type Theme = typeof theme;
export type ColorToken = keyof typeof color;
export type PillarToken = keyof typeof pillarTint;
export type TypeToken = keyof typeof type;
export type SpaceToken = keyof typeof space;
export type RadiusToken = keyof typeof radius;
export type IllustrationTone = 'green' | 'blue' | 'peach' | 'purple' | 'gold';

export default theme;

export const fontsToLoad = {
  Poppins_600SemiBold: require('@expo-google-fonts/poppins/600SemiBold/Poppins_600SemiBold.ttf'),
  Poppins_700Bold: require('@expo-google-fonts/poppins/700Bold/Poppins_700Bold.ttf'),
};
