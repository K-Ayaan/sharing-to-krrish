// <ListRow leading={<IconTile … />} title="LPG refill request" subtitle="Request submitted" trailingTop="10 Sep 2026" onPress={…} />
// The row shape used by records, notices, collections, order history and recent activity.
// `card` wraps it in its own white card; otherwise it sits in a shared card with dividers.
import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ArrowRight, ChevronRight } from 'lucide-react-native';
import theme from '../../theme';

export type ListRowProps = {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  // Extra lines under the subtitle (date with icon, "per kg", etc.).
  meta?: ReactNode;
  // Sits to the right of the text column (status pill, price).
  trailing?: ReactNode;
  // Sits on the title line, right-aligned (dates on activity rows).
  trailingTop?: string;
  titleAdornment?: ReactNode;
  // 'chevron' plain › ; 'circle' › in a tinted circle (vandhan-page.png); 'arrow' → in a circle (lpg-page.png).
  affordance?: 'chevron' | 'circle' | 'arrow' | 'none';
  onPress?: () => void;
  card?: boolean;
  divider?: boolean;
  body?: string;
  bodyLines?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export default function ListRow({
  title,
  subtitle,
  leading,
  meta,
  trailing,
  trailingTop,
  titleAdornment,
  affordance = 'chevron',
  onPress,
  card = false,
  divider = false,
  body,
  bodyLines = 2,
  style,
  accessibilityLabel,
}: ListRowProps) {
  const inner = (pressed: boolean) => (
    <View style={[styles.row, card && styles.card, divider && styles.divider, pressed && styles.pressed, style]}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.text}>
        <View style={styles.titleRow}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          {titleAdornment}
          {trailingTop ? <Text style={styles.trailingTop}>{trailingTop}</Text> : null}
        </View>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
        {body ? (
          <Text numberOfLines={bodyLines} style={styles.body}>
            {body}
          </Text>
        ) : null}
        {meta}
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      {onPress && affordance !== 'none' ? (
        affordance === 'chevron' ? (
          <ChevronRight size={20} color={theme.color.textPrimary} strokeWidth={2} />
        ) : (
          <View style={styles.affordanceCircle}>
            {affordance === 'arrow' ? (
              <ArrowRight size={16} color={theme.color.textPrimary} strokeWidth={2} />
            ) : (
              <ChevronRight size={16} color={theme.color.primary} strokeWidth={2.25} />
            )}
          </View>
        )
      ) : null}
    </View>
  );

  if (!onPress) return inner(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? [title, subtitle, trailingTop].filter(Boolean).join(', ')}
      onPress={onPress}
    >
      {({ pressed }) => inner(pressed)}
    </Pressable>
  );
}

export function UnreadDot() {
  return <View accessibilityLabel="Unread" style={styles.unread} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    paddingVertical: theme.space.m,
  },
  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.card,
    paddingHorizontal: theme.space.m,
    ...theme.elevation.card,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.color.border,
  },
  pressed: {
    opacity: 0.8,
  },
  leading: {
    alignSelf: 'center',
  },
  text: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  title: {
    ...theme.type.body,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.color.textPrimary,
    flexShrink: 1,
  },
  trailingTop: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    marginLeft: 'auto',
  },
  subtitle: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
  body: {
    ...theme.type.body,
    fontSize: 13,
    lineHeight: 19,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
  trailing: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: theme.space.s,
  },
  affordanceCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.color.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unread: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: theme.pillarTint.vandhan.icon,
  },
});
