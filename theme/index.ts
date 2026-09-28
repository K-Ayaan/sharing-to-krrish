import { TextStyle } from 'react-native';

const color = {
  primary: '#2E7CF6',
  primaryPressed: '#1D5FD1',
  primaryTint: '#E8F0FE',
  background: '#FFFFFF',
  // Warm cream behind Services and Settings (redesign batch 2), under their decorative backdrops.
  backgroundWarm: '#FAF8F2',
  // Pale blue-white behind LPG and My Records (batches 5–6).
  backgroundCool: '#F5F8FD',
  surface: '#FFFFFF',
  surfaceMuted: '#F5F6F8',
  border: '#E5E7EB',
  textPrimary: '#0F172A',
  textSecondary: '#666666',
  success: '#16A34A',
  successTint: '#E7F8EC',
  // Finished states — Delivered, Collected, Resolved (batch 6). A status colour in its own right,
  // separate from the decorative notices tint.
  complete: '#7C3AED',
  completeTint: '#F1EAFE',
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
  // Tab-root titles in the redesign (Home greeting, Services).
  display: { fontSize: 32, fontWeight: '800' },
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

// Launch/loading screen only (LoaderScreen): pure white with pure black text.
// Separate from `color` so no existing token changes.
const launch = {
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: 'rgba(0, 0, 0, 0.55)',
  track: 'rgba(0, 0, 0, 0.12)',
  fill: '#000000',
} as const;

// Onboarding redesign — green on sage. Scoped to the onboarding flow through
// `AppearanceProvider appearance="onboarding"`; the rest of the app keeps `color` until its own
// redesign lands. `color` mirrors every key of the app palette so components can swap one for the other.
const onboarding = {
  color: {
    ...color,
    primary: '#2F6B4B',
    primaryPressed: '#24553B',
    primaryTint: '#E2EADC',
    background: '#EEF2E8',
    surface: '#F7F9F3',
    surfaceMuted: '#E6ECE0',
    border: '#D6E0D0',
    textPrimary: '#133A28',
    textSecondary: '#7B867E',
    success: '#2F6B4B',
    successTint: '#DCE9D6',
  },
  type: {
    title: { fontSize: 32, fontWeight: '800' },
    header: { fontSize: 18, fontWeight: '500' },
  },
  radius: {
    card: 24,
  },
  shadow: {
    shadowColor: '#2F6B4B',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffsetY: 6,
  },
  // Decorative illustration fills (Landscape, OnboardingBackdrop, SuccessBadge) — never UI state.
  art: {
    sun: '#FAD9A4',
    sunGlow: '#FCEBCB',
    hillFar: '#D3E0CC',
    hillMid: '#B7CEAF',
    hillNear: '#9DBE95',
    meadow: '#C9DDB2',
    tree: '#6F9870',
    treeDark: '#557F58',
    wall: '#F5F0E8',
    wallShade: '#E4DCD0',
    roof: '#A8705A',
    window: '#9E8C78',
    leaf: '#7FA37D',
    leafDark: '#5E8A60',
    leafLight: '#A9C3A2',
    wave: '#E4EBDD',
    confettiGold: '#F2C25B',
  },
} as const;

// Van Dhan redesign (batch 3) — the app palette with forest-green primaries on the warm cream page.
// Text stays navy, as in the reference images. Applied to the whole Van Dhan stack through
// `AppearanceProvider appearance="vandhan"`; the tab bar's active tab also turns green there.
const vandhan = {
  color: {
    ...color,
    primary: '#1E6B42',
    primaryPressed: '#175634',
    primaryTint: '#E6F2E7',
    background: color.backgroundWarm,
  },
} as const;

// Livestock redesign (batch 4) — rose primaries on the warm cream page, text stays navy. Applied to
// the whole Livestock stack through `AppearanceProvider appearance="livestock"`; the tab bar's active tab
// turns rose there. `art` recolours the shared backdrop's hills and leaves in soft pinks.
const livestock = {
  color: {
    ...color,
    primary: '#E94F6B',
    primaryPressed: '#CC3A56',
    primaryTint: '#FDE7EA',
    background: color.backgroundWarm,
  },
  art: {
    hillFar: '#F8E1E4',
    hillMid: '#F5D5DA',
    hillNear: '#F1C8CF',
    sunGlow: '#FCEBDF',
    leaf: '#EFB3BE',
    leafLight: '#F6D0D7',
  },
} as const;

// LPG redesign (batch 5) — the app's own blue primaries on a pale blue-white page, text navy. Applied
// to the whole LPG stack through `AppearanceProvider appearance="lpg"`; the tab bar stays blue.
// `art` recolours the shared backdrop's hills and leaves in soft blues.
const lpg = {
  color: {
    ...color,
    background: color.backgroundCool,
  },
  art: {
    hillFar: '#E3ECF8',
    hillMid: '#D6E4F5',
    hillNear: '#C9DBF2',
    sunGlow: '#EAF2FC',
    leaf: '#A9C4E8',
    leafLight: '#CFE0F5',
  },
  // LpgHome's gas-cylinder illustration.
  cylinder: {
    body: '#E8553F',
    shade: '#C8412F',
    highlight: '#F27A66',
    flame: '#FFFFFF',
  },
} as const;

// Material treatments layered on the colour tokens above — opacity and elevation only, no new hues.
function withAlpha(hex: string, alpha: number) {
  const value = parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

const material = {
  glass: {
    fill: withAlpha(color.surface, 0.72),
    border: withAlpha(color.surface, 0.9),
    blurIntensity: 40,
    shadowColor: color.textPrimary,
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffsetY: 8,
    /** Selected-tab capsule inside the glass tab bar. */
    highlight: withAlpha(color.textPrimary, 0.06),
  },
  // The tab bar's glassmorphism, used where native Liquid Glass (iOS 26) isn't available: much more
  // see-through than `glass` (which read as a solid white, neumorphic pill), a bright rim and a
  // specular sheen along the top edge.
  liquid: {
    fill: withAlpha(color.surface, 0.06),
    /** Tint over iOS 26's clear glass, just enough to keep the tab labels legible. */
    nativeTint: withAlpha(color.surface, 0.12),
    /** Soft band just inside the edge: the glass's thickness bending light. */
    edgeBand: withAlpha(color.surface, 0.3),
    edgeBandWidth: 6,
    /** Fainter inner rim, lit from the opposite corner, that bevels the edge. */
    bevel: withAlpha(color.surface, 0.6),
    /** Thin dark outline that separates the glass from bright content behind it. */
    edge: withAlpha(color.textPrimary, 0.08),
    /** Corner-lit rim: `rim` at the top-left and bottom-right corners, fading to `rimDim` between them. */
    rim: withAlpha(color.surface, 0.95),
    rimDim: withAlpha(color.surface, 0.12),
    sheenTop: withAlpha(color.surface, 0.45),
    sheenBottom: withAlpha(color.surface, 0),
    blurIntensity: 45,
    shadowColor: color.textPrimary,
    shadowOpacity: 0.14,
    shadowRadius: 28,
    shadowOffsetY: 12,
    /** The selected-tab lens: a clearer, brighter bubble of glass. */
    capsuleFill: withAlpha(color.surface, 0.3),
    capsuleRim: withAlpha(color.surface, 1),
    capsuleRimDim: withAlpha(color.surface, 0.2),
    capsuleSheen: withAlpha(color.surface, 0.35),
    /** How strongly a pillar's tint washes over the lens. */
    capsuleTintOpacity: 0.6,
    /** The lens while a finger is on the bar: a clear droplet lifted off the glass. */
    lensFill: withAlpha(color.surface, 0.18),
    lensRim: withAlpha(color.surface, 1),
    lensRimDim: withAlpha(color.surface, 0.55),
    lensSpecular: withAlpha(color.surface, 0.8),
    lensCaustic: withAlpha(color.surface, 0.45),
    /** Shaded inner lower edge that gives the droplet thickness. */
    lensShade: withAlpha(color.textPrimary, 0.1),
    lensShadowOpacity: 0.5,
    lensShadowRadius: 12,
    lensShadowOffsetY: 6,
  },
} as const;

export const theme = { color, pillarTint, launch, onboarding, vandhan, livestock, lpg, material, type, space, radius } as const;

export type Theme = typeof theme;
export type ColorToken = keyof typeof color;
export type Palette = Record<ColorToken, string>;
export type PillarToken = keyof typeof pillarTint;
export type TypeToken = keyof typeof type;
export type SpaceToken = keyof typeof space;
export type RadiusToken = keyof typeof radius;

export default theme;
