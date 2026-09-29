// <StatusPill tone="verified" label="Verified" />
// The only place status colour is decided. Tones map 1:1 to theme.color.status — pillars never
// colour a status with their own tint (CLAUDE.md rule).
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { CheckCircle2, Clock, MoreHorizontal, Truck, XCircle, Circle } from 'lucide-react-native';
import theme from '../../theme';
import type { IconComponent } from './icons';

export type StatusTone = 'verified' | 'pending' | 'rejected' | 'progress' | 'delivery' | 'neutral' | 'active';

const TONES: Record<StatusTone, { fg: string; bg: string; icon: IconComponent | null }> = {
  verified: { fg: theme.color.status.verifiedFg, bg: theme.color.status.verifiedBg, icon: CheckCircle2 },
  pending: { fg: theme.color.status.pendingFg, bg: theme.color.status.pendingBg, icon: Clock },
  rejected: { fg: theme.color.status.rejectedFg, bg: theme.color.status.rejectedBg, icon: XCircle },
  progress: { fg: theme.color.status.progressFg, bg: theme.color.status.progressBg, icon: MoreHorizontal },
  delivery: { fg: theme.color.status.progressFg, bg: theme.color.status.progressBg, icon: Truck },
  active: { fg: theme.color.status.progressFg, bg: theme.color.status.progressBg, icon: Circle },
  neutral: { fg: theme.color.status.neutralFg, bg: theme.color.status.neutralBg, icon: null },
};

export type StatusPillProps = {
  tone: StatusTone;
  label: string;
  size?: 'medium' | 'small';
  style?: ViewStyle;
};

export default function StatusPill({ tone, label, size = 'medium', style }: StatusPillProps) {
  const { fg, bg, icon: Icon } = TONES[tone];
  const small = size === 'small';
  return (
    <View
      accessibilityLabel={`Status: ${label}`}
      style={[styles.pill, small && styles.pillSmall, { backgroundColor: bg }, style]}
    >
      {Icon ? (
        tone === 'active' ? (
          <View style={[styles.dot, { backgroundColor: fg }]} />
        ) : (
          <Icon size={small ? 13 : 16} color={fg} strokeWidth={2.25} />
        )
      ) : null}
      <Text numberOfLines={1} style={[small ? styles.labelSmall : styles.label, { color: fg }]}>
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
    gap: 6,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.space.m,
    paddingVertical: 6,
  },
  pillSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    ...theme.type.captionStrong,
    fontWeight: '500',
  },
  labelSmall: {
    ...theme.type.caption,
    fontSize: 10,
    fontWeight: '500',
  },
});
