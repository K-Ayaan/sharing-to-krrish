// <StatusPill label="Delivered" tone="success" />
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export type StatusPillProps = {
  label: string;
  tone?: StatusTone;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Defaults to the tone's text color. */
  iconColor?: string;
  style?: ViewStyle;
};

const TONES: Record<StatusTone, { fg: string; bg: string }> = {
  success: { fg: theme.color.success, bg: theme.color.successTint },
  warning: { fg: theme.color.warning, bg: theme.color.warningTint },
  danger: { fg: theme.color.danger, bg: theme.color.dangerTint },
  info: { fg: theme.color.primary, bg: theme.color.primaryTint },
  neutral: { fg: theme.color.textSecondary, bg: theme.color.surfaceMuted },
};

export default function StatusPill({ label, tone = 'neutral', icon, iconColor, style }: StatusPillProps) {
  const { fg, bg } = TONES[tone];

  return (
    <View style={[styles.pill, { backgroundColor: bg }, style]}>
      {icon ? <Ionicons name={icon} size={theme.type.body.fontSize} color={iconColor ?? fg} /> : null}
      <Text numberOfLines={1} style={[styles.label, { color: fg }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: theme.space.xs,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.space.s + theme.space.xs,
    paddingVertical: theme.space.xs,
  },
  label: {
    ...theme.type.caption,
    fontWeight: '600',
  },
});
