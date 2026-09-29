// <Card onPress={open} tone="vandhan"><Text>…</Text></Card>
import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import theme, { type PillarToken } from '../../theme';

export type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  // A pillar tone gives the soft tinted background + matching border used by the service cards
  // on home.png and services-page.png.
  tone?: PillarToken | 'muted' | 'success';
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export default function Card({
  children,
  onPress,
  tone,
  padded = true,
  style,
  accessibilityLabel,
}: CardProps) {
  const toneStyle =
    tone === 'muted'
      ? styles.muted
      : tone === 'success'
        ? styles.success
        : tone
          ? {
              backgroundColor: theme.pillarTint[tone].card,
              borderColor: theme.pillarTint[tone].border,
              borderWidth: 1,
            }
          : null;

  const content = [styles.card, padded && styles.padded, toneStyle, style];

  if (!onPress) {
    return <View style={content}>{children}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [...content, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.card,
    ...theme.elevation.card,
  },
  padded: {
    paddingHorizontal: theme.space.l,
    paddingVertical: theme.space.m + 2,
  },
  muted: {
    backgroundColor: theme.color.surfaceMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  success: {
    backgroundColor: theme.color.primarySoft,
    borderWidth: 1,
    borderColor: theme.pillarTint.vandhan.border,
  },
  pressed: {
    opacity: 0.85,
  },
});
