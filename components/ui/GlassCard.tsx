// <GlassCard><TextField … /></GlassCard>
import { BlurView } from 'expo-blur';
import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type GlassCardProps = {
  children: ReactNode;
  /** Set false when the content brings its own padding. */
  padded?: boolean;
  style?: ViewStyle;
};

const { glass } = theme.material;

// Frosted-glass material: blur + a translucent surface fill + a light edge + a soft shadow.
// Every value comes from theme.material.glass, which is derived from existing colour tokens —
// it's an elevation treatment, not a new palette. Needs something tinted behind it to read as glass.
export default function GlassCard({ children, padded = true, style }: GlassCardProps) {
  return (
    <View style={[styles.shadow, style]}>
      <BlurView intensity={glass.blurIntensity} tint="light" style={styles.glass}>
        <View style={padded ? styles.padded : undefined}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: theme.radius.card,
    shadowColor: glass.shadowColor,
    shadowOpacity: glass.shadowOpacity,
    shadowRadius: glass.shadowRadius,
    shadowOffset: { width: 0, height: glass.shadowOffsetY },
  },
  glass: {
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: glass.border,
    backgroundColor: glass.fill,
    overflow: 'hidden',
  },
  padded: {
    padding: theme.space.m,
  },
});
