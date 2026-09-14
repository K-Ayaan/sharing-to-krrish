// <RunningBanner icon="megaphone-outline" text="Important Update: rates revised" onPress={openNotice} />
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type RunningBannerTone = 'warning' | 'info';

export type RunningBannerProps = {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  onPress?: () => void;
  tone?: RunningBannerTone;
  style?: ViewStyle;
};

const TONES: Record<RunningBannerTone, { bg: string; icon: string; text: string }> = {
  warning: { bg: theme.color.warningTint, icon: theme.color.warning, text: theme.color.textPrimary },
  info: { bg: theme.color.primaryTint, icon: theme.color.primary, text: theme.color.primary },
};

// Ambient, non-blocking, never dismissable: a flat full-bleed strip with square
// corners and no border — deliberately the opposite shape to AlertCard's inset
// rounded box, so the two never read as the same element.
export default function RunningBanner({ icon, text, onPress, tone = 'warning', style }: RunningBannerProps) {
  const colors = TONES[tone];

  const content = (
    <>
      <Ionicons name={icon} size={theme.type.headline.fontSize} color={colors.icon} />
      <Text numberOfLines={1} style={[styles.text, { color: colors.text }]}>
        {text}
      </Text>
      {onPress ? (
        <Ionicons name="chevron-forward" size={theme.type.body.fontSize} color={colors.icon} />
      ) : null}
    </>
  );

  if (!onPress) {
    return <View style={[styles.strip, { backgroundColor: colors.bg }, style]}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.strip, { backgroundColor: colors.bg }, pressed && styles.pressed, style]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
    paddingHorizontal: theme.space.m,
    paddingVertical: theme.space.s + theme.space.xs,
    borderRadius: 0,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    ...theme.type.body,
    flex: 1,
  },
});
