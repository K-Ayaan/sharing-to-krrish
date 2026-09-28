// <Card tone="danger"><Text>…</Text></Card>
import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import theme, { Palette } from '../../theme';
import { onboardingShadow, useAppearance } from './Appearance';

export type CardTone = 'default' | 'info' | 'warning' | 'danger';

export type CardProps = {
  children: ReactNode;
  tone?: CardTone;
  /** Set false when the content (e.g. a ListRow) brings its own padding. */
  padded?: boolean;
  /** Soft drop shadow (theme.material.glass) — for cards floating over a decorative backdrop. */
  elevated?: boolean;
  style?: ViewStyle;
};

const toneBackgrounds = (color: Palette, onboarding: boolean): Record<CardTone, string> => ({
  default: color.surface,
  // Onboarding's info panel is a flat sage block rather than the primary tint.
  info: onboarding ? color.surfaceMuted : color.primaryTint,
  warning: color.warningTint,
  danger: color.dangerTint,
});

export default function Card({
  children,
  tone = 'default',
  padded = true,
  elevated = false,
  style,
}: CardProps) {
  const { appearance, color } = useAppearance();
  const onboarding = appearance === 'onboarding';

  const card = (
    <View
      style={[
        onboarding ? styles.onboardingCard : styles.card,
        onboarding && tone === 'default' && styles.raised,
        { backgroundColor: toneBackgrounds(color, onboarding)[tone] },
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );

  // The default card clips its content, which would also clip a shadow on iOS — so the shadow sits
  // on a wrapper. (The onboarding card doesn't clip and carries its own shadow.)
  if (!elevated || onboarding) return card;
  return <View style={styles.elevated}>{card}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: theme.color.border,
    overflow: 'hidden',
  },
  // No clipping here, or iOS would drop the shadow.
  onboardingCard: {
    borderRadius: theme.onboarding.radius.card,
  },
  raised: onboardingShadow,
  elevated: {
    borderRadius: theme.radius.card,
    shadowColor: theme.material.glass.shadowColor,
    shadowOpacity: theme.material.glass.shadowOpacity,
    shadowRadius: theme.material.glass.shadowRadius,
    shadowOffset: { width: 0, height: theme.material.glass.shadowOffsetY },
  },
  padded: {
    padding: theme.space.m,
  },
});
